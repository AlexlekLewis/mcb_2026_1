/**
 * Shared data fetchers for dashboard v2 pages.
 *
 * Kept intentionally narrow — only the queries the new sparse-and-confident
 * pages need. The legacy 1540-line page (now at /dashboard/_legacy/page.tsx)
 * has the full original set; consult that for anything Explorer should
 * surface.
 *
 * All fetchers fail safe: if Supabase isn't configured, they return null /
 * empty arrays so pages render an empty-state instead of throwing.
 */

import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export interface DailyMetric {
  metric_date: string;
  page_views: number;
  visitors: number;
  sessions: number;
  quote_form_starts: number;
  quote_submits: number;
  quote_successes: number;
  phone_taps: number;
  leads: number;
}

export interface FunnelRow {
  sort_order: number;
  stage: string;
  total: number;
}

export interface BotCrawlSummary {
  bot_id: string;
  hits_7d: number;
  last_seen: string | null;
}

export interface AiCitationSummary {
  total_probes_7d: number;
  mcb_cited_count_7d: number;
  share_of_voice_7d: number; // 0..1
}

export interface ContentFreshnessRow {
  url: string;
  title: string | null;
  days_stale: number | null;
  ai_citations_30d: number;
  visits_30d: number;
  last_refreshed: string | null;
}

export interface GbpReviewPending {
  id: number;
  reviewer_name: string | null;
  rating: number | null;
  review_text: string | null;
  review_created_at: string | null;
}

// ---------------------------------------------------------------------
// Daily metrics → leads sparkline + headline numbers
// ---------------------------------------------------------------------

export async function fetchDailyMetrics(days = 28): Promise<DailyMetric[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  const sinceIso = since.toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("dashboard_daily_metrics")
    .select("*")
    .gte("metric_date", sinceIso)
    .order("metric_date", { ascending: true });

  if (error || !data) return [];
  return data as DailyMetric[];
}

/**
 * Compute a 28d hero metric vs prior-28d for one column of DailyMetric.
 */
export function sumColumn(rows: DailyMetric[], col: keyof DailyMetric): number {
  return rows.reduce((acc, r) => acc + (typeof r[col] === "number" ? (r[col] as number) : 0), 0);
}

export async function fetchLeadsHeroData(days: number = 28): Promise<{
  current: DailyMetric[];
  prior: DailyMetric[];
}> {
  if (!hasSupabaseAdminConfig()) return { current: [], prior: [] };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { current: [], prior: [] };

  const window = Math.max(1, Math.floor(days));
  const today = new Date();
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - window);
  const priorStart = new Date(today);
  priorStart.setUTCDate(priorStart.getUTCDate() - window * 2);

  const startIso = start.toISOString().slice(0, 10);
  const priorStartIso = priorStart.toISOString().slice(0, 10);
  const priorEndIso = start.toISOString().slice(0, 10);

  const [{ data: current }, { data: prior }] = await Promise.all([
    supabase
      .from("dashboard_daily_metrics")
      .select("*")
      .gte("metric_date", startIso)
      .order("metric_date", { ascending: true }),
    supabase
      .from("dashboard_daily_metrics")
      .select("*")
      .gte("metric_date", priorStartIso)
      .lt("metric_date", priorEndIso)
      .order("metric_date", { ascending: true }),
  ]);

  return { current: (current as DailyMetric[]) ?? [], prior: (prior as DailyMetric[]) ?? [] };
}

// ---------------------------------------------------------------------
// Funnel rows
// ---------------------------------------------------------------------

export async function fetchFunnelRows(): Promise<FunnelRow[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("dashboard_conversion_funnel_30d")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data as FunnelRow[];
}

// ---------------------------------------------------------------------
// Recent phone taps — every dimension we capture for a `phone_tap` event,
// including the attribution columns (gclid / fbclid / utm_* / referrer).
// Used by the Leads-page call panel to show where each caller came from.
// ---------------------------------------------------------------------

export interface RecentPhoneTap {
  created_at: string;
  source_path: string | null;
  landing_path: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  device_type: string | null;
  browser: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  gclid: string | null;
  fbclid: string | null;
  referrer_url: string | null;
}

