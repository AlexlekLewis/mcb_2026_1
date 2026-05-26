import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  GROWTH_CORRIDOR_PAGES,
  GROWTH_CORRIDOR_URLS,
  PAGE_BY_URL,
  type GrowthCorridor,
  type GrowthCorridorPage,
} from "@/lib/growth-corridors";
import { RELEASES } from "./releases";

/**
 * Loads the data behind /dashboard/growth-corridors.
 *
 * Three panels covered tonight (Round 1):
 *   1. corridor KPI strip   — last-28d cohort metrics vs prior 28d vs rest-of-site
 *   2. per-page table       — per-URL metrics for the 18 cohort URLs
 *   6. release impact       — releases tagged `affectsGrowthCorridor`, 24h/48h/7d
 *
 * Panels 3 (question-level engagement), 4 (drop-off heatmap), and 5
 * (AI-citation tracker) require new event flow + several days of data —
 * out of scope for the overnight build, will follow once Round 1 ships and
 * the new analytics events start firing.
 *
 * Bot filtering mirrors release-metrics.ts. When `analytics_events_clean`
 * migration lands site-wide, both files switch over together.
 */

const BOT_UA_PATTERNS = [
  "%bot%",
  "%crawler%",
  "%spider%",
  "%external%agent%",
  "%headless%",
  "%puppeteer%",
  "%playwright%",
];

const COUNT_OPTS = { count: "exact" as const, head: true };

const TWENTY_EIGHT_DAYS_MS = 28 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface CorridorKpiBlock {
  humans: number;
  leads: number;
  leadRatePct: number | null;
  quoteCtaCtrPct: number | null;
  ctaClicks: number;
  pageViews: number;
}

export interface CorridorKpiStripData {
  cohort: CorridorKpiBlock;
  cohortPrior: CorridorKpiBlock;
  restOfSite: CorridorKpiBlock;
  /** True when the data layer is unavailable (e.g. no Supabase). */
  unavailable: boolean;
}

export interface CorridorPageRow {
  url: string;
  label: string;
  corridor: GrowthCorridor;
  category: GrowthCorridorPage["category"];
  humans28d: number;
  ctaClicks28d: number;
  quoteCtaCtrPct: number | null;
  leads28d: number;
  /** 7d humans vs prior 7d, as ratio − 1 (e.g. 0.12 = +12%). null when prior is 0. */
  humans7dDelta: number | null;
}

export interface CorridorReleaseRow {
  id: string;
  title: string;
  releasedAt: string;
  summary: string;
  /** Hours since release. Negative would never happen. */
  hoursSinceRelease: number;
}

export interface GrowthCorridorDashboardData {
  kpi: CorridorKpiStripData;
  pages: CorridorPageRow[];
  releases: CorridorReleaseRow[];
  cohortUrls: string[];
  lastUpdatedIso: string;
}

