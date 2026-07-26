import "server-only";
import { cache } from "react";
import { getSupabaseAdmin, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

/**
 * Corrected, owner-legible metrics for the dashboard.
 *
 * WHY THIS EXISTS
 *   The `dashboard_daily_metrics` / `dashboard_top_pages_30d` /
 *   `dashboard_conversion_funnel_30d` DB views still read the RAW
 *   `analytics_events` table and bucket by UTC, so bots inflate
 *   visitors/sessions (visitors > page_views on some days — impossible) and
 *   "today" starts at 10am Melbourne. The fix migration (20260601) was never
 *   applied and there is no DDL path from the app. So we compute headline
 *   numbers here, in app code, from the bot-filtered `analytics_events_clean`
 *   view, bucketed to Australia/Melbourne, with visitor/session distincts
 *   scoped to `page_view`. This is the single source of truth the redesigned
 *   dashboard (and, via data.ts, the leads page + weekly digest email) reads.
 *
 * PERFORMANCE
 *   Counting by fetching unbounded rows silently caps at PostgREST's 1000-row
 *   limit (the historic "bot crawls froze at 1000" bug). So:
 *     - pure counts use head-count queries ({count:'exact', head:true});
 *     - anything needing DISTINCT or per-session aggregation paginates in
 *       1000-row pages via fetchAllClean().
 *   The whole bundle is cache()-wrapped (per-request memo) and the dashboard
 *   routes set `revalidate = 1800`, so the paginated reads run at most ~half
 *   hourly, not per request.
 */

// ---------------------------------------------------------------------
// Time helpers — Australia/Melbourne, DST-correct via the named zone.
// ---------------------------------------------------------------------

const TZ = "Australia/Melbourne";
const DAY_FMT = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const MONTH_FMT = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" });

/** ISO instant → "YYYY-MM-DD" in Melbourne local time. */
export function melbourneDay(iso: string): string {
  return DAY_FMT.format(new Date(iso));
}
/** ISO instant → "YYYY-MM" in Melbourne local time. */
export function melbourneMonth(iso: string): string {
  return MONTH_FMT.format(new Date(iso));
}
/** "2026-07" → "Jul 2026". */
export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(Date.UTC(y, (m ?? 1) - 1, 1));
  return d.toLocaleDateString("en-AU", { month: "short", year: "numeric", timeZone: "UTC" });
}

const DAY_MS = 86_400_000;
function iso(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * DAY_MS).toISOString();
}

// ---------------------------------------------------------------------
// Paginated fetch from the bot-filtered view (beats the 1000-row cap).
// ---------------------------------------------------------------------

const PAGE = 1000;
const MAX_PAGES = 25; // safety backstop (~25k rows) — real 75d volume is ~4k

type Row = Record<string, unknown>;

async function fetchAllClean(
  eventName: string,
  columns: string,
  sinceIso: string,
): Promise<Row[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const out: Row[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE;
    const { data, error } = await supabase
      .from("analytics_events_clean")
      .select(columns)
      .eq("event_name", eventName)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error || !data) break;
    out.push(...(data as unknown as Row[]));
    if (data.length < PAGE) break;
  }
  return out;
}

async function fetchAllCleanRange(
  eventName: string,
  columns: string,
  fromIso: string,
  toIso: string,
): Promise<Row[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const out: Row[] = [];
  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE;
    const { data, error } = await supabase
      .from("analytics_events_clean")
      .select(columns)
      .eq("event_name", eventName)
      .gte("created_at", fromIso)
      .lt("created_at", toIso)
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error || !data) break;
    out.push(...(data as unknown as Row[]));
    if (data.length < PAGE) break;
  }
  return out;
}

async function countClean(eventName: string, fromIso: string, toIso?: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return 0;
  let q = supabase
    .from("analytics_events_clean")
    .select("id", { count: "exact", head: true })
    .eq("event_name", eventName)
    .gte("created_at", fromIso);
  if (toIso) q = q.lt("created_at", toIso);
  const { count, error } = await q;
  return error ? 0 : count ?? 0;
}

// ---------------------------------------------------------------------
// Lead-source classification (organic vs ads). gclid is the reliable
// paid signal (Google auto-tags every ad click); UTM/referrer refine.
// ---------------------------------------------------------------------

const PAID_MEDIUMS = new Set(["cpc", "ppc", "paidsearch", "paid", "paid_search", "paid-search", "paidsocial", "paid_social"]);

