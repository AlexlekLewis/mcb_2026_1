import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
  Compass,
  Globe2,
  Laptop,
  MapPin,
  MousePointerClick,
  PhoneCall,
  Search,
  Share2,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { hasSupabaseAdminConfig, getSupabaseAdmin } from "@/lib/supabase/admin";
import {
  DonutChart,
  FunnelChart,
  HorizontalBarChart,
  HourlyActivityChart,
  TrendChart,
} from "@/components/dashboard/DashboardCharts";
import MelbourneMapClient, { type MelbourneMapData } from "@/components/dashboard/MelbourneMapClient";
import type { MapPoint } from "@/components/dashboard/MelbourneMap";
import { LOCATIONS } from "@/lib/locations";
import { ReleaseTracker } from "@/components/dashboard/ReleaseTracker";
import { loadReleaseMetrics } from "@/lib/dashboard/release-metrics";
import { RELEASES } from "@/lib/dashboard/releases";
import type { TrendMarkers } from "@/components/dashboard/DashboardCharts";
import { tallyTopSuburbs, type SuburbTally } from "@/lib/dashboard/nearest-suburb";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Website Dashboard",
  description: "Private website analytics dashboard for Modern Curtains and Blinds.",
  robots: {
    index: false,
    follow: false,
  },
};

type DailyMetric = {
  metric_date: string;
  page_views: number;
  visitors: number;
  sessions: number;
  quote_form_starts: number;
  quote_submits: number;
  quote_successes: number;
  phone_taps: number;
  chat_opens: number;
  chat_leads: number;
  leads: number;
};

type FunnelRow = {
  sort_order: number;
  stage: string;
  total: number;
};

type PageEngagement = {
  page_path: string;
  page_views: number;
  visitors: number;
  sessions: number;
  avg_scroll_percent: number;
  avg_engaged_seconds: number;
};

type LocationRow = {
  city: string;
  region: string;
  country: string;
  visitors: number;
  sessions: number;
  page_views: number;
  quote_clicks: number;
  phone_taps: number;
};

type DeviceRow = {
  device_type: string;
  visitors: number;
  sessions: number;
  page_views: number;
};

type BrowserRow = {
  browser: string;
  visitors: number;
  sessions: number;
};

type CountryRow = {
  country: string;
  visitors: number;
  sessions: number;
  page_views: number;
};

type TrafficSourceRow = {
  source: string;
  visitors: number;
  sessions: number;
  page_views: number;
  quote_clicks: number;
};

type HourRow = {
  hour: number;
  page_views: number;
  sessions: number;
};

type EngagementTotals = {
  total_sessions: number;
  avg_engaged_seconds: number;
  avg_pages_per_session: number;
  avg_max_scroll_percent: number;
  bounced_sessions: number;
};

type LeadSource = {
  lead_source: string;
  leads: number;
  won: number;
  lost: number;
  new: number;
};

type RecentLead = {
  id: string;
  created_at: string;
  source: string;
  status: string;
  first_name: string | null;
  last_name: string | null;
  suburb: string | null;
  product_interests: string[];
  tracking_context: Record<string, unknown> | null;
};

type RecentSession = {
  session_id: string;
  visitor_id: string | null;
  started_at: string;
  last_event_at: string;
  duration_seconds: number;
  engaged_seconds: number;
  page_views: number;
  unique_pages: number;
  max_scroll_percent: number;
  clicked_quote_cta: boolean;
  tapped_phone: boolean;
  completed_quote: boolean;
  landing_path: string | null;
  referrer_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
};

type SearchMetric = {
  clicks: number;
  impressions: number;
  position: number | null;
};

type CtaClickRow = {
  session_id: string | null;
  page_path: string | null;
  created_at: string;
};

type ScrollDepthRow = {
  session_id: string | null;
  page_path: string | null;
  scroll_percent: number | null;
  created_at: string;
};

type PageScrollAtClick = {
  page_path: string;
  clicks: number;
  median_scroll_at_click: number | null;
};

type ScrollAtClickResult = {
  totalClicks: number;
  medianScrollAtClick: number | null;
  perPage: PageScrollAtClick[];
};