export async function loadGrowthCorridorDashboard(): Promise<GrowthCorridorDashboardData> {
  const cohortUrls = GROWTH_CORRIDOR_PAGES.map((p) => p.url);
  const lastUpdatedIso = new Date().toISOString();

  // Releases panel — always derivable from the static releases.ts list,
  // even without Supabase. Filter by the optional flag and sort newest-first.
  const releases: CorridorReleaseRow[] = RELEASES.filter((r) => r.affectsGrowthCorridor)
    .map((r) => ({
      id: r.id,
      title: r.title,
      releasedAt: r.releasedAt,
      summary: r.summary,
      hoursSinceRelease: hoursBetween(new Date(r.releasedAt), new Date()),
    }))
    .sort((a, b) => (a.releasedAt < b.releasedAt ? 1 : -1));

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      kpi: emptyKpiStrip(true),
      pages: GROWTH_CORRIDOR_PAGES.map((p) => emptyPageRow(p)),
      releases,
      cohortUrls,
      lastUpdatedIso,
    };
  }

  const now = new Date();
  const start28d = new Date(now.getTime() - TWENTY_EIGHT_DAYS_MS);
  const startPrior28d = new Date(now.getTime() - 2 * TWENTY_EIGHT_DAYS_MS);
  const start7d = new Date(now.getTime() - SEVEN_DAYS_MS);
  const startPrior7d = new Date(now.getTime() - 2 * SEVEN_DAYS_MS);

  const [cohortNow, cohortPrior, restNow, pageRows] = await Promise.all([
    loadKpiBlock(supabase, start28d, now, { membership: "in" }),
    loadKpiBlock(supabase, startPrior28d, start28d, { membership: "in" }),
    loadKpiBlock(supabase, start28d, now, { membership: "out" }),
    loadPerPageRows(supabase, start7d, now, startPrior7d, start7d),
  ]);

  return {
    kpi: {
      cohort: cohortNow,
      cohortPrior,
      restOfSite: restNow,
      unavailable: false,
    },
    pages: pageRows,
    releases,
    cohortUrls,
    lastUpdatedIso,
  };
}

// --- internals ---

type SupabaseAdmin = NonNullable<ReturnType<typeof getSupabaseAdmin>>;

function applyBotFilters<T>(query: T): T {
  // chained `.not(...)` mutates and returns the same query builder shape.
  // Typed loosely to avoid pulling Supabase's huge generic surface here.
  let q = query as unknown as {
    not: (col: string, op: string, val: string) => typeof q;
  };
  for (const pattern of BOT_UA_PATTERNS) {
    q = q.not("user_agent", "ilike", pattern);
  }
  return q as unknown as T;
}

async function countEvents(
  supabase: SupabaseAdmin,
  eventName: string,
  sinceIso: string,
  untilIso: string,
  options: { membership: "in" | "out"; urls?: string[] }
): Promise<number> {
  const targetUrls = options.urls ?? Array.from(GROWTH_CORRIDOR_URLS);
  let q = supabase
    .from("analytics_events")
    .select("*", COUNT_OPTS)
    .eq("event_name", eventName)
    .gte("created_at", sinceIso)
    .lt("created_at", untilIso)
    .neq("device_type", "bot");

  if (options.membership === "in") {
    q = q.in("page_path", targetUrls);
  } else {
    // "out" — everything NOT in the cohort.
    // Supabase JS doesn't expose a `.notIn(...)` — emulate with a long
    // `.not("page_path", "in", "(...)")` filter using PostgREST syntax.
    const inList = targetUrls.map((u) => `"${u.replace(/"/g, '\\"')}"`).join(",");
    q = q.not("page_path", "in", `(${inList})`);
  }

  q = applyBotFilters(q);
  const result = await q;
  return result.count ?? 0;
}

async function countLeads(
  supabase: SupabaseAdmin,
  sinceIso: string,
  untilIso: string,
  options: { membership: "in" | "out"; urls?: string[] }
): Promise<number> {
  // Leads carry a `page_path` of the page the form was submitted from.
  // If the column doesn't exist or is sparse, this gracefully returns 0.
  const targetUrls = options.urls ?? Array.from(GROWTH_CORRIDOR_URLS);
  let q = supabase
    .from("lead_submissions")
    .select("*", COUNT_OPTS)
    .gte("created_at", sinceIso)
    .lt("created_at", untilIso);

  if (options.membership === "in") {
    q = q.in("page_path", targetUrls);
  } else {
    const inList = targetUrls.map((u) => `"${u.replace(/"/g, '\\"')}"`).join(",");
    q = q.not("page_path", "in", `(${inList})`);
  }

  try {
    const result = await q;
    return result.count ?? 0;
  } catch {
    // If page_path isn't on lead_submissions yet, fall back to 0 rather than crash.
    return 0;
  }
}

