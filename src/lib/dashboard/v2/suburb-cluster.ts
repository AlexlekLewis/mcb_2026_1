/**
 * Suburb consolidation clustering.
 *
 * Takes raw suburb_audit rows and proposes how to consolidate the 693
 * templated /locations/[suburb] pages down to a small set of deep regional
 * pages. The cluster target uses Melbourne region buckets defined in
 * src/lib/region-content.ts.
 *
 * Output: per-region clusters with member suburb URLs, total
 * organic_clicks_30d, average uniqueness, and a recommended target URL.
 *
 * The actual redirect map + page generation is a manual exercise after
 * Alex reviews the proposal — this helper just computes it.
 */

import { LOCATIONS } from "@/lib/locations";
import { getMelbourneRegion, type MelbourneRegion } from "@/lib/region-content";

export interface AuditRow {
  url: string;
  suburb_slug: string;
  product_slug: string | null;
  unique_pct: number | null;
  organic_clicks_30d: number | null;
  recommendation: string | null;
}

export interface ClusterMember {
  url: string;
  suburb_slug: string;
  product_slug: string | null;
  unique_pct: number | null;
  organic_clicks_30d: number;
}

export interface ClusterProposal {
  region: MelbourneRegion;
  targetUrl: string;
  members: ClusterMember[];
  memberCount: number;
  totalClicks30d: number;
  avgUniquePct: number;
  pagesToConsolidate: number; // members with unique_pct < threshold OR organic_clicks_30d < threshold
  pagesToKeep: number;        // members worth preserving
}

const KEEP_THRESHOLD_UNIQUE_PCT = 40;
const KEEP_THRESHOLD_CLICKS_30D = 50;

/**
 * Group audit rows by Melbourne region and propose consolidation targets.
 *
 * - Suburbs that don't match any known location (slug missing from
 *   LOCATIONS) are dropped — they shouldn't have a /locations/ page at all.
 * - Region is derived from the suburb's lat/lng via getMelbourneRegion.
 * - Target URL is the canonical regional landing page (created later).
 */
export function buildClusterProposals(audit: AuditRow[]): ClusterProposal[] {
  const byRegion = new Map<MelbourneRegion, ClusterMember[]>();

  for (const row of audit) {
    const loc = LOCATIONS.find((l) => l.slug === row.suburb_slug);
    if (!loc) continue;
    const region = getMelbourneRegion(loc);
    const list = byRegion.get(region) ?? [];
    list.push({
      url: row.url,
      suburb_slug: row.suburb_slug,
      product_slug: row.product_slug,
      unique_pct: row.unique_pct,
      organic_clicks_30d: row.organic_clicks_30d ?? 0,
    });
    byRegion.set(region, list);
  }

  const proposals: ClusterProposal[] = [];
  for (const [region, members] of byRegion.entries()) {
    const totalClicks30d = members.reduce((acc, m) => acc + m.organic_clicks_30d, 0);
    const validUniques = members.filter((m) => m.unique_pct !== null);
    const avgUniquePct =
      validUniques.length > 0
        ? validUniques.reduce((acc, m) => acc + (m.unique_pct ?? 0), 0) / validUniques.length
        : 0;

    const pagesToKeep = members.filter(
      (m) =>
        (m.unique_pct ?? 0) >= KEEP_THRESHOLD_UNIQUE_PCT ||
        m.organic_clicks_30d >= KEEP_THRESHOLD_CLICKS_30D,
    ).length;

    proposals.push({
      region,
      targetUrl: `/locations/${region}`,
      members,
      memberCount: members.length,
      totalClicks30d,
      avgUniquePct: +avgUniquePct.toFixed(2),
      pagesToConsolidate: members.length - pagesToKeep,
      pagesToKeep,
    });
  }

  // Highest-impact regions first (most clicks at stake).
  proposals.sort((a, b) => b.totalClicks30d - a.totalClicks30d);
  return proposals;
}

/**
 * Generate a markdown consolidation plan ready to paste into a PR / audit
 * doc. Includes the proposal summary, per-region detail, and the
 * recommended redirect map structure.
 */