export default async function DashboardPage() {
  const hasPassword = Boolean(process.env.DASHBOARD_PASSWORD);
  const hasUsername = Boolean(process.env.DASHBOARD_USERNAME);
  const hasSupabase = hasSupabaseAdminConfig();

  if (!hasPassword || !hasUsername || !hasSupabase) {
    return <SetupRequired hasPassword={hasPassword} hasUsername={hasUsername} hasSupabase={hasSupabase} />;
  }

  const [data, releases] = await Promise.all([loadDashboardData(), loadReleaseMetrics()]);
  const totals = getTotals(data.daily.slice(0, 30));
  const latestDate = data.daily[0]?.metric_date;
  const trends = buildTrendBuckets(data.daily, data.todayHourly);
  const trendMarkers = buildTrendMarkers();

  const trafficSources = data.trafficSources.slice(0, 6).map((row) => ({
    label: row.source,
    value: row.visitors,
  }));
  const deviceMix = data.devices.map((row) => ({
    label: row.device_type,
    value: row.visitors,
  }));
  const topCities = data.locations.slice(0, 10).map((row) => ({
    label: row.city + (row.region ? `, ${row.region}` : ""),
    value: row.visitors,
  }));
  const outsideVic = getOutsideVicStats(data.locations);
  const topSuburbs = data.topSuburbs.slice(0, 8);
  const topSuburbsForChart = topSuburbs.map((row) => ({
    label: row.name,
    value: row.count,
  }));
  const hourly = ensureHourlySpread(data.hourly).map((row) => ({
    hour: row.hour,
    sessions: row.sessions,
  }));

  const bounceRate = data.engagementTotals.total_sessions > 0
    ? Math.round((data.engagementTotals.bounced_sessions / data.engagementTotals.total_sessions) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col justify-between gap-4 border-b border-stone-300 pb-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-mcb-terracotta">MCB website data</p>
            <h1 className="font-serif text-4xl text-mcb-charcoal">Website Dashboard</h1>
          </div>
          <div className="flex flex-col gap-3 text-sm text-stone-500 md:items-end">
            <Link
              href="/dashboard/optimization"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-2 font-bold uppercase tracking-wide text-white shadow-lg shadow-orange-500/20 transition-transform hover:-translate-y-0.5"
            >
              <Activity className="h-4 w-4" /> Site Intelligence <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/social"
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-charcoal px-4 py-2 font-bold uppercase tracking-wide text-white transition-colors hover:bg-mcb-terracotta"
            >
              <Share2 className="h-4 w-4" /> Social Tracking <ArrowRight className="h-4 w-4" />
            </Link>
            <div>
              Last dashboard refresh: {new Date().toLocaleString("en-AU")}
              {latestDate ? <span className="block">Latest stored activity: {formatDate(latestDate)}</span> : null}
            </div>
          </div>
        </header>

        {data.errors.length > 0 ? (
          <div className="mb-6 rounded-sm border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="mb-2 font-bold">
              {data.errors.length} dashboard quer{data.errors.length === 1 ? "y" : "ies"} returned errors:
            </p>
            <ul className="space-y-1 font-mono text-xs">
              {Object.entries(data.errorDetails)
                .filter(([, msg]) => Boolean(msg))
                .map(([key, msg]) => (
                  <li key={key}>
                    <span className="font-bold">{key}:</span> {msg}
                  </li>
                ))}
            </ul>
          </div>
        ) : null}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<BarChart3 />} label="Page Views" value={totals.pageViews.toLocaleString()} detail="Last 30 stored days" />
          <KpiCard
            icon={<Users />}
            label="Visitors"
            value={totals.visitors.toLocaleString()}
            detail={`${totals.sessions.toLocaleString()} sessions`}
          />
          <KpiCard
            icon={<Clock />}
            label="Avg Engaged Time"
            value={formatDuration(data.engagementTotals.avg_engaged_seconds)}
            detail={`${data.engagementTotals.avg_pages_per_session.toFixed(1)} pages / session`}
          />
          <KpiCard
            icon={<Activity />}
            label="Bounce Rate"
            value={`${bounceRate}%`}
            detail={`${data.engagementTotals.bounced_sessions.toLocaleString()} of ${data.engagementTotals.total_sessions.toLocaleString()} sessions`}
          />
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<MousePointerClick />} label="Stored Leads" value={totals.leads.toLocaleString()} detail={`${totals.quoteSuccesses.toLocaleString()} quote successes`} />
          <KpiCard icon={<PhoneCall />} label="Phone Taps" value={totals.phoneTaps.toLocaleString()} detail={`${totals.chatLeads.toLocaleString()} chat leads`} />
          <KpiCard
            icon={<TrendingUp />}
            label="Avg Max Scroll"
            value={`${data.engagementTotals.avg_max_scroll_percent}%`}
            detail={
              data.scrollAtClick.medianScrollAtClick != null
                ? `Per-session deepest scroll · Median ${data.scrollAtClick.medianScrollAtClick}% at quote click`
                : "Per-session deepest scroll"
            }
          />
          <KpiCard
            icon={<Globe2 />}
            label="% Outside VIC"
            value={outsideVic.total > 0 ? `${outsideVic.percent}%` : "—"}
            detail={
              outsideVic.total > 0
                ? `${outsideVic.outsideVic.toLocaleString()} of ${outsideVic.total.toLocaleString()} located visitors`
                : "No geo data yet"
            }
            tone={outsideVicTone(outsideVic.percent, outsideVic.total)}
          />
        </section>

        <section className="mb-6">
          <ReleaseTracker releases={releases} />
        </section>

        <section className="mb-6">
          <Panel title="Traffic & Leads Trend" icon={<TrendingUp />}>
            <TrendChart data={trends} markers={trendMarkers} />
          </Panel>
        </section>

        <section className="mb-6">
          <Panel title="Melbourne Activity Map" icon={<MapPin />}>
            <MelbourneMapClient data={data.mapData} />
          </Panel>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel title="Conversion Funnel" icon={<MousePointerClick />}>
            <FunnelChart data={data.funnel} />
            {data.outOfAreaLeadsCount > 0 ? (
              <p className="mt-4 rounded-sm border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <strong>{data.outOfAreaLeadsCount.toLocaleString()}</strong> out-of-area lead
                {data.outOfAreaLeadsCount === 1 ? "" : "s"} in the last 30 days (postcode not in
                Victoria). These submissions still go through — the form shows a soft warning.
              </p>
            ) : null}
          </Panel>

          <Panel title="Traffic Sources" icon={<Compass />}>
            <DonutChart data={trafficSources} />
            <p className="mt-3 text-xs text-stone-500">
              Counts visitors by UTM source if present, otherwise by referring domain. &ldquo;direct&rdquo; means no referrer.
            </p>
          </Panel>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Top Pages — Engagement" icon={<BarChart3 />}>
            <DataTable
              columns={["Page", "Views", "Visitors", "Avg Scroll", "Avg Time"]}
              rows={data.pageEngagement.slice(0, 12).map((page) => [
                page.page_path,
                page.page_views.toLocaleString(),
                page.visitors.toLocaleString(),
                `${page.avg_scroll_percent}%`,
                formatDuration(page.avg_engaged_seconds),
              ])}
              empty="No page view events have been stored yet."
            />
          </Panel>

          <Panel title="Devices" icon={<Laptop />}>
            <DonutChart data={deviceMix} height={220} />
            {data.browsers.length > 0 ? (
              <div className="mt-4 space-y-2 text-sm">
                {data.browsers.slice(0, 5).map((row) => (
                  <div key={row.browser} className="flex items-center justify-between border-b border-stone-100 pb-1 last:border-0">
                    <span className="font-medium text-stone-700">{row.browser}</span>
                    <span className="text-stone-500">{row.visitors.toLocaleString()} visitors</span>
                  </div>
                ))}
              </div>
            ) : null}
          </Panel>
        </section>

        <section className="mb-6">
          <Panel title="Scroll Depth at Quote Click — By Page" icon={<TrendingUp />}>
            {data.scrollAtClick.perPage.length > 0 ? (
              <>
                <DataTable
                  columns={["Page", "Quote Clicks", "Median Scroll at Click"]}
                  rows={data.scrollAtClick.perPage.slice(0, 12).map((row) => [
                    row.page_path,
                    row.clicks.toLocaleString(),
                    row.median_scroll_at_click != null ? `${row.median_scroll_at_click}%` : "—",
                  ])}
                  empty="No quote-CTA clicks recorded yet."
                  monoFirstColumn
                />
                <p className="mt-3 text-xs text-stone-500">
                  For each click on a quote CTA, we take the deepest scroll the visitor reached on that page
                  before clicking — then take the median per page. Low values mean the top of the page convinced
                  them; high values mean below-fold content matters. Scroll resolution is 25/50/75/100% so values
                  are rounded buckets.
                </p>
              </>
            ) : (
              <p className="rounded-sm bg-stone-50 p-4 text-sm text-stone-500">
                No quote-CTA clicks recorded in the last 30 days.
              </p>
            )}
          </Panel>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <Panel title="Top Suburbs" icon={<MapPin />}>
            {topSuburbs.length > 0 ? (
              <>
                <HorizontalBarChart
                  data={topSuburbsForChart}
                  valueKey="value"
                  labelKey="label"
                  height={300}
                />
                <p className="mt-3 text-xs text-stone-500">
                  Visitor sessions mapped to the nearest VIC suburb in our service-area list using IP geolocation
                  (last 90 days, bot-filtered). IP geo is accurate to roughly 5–10 km — treat this as a cluster
                  signal, not pinpoint addresses.
                </p>
              </>
            ) : (
              <p className="rounded-sm bg-stone-50 p-4 text-sm text-stone-500">
                No visitor sessions with usable coordinates have been recorded yet.
              </p>
            )}
          </Panel>

          <Panel title="Top Cities" icon={<MapPin />}>
            <HorizontalBarChart data={topCities} valueKey="value" labelKey="label" color="#3f4946" height={300} />
          </Panel>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Recent Sessions" icon={<Activity />}>
            <DataTable
              columns={["When", "Where", "Pages", "Time", "Scroll", "Source", "Outcome"]}
              rows={data.recentSessions.slice(0, 14).map((session) => [
                formatShortDateTime(session.started_at),
                formatSessionLocation(session, data.sessionLeadSuburb),
                session.page_views.toLocaleString(),
                formatDuration(Math.max(session.engaged_seconds, session.duration_seconds)),
                `${session.max_scroll_percent}%`,
                session.utm_source || extractDomain(session.referrer_url) || "direct",
                formatSessionOutcome(session),
              ])}
              empty="No sessions stored yet. Once visitors land on the site this table will populate."
              monoFirstColumn
            />
          </Panel>

          <Panel title="Activity by Hour (Melbourne)" icon={<Clock />}>
            <HourlyActivityChart data={hourly} />
            <p className="mt-3 text-xs text-stone-500">
              Sessions broken down by hour-of-day. Useful for picking when to publish, run ads or staff phone lines.
            </p>
          </Panel>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <Panel title="Lead Sources" icon={<MousePointerClick />}>
            <DataTable
              columns={["Source", "Leads", "New", "Won", "Lost"]}
              rows={data.leadSources.map((source) => [
                source.lead_source,
                source.leads.toLocaleString(),
                source.new.toLocaleString(),
                source.won.toLocaleString(),
                source.lost.toLocaleString(),
              ])}
              empty="No lead submissions have been stored yet."
            />
          </Panel>

          <Panel title="Recent Leads" icon={<MousePointerClick />}>
            <DataTable
              columns={["When", "Name", "Location", "Interest", "Source"]}
              rows={data.recentLeads.map((lead) => [
                formatShortDateTime(lead.created_at),
                [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "Unknown",
                formatLeadLocation(lead, data.leadGeo),
                lead.product_interests?.join(", ") || "Not selected",
                lead.source,
              ])}
              empty="No lead submissions have been stored yet."
            />
          </Panel>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Panel title="Daily Metrics" icon={<BarChart3 />}>
            <DataTable
              columns={["Date", "Views", "Visitors", "Leads", "Quote Starts", "Quote Success"]}
              rows={data.daily.slice(0, 14).map((day) => [
                formatDate(day.metric_date),
                day.page_views.toLocaleString(),
                day.visitors.toLocaleString(),
                day.leads.toLocaleString(),
                day.quote_form_starts.toLocaleString(),
                day.quote_successes.toLocaleString(),
              ])}
              empty="No daily metrics have been stored yet."
            />
          </Panel>

          <Panel title="SEO Analytics" icon={<Search />}>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <MiniStat label="Clicks" value={data.searchTotals.clicks} />
              <MiniStat label="Impressions" value={data.searchTotals.impressions} />
              <MiniStat
                label="Avg Position"
                value={data.searchTotals.position ? data.searchTotals.position.toFixed(1) : "N/A"}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Once Search Console import is wired up this panel will surface queries, landing pages, clicks, impressions, CTR
              and ranking movement.
            </p>
          </Panel>
        </section>
      </div>
    </div>
  );
}

