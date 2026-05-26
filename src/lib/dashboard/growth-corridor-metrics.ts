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
 * Six panels:
 *   1. corridor KPI strip       — last-28d cohort metrics vs prior 28d vs rest-of-site
 *   2. per-page table           — per-URL metrics for the 18 cohort URLs
 *   3. question-level engagement — for each woven Q section, scroll-in rate + dwell
 *   4. scroll-depth heatmap     — % of humans reaching 25/50/75/100 per page
 *   5. AI citation tracker      — latest sweep per question × source from ai_citation_log
 *   6. release impact           — releases tagged `affectsGrowthCorridor`
 *
 * Panel 3 needs the new question_scrolled_into_view / question_section_dwell
 * events firing; until they are, the panel renders an empty state.
 *
 * Panel 5 reads from public.ai_citation_log (migration 20260526). If the
 * table doesn't exist yet, the panel renders an empty state.
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

export interface CorridorScrollDepthRow {
  url: string;
  label: string;
  pageViews: number;
  /** % of page_view sessions that reached each threshold. null if pageViews = 0. */
  pct25: number | null;
  pct50: number | null;
  pct75: number | null;
  pct100: number | null;
}

export interface CorridorQuestionEngagementRow {
  questionId: string;
  pageUrl: string;
  pageLabel: string;
  scrollIns28d: number;
  /** Median dwell in seconds, or null if no exit-dwell events recorded. */
  medianDwellSec: number | null;
}

export interface CorridorAiCitationRow {
  questionId: string;
  /** Latest entry per source. null if that source has never been swept. */
  chatgpt: CorridorAiCitationCell | null;
  perplexity: CorridorAiCitationCell | null;
  gemini: CorridorAiCitationCell | null;
  googleAiOverview: CorridorAiCitationCell | null;
}

export interface CorridorAiCitationCell {
  cited: boolean | null;
  checkedAtIso: string;
  notes: string | null;
}