export type LeadBucket = "ads" | "organic";

interface LeadRow {
  created_at: string;
  gclid: string | null;
  status: string | null;
  tracking_context: Record<string, unknown> | null;
}

function classifyLead(l: LeadRow): LeadBucket {
  const tc = l.tracking_context ?? {};
  const gclid = l.gclid || (tc.gclid as string) || (tc.gclidStored as string);
  const med = String((tc.utmMedium as string) ?? "").toLowerCase();
  const src = String((tc.utmSource as string) ?? "").toLowerCase();
  if (gclid) return "ads";
  if (PAID_MEDIUMS.has(med)) return "ads";
  if (src.includes("google") && (med === "cpc" || med === "ads")) return "ads";
  return "organic";
}

const isSpamLead = (l: LeadRow) => Boolean(l.status && /spam|junk|test|invalid/i.test(l.status));

// ---------------------------------------------------------------------
// Public shapes
// ---------------------------------------------------------------------

export interface KpiBlock {
  visitors: number;
  sessions: number;
  pageViews: number;
  leads: number;
  leadRatePct: number; // 0..100
  phoneTaps: number;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD Melbourne
  value: number;
}

export interface MonthRow {
  month: string; // YYYY-MM
  label: string; // "Jun 2026"
  pageViews: number;
  visitors: number;
  sessions: number;
  leads: number;
  adsLeads: number;
  organicLeads: number;
  leadRatePct: number;
  phoneTaps: number;
  partial: boolean; // true for the in-progress current month
}

export interface PageRow {
  path: string;
  views: number;
  avgScrollPct: number | null;
  avgEngagedSec: number | null;
}

export interface LocationRow {
  label: string;
  visitors: number;
}

export interface FunnelStage {
  key: string;
  label: string;
  count: number;
}

export interface ReportData {
  unavailable: boolean;
  generatedAt: string;
  kpis: { current: KpiBlock; prior: KpiBlock };
  leadsDaily: DailyPoint[];
  visitorsDaily: DailyPoint[];
  months: MonthRow[];
  topPages: PageRow[];
  devices: { label: string; value: number }[];
  engagement: { avgSec: number; medianSec: number; sessions: number };
  scrollReach: { threshold: number; pct: number }[];
  locations: {
    top: LocationRow[];
    melbourneVisitors: number;
    otherAuVisitors: number;
    intlOrUnknownVisitors: number;
    totalVisitors: number;
  };
  funnel: { current: FunnelStage[] };
}

// ---------------------------------------------------------------------
// Small aggregation helpers
// ---------------------------------------------------------------------

function distinct<T>(rows: Row[], key: string, filter?: (r: Row) => boolean): Set<T> {
  const s = new Set<T>();
  for (const r of rows) {
    if (filter && !filter(r)) continue;
    const v = r[key];
    if (v != null && v !== "") s.add(v as T);
  }
  return s;
}

function inWindow(r: Row, fromIso: string, toIso?: string): boolean {
  const t = String(r.created_at);
  if (t < fromIso) return false;
  if (toIso && t >= toIso) return false;
  return true;
}

function kpiBlock(pv: Row[], taps: Row[], leadCount: number, fromIso: string, toIso?: string): KpiBlock {
  const win = pv.filter((r) => inWindow(r, fromIso, toIso));
  const visitors = distinct<string>(win, "visitor_id").size;
  const sessions = distinct<string>(win, "session_id").size;
  const pageViews = win.length;
  const phoneTaps = taps.filter((r) => inWindow(r, fromIso, toIso)).length;
  return {
    visitors,
    sessions,
    pageViews,
    leads: leadCount,
    leadRatePct: visitors > 0 ? (leadCount / visitors) * 100 : 0,
    phoneTaps,
  };
}

// ---------------------------------------------------------------------
// The loader
// ---------------------------------------------------------------------

const EMPTY: ReportData = {
  unavailable: true,
  generatedAt: new Date(0).toISOString(),
  kpis: {
    current: { visitors: 0, sessions: 0, pageViews: 0, leads: 0, leadRatePct: 0, phoneTaps: 0 },
    prior: { visitors: 0, sessions: 0, pageViews: 0, leads: 0, leadRatePct: 0, phoneTaps: 0 },
  },
  leadsDaily: [],
  visitorsDaily: [],
  months: [],
  topPages: [],
  devices: [],
  engagement: { avgSec: 0, medianSec: 0, sessions: 0 },
  scrollReach: [],
  locations: { top: [], melbourneVisitors: 0, otherAuVisitors: 0, intlOrUnknownVisitors: 0, totalVisitors: 0 },
  funnel: { current: [] },
};