export async function fetchRecentPhoneTaps(limit = 25): Promise<RecentPhoneTap[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("analytics_events_clean")
    .select("*")
    .eq("event_name", "phone_tap")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as unknown as RecentPhoneTap[];
}

// ---------------------------------------------------------------------
// Recent leads — chronological list of the most recent quote-form
// submissions, surfaced on /dashboard/leads. Mirrors the table the
// legacy 1540-line dashboard used to show.
// ---------------------------------------------------------------------

export interface RecentLead {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  suburb: string | null;
  postcode: string | null;
  is_victoria: boolean | null;
  product_interests: string[] | null;
  window_count: string | null;
  referral: string | null;
  needs_advice: boolean | null;
  source: string | null;
  status: string | null;
  gclid: string | null;
}

export async function fetchRecentLeads(limit = 25): Promise<RecentLead[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("lead_submissions")
    .select(
      "id, created_at, first_name, last_name, email, phone, suburb, postcode, is_victoria, product_interests, window_count, referral, needs_advice, source, status, gclid",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as unknown as RecentLead[];
}

// ---------------------------------------------------------------------
// Bot crawl summary (reads from PR 1's new bot_crawls table)
// ---------------------------------------------------------------------

export async function fetchBotCrawlSummary(): Promise<{
  total7d: number;
  prior7d: number;
  byBot: BotCrawlSummary[];
}> {
  if (!hasSupabaseAdminConfig()) return { total7d: 0, prior7d: 0, byBot: [] };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { total7d: 0, prior7d: 0, byBot: [] };

  const now = new Date();
  const sevenAgo = new Date(now);
  sevenAgo.setUTCDate(sevenAgo.getUTCDate() - 7);
  const fourteenAgo = new Date(now);
  fourteenAgo.setUTCDate(fourteenAgo.getUTCDate() - 14);

  try {
    const [recent, prior] = await Promise.all([
      supabase
        .from("bot_crawls")
        .select("bot_id, created_at")
        .gte("created_at", sevenAgo.toISOString()),
      supabase
        .from("bot_crawls")
        .select("id", { count: "exact", head: true })
        .gte("created_at", fourteenAgo.toISOString())
        .lt("created_at", sevenAgo.toISOString()),
    ]);

    const recentRows = (recent.data ?? []) as Array<{ bot_id: string; created_at: string }>;
    const byBotMap = new Map<string, { hits: number; lastSeen: string | null }>();
    for (const row of recentRows) {
      const cur = byBotMap.get(row.bot_id) ?? { hits: 0, lastSeen: null };
      cur.hits += 1;
      if (!cur.lastSeen || row.created_at > cur.lastSeen) cur.lastSeen = row.created_at;
      byBotMap.set(row.bot_id, cur);
    }

    const byBot: BotCrawlSummary[] = Array.from(byBotMap.entries())
      .map(([bot_id, v]) => ({ bot_id, hits_7d: v.hits, last_seen: v.lastSeen }))
      .sort((a, b) => b.hits_7d - a.hits_7d);

    return {
      total7d: recentRows.length,
      prior7d: prior.count ?? 0,
      byBot,
    };
  } catch {
    // Table not yet created in Supabase — return empty-state.
    return { total7d: 0, prior7d: 0, byBot: [] };
  }
}

// ---------------------------------------------------------------------
// AI citation summary (reads from PR 1's ai_citations table — empty
// until manual entry UI or paid auto-probe is wired)
// ---------------------------------------------------------------------

export async function fetchAiCitationSummary(): Promise<AiCitationSummary> {
  const empty: AiCitationSummary = {
    total_probes_7d: 0,
    mcb_cited_count_7d: 0,
    share_of_voice_7d: 0,
  };

  if (!hasSupabaseAdminConfig()) return empty;
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty;

  const sevenAgo = new Date();
  sevenAgo.setUTCDate(sevenAgo.getUTCDate() - 7);
  const sevenAgoIso = sevenAgo.toISOString();

  // Read from BOTH probe stores:
  //   - ai_citations: new manual / future-Otterly entries (PR 1)
  //   - ai_citation_probes: existing automated Perplexity probes
  // Sum them — they capture the same conceptual data via different sources.
  let total = 0;
  let cited = 0;

  try {
    const { data } = await supabase
      .from("ai_citations")
      .select("mcb_cited")
      .gte("probed_at", sevenAgoIso);
    if (data) {
      const rows = data as Array<{ mcb_cited: boolean }>;
      total += rows.length;
      cited += rows.filter((r) => r.mcb_cited).length;
    }
  } catch {
    // table not yet created
  }

  try {
    const { data } = await supabase
      .from("ai_citation_probes")
      .select("cited")
      .gte("probed_at", sevenAgoIso);
    if (data) {
      const rows = data as Array<{ cited: boolean }>;
      total += rows.length;
      cited += rows.filter((r) => r.cited).length;
    }
  } catch {
    // table not present in this deployment
  }

  return {
    total_probes_7d: total,
    mcb_cited_count_7d: cited,
    share_of_voice_7d: total > 0 ? cited / total : 0,
  };
}

// ---------------------------------------------------------------------
// Tracked questions + per-question latest probe status
// ---------------------------------------------------------------------

export interface TrackedQuestion {
  id: number;
  question: string;
  category: string;
  intent: string;
  priority: number;
  expected_volume: number | null;
  is_active: boolean;
}

export interface CitationEntryRow {
  id: number;
  probed_at: string;
  question_id: number;
  engine: string;
  mcb_cited: boolean;
  mcb_cited_url: string | null;
  competitor_brands: string[];
  source: string;
}

export async function fetchTrackedQuestions(): Promise<TrackedQuestion[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("tracked_questions")
      .select("id, question, category, intent, priority, expected_volume, is_active")
      .eq("is_active", true)
      .order("priority", { ascending: true })
      .order("id", { ascending: true });

    if (error || !data) return [];
    return data as TrackedQuestion[];
  } catch {
    return [];
  }
}