async function loadDashboardData() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return emptyData(["Supabase is not configured"]);
  }

  const mapEventCutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const scrollWindowCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStartIso = todayStart.toISOString();
  const mapEventNames = [
    "page_view",
    "phone_tap",
    "quote_form_start",
    "quote_step_3_submit",
    "quote_success",
  ];

  const [
    daily,
    funnel,
    pageEngagement,
    leadSources,
    recentLeads,
    searchMetrics,
    locations,
    countries,
    devices,
    browsers,
    trafficSources,
    hourly,
    engagementTotals,
    recentSessions,
    mapEvents,
    mapLeads,
    todayEvents,
    todayLeads,
    quoteCtaClickEvents,
    scrollDepthEvents,
    outOfAreaLeads,
  ] = await Promise.all([
    supabase.from("dashboard_daily_metrics").select("*").limit(400),
    supabase.from("dashboard_conversion_funnel_30d").select("*"),
    supabase.from("dashboard_page_engagement_30d").select("*").limit(20),
    supabase.from("dashboard_lead_sources_30d").select("*").limit(12),
    supabase
      .from("lead_submissions")
      .select("id, created_at, source, status, first_name, last_name, suburb, product_interests, tracking_context")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("seo_search_console_metrics")
      .select("clicks, impressions, position")
      .gte("metric_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10))
      .limit(5000),
    supabase.from("dashboard_locations_30d").select("*").limit(50),
    supabase.from("dashboard_countries_30d").select("*").limit(20),
    supabase.from("dashboard_devices_30d").select("*"),
    supabase.from("dashboard_browsers_30d").select("*"),
    supabase.from("dashboard_traffic_sources_30d").select("*").limit(20),
    supabase.from("dashboard_hourly_30d").select("*"),
    supabase.from("dashboard_engagement_totals_30d").select("*").maybeSingle(),
    supabase.from("dashboard_recent_sessions_30d").select("*").limit(30),
    supabase
      .from("analytics_events")
      .select("event_name, latitude, longitude, visitor_id, city, session_id")
      .gte("created_at", mapEventCutoff)
      .in("event_name", mapEventNames)
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .limit(25000),
    supabase
      .from("lead_submissions")
      .select("suburb, tracking_context")
      .gte("created_at", mapEventCutoff),
    supabase
      .from("analytics_events")
      .select("event_name, visitor_id, created_at")
      .gte("created_at", todayStartIso)
      .eq("event_name", "page_view")
      .limit(50000),
    supabase
      .from("lead_submissions")
      .select("created_at")
      .gte("created_at", todayStartIso),
    // Source from raw analytics_events (not analytics_events_clean) so this
    // works whether the bot-filter view migration is applied or not. Bot share
    // is filtered out implicitly: bots rarely fire quote_cta_click, and the
    // scroll_depth events we surface only count when joined to a click on the
    // same session — which excludes bot sessions naturally.
    supabase
      .from("analytics_events")
      .select("session_id, page_path, created_at")
      .eq("event_name", "quote_cta_click")
      .gte("created_at", scrollWindowCutoff)
      .limit(5000),
    supabase
      .from("analytics_events")
      .select("session_id, page_path, scroll_percent, created_at")
      .eq("event_name", "scroll_depth")
      .gte("created_at", scrollWindowCutoff)
      .not("scroll_percent", "is", null)
      .limit(25000),
    supabase
      .from("lead_submissions")
      .select("id", { count: "exact", head: true })
      .eq("is_victoria", false)
      .gte("created_at", scrollWindowCutoff),
  ]);

  const leads = (recentLeads.data || []) as RecentLead[];
  const leadSessionIds = leads
    .map((lead) => {
      const context = lead.tracking_context as Record<string, unknown> | null;
      const value = context?.sessionId ?? context?.session_id;
      return typeof value === "string" && value.length > 0 ? value : null;
    })
    .filter((id): id is string => Boolean(id));

  let leadGeo: LeadGeoLookup = {};
  if (leadSessionIds.length > 0) {
    const { data: geoRows } = await supabase
      .from("dashboard_recent_sessions_30d")
      .select("session_id, city, region, country")
      .in("session_id", leadSessionIds);
    leadGeo = Object.fromEntries(
      (geoRows || []).map((row) => [
        row.session_id as string,
        {
          city: (row.city as string | null) ?? null,
          region: (row.region as string | null) ?? null,
          country: (row.country as string | null) ?? null,
        },
      ])
    );
  }

  const mapLeadsRows = (mapLeads.data || []) as MapLeadRow[];
  const mapEventsRows = (mapEvents.data || []) as MapEventRow[];
  const mapData = buildMapData(mapEventsRows, mapLeadsRows);
  const sessionLeadSuburb = buildSessionLeadSuburb(mapLeadsRows);
  const topSuburbs = getTopSuburbsFromEvents(mapEventsRows);
  const scrollAtClick = computeScrollAtClick(
    (quoteCtaClickEvents.data || []) as CtaClickRow[],
    (scrollDepthEvents.data || []) as ScrollDepthRow[]
  );
  const todayHourly = buildTodayHourly(
    (todayEvents.data || []) as TodayEventRow[],
    (todayLeads.data || []) as { created_at: string }[]
  );

  return {
    daily: (daily.data || []) as DailyMetric[],
    funnel: (funnel.data || []) as FunnelRow[],
    pageEngagement: (pageEngagement.data || []) as PageEngagement[],
    leadSources: (leadSources.data || []) as LeadSource[],
    recentLeads: leads,
    leadGeo,
    mapData,
    sessionLeadSuburb,
    todayHourly,
    topSuburbs,
    scrollAtClick,
    outOfAreaLeadsCount: outOfAreaLeads.count ?? 0,
    searchTotals: getSearchTotals((searchMetrics.data || []) as SearchMetric[]),
    locations: (locations.data || []) as LocationRow[],
    countries: (countries.data || []) as CountryRow[],
    devices: (devices.data || []) as DeviceRow[],
    browsers: (browsers.data || []) as BrowserRow[],
    trafficSources: (trafficSources.data || []) as TrafficSourceRow[],
    hourly: (hourly.data || []) as HourRow[],
    engagementTotals: ((engagementTotals.data as EngagementTotals | null) || {
      total_sessions: 0,
      avg_engaged_seconds: 0,
      avg_pages_per_session: 0,
      avg_max_scroll_percent: 0,
      bounced_sessions: 0,
    }) as EngagementTotals,
    recentSessions: (recentSessions.data || []) as RecentSession[],
    errors: [
      daily.error,
      funnel.error,
      pageEngagement.error,
      leadSources.error,
      recentLeads.error,
      searchMetrics.error,
      locations.error,
      countries.error,
      devices.error,
      browsers.error,
      trafficSources.error,
      hourly.error,
      engagementTotals.error,
      recentSessions.error,
      mapEvents.error,
      mapLeads.error,
      todayEvents.error,
      todayLeads.error,
      quoteCtaClickEvents.error,
      scrollDepthEvents.error,
      outOfAreaLeads.error,
    ].filter(Boolean),
    errorDetails: {
      daily: daily.error?.message ?? null,
      funnel: funnel.error?.message ?? null,
      pageEngagement: pageEngagement.error?.message ?? null,
      leadSources: leadSources.error?.message ?? null,
      recentLeads: recentLeads.error?.message ?? null,
      searchMetrics: searchMetrics.error?.message ?? null,
      locations: locations.error?.message ?? null,
      countries: countries.error?.message ?? null,
      devices: devices.error?.message ?? null,
      browsers: browsers.error?.message ?? null,
      trafficSources: trafficSources.error?.message ?? null,
      hourly: hourly.error?.message ?? null,
      engagementTotals: engagementTotals.error?.message ?? null,
      recentSessions: recentSessions.error?.message ?? null,
      mapEvents: mapEvents.error?.message ?? null,
      mapLeads: mapLeads.error?.message ?? null,
      todayEvents: todayEvents.error?.message ?? null,
      todayLeads: todayLeads.error?.message ?? null,
      quoteCtaClickEvents: quoteCtaClickEvents.error?.message ?? null,
      scrollDepthEvents: scrollDepthEvents.error?.message ?? null,
      outOfAreaLeads: outOfAreaLeads.error?.message ?? null,
    },
  };
}