const FUNNEL_STAGES: { key: string; label: string }[] = [
  { key: "quote_cta_click", label: "Quote CTA clicks" },
  { key: "quote_form_start", label: "Form started" },
  { key: "quote_step_1_complete", label: "Step 1 · suburb + product" },
  { key: "quote_step_2_complete", label: "Step 2 · contact details" },
  { key: "quote_step_3_submit", label: "Step 3 · submitted" },
  { key: "quote_success", label: "Lead saved" },
];

/**
 * Loads the full corrected report bundle. cache()-wrapped so multiple callers
 * within one render share a single set of queries.
 */
export const loadReportData = cache(async (): Promise<ReportData> => {
  if (!hasSupabaseAdminConfig()) return EMPTY;
  const supabase = getSupabaseAdmin();
  if (!supabase) return EMPTY;

  const now30 = iso(30);
  const now60 = iso(60);
  const now75 = iso(75); // covers May/Jun/Jul for the calendar-month view
  const now120 = iso(120);

  // Parallel pulls. page_view / phone_tap over 75d; engagement + scroll 30d;
  // leads 120d; funnel head-counts for two windows.
  const [
    pageViews,
    taps,
    scroll,
    ticks,
    leadResp,
    funnelCounts,
  ] = await Promise.all([
    fetchAllClean("page_view", "visitor_id,session_id,page_path,city,region,country,device_type,created_at", now75),
    fetchAllClean("phone_tap", "visitor_id,created_at", now75),
    fetchAllClean("scroll_depth", "session_id,scroll_percent,page_path,created_at", now30),
    fetchAllClean("engagement_tick", "session_id,engagement_seconds,page_path,created_at", now30),
    supabase
      .from("lead_submissions")
      .select("created_at,gclid,status,tracking_context")
      .gte("created_at", now120)
      .order("created_at", { ascending: true }),
    Promise.all(
      FUNNEL_STAGES.map(async (s) => ({ key: s.key, count: await countClean(s.key, now30) })),
    ),
  ]);

  const leads: LeadRow[] = ((leadResp.data as LeadRow[]) ?? []).filter((l) => !isSpamLead(l));

  // ----- Headline KPIs (rolling 30d vs prior 30d) -----
  const leadsCur = leads.filter((l) => inWindow(l as unknown as Row, now30)).length;
  const leadsPrior = leads.filter((l) => inWindow(l as unknown as Row, now60, now30)).length;
  const current = kpiBlock(pageViews, taps, leadsCur, now30);
  const prior = kpiBlock(pageViews, taps, leadsPrior, now60, now30);

  // ----- Daily series (current 30d), Melbourne-bucketed -----
  const leadsByDay = new Map<string, number>();
  for (const l of leads) {
    if (!inWindow(l as unknown as Row, now30)) continue;
    const d = melbourneDay(l.created_at);
    leadsByDay.set(d, (leadsByDay.get(d) ?? 0) + 1);
  }
  const visByDay = new Map<string, Set<string>>();
  for (const r of pageViews) {
    if (!inWindow(r, now30)) continue;
    const d = melbourneDay(String(r.created_at));
    if (!visByDay.has(d)) visByDay.set(d, new Set());
    if (r.visitor_id) visByDay.get(d)!.add(String(r.visitor_id));
  }
  const dayKeys = enumerateDays(now30);
  const leadsDaily: DailyPoint[] = dayKeys.map((date) => ({ date, value: leadsByDay.get(date) ?? 0 }));
  const visitorsDaily: DailyPoint[] = dayKeys.map((date) => ({ date, value: visByDay.get(date)?.size ?? 0 }));

  // ----- Calendar month-on-month -----
  const curMonth = melbourneMonth(new Date().toISOString());
  const monthAgg = new Map<string, { pv: number; vis: Set<string>; ses: Set<string>; leads: number; ads: number; org: number; taps: number }>();
  const ensureMonth = (m: string) => {
    if (!monthAgg.has(m)) monthAgg.set(m, { pv: 0, vis: new Set(), ses: new Set(), leads: 0, ads: 0, org: 0, taps: 0 });
    return monthAgg.get(m)!;
  };
  for (const r of pageViews) {
    const m = ensureMonth(melbourneMonth(String(r.created_at)));
    m.pv++;
    if (r.visitor_id) m.vis.add(String(r.visitor_id));
    if (r.session_id) m.ses.add(String(r.session_id));
  }
  for (const r of taps) ensureMonth(melbourneMonth(String(r.created_at))).taps++;
  for (const l of leads) {
    const m = ensureMonth(melbourneMonth(l.created_at));
    m.leads++;
    if (classifyLead(l) === "ads") m.ads++;
    else m.org++;
  }
  const months: MonthRow[] = [...monthAgg.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({
      month,
      label: monthLabel(month),
      pageViews: v.pv,
      visitors: v.vis.size,
      sessions: v.ses.size,
      leads: v.leads,
      adsLeads: v.ads,
      organicLeads: v.org,
      leadRatePct: v.vis.size > 0 ? (v.leads / v.vis.size) * 100 : 0,
      phoneTaps: v.taps,
      partial: month === curMonth,
    }))
    .filter((m) => m.pageViews > 0 || m.leads > 0);

  // ----- Traffic & engagement (30d) -----
  const pv30 = pageViews.filter((r) => inWindow(r, now30));

  // Top pages: views + avg scroll + avg engaged seconds per session on that path.
  const viewsByPath = new Map<string, number>();
  for (const r of pv30) {
    const p = String(r.page_path ?? "?");
    viewsByPath.set(p, (viewsByPath.get(p) ?? 0) + 1);
  }
  const scrollByPath = new Map<string, { sum: number; n: number }>();
  for (const r of scroll) {
    const p = String(r.page_path ?? "?");
    const sp = Number(r.scroll_percent ?? 0);
    const e = scrollByPath.get(p) ?? { sum: 0, n: 0 };
    e.sum += sp; e.n++;
    scrollByPath.set(p, e);
  }
  const engByPath = new Map<string, { sec: number; sessions: Set<string> }>();
  for (const r of ticks) {
    const p = String(r.page_path ?? "?");
    const e = engByPath.get(p) ?? { sec: 0, sessions: new Set() };
    e.sec += Number(r.engagement_seconds ?? 0);
    if (r.session_id) e.sessions.add(String(r.session_id));
    engByPath.set(p, e);
  }
  const topPages: PageRow[] = [...viewsByPath.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12)
    .map(([path, views]) => {
      const sc = scrollByPath.get(path);
      const en = engByPath.get(path);
      return {
        path,
        views,
        avgScrollPct: sc && sc.n > 0 ? Math.round(sc.sum / sc.n) : null,
        avgEngagedSec: en && en.sessions.size > 0 ? Math.round(en.sec / en.sessions.size) : null,
      };
    });

  // Device split
  const devMap = new Map<string, number>();
  for (const r of pv30) {
    const d = String(r.device_type ?? "unknown");
    devMap.set(d, (devMap.get(d) ?? 0) + 1);
  }
  const devices = [...devMap.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([label, value]) => ({ label, value }));

  // Active time on site: sum engagement_seconds per session → avg/median.
  const secBySession = new Map<string, number>();
  for (const r of ticks) {
    const s = String(r.session_id ?? "?");
    secBySession.set(s, (secBySession.get(s) ?? 0) + Number(r.engagement_seconds ?? 0));
  }
  const durs = [...secBySession.values()].sort((a, b) => a - b);
  const avgSec = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;
  const medianSec = durs.length ? durs[Math.floor(durs.length / 2)] : 0;

  // Scroll reach: max scroll per session → % reaching each threshold.
  const maxScrollBySession = new Map<string, number>();
  for (const r of scroll) {
    const s = String(r.session_id ?? "?");
    const sp = Number(r.scroll_percent ?? 0);
    maxScrollBySession.set(s, Math.max(maxScrollBySession.get(s) ?? 0, sp));
  }
  const scrollTotal = maxScrollBySession.size;
  const scrollReach = [25, 50, 75, 100].map((threshold) => {
    const reached = [...maxScrollBySession.values()].filter((v) => v >= threshold).length;
    return { threshold, pct: scrollTotal > 0 ? Math.round((reached / scrollTotal) * 100) : 0 };
  });

  // ----- Locations (30d) -----
  const locVisitors = new Map<string, Set<string>>();
  let melbourneVisitors = 0, otherAuVisitors = 0, intlOrUnknownVisitors = 0;
  const auRegionVisitors = { vic: new Set<string>(), other: new Set<string>(), intl: new Set<string>() };
  for (const r of pv30) {
    const city = r.city ? String(r.city) : null;
    const region = r.region ? String(r.region) : null;
    const country = r.country ? String(r.country) : null;
    const vid = r.visitor_id ? String(r.visitor_id) : null;
    const label = city ? `${city}${region ? `, ${region}` : ""}` : "Unknown";
    if (!locVisitors.has(label)) locVisitors.set(label, new Set());
    if (vid) locVisitors.get(label)!.add(vid);
    if (vid) {
      if (country === "AU" && region === "VIC") auRegionVisitors.vic.add(vid);
      else if (country === "AU") auRegionVisitors.other.add(vid);
      else auRegionVisitors.intl.add(vid);
    }
  }
  melbourneVisitors = auRegionVisitors.vic.size;
  otherAuVisitors = auRegionVisitors.other.size;
  intlOrUnknownVisitors = auRegionVisitors.intl.size;
  const top: LocationRow[] = [...locVisitors.entries()]
    .map(([label, s]) => ({ label, visitors: s.size }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 10);
  const totalVisitors = distinct<string>(pv30, "visitor_id").size;

  // ----- Funnel (30d) -----
  const funnelCount = new Map(funnelCounts.map((c) => [c.key, c.count]));
  const funnel = {
    current: FUNNEL_STAGES.map((s) => ({ key: s.key, label: s.label, count: funnelCount.get(s.key) ?? 0 })),
  };

  return {
    unavailable: false,
    generatedAt: new Date().toISOString(),
    kpis: { current, prior },
    leadsDaily,
    visitorsDaily,
    months,
    topPages,
    devices,
    engagement: { avgSec, medianSec, sessions: durs.length },
    scrollReach,
    locations: { top, melbourneVisitors, otherAuVisitors, intlOrUnknownVisitors, totalVisitors },
    funnel,
  };
});

// ---------------------------------------------------------------------
// Window-aware helpers for the Leads page (funnel + lead source).
// ---------------------------------------------------------------------

/** Detailed quote funnel (incl. step_1 / step_2) over a window. Head-counts — cheap. */
export async function fetchQuoteFunnel(days = 30): Promise<FunnelStage[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const since = iso(days);
  const counts = await Promise.all(FUNNEL_STAGES.map((s) => countClean(s.key, since)));
  return FUNNEL_STAGES.map((s, i) => ({ key: s.key, label: s.label, count: counts[i] }));
}

// ---------------------------------------------------------------------
// Arbitrary-period comparison (powers the editable /dashboard/compare page).
// ---------------------------------------------------------------------

export interface PeriodMetrics {
  fromIso: string;
  toIso: string;
  pageViews: number;
  visitors: number;
  sessions: number;
  leads: number;
  leadRatePct: number;
  phoneTaps: number;
  adsLeads: number;
  organicLeads: number;
  avgActiveSec: number;
}

/** All headline metrics for an arbitrary [from, to) instant range, bot-filtered. */
export async function computePeriod(fromIso: string, toIso: string): Promise<PeriodMetrics> {
  const empty: PeriodMetrics = {
    fromIso, toIso, pageViews: 0, visitors: 0, sessions: 0, leads: 0,
    leadRatePct: 0, phoneTaps: 0, adsLeads: 0, organicLeads: 0, avgActiveSec: 0,
  };
  if (!hasSupabaseAdminConfig()) return empty;
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty;

  const [pv, ticks, phoneTaps, leadResp] = await Promise.all([
    fetchAllCleanRange("page_view", "visitor_id,session_id,created_at", fromIso, toIso),
    fetchAllCleanRange("engagement_tick", "session_id,engagement_seconds,created_at", fromIso, toIso),
    countClean("phone_tap", fromIso, toIso),
    supabase
      .from("lead_submissions")
      .select("created_at,gclid,status,tracking_context")
      .gte("created_at", fromIso)
      .lt("created_at", toIso),
  ]);

  const visitors = distinct<string>(pv, "visitor_id").size;
  const sessions = distinct<string>(pv, "session_id").size;

  const perSession = new Map<string, number>();
  for (const r of ticks) {
    const s = String(r.session_id ?? "?");
    perSession.set(s, (perSession.get(s) ?? 0) + Number(r.engagement_seconds ?? 0));
  }
  const durs = [...perSession.values()];
  const avgActiveSec = durs.length ? Math.round(durs.reduce((a, b) => a + b, 0) / durs.length) : 0;

  const leads = ((leadResp.data as LeadRow[]) ?? []).filter((l) => !isSpamLead(l));
  let adsLeads = 0;
  let organicLeads = 0;
  for (const l of leads) {
    if (classifyLead(l) === "ads") adsLeads++;
    else organicLeads++;
  }

  return {
    fromIso, toIso,
    pageViews: pv.length,
    visitors,
    sessions,
    leads: leads.length,
    leadRatePct: visitors > 0 ? (leads.length / visitors) * 100 : 0,
    phoneTaps,
    adsLeads,
    organicLeads,
    avgActiveSec,
  };
}

/** Bot-filtered head-count of a single event over a rolling-day window. */
export async function countCleanEvent(eventName: string, days = 30): Promise<number> {
  if (!hasSupabaseAdminConfig()) return 0;
  return countClean(eventName, iso(days));
}

/** Organic-vs-ads lead split over a window. */
export async function fetchLeadSourceSplit(days = 30): Promise<{ ads: number; organic: number; total: number }> {
  if (!hasSupabaseAdminConfig()) return { ads: 0, organic: 0, total: 0 };
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ads: 0, organic: 0, total: 0 };
  const { data } = await supabase
    .from("lead_submissions")
    .select("created_at,gclid,status,tracking_context")
    .gte("created_at", iso(days));
  const leads = ((data as LeadRow[]) ?? []).filter((l) => !isSpamLead(l));
  let ads = 0;
  let organic = 0;
  for (const l of leads) {
    if (classifyLead(l) === "ads") ads++;
    else organic++;
  }
  return { ads, organic, total: leads.length };
}