async function loadKpiBlock(
  supabase: SupabaseAdmin,
  since: Date,
  until: Date,
  options: { membership: "in" | "out" }
): Promise<CorridorKpiBlock> {
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  const [pageViews, ctaClicks, leads] = await Promise.all([
    countEvents(supabase, "page_view", sinceIso, untilIso, options),
    countEvents(supabase, "quote_cta_click", sinceIso, untilIso, options),
    countLeads(supabase, sinceIso, untilIso, options),
  ]);

  // "humans" approximated by page_views — at MCB's volume this is the best
  // proxy without a session-grain materialised view.
  const humans = pageViews;

  return {
    humans,
    leads,
    leadRatePct: humans > 0 ? (leads / humans) * 100 : null,
    quoteCtaCtrPct: pageViews > 0 ? (ctaClicks / pageViews) * 100 : null,
    ctaClicks,
    pageViews,
  };
}

async function loadPerPageRows(
  supabase: SupabaseAdmin,
  start7d: Date,
  now: Date,
  startPrior7d: Date,
  endPrior7d: Date
): Promise<CorridorPageRow[]> {
  const sinceIso = start7d.toISOString();
  const untilIso = now.toISOString();
  const priorSinceIso = startPrior7d.toISOString();
  const priorUntilIso = endPrior7d.toISOString();
  // 28-day windows for the headline humans/leads on each row.
  const since28dIso = new Date(now.getTime() - TWENTY_EIGHT_DAYS_MS).toISOString();

  const rows: CorridorPageRow[] = [];

  // Sequential not parallel — Supabase free tier doesn't love 80+ concurrent
  // queries. 18 URLs × 5 queries = 90; chunk into per-URL batches.
  for (const page of GROWTH_CORRIDOR_PAGES) {
    const [humans28d, ctaClicks28d, leads28d, humans7d, humansPrior7d] = await Promise.all([
      countEvents(supabase, "page_view", since28dIso, untilIso, {
        membership: "in",
        urls: [page.url],
      }),
      countEvents(supabase, "quote_cta_click", since28dIso, untilIso, {
        membership: "in",
        urls: [page.url],
      }),
      countLeads(supabase, since28dIso, untilIso, { membership: "in", urls: [page.url] }),
      countEvents(supabase, "page_view", sinceIso, untilIso, {
        membership: "in",
        urls: [page.url],
      }),
      countEvents(supabase, "page_view", priorSinceIso, priorUntilIso, {
        membership: "in",
        urls: [page.url],
      }),
    ]);

    rows.push({
      url: page.url,
      label: page.label,
      corridor: page.corridor,
      category: page.category,
      humans28d,
      ctaClicks28d,
      quoteCtaCtrPct: humans28d > 0 ? (ctaClicks28d / humans28d) * 100 : null,
      leads28d,
      humans7dDelta:
        humansPrior7d > 0 ? humans7d / humansPrior7d - 1 : humans7d > 0 ? null : null,
    });
  }

  return rows;
}

function emptyKpiBlock(): CorridorKpiBlock {
  return {
    humans: 0,
    leads: 0,
    leadRatePct: null,
    quoteCtaCtrPct: null,
    ctaClicks: 0,
    pageViews: 0,
  };
}

function emptyKpiStrip(unavailable: boolean): CorridorKpiStripData {
  return {
    cohort: emptyKpiBlock(),
    cohortPrior: emptyKpiBlock(),
    restOfSite: emptyKpiBlock(),
    unavailable,
  };
}

function emptyPageRow(p: GrowthCorridorPage): CorridorPageRow {
  return {
    url: p.url,
    label: p.label,
    corridor: p.corridor,
    category: p.category,
    humans28d: 0,
    ctaClicks28d: 0,
    quoteCtaCtrPct: null,
    leads28d: 0,
    humans7dDelta: null,
  };
}

function hoursBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / (60 * 60 * 1000));
}

// Re-export for downstream importers.
export { PAGE_BY_URL };