type LeadGeoLookup = Record<
  string,
  { city: string | null; region: string | null; country: string | null }
>;

function emptyData(errors: string[]) {
  return {
    daily: [] as DailyMetric[],
    funnel: [] as FunnelRow[],
    pageEngagement: [] as PageEngagement[],
    leadSources: [] as LeadSource[],
    recentLeads: [] as RecentLead[],
    leadGeo: {} as LeadGeoLookup,
    mapData: { views: [], visitors: [], leads: [], phone: [], forms: [] } as MelbourneMapData,
    sessionLeadSuburb: {} as Record<string, string>,
    topSuburbs: [] as SuburbTally[],
    scrollAtClick: emptyScrollAtClick(),
    outOfAreaLeadsCount: 0,
    todayHourly: [] as Array<{ label: string; page_views: number; visitors: number; leads: number }>,
    searchTotals: { clicks: 0, impressions: 0, position: null },
    locations: [] as LocationRow[],
    countries: [] as CountryRow[],
    devices: [] as DeviceRow[],
    browsers: [] as BrowserRow[],
    trafficSources: [] as TrafficSourceRow[],
    hourly: [] as HourRow[],
    engagementTotals: {
      total_sessions: 0,
      avg_engaged_seconds: 0,
      avg_pages_per_session: 0,
      avg_max_scroll_percent: 0,
      bounced_sessions: 0,
    } as EngagementTotals,
    recentSessions: [] as RecentSession[],
    errors,
    errorDetails: {} as Record<string, string | null>,
  };
}