export interface LeadSourceMonth {
  month: string;
  label: string;
  total: number;
  ads: number;
  organic: number;
  partial: boolean;
}

/** Leads by calendar month, split organic vs ads. Leads are few → one cheap pull. */
export async function fetchLeadSourceMonthly(monthsBack = 4): Promise<LeadSourceMonth[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data } = await supabase
    .from("lead_submissions")
    .select("created_at,gclid,status,tracking_context")
    .gte("created_at", iso(monthsBack * 31 + 5))
    .order("created_at", { ascending: true });
  const leads = ((data as LeadRow[]) ?? []).filter((l) => !isSpamLead(l));
  const curMonth = melbourneMonth(new Date().toISOString());
  const agg = new Map<string, { total: number; ads: number; organic: number }>();
  for (const l of leads) {
    const m = melbourneMonth(l.created_at);
    const e = agg.get(m) ?? { total: 0, ads: 0, organic: 0 };
    e.total++;
    if (classifyLead(l) === "ads") e.ads++;
    else e.organic++;
    agg.set(m, e);
  }
  return [...agg.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-monthsBack)
    .map(([month, v]) => ({ month, label: monthLabel(month), total: v.total, ads: v.ads, organic: v.organic, partial: month === curMonth }));
}

/** Enumerate Melbourne day keys from `sinceIso` to today (inclusive). */
function enumerateDays(sinceIso: string): string[] {
  const out: string[] = [];
  const start = new Date(sinceIso).getTime();
  const end = Date.now();
  for (let t = start; t <= end + DAY_MS; t += DAY_MS) {
    const key = melbourneDay(new Date(t).toISOString());
    if (out[out.length - 1] !== key) out.push(key);
  }
  return out;
}