export async function fetchLatestCitationsByQuestion(): Promise<
  Map<number, Map<string, CitationEntryRow>>
> {
  // Returns: questionId → engine → most recent CitationEntryRow.
  const empty = new Map<number, Map<string, CitationEntryRow>>();
  if (!hasSupabaseAdminConfig()) return empty;
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty;

  try {
    const { data, error } = await supabase
      .from("ai_citations")
      .select("id, probed_at, question_id, engine, mcb_cited, mcb_cited_url, competitor_brands, source")
      .order("probed_at", { ascending: false })
      .limit(500);

    if (error || !data) return empty;
    const rows = data as CitationEntryRow[];

    const result = new Map<number, Map<string, CitationEntryRow>>();
    for (const r of rows) {
      const inner = result.get(r.question_id) ?? new Map<string, CitationEntryRow>();
      if (!inner.has(r.engine)) inner.set(r.engine, r);
      result.set(r.question_id, inner);
    }
    return result;
  } catch {
    return empty;
  }
}

// ---------------------------------------------------------------------
// Content backlog (PR 1's table — populated by question-discovery cron)
// ---------------------------------------------------------------------

export interface BacklogRow {
  id: number;
  discovered_at: string;
  question: string;
  source: string;
  source_url: string | null;
  category: string | null;
  est_volume: number | null;
  commercial_intent_score: number | null;
  content_gap_score: number | null;
  total_score: number;
  status: string;
}

// ---------------------------------------------------------------------
// Suburb audit (PR 1's table — populated by the monthly suburb cron)
// ---------------------------------------------------------------------

export interface SuburbAuditRow {
  id: number;
  audited_at: string;
  url: string;
  suburb_slug: string;
  product_slug: string | null;
  region_cluster: string | null;
  unique_word_count: number | null;
  unique_pct: number | null;
  organic_clicks_30d: number | null;
  recommendation: string | null;
  cluster_target_url: string | null;
  notes: string | null;
}

export async function fetchLatestSuburbAudit(limit = 800): Promise<SuburbAuditRow[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("suburb_audit")
      .select("*")
      .order("audited_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    // De-dupe to most recent per url
    const seen = new Set<string>();
    const result: SuburbAuditRow[] = [];
    for (const row of data as SuburbAuditRow[]) {
      if (seen.has(row.url)) continue;
      seen.add(row.url);
      result.push(row);
    }
    return result;
  } catch {
    return [];
  }
}