function SetupRequired({
  hasPassword,
  hasUsername,
  hasSupabase,
}: {
  hasPassword: boolean;
  hasUsername: boolean;
  hasSupabase: boolean;
}) {
  return (
    <div className="min-h-screen bg-stone-100 px-4 py-12 text-stone-900">
      <div className="mx-auto max-w-3xl rounded-sm border border-stone-300 bg-white p-8 shadow-sm">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-amber-100 text-amber-700">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-mcb-terracotta">Dashboard setup</p>
        <h1 className="mb-4 font-serif text-4xl text-mcb-charcoal">Website Dashboard Is Protected</h1>
        <p className="mb-6 leading-relaxed text-stone-600">
          Add the required environment variables before the dashboard reads private lead and analytics data.
        </p>
        <div className="space-y-3 text-sm">
          <SetupRow complete={hasUsername} label="DASHBOARD_USERNAME" />
          <SetupRow complete={hasPassword} label="DASHBOARD_PASSWORD" />
          <SetupRow complete={hasSupabase} label="SUPABASE_SERVICE_ROLE_KEY plus SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL" />
        </div>
      </div>
    </div>
  );
}

function SetupRow({ complete, label }: { complete: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-stone-200 bg-stone-50 px-4 py-3">
      <span className="font-medium text-stone-700">{label}</span>
      <span className={complete ? "text-green-700" : "text-amber-700"}>{complete ? "Ready" : "Needed"}</span>
    </div>
  );
}

type KpiTone = "default" | "good" | "warn" | "bad";

const KPI_TONE_CLASS: Record<KpiTone, string> = {
  default: "text-mcb-charcoal",
  good: "text-emerald-700",
  warn: "text-amber-600",
  bad: "text-red-700",
};

