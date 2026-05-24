import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { ConsolidationPlanPanel } from "@/components/dashboard/v2/ConsolidationPlanModal";
import { fetchLatestSuburbAudit } from "@/lib/dashboard/v2/data";
import {
  buildClusterProposals,
  renderConsolidationPlanMarkdown,
  type AuditRow,
} from "@/lib/dashboard/v2/suburb-cluster";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Suburb audit · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function SuburbAuditPage() {
  const audit = await fetchLatestSuburbAudit(800);
  const auditRows: AuditRow[] = audit.map((r) => ({
    url: r.url,
    suburb_slug: r.suburb_slug,
    product_slug: r.product_slug,
    unique_pct: r.unique_pct,
    organic_clicks_30d: r.organic_clicks_30d,
    recommendation: r.recommendation,
  }));

  const proposals = buildClusterProposals(auditRows);
  const planMarkdown = renderConsolidationPlanMarkdown(proposals);

  const totalPages = audit.length;
  const totalConsolidate = proposals.reduce((a, b) => a + b.pagesToConsolidate, 0);
  const totalKeep = proposals.reduce((a, b) => a + b.pagesToKeep, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Suburb audit"
        subtitle="The 693 templated /locations/[suburb] pages, scored for uniqueness and clustered into regional consolidation targets. Audited on the 1st of each month."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Pages audited"
          value={totalPages}
          footer={totalPages === 0 ? "no audit yet — cron runs 1st of month" : "most-recent run"}
        />
        <KpiCard
          label="Recommended to consolidate"
          value={totalConsolidate}
          state={totalConsolidate > 50 ? "attention" : "neutral"}
          footer="below uniqueness OR traffic threshold"
        />
        <KpiCard
          label="Recommended to keep"
          value={totalKeep}
          state="good"
          footer="genuinely unique or meaningful traffic"
        />
        <KpiCard
          label="Regional clusters"
          value={proposals.length}
          footer="target landing pages to create"
        />
      </section>

      {totalPages === 0 ? (
        <EmptyState />
      ) : (
        <>
          <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
                Regional cluster proposal
              </h2>
              <ConsolidationPlanPanel planMarkdown={planMarkdown} />
            </div>
            <p className="mt-1 text-sm text-[var(--color-mcb-warm-grey)]">
              Suburbs grouped by Melbourne region. Sort: highest organic traffic first.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)] border-b border-[var(--color-mcb-sand-deep)]">
                    <th className="py-2 font-semibold">Region</th>
                    <th className="py-2 font-semibold text-right w-20">Pages</th>
                    <th className="py-2 font-semibold text-right w-24">Keep</th>
                    <th className="py-2 font-semibold text-right w-28">Consolidate</th>
                    <th className="py-2 font-semibold text-right w-28">Clicks · 30d</th>
                    <th className="py-2 font-semibold text-right w-24">Avg unique</th>
                    <th className="py-2 font-semibold">Target URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
                  {proposals.map((p) => (
                    <tr key={p.region} className="hover:bg-[var(--color-mcb-sand)]">
                      <td className="py-2 font-medium text-[var(--color-mcb-charcoal)] capitalize">
                        {p.region}
                      </td>
                      <td className="py-2 text-right tabular-nums">{p.memberCount}</td>
                      <td className="py-2 text-right tabular-nums text-[var(--color-mcb-sage-dark)]">
                        {p.pagesToKeep}
                      </td>
                      <td className="py-2 text-right tabular-nums text-[var(--color-mcb-terracotta-deep)]">
                        {p.pagesToConsolidate}
                      </td>
                      <td className="py-2 text-right tabular-nums">{p.totalClicks30d}</td>
                      <td className="py-2 text-right tabular-nums">{p.avgUniquePct}%</td>
                      <td className="py-2 font-mono text-xs">{p.targetUrl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
            <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
              Per-page audit results
            </h2>
            <p className="mt-1 text-sm text-[var(--color-mcb-warm-grey)]">
              Sorted: lowest uniqueness first (most consolidation candidates at the top). Showing first 100.
            </p>
            <div className="mt-4 max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)] border-b border-[var(--color-mcb-sand-deep)]">
                    <th className="py-2 font-semibold">URL</th>
                    <th className="py-2 font-semibold text-right w-24">Unique %</th>
                    <th className="py-2 font-semibold text-right w-24">Words</th>
                    <th className="py-2 font-semibold text-right w-28">Clicks · 30d</th>
                    <th className="py-2 font-semibold w-32">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
                  {[...audit]
                    .sort((a, b) => (a.unique_pct ?? 0) - (b.unique_pct ?? 0))
                    .slice(0, 100)
                    .map((r) => (
                      <tr key={r.id} className="hover:bg-[var(--color-mcb-sand)]">
                        <td className="py-2 font-mono text-xs text-[var(--color-mcb-charcoal)]">
                          {r.url}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {r.unique_pct === null ? "—" : `${r.unique_pct}%`}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {r.unique_word_count ?? "—"}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {r.organic_clicks_30d ?? 0}
                        </td>
                        <td className="py-2">
                          <RecommendationBadge value={r.recommendation} />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        <p>
          See{" "}
          <Link
            href="/dashboard"
            className="text-[var(--color-mcb-terracotta-deep)] hover:underline"
          >
            audits/SUBURB_CONSOLIDATION_RUNBOOK.md
          </Link>{" "}
          for the full workflow: audit → review proposal → ship redirect map → create regional pages.
        </p>
      </aside>
    </div>
  );
}

function EmptyState() {
  return (
    <section className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white p-8 text-center">
      <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
        No audit data yet
      </h2>
      <p className="mt-2 text-sm text-[var(--color-mcb-warm-grey)] max-w-md mx-auto">
        The suburb-uniqueness-audit cron runs on the 1st of each month at
        00:00 AEST and scores 60 pages per run. Once the first run completes,
        cluster proposals and per-page recommendations will populate here.
      </p>
      <p className="mt-3 text-xs text-[var(--color-mcb-warm-grey)]">
        To run on-demand, hit{" "}
        <code className="font-mono">/api/cron/suburb-uniqueness-audit</code>{" "}
        with{" "}
        <code className="font-mono">Authorization: Bearer $CRON_SECRET</code>.
      </p>
    </section>
  );
}

function RecommendationBadge({ value }: { value: string | null }) {
  if (!value) {
    return <span className="text-xs text-[var(--color-mcb-warm-grey)]">—</span>;
  }
  const cls =
    value === "keep"
      ? "bg-[var(--color-mcb-state-good-bg)] text-[var(--color-mcb-sage-dark)]"
      : value === "consolidate" || value === "redirect"
      ? "bg-[var(--color-mcb-state-attention-bg)] text-[var(--color-mcb-terracotta-deep)]"
      : "bg-[var(--color-mcb-state-critical-bg)] text-[var(--color-mcb-terracotta-red)]";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {value}
    </span>
  );
}