export async function fetchBacklog(status: "new" | "approved" | "all" = "new", limit = 50): Promise<BacklogRow[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("content_backlog")
      .select("*")
      .order("total_score", { ascending: false })
      .limit(limit);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as BacklogRow[];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------
// Content freshness (reads from PR 1's content_freshness table — empty
// until cron seeds it)
// ---------------------------------------------------------------------

export async function fetchStaleContent(limit = 5): Promise<ContentFreshnessRow[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    // days_stale is computed client-side — Postgres generated columns can't
    // use now() (not immutable). Order by last_refreshed asc (oldest first)
    // with nulls first so never-refreshed pages surface at the top.
    const { data, error } = await supabase
      .from("content_freshness")
      .select("url, title, ai_citations_30d, visits_30d, last_refreshed")
      .order("last_refreshed", { ascending: true, nullsFirst: true })
      .limit(limit);

    if (error || !data) return [];
    return (data as Omit<ContentFreshnessRow, "days_stale">[]).map((row) => ({
      ...row,
      days_stale:
        row.last_refreshed === null
          ? null
          : Math.floor(
              (Date.now() - new Date(row.last_refreshed).getTime()) / 86_400_000,
            ),
    }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------
// GBP pending reviews (reads from PR 1's gbp_reviews — empty until cron)
// ---------------------------------------------------------------------

export async function fetchPendingReviews(limit = 5): Promise<GbpReviewPending[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("gbp_reviews")
      .select("id, reviewer_name, rating, review_text, review_created_at")
      .eq("response_status", "pending")
      .order("review_created_at", { ascending: true, nullsFirst: false })
      .limit(limit);

    if (error || !data) return [];
    return data as GbpReviewPending[];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------
// AI Content Engine — per-published-answer performance
// Reads from the answer_performance view created in
// supabase/migrations/20260524_ai_content_engine.sql
// ---------------------------------------------------------------------

export interface AnswerPerformanceRow {
  registry_id: number;
  question_id: number;
  question_text: string;
  url: string;
  anchor: string;
  full_url: string;
  mode: string;
  product_slug: string | null;
  byline_author: string;
  published_at: string;
  last_revised_at: string;
  days_since_publish: number;
  ai_bot_hits_7d: number;
  distinct_ai_bots_7d: number;
  last_bot_hit: string | null;
  ai_bot_hits_30d: number;
  page_views_7d: number;
  sessions_7d: number;
  page_views_30d: number;
  leads_attributed_30d: number;
  latest_cited: boolean | null;
  latest_probe_at: string | null;
  latest_cited_url: string | null;
}

export async function fetchAnswerPerformance(): Promise<AnswerPerformanceRow[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from("answer_performance")
      .select("*")
      .order("ai_bot_hits_30d", { ascending: false })
      .order("page_views_30d", { ascending: false })
      .limit(50);
    if (error || !data) return [];
    return data as AnswerPerformanceRow[];
  } catch {
    // View not yet created — first-run state.
    return [];
  }
}

export async function fetchLatestSkillRun(): Promise<{
  id: number;
  started_at: string;
  finished_at: string | null;
  status: string;
  pieces_published: number;
  hypothesis: string | null;
  release_id: string | null;
} | null> {
  if (!hasSupabaseAdminConfig()) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("skill_runs")
      .select("id, started_at, finished_at, status, pieces_published, hypothesis, release_id")
      .order("started_at", { ascending: false })
      .limit(1)
      .single();
    if (error || !data) return null;
    return data as {
      id: number;
      started_at: string;
      finished_at: string | null;
      status: string;
      pieces_published: number;
      hypothesis: string | null;
      release_id: string | null;
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

export function formatPercentPoints(value: number, fractionDigits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(fractionDigits)}pp`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-AU");
}

export function formatDelta(value: number): string {
  if (value === 0) return "0";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("en-AU")}`;
}

export function deltaDirection(current: number, prior: number): "up" | "down" | "flat" {
  if (current > prior) return "up";
  if (current < prior) return "down";
  return "flat";
}

export function relativeDaysAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}