function KpiCard({
  icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  tone?: KpiTone;
}) {
  return (
    <div className="rounded-sm border border-stone-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wide text-stone-500">{label}</span>
        <span className="text-mcb-terracotta [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${KPI_TONE_CLASS[tone]}`}>{value}</div>
      <p className="mt-1 text-sm text-stone-500">{detail}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-sm border border-stone-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 border-b border-stone-200 pb-3">
        <span className="text-mcb-terracotta [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
        <h2 className="font-serif text-2xl text-mcb-charcoal">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DataTable({
  columns,
  rows,
  empty,
  monoFirstColumn,
}: {
  columns: string[];
  rows: string[][];
  empty: string;
  monoFirstColumn?: boolean;
}) {
  if (rows.length === 0) {
    return <p className="rounded-sm bg-stone-50 p-4 text-sm text-stone-500">{empty}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
            {columns.map((column) => (
              <th key={column} className="px-2 py-2 font-bold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.join("-")}-${index}`} className="border-b border-stone-100 last:border-0">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cell}-${cellIndex}`}
                  className={`max-w-[280px] px-2 py-3 align-top text-stone-700 ${
                    monoFirstColumn && cellIndex === 0 ? "font-mono text-xs" : ""
                  }`}
                >
                  <span className="line-clamp-2">{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-stone-50 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-mcb-charcoal">{typeof value === "number" ? value.toLocaleString() : value}</p>
    </div>
  );
}

function getTotals(daily: DailyMetric[]) {
  return daily.reduce(
    (totals, day) => ({
      pageViews: totals.pageViews + day.page_views,
      visitors: totals.visitors + day.visitors,
      sessions: totals.sessions + day.sessions,
      leads: totals.leads + day.leads,
      quoteSuccesses: totals.quoteSuccesses + day.quote_successes,
      phoneTaps: totals.phoneTaps + day.phone_taps,
      chatLeads: totals.chatLeads + day.chat_leads,
    }),
    {
      pageViews: 0,
      visitors: 0,
      sessions: 0,
      leads: 0,
      quoteSuccesses: 0,
      phoneTaps: 0,
      chatLeads: 0,
    }
  );
}

/**
 * Counts visitors split by VIC vs out-of-VIC from the locations view, which is
 * already deduped by city/region. Rows with no region (no IP geo) are excluded
 * from both numerator and denominator so unknowns don't inflate the bad number.
 */
function getOutsideVicStats(locations: LocationRow[]) {
  let inVic = 0;
  let outsideVic = 0;
  for (const row of locations) {
    if (!row.region) continue;
    if (row.region.toUpperCase() === "VIC") inVic += row.visitors;
    else outsideVic += row.visitors;
  }
  const total = inVic + outsideVic;
  const percent = total > 0 ? Math.round((outsideVic / total) * 100) : 0;
  return { inVic, outsideVic, total, percent };
}

/** Color the % Outside VIC card to flag drift — green ≤5%, amber 6–15%, red 16%+. */
function outsideVicTone(percent: number, total: number): KpiTone {
  if (total === 0) return "default";
  if (percent <= 5) return "good";
  if (percent <= 15) return "warn";
  return "bad";
}

/**
 * Dedupe MapEventRow[] down to one (lat, lon) per session, then bucket them by
 * nearest VIC suburb. Sessions outside MAX_MATCH_DISTANCE_KM are dropped — they
 * surface separately via the % Outside VIC card.
 */
function getTopSuburbsFromEvents(events: MapEventRow[]): SuburbTally[] {
  const sessionCoord = new Map<string, { lat: number; lon: number }>();
  for (const event of events) {
    if (event.latitude == null || event.longitude == null) continue;
    const key = event.session_id || `${event.visitor_id ?? ""}:${event.latitude},${event.longitude}`;
    if (!key || sessionCoord.has(key)) continue;
    sessionCoord.set(key, { lat: event.latitude, lon: event.longitude });
  }
  return tallyTopSuburbs(Array.from(sessionCoord.values()));
}

/**
 * For each quote-CTA click, finds the deepest scroll the same session reached on
 * the same page BEFORE the click. Returns the median across the cohort plus a
 * per-page breakdown sorted by click volume.
 *
 * Why this metric: tells us at what scroll depth visitors decide to engage. If
 * the median is 30%, the top of the page is doing the convincing; if it's 80%,
 * everything below the fold matters. Per-page tells us which pages and which
 * sections within them are pulling weight.
 *
 * Scroll resolution is 25/50/75/100% (event fires at those thresholds), so this
 * is a rough bucket signal — directionally useful, not finer.
 */
function computeScrollAtClick(
  clicks: CtaClickRow[],
  scrolls: ScrollDepthRow[]
): ScrollAtClickResult {
  // Index scrolls by `${session_id}\0${page_path}` for fast lookup, sorted ascending by time
  const scrollIndex = new Map<string, Array<{ time: number; pct: number }>>();
  for (const s of scrolls) {
    if (!s.session_id || !s.page_path || s.scroll_percent == null) continue;
    const key = `${s.session_id} ${s.page_path}`;
    const bucket = scrollIndex.get(key) || [];
    bucket.push({ time: Date.parse(s.created_at), pct: s.scroll_percent });
    scrollIndex.set(key, bucket);
  }
  for (const bucket of scrollIndex.values()) {
    bucket.sort((a, b) => a.time - b.time);
  }

  const allScrollAtClick: number[] = [];
  const perPageScrolls = new Map<string, number[]>();

  for (const click of clicks) {
    if (!click.session_id || !click.page_path) continue;
    const key = `${click.session_id} ${click.page_path}`;
    const bucket = scrollIndex.get(key);
    let maxScroll = 0;
    if (bucket) {
      const clickTime = Date.parse(click.created_at);
      for (const entry of bucket) {
        if (entry.time > clickTime) break;
        if (entry.pct > maxScroll) maxScroll = entry.pct;
      }
    }
    allScrollAtClick.push(maxScroll);
    const pagePath = click.page_path;
    const pageBucket = perPageScrolls.get(pagePath) || [];
    pageBucket.push(maxScroll);
    perPageScrolls.set(pagePath, pageBucket);
  }

  const perPage: PageScrollAtClick[] = Array.from(perPageScrolls.entries())
    .map(([page_path, values]) => ({
      page_path,
      clicks: values.length,
      median_scroll_at_click: median(values),
    }))
    .sort((a, b) => b.clicks - a.clicks);

  return {
    totalClicks: clicks.length,
    medianScrollAtClick: median(allScrollAtClick),
    perPage,
  };
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

function emptyScrollAtClick(): ScrollAtClickResult {
  return { totalClicks: 0, medianScrollAtClick: null, perPage: [] };
}

function getSearchTotals(metrics: SearchMetric[]) {
  const clicks = metrics.reduce((total, metric) => total + metric.clicks, 0);
  const impressions = metrics.reduce((total, metric) => total + metric.impressions, 0);
  const positionMetrics = metrics.filter((metric) => typeof metric.position === "number");
  const position =
    positionMetrics.length > 0
      ? positionMetrics.reduce((total, metric) => total + (metric.position || 0), 0) / positionMetrics.length
      : null;

  return { clicks, impressions, position };
}

function ensureHourlySpread(rows: HourRow[]): HourRow[] {
  const map = new Map<number, HourRow>();
  for (const row of rows) map.set(row.hour, row);
  return Array.from({ length: 24 }, (_, hour) =>
    map.get(hour) || { hour, page_views: 0, sessions: 0 }
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatShortDateTime(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Melbourne",
  }).format(new Date(value));
}

function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  if (minutes < 60) return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatSessionLocation(
  session: RecentSession,
  sessionLeadSuburb: Record<string, string>
): string {
  const leadSuburb = session.session_id ? sessionLeadSuburb[session.session_id] : undefined;
  const ipParts = [session.city, session.region, session.country].filter(Boolean);
  const ipLocation = ipParts.length > 0 ? ipParts.join(", ") : null;

  if (leadSuburb && ipLocation) return `${leadSuburb} · ${ipLocation}`;
  if (leadSuburb) return leadSuburb;
  if (ipLocation) return ipLocation;
  return "Unknown (no IP geo)";
}

function formatSessionOutcome(session: RecentSession) {
  const flags: string[] = [];
  if (session.completed_quote) flags.push("Quote ✓");
  if (session.clicked_quote_cta) flags.push("CTA");
  if (session.tapped_phone) flags.push("Phone");
  return flags.length > 0 ? flags.join(", ") : "—";
}

function extractDomain(url: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function formatLeadLocation(lead: RecentLead, geo: LeadGeoLookup): string {
  const context = lead.tracking_context as Record<string, unknown> | null;
  const sessionId =
    (typeof context?.sessionId === "string" && context.sessionId) ||
    (typeof context?.session_id === "string" && context.session_id) ||
    null;
  const session = sessionId ? geo[sessionId] : undefined;

  const ipParts = session ? [session.city, session.region, session.country].filter(Boolean) : [];
  const ipLocation = ipParts.length > 0 ? ipParts.join(", ") : null;

  if (lead.suburb && ipLocation) return `${lead.suburb} · ${ipLocation}`;
  if (lead.suburb) return lead.suburb;
  if (ipLocation) return ipLocation;
  return "Unknown";
}

function buildTrendBuckets(
  daily: DailyMetric[],
  todayHourly: Array<{ label: string; page_views: number; visitors: number; leads: number }>
) {
  const ascending = [...daily].sort((a, b) => a.metric_date.localeCompare(b.metric_date));

  const dailyPoints = todayHourly;

  const weeklyMap = new Map<string, { date: Date; page_views: number; visitors: number; leads: number }>();
  for (const day of ascending) {
    const date = new Date(`${day.metric_date}T00:00:00`);
    const weekStart = startOfWeek(date);
    const key = weekStart.toISOString().slice(0, 10);
    const bucket = weeklyMap.get(key) || { date: weekStart, page_views: 0, visitors: 0, leads: 0 };
    bucket.page_views += day.page_views;
    bucket.visitors += day.visitors;
    bucket.leads += day.leads;
    weeklyMap.set(key, bucket);
  }
  const weeklyPoints = Array.from(weeklyMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-12)
    .map((bucket) => ({
      label: `Wk ${formatShortDate(bucket.date.toISOString().slice(0, 10))}`,
      page_views: bucket.page_views,
      visitors: bucket.visitors,
      leads: bucket.leads,
    }));

  const monthlyMap = new Map<string, { date: Date; page_views: number; visitors: number; leads: number }>();
  for (const day of ascending) {
    const date = new Date(`${day.metric_date}T00:00:00`);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const key = `${monthStart.getFullYear()}-${monthStart.getMonth()}`;
    const bucket = monthlyMap.get(key) || { date: monthStart, page_views: 0, visitors: 0, leads: 0 };
    bucket.page_views += day.page_views;
    bucket.visitors += day.visitors;
    bucket.leads += day.leads;
    monthlyMap.set(key, bucket);
  }
  const monthlyPoints = Array.from(monthlyMap.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-12)
    .map((bucket) => ({
      label: new Intl.DateTimeFormat("en-AU", { month: "short", year: "2-digit" }).format(bucket.date),
      page_views: bucket.page_views,
      visitors: bucket.visitors,
      leads: bucket.leads,
    }));

  return { daily: dailyPoints, weekly: weeklyPoints, monthly: monthlyPoints };
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = (day + 6) % 7;
  result.setDate(result.getDate() - diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Produce per-range "optimization checkpoint" markers for the trend chart.
 * Each marker's `label` must match the X-axis bucket label produced by
 * buildTrendBuckets and buildTodayHourly so Recharts can pin it in place.
 *
 * Daily markers only show if the release happened today (UTC, mirroring how
 * the hourly buckets are produced server-side).
 */
function buildTrendMarkers(): TrendMarkers {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  const daily: TrendMarkers["daily"] = [];
  const weekly: TrendMarkers["weekly"] = [];
  const monthly: TrendMarkers["monthly"] = [];

  for (const release of RELEASES) {
    const released = new Date(release.releasedAt);
    const title = release.title.length > 28 ? `${release.title.slice(0, 27)}…` : release.title;

    if (released.toISOString().slice(0, 10) === todayKey) {
      daily.push({
        label: formatHourLabel(released.getHours()),
        title,
        releasedAt: release.releasedAt,
      });
    }

    const weekStart = startOfWeek(released);
    weekly.push({
      label: `Wk ${formatShortDate(weekStart.toISOString().slice(0, 10))}`,
      title,
      releasedAt: release.releasedAt,
    });

    const monthStart = new Date(released.getFullYear(), released.getMonth(), 1);
    monthly.push({
      label: new Intl.DateTimeFormat("en-AU", { month: "short", year: "2-digit" }).format(monthStart),
      title,
      releasedAt: release.releasedAt,
    });
  }

  return { daily, weekly, monthly };
}

type TodayEventRow = {
  event_name: string;
  visitor_id: string | null;
  created_at: string;
};

function buildTodayHourly(
  events: TodayEventRow[],
  leads: { created_at: string }[]
): Array<{ label: string; page_views: number; visitors: number; leads: number }> {
  const buckets: Array<{
    hour: number;
    page_views: number;
    visitors: Set<string>;
    leads: number;
  }> = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    page_views: 0,
    visitors: new Set<string>(),
    leads: 0,
  }));

  for (const event of events) {
    const hour = new Date(event.created_at).getHours();
    if (hour < 0 || hour > 23) continue;
    const bucket = buckets[hour];
    if (event.event_name === "page_view") {
      bucket.page_views += 1;
      if (event.visitor_id) bucket.visitors.add(event.visitor_id);
    }
  }

  for (const lead of leads) {
    const hour = new Date(lead.created_at).getHours();
    if (hour < 0 || hour > 23) continue;
    buckets[hour].leads += 1;
  }

  return buckets.map((bucket) => ({
    label: formatHourLabel(bucket.hour),
    page_views: bucket.page_views,
    visitors: bucket.visitors.size,
    leads: bucket.leads,
  }));
}

function formatHourLabel(hour: number): string {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

type MapEventRow = {
  event_name: string;
  latitude: number | null;
  longitude: number | null;
  visitor_id: string | null;
  city: string | null;
  session_id: string | null;
};

type MapLeadRow = {
  suburb: string | null;
  tracking_context: Record<string, unknown> | null;
};

const SUBURB_LOOKUP: Map<string, (typeof LOCATIONS)[number]> = (() => {
  const map = new Map<string, (typeof LOCATIONS)[number]>();
  for (const loc of LOCATIONS) {
    map.set(loc.name.toLowerCase(), loc);
    map.set(loc.slug.toLowerCase(), loc);
  }
  return map;
})();

function normalizeSuburbName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[,\s]+(vic|victoria)\b[\s,]*\d{0,4}.*$/i, "")
    .replace(/[,\s]+\d{4}\b.*$/i, "")
    .replace(/[,\s]+(vic|victoria)\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function lookupSuburb(value: string | null) {
  if (!value) return null;
  const normalized = normalizeSuburbName(value);
  if (!normalized) return null;
  return SUBURB_LOOKUP.get(normalized) || null;
}

function sessionIdFromContext(context: Record<string, unknown> | null): string | null {
  if (!context) return null;
  const candidate = context.sessionId ?? context.session_id;
  return typeof candidate === "string" && candidate.length > 0 ? candidate : null;
}

function buildSessionLeadSuburb(leads: MapLeadRow[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const lead of leads) {
    if (!lead.suburb) continue;
    const sessionId = sessionIdFromContext(lead.tracking_context);
    if (!sessionId) continue;
    map[sessionId] = lead.suburb;
  }
  return map;
}

function buildMapData(
  events: MapEventRow[],
  leads: MapLeadRow[]
): MelbourneMapData {
  const viewBuckets = new Map<string, { lat: number; lng: number; count: number; label: string | null }>();
  const visitorBuckets = new Map<string, { lat: number; lng: number; visitors: Set<string>; label: string | null }>();
  const phoneBuckets = new Map<string, { lat: number; lng: number; count: number; label: string | null }>();
  const formBuckets = new Map<string, { lat: number; lng: number; count: number; label: string | null }>();
  const sessionLatLng = new Map<string, { lat: number; lng: number; label: string | null }>();

  for (const event of events) {
    if (event.latitude == null || event.longitude == null) continue;
    const lat = Math.round(event.latitude * 1000) / 1000;
    const lng = Math.round(event.longitude * 1000) / 1000;
    const key = `${lat},${lng}`;
    const label = event.city;

    if (event.session_id && !sessionLatLng.has(event.session_id)) {
      sessionLatLng.set(event.session_id, { lat, lng, label });
    }

    if (event.event_name === "page_view") {
      const bucket = viewBuckets.get(key) || { lat, lng, count: 0, label };
      bucket.count += 1;
      viewBuckets.set(key, bucket);

      if (event.visitor_id) {
        const visitorBucket =
          visitorBuckets.get(key) || { lat, lng, visitors: new Set<string>(), label };
        visitorBucket.visitors.add(event.visitor_id);
        visitorBuckets.set(key, visitorBucket);
      }
    } else if (event.event_name === "phone_tap") {
      const bucket = phoneBuckets.get(key) || { lat, lng, count: 0, label };
      bucket.count += 1;
      phoneBuckets.set(key, bucket);
    } else if (
      event.event_name === "quote_step_3_submit" ||
      event.event_name === "quote_success" ||
      event.event_name === "quote_form_start"
    ) {
      const bucket = formBuckets.get(key) || { lat, lng, count: 0, label };
      bucket.count += 1;
      formBuckets.set(key, bucket);
    }
  }

  const leadBuckets = new Map<string, { lat: number; lng: number; count: number; label: string | null }>();
  for (const lead of leads) {
    let lat: number | null = null;
    let lng: number | null = null;
    let label: string | null = null;

    const suburbMatch = lookupSuburb(lead.suburb);
    if (suburbMatch) {
      lat = suburbMatch.latitude;
      lng = suburbMatch.longitude;
      label = suburbMatch.name;
    } else {
      const sessionId = sessionIdFromContext(lead.tracking_context);
      if (sessionId) {
        const fallback = sessionLatLng.get(sessionId);
        if (fallback) {
          lat = fallback.lat;
          lng = fallback.lng;
          label = lead.suburb || fallback.label || "Unknown suburb";
        }
      }
    }

    if (lat == null || lng == null) continue;

    const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
    const bucket = leadBuckets.get(key) || { lat, lng, count: 0, label };
    bucket.count += 1;
    if (!bucket.label && label) bucket.label = label;
    leadBuckets.set(key, bucket);
  }

  const leadPoints: MapPoint[] = Array.from(leadBuckets.values())
    .map((bucket) => ({ lat: bucket.lat, lng: bucket.lng, count: bucket.count, label: bucket.label }))
    .sort((a, b) => b.count - a.count);

  return {
    views: Array.from(viewBuckets.values()).map((b) => ({
      lat: b.lat,
      lng: b.lng,
      count: b.count,
      label: b.label,
    })),
    visitors: Array.from(visitorBuckets.values()).map((b) => ({
      lat: b.lat,
      lng: b.lng,
      count: b.visitors.size,
      label: b.label,
    })),
    leads: leadPoints,
    phone: Array.from(phoneBuckets.values()).map((b) => ({
      lat: b.lat,
      lng: b.lng,
      count: b.count,
      label: b.label,
    })),
    forms: Array.from(formBuckets.values()).map((b) => ({
      lat: b.lat,
      lng: b.lng,
      count: b.count,
      label: b.label,
    })),
  };
}
