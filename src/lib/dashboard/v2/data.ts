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

export async function fetchLeadsHeroData(): Promise<{
  current: DailyMetric[];
  prior: DailyMetric[];
}> {
  if (!hasSupabaseAdminConfig()) return { current: [], prior: [] };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { current: [], prior: [] };

  const today = new Date();
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - 28);
  const priorStart = new Date(today);
  priorStart.setUTCDate(priorStart.getUTCDate() - 56);

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

  try {
    const { data, error } = await supabase
      .from("ai_citations")
      .select("mcb_cited")
      .gte("probed_at", sevenAgo.toISOString());

    if (error || !data) return empty;
    const rows = data as Array<{ mcb_cited: boolean }>;
    const total = rows.length;
    const cited = rows.filter((r) => r.mcb_cited).length;
    return {
      total_probes_7d: total,
      mcb_cited_count_7d: cited,
      share_of_voice_7d: total > 0 ? cited / total : 0,
    };
  } catch {
    return empty;
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
    const { data, error } = await supabase
      .from("content_freshness")
      .select("url, title, days_stale, ai_citations_30d, visits_30d, last_refreshed")
      .order("days_stale", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error || !data) return [];
    return data as ContentFreshnessRow[];
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
      .select("id, reviewer_name, rating, review_created_at")
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