export interface GrowthCorridorDashboardData {
  kpi: CorridorKpiStripData;
  pages: CorridorPageRow[];
  releases: CorridorReleaseRow[];
  scrollDepth: CorridorScrollDepthRow[];
  questionEngagement: CorridorQuestionEngagementRow[];
  aiCitations: CorridorAiCitationRow[];
  /** True if ai_citation_log table was not found / unreadable. */
  aiCitationsTableMissing: boolean;
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
      scrollDepth: GROWTH_CORRIDOR_PAGES.map((p) => emptyScrollDepthRow(p)),
      questionEngagement: [],
      aiCitations: [],
      aiCitationsTableMissing: true,
      cohortUrls,
      lastUpdatedIso,
    };
  }

  const now = new Date();
  const start28d = new Date(now.getTime() - TWENTY_EIGHT_DAYS_MS);
  const startPrior28d = new Date(now.getTime() - 2 * TWENTY_EIGHT_DAYS_MS);
  const start7d = new Date(now.getTime() - SEVEN_DAYS_MS);
  const startPrior7d = new Date(now.getTime() - 2 * SEVEN_DAYS_MS);

  const [
    cohortNow,
    cohortPrior,
    restNow,
    pageRows,
    scrollDepthRows,
    questionEngagementRows,
    aiCitationData,
  ] = await Promise.all([
    loadKpiBlock(supabase, start28d, now, { membership: "in" }),
    loadKpiBlock(supabase, startPrior28d, start28d, { membership: "in" }),
    loadKpiBlock(supabase, start28d, now, { membership: "out" }),
    loadPerPageRows(supabase, start7d, now, startPrior7d, start7d),
    loadScrollDepthRows(supabase, start28d, now),
    loadQuestionEngagementRows(supabase, start28d, now),
    loadAiCitations(supabase),
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
    scrollDepth: scrollDepthRows,
    questionEngagement: questionEngagementRows,
    aiCitations: aiCitationData.rows,
    aiCitationsTableMissing: aiCitationData.tableMissing,
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

function emptyScrollDepthRow(p: GrowthCorridorPage): CorridorScrollDepthRow {
  return {
    url: p.url,
    label: p.label,
    pageViews: 0,
    pct25: null,
    pct50: null,
    pct75: null,
    pct100: null,
  };
}

// --- Panel 4: scroll-depth heatmap ---

async function loadScrollDepthRows(
  supabase: SupabaseAdmin,
  since: Date,
  until: Date
): Promise<CorridorScrollDepthRow[]> {
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  const rows: CorridorScrollDepthRow[] = [];

  for (const page of GROWTH_CORRIDOR_PAGES) {
    const [pageViews, depth25, depth50, depth75, depth100] = await Promise.all([
      countEvents(supabase, "page_view", sinceIso, untilIso, {
        membership: "in",
        urls: [page.url],
      }),
      countScrollDepth(supabase, page.url, 25, sinceIso, untilIso),
      countScrollDepth(supabase, page.url, 50, sinceIso, untilIso),
      countScrollDepth(supabase, page.url, 75, sinceIso, untilIso),
      countScrollDepth(supabase, page.url, 100, sinceIso, untilIso),
    ]);

    rows.push({
      url: page.url,
      label: page.label,
      pageViews,
      pct25: pageViews > 0 ? (depth25 / pageViews) * 100 : null,
      pct50: pageViews > 0 ? (depth50 / pageViews) * 100 : null,
      pct75: pageViews > 0 ? (depth75 / pageViews) * 100 : null,
      pct100: pageViews > 0 ? (depth100 / pageViews) * 100 : null,
    });
  }

  return rows;
}

async function countScrollDepth(
  supabase: SupabaseAdmin,
  pagePath: string,
  threshold: 25 | 50 | 75 | 100,
  sinceIso: string,
  untilIso: string
): Promise<number> {
  let q = supabase
    .from("analytics_events")
    .select("*", COUNT_OPTS)
    .eq("event_name", "scroll_depth")
    .eq("page_path", pagePath)
    .eq("depth", threshold)
    .gte("created_at", sinceIso)
    .lt("created_at", untilIso)
    .neq("device_type", "bot");
  q = applyBotFilters(q);
  try {
    const result = await q;
    return result.count ?? 0;
  } catch {
    // scroll_depth events may use a different column name in some schemas;
    // gracefully degrade rather than crash the whole dashboard.
    return 0;
  }
}

// --- Panel 3: question-level engagement ---

async function loadQuestionEngagementRows(
  supabase: SupabaseAdmin,
  since: Date,
  until: Date
): Promise<CorridorQuestionEngagementRow[]> {
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  // Pull all question_scrolled_into_view events in the window for cohort pages.
  // Aggregate client-side. At MCB volumes this is fine — events count is small.
  try {
    let q = supabase
      .from("analytics_events")
      .select("page_path, payload, created_at")
      .eq("event_name", "question_scrolled_into_view")
      .gte("created_at", sinceIso)
      .lt("created_at", untilIso)
      .in("page_path", Array.from(GROWTH_CORRIDOR_URLS))
      .neq("device_type", "bot")
      .limit(5000);
    q = applyBotFilters(q);
    const result = await q;
    const events = (result.data ?? []) as Array<{
      page_path: string;
      payload: Record<string, unknown> | null;
    }>;

    type Bucket = { url: string; questionId: string; count: number };
    const buckets = new Map<string, Bucket>();

    for (const ev of events) {
      const qid =
        typeof ev.payload?.question_id === "string"
          ? ev.payload.question_id
          : null;
      if (!qid) continue;
      const key = `${ev.page_path}::${qid}`;
      const existing = buckets.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        buckets.set(key, { url: ev.page_path, questionId: qid, count: 1 });
      }
    }

    // Pull dwell events to compute median dwell per (page, question_id).
    const dwellQ = supabase
      .from("analytics_events")
      .select("page_path, payload")
      .eq("event_name", "question_section_dwell")
      .gte("created_at", sinceIso)
      .lt("created_at", untilIso)
      .in("page_path", Array.from(GROWTH_CORRIDOR_URLS))
      .neq("device_type", "bot")
      .limit(5000);
    const dwellResult = await applyBotFilters(dwellQ);
    const dwellEvents = (dwellResult.data ?? []) as Array<{
      page_path: string;
      payload: Record<string, unknown> | null;
    }>;

    const dwellByKey = new Map<string, number[]>();
    for (const ev of dwellEvents) {
      const qid =
        typeof ev.payload?.question_id === "string"
          ? ev.payload.question_id
          : null;
      const kind =
        typeof ev.payload?.kind === "string" ? ev.payload.kind : null;
      const dwellMs =
        typeof ev.payload?.dwell_ms === "number" ? ev.payload.dwell_ms : null;
      if (!qid || kind !== "exit" || dwellMs == null) continue;
      const key = `${ev.page_path}::${qid}`;
      const list = dwellByKey.get(key) ?? [];
      list.push(dwellMs);
      dwellByKey.set(key, list);
    }

    return Array.from(buckets.values())
      .map((b) => {
        const key = `${b.url}::${b.questionId}`;
        const dwells = dwellByKey.get(key);
        const median = dwells && dwells.length > 0 ? medianOf(dwells) / 1000 : null;
        const pageLabel = PAGE_BY_URL[b.url]?.label ?? b.url;
        return {
          questionId: b.questionId,
          pageUrl: b.url,
          pageLabel,
          scrollIns28d: b.count,
          medianDwellSec: median,
        };
      })
      .sort((a, b) => b.scrollIns28d - a.scrollIns28d);
  } catch {
    return [];
  }
}

function medianOf(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// --- Panel 5: AI citation tracker ---

async function loadAiCitations(
  supabase: SupabaseAdmin
): Promise<{ rows: CorridorAiCitationRow[]; tableMissing: boolean }> {
  try {
    // Pull all rows (table is tiny — manual quarterly entries).
    // Sort newest-first so the latest entry per (question_id, source) is first.
    const result = await supabase
      .from("ai_citation_log")
      .select("question_id, source, checked_at, cited, notes")
      .order("checked_at", { ascending: false })
      .limit(5000);

    if (result.error) {
      // Most common: table doesn't exist yet (migration not applied).
      return { rows: [], tableMissing: true };
    }

    const data = (result.data ?? []) as Array<{
      question_id: string;
      source: string;
      checked_at: string;
      cited: boolean | null;
      notes: string | null;
    }>;

    // Build latest-per-(question_id, source) map.
    const latest = new Map<string, CorridorAiCitationCell>();
    for (const row of data) {
      const key = `${row.question_id}::${row.source}`;
      if (latest.has(key)) continue; // sorted desc → first seen IS latest
      latest.set(key, {
        cited: row.cited,
        checkedAtIso: row.checked_at,
        notes: row.notes,
      });
    }

    // Group by question_id.
    const byQuestion = new Map<string, CorridorAiCitationRow>();
    for (const row of data) {
      if (!byQuestion.has(row.question_id)) {
        byQuestion.set(row.question_id, {
          questionId: row.question_id,
          chatgpt: null,
          perplexity: null,
          gemini: null,
          googleAiOverview: null,
        });
      }
    }
    for (const [key, cell] of latest.entries()) {
      const [questionId, source] = key.split("::");
      const row = byQuestion.get(questionId);
      if (!row) continue;
      if (source === "chatgpt") row.chatgpt = cell;
      else if (source === "perplexity") row.perplexity = cell;
      else if (source === "gemini") row.gemini = cell;
      else if (source === "google_ai_overview") row.googleAiOverview = cell;
    }

    return {
      rows: Array.from(byQuestion.values()).sort((a, b) =>
        a.questionId.localeCompare(b.questionId)
      ),
      tableMissing: false,
    };
  } catch {
    return { rows: [], tableMissing: true };
  }
}

// Re-export for downstream importers.
export { PAGE_BY_URL };