// ---------------------------------------------------------------------
// Formatting helpers (kept here so pages don't duplicate them)
// ---------------------------------------------------------------------

export function fmtDuration(sec: number): string {
  if (sec <= 0) return "0s";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export function pctDelta(current: number, prior: number): number | null {
  if (prior === 0) return current === 0 ? 0 : null; // null = "new" / no baseline
  return ((current - prior) / prior) * 100;
}

// ---------------------------------------------------------------------
// Clean replacements for the broken DB views, consumed by data.ts so the
// leads page + weekly-digest email inherit corrected numbers too. Same
// row shapes as data.ts's DailyMetric / FunnelRow.
// ---------------------------------------------------------------------

export interface DailyMetricClean {
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

/** Per-Melbourne-day metrics from bot-filtered events. Replaces dashboard_daily_metrics. */
export async function fetchDailyMetricsClean(days = 28): Promise<DailyMetricClean[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const sinceIso = iso(Math.max(1, Math.floor(days)));
  const [pv, taps, starts, submits, successes, leadResp] = await Promise.all([
    fetchAllClean("page_view", "visitor_id,session_id,created_at", sinceIso),
    fetchAllClean("phone_tap", "created_at", sinceIso),
    fetchAllClean("quote_form_start", "created_at", sinceIso),
    fetchAllClean("quote_step_3_submit", "created_at", sinceIso),
    fetchAllClean("quote_success", "created_at", sinceIso),
    supabase.from("lead_submissions").select("created_at,status").gte("created_at", sinceIso),
  ]);
  const leads = ((leadResp.data as LeadRow[]) ?? []).filter((l) => !isSpamLead(l));

  const days_ = enumerateDays(sinceIso);
  const blank = () =>
    ({ page_views: 0, quote_form_starts: 0, quote_submits: 0, quote_successes: 0, phone_taps: 0, leads: 0, visitors: new Set<string>(), sessions: new Set<string>() });
  const agg = new Map<string, ReturnType<typeof blank>>();
  const ensure = (d: string) => { if (!agg.has(d)) agg.set(d, blank()); return agg.get(d)!; };

  for (const r of pv) {
    const a = ensure(melbourneDay(String(r.created_at)));
    a.page_views++;
    if (r.visitor_id) a.visitors.add(String(r.visitor_id));
    if (r.session_id) a.sessions.add(String(r.session_id));
  }
  for (const r of taps) ensure(melbourneDay(String(r.created_at))).phone_taps++;
  for (const r of starts) ensure(melbourneDay(String(r.created_at))).quote_form_starts++;
  for (const r of submits) ensure(melbourneDay(String(r.created_at))).quote_submits++;
  for (const r of successes) ensure(melbourneDay(String(r.created_at))).quote_successes++;
  for (const l of leads) ensure(melbourneDay(l.created_at)).leads++;

  return days_.map((metric_date) => {
    const a = agg.get(metric_date) ?? blank();
    return {
      metric_date,
      page_views: a.page_views,
      visitors: a.visitors.size,
      sessions: a.sessions.size,
      quote_form_starts: a.quote_form_starts,
      quote_submits: a.quote_submits,
      quote_successes: a.quote_successes,
      phone_taps: a.phone_taps,
      leads: a.leads,
    };
  });
}

/** {current, prior} daily-metric windows from bot-filtered events. Replaces the two dashboard_daily_metrics reads in fetchLeadsHeroData. */
export async function fetchLeadsHeroDataClean(
  days = 28,
): Promise<{ current: DailyMetricClean[]; prior: DailyMetricClean[] }> {
  const window = Math.max(1, Math.floor(days));
  const all = await fetchDailyMetricsClean(window * 2);
  const cutoff = melbourneDay(iso(window)); // first day of the current window
  return {
    current: all.filter((r) => r.metric_date >= cutoff),
    prior: all.filter((r) => r.metric_date < cutoff),
  };
}

export interface FunnelRowClean {
  sort_order: number;
  stage: string;
  total: number;
}

/** 30d conversion funnel from bot-filtered events. Replaces dashboard_conversion_funnel_30d. */
export async function fetchFunnelRowsClean(): Promise<FunnelRowClean[]> {
  if (!hasSupabaseAdminConfig()) return [];
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const since = iso(30);

  const stages: { key: string; label: string }[] = [
    { key: "page_view", label: "Page views" },
    { key: "quote_cta_click", label: "Quote CTA clicks" },
    { key: "quote_form_start", label: "Quote form starts" },
    { key: "quote_step_3_submit", label: "Quote submits" },
    { key: "quote_success", label: "Quote successes" },
  ];
  const counts = await Promise.all(stages.map((s) => countClean(s.key, since)));

  const { count: leadCount } = await supabase
    .from("lead_submissions")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since);

  const rows: FunnelRowClean[] = stages.map((s, i) => ({ sort_order: i + 1, stage: s.label, total: counts[i] }));
  rows.push({ sort_order: stages.length + 1, stage: "Stored leads", total: leadCount ?? 0 });
  return rows;
}