export function renderConsolidationPlanMarkdown(proposals: ClusterProposal[]): string {
  const lines: string[] = [];
  lines.push("# Suburb Page Consolidation Plan");
  lines.push("");
  lines.push(`_Generated ${new Date().toISOString().slice(0, 10)} from suburb_audit data._`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  const totalMembers = proposals.reduce((a, b) => a + b.memberCount, 0);
  const totalConsolidate = proposals.reduce((a, b) => a + b.pagesToConsolidate, 0);
  const totalKeep = proposals.reduce((a, b) => a + b.pagesToKeep, 0);
  const totalClicks = proposals.reduce((a, b) => a + b.totalClicks30d, 0);
  lines.push(`- **${proposals.length}** regional clusters proposed.`);
  lines.push(`- **${totalMembers}** suburb pages audited.`);
  lines.push(`- **${totalConsolidate}** recommended for 301 → regional page.`);
  lines.push(`- **${totalKeep}** recommended to keep (genuinely unique content or meaningful traffic).`);
  lines.push(`- **${totalClicks}** total organic clicks / 30d across all audited pages.`);
  lines.push("");
  lines.push("## Per-region breakdown");
  lines.push("");
  lines.push("| Region | Pages | Keep | Consolidate | Clicks / 30d | Target URL |");
  lines.push("| --- | ---: | ---: | ---: | ---: | --- |");
  for (const p of proposals) {
    lines.push(
      `| ${p.region} | ${p.memberCount} | ${p.pagesToKeep} | ${p.pagesToConsolidate} | ${p.totalClicks30d} | \`${p.targetUrl}\` |`,
    );
  }
  lines.push("");
  lines.push("## Per-region detail");
  lines.push("");
  for (const p of proposals) {
    lines.push(`### ${p.region} → \`${p.targetUrl}\``);
    lines.push("");
    lines.push(`- ${p.memberCount} suburb pages in this cluster`);
    lines.push(`- ${p.pagesToKeep} keep / ${p.pagesToConsolidate} consolidate`);
    lines.push(`- ${p.totalClicks30d} organic clicks / 30d`);
    lines.push(`- Average uniqueness: ${p.avgUniquePct}%`);
    lines.push("");
    lines.push("**Pages to consolidate (redirect to regional target):**");
    lines.push("");
    const consolidateMembers = p.members.filter(
      (m) =>
        (m.unique_pct ?? 0) < KEEP_THRESHOLD_UNIQUE_PCT &&
        m.organic_clicks_30d < KEEP_THRESHOLD_CLICKS_30D,
    );
    if (consolidateMembers.length === 0) {
      lines.push("_(none — all pages in this cluster meet the keep threshold)_");
    } else {
      for (const m of consolidateMembers.slice(0, 50)) {
        lines.push(`- \`${m.url}\` (unique: ${m.unique_pct ?? "?"}%, clicks: ${m.organic_clicks_30d})`);
      }
      if (consolidateMembers.length > 50) {
        lines.push(`- _… ${consolidateMembers.length - 50} more_`);
      }
    }
    lines.push("");
    const keepMembers = p.members.filter(
      (m) =>
        (m.unique_pct ?? 0) >= KEEP_THRESHOLD_UNIQUE_PCT ||
        m.organic_clicks_30d >= KEEP_THRESHOLD_CLICKS_30D,
    );
    if (keepMembers.length > 0) {
      lines.push("**Pages to keep:**");
      lines.push("");
      for (const m of keepMembers) {
        lines.push(`- \`${m.url}\` (unique: ${m.unique_pct ?? "?"}%, clicks: ${m.organic_clicks_30d})`);
      }
    }
    lines.push("");
  }
  lines.push("## Suggested redirect map (TS)");
  lines.push("");
  lines.push("```ts");
  lines.push("// src/lib/suburb-redirects.ts");
  lines.push("export const SUBURB_REDIRECTS: Record<string, string> = {");
  for (const p of proposals) {
    for (const m of p.members.filter(
      (m) =>
        (m.unique_pct ?? 0) < KEEP_THRESHOLD_UNIQUE_PCT &&
        m.organic_clicks_30d < KEEP_THRESHOLD_CLICKS_30D,
    )) {
      lines.push(`  "${m.url}": "${p.targetUrl}",`);
    }
  }
  lines.push("};");
  lines.push("```");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push("**Thresholds used:**");
  lines.push(`- Keep if \`unique_pct >= ${KEEP_THRESHOLD_UNIQUE_PCT}%\` OR \`organic_clicks_30d >= ${KEEP_THRESHOLD_CLICKS_30D}\``);
  lines.push("- Otherwise: consolidate via 301 to regional target.");
  return lines.join("\n");
}
