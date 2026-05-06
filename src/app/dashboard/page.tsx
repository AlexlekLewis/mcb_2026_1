import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  MousePointerClick,
  PhoneCall,
  Search,
  Share2,
  ShieldAlert,
  Users,
} from "lucide-react";
import { hasSupabaseAdminConfig, getSupabaseAdmin } from "@/lib/supabase/admin";

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

type TopPage = {
  page_path: string;
  page_views: number;
  visitors: number;
  quote_clicks: number;
  phone_taps: number;
  chat_opens: number;
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

type SearchMetric = {
  clicks: number;
  impressions: number;
  position: number | null;
};

export default async function DashboardPage() {
  const hasPassword = Boolean(process.env.DASHBOARD_PASSWORD);
  const hasUsername = Boolean(process.env.DASHBOARD_USERNAME);
  const hasSupabase = hasSupabaseAdminConfig();

  if (!hasPassword || !hasUsername || !hasSupabase) {
    return <SetupRequired hasPassword={hasPassword} hasUsername={hasUsername} hasSupabase={hasSupabase} />;
  }

  const data = await loadDashboardData();
  const totals = getTotals(data.daily);
  const latestDate = data.daily[0]?.metric_date;

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
            Some dashboard queries returned errors. Check Supabase logs if the numbers look incomplete.
          </div>
        ) : null}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={<BarChart3 />} label="Page Views" value={totals.pageViews} detail="Last 30 stored days" />
          <KpiCard icon={<Users />} label="Visitors" value={totals.visitors} detail={`${totals.sessions.toLocaleString()} sessions`} />
          <KpiCard icon={<ClipboardList />} label="Stored Leads" value={totals.leads} detail={`${totals.quoteSuccesses.toLocaleString()} quote successes`} />
          <KpiCard icon={<PhoneCall />} label="Phone Taps" value={totals.phoneTaps} detail={`${totals.chatLeads.toLocaleString()} chat leads`} />
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Panel title="30 Day Funnel" icon={<MousePointerClick />}>
            <div className="space-y-3">
              {data.funnel.map((row, index) => (
                <FunnelBar key={row.stage} row={row} max={data.funnel[0]?.total || 0} previous={data.funnel[index - 1]?.total} />
              ))}
            </div>
          </Panel>

          <Panel title="Top Pages" icon={<BarChart3 />}>
            <DataTable
              columns={["Page", "Views", "Visitors", "Quote Clicks", "Phone"]}
              rows={data.topPages.map((page) => [
                page.page_path,
                page.page_views.toLocaleString(),
                page.visitors.toLocaleString(),
                page.quote_clicks.toLocaleString(),
                page.phone_taps.toLocaleString(),
              ])}
              empty="No page view events have been stored yet."
            />
          </Panel>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <Panel title="Lead Sources" icon={<CheckCircle2 />}>
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

          <Panel title="Recent Leads" icon={<ClipboardList />}>
            <DataTable
              columns={["Date", "Name", "Suburb", "Interest", "Source"]}
              rows={data.recentLeads.map((lead) => [
                formatDate(lead.created_at),
                [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "Unknown",
                lead.suburb || "Unknown",
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
              <MiniStat label="Avg Position" value={data.searchTotals.position ? data.searchTotals.position.toFixed(1) : "N/A"} />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              Search Console import is ready at the database level. Once connected, this panel can show queries, landing pages, clicks,
              impressions, CTR, and ranking movement.
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
    return {
      daily: [],
      funnel: [],
      topPages: [],
      leadSources: [],
      recentLeads: [],
      searchTotals: { clicks: 0, impressions: 0, position: null },
      errors: ["Supabase is not configured"],
    };
  }

  const [daily, funnel, topPages, leadSources, recentLeads, searchMetrics] = await Promise.all([
    supabase.from("dashboard_daily_metrics").select("*").limit(30),
    supabase.from("dashboard_conversion_funnel_30d").select("*"),
    supabase.from("dashboard_top_pages_30d").select("*").limit(12),
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
  ]);

  return {
    daily: (daily.data || []) as DailyMetric[],
    funnel: (funnel.data || []) as FunnelRow[],
    topPages: (topPages.data || []) as TopPage[],
    leadSources: (leadSources.data || []) as LeadSource[],
    recentLeads: (recentLeads.data || []) as RecentLead[],
    searchTotals: getSearchTotals((searchMetrics.data || []) as SearchMetric[]),
    errors: [daily.error, funnel.error, topPages.error, leadSources.error, recentLeads.error, searchMetrics.error].filter(Boolean),
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

function KpiCard({ icon, label, value, detail }: { icon: ReactNode; label: string; value: number; detail: string }) {
  return (
    <div className="rounded-sm border border-stone-300 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold uppercase tracking-wide text-stone-500">{label}</span>
        <span className="text-mcb-terracotta [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
      </div>
      <div className="text-3xl font-bold text-mcb-charcoal">{value.toLocaleString()}</div>
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

function FunnelBar({ row, max, previous }: { row: FunnelRow; max: number; previous?: number }) {
  const width = max > 0 ? Math.max((row.total / max) * 100, row.total > 0 ? 4 : 0) : 0;
  const conversion = previous && previous > 0 ? `${Math.round((row.total / previous) * 100)}% from previous` : "Start";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold text-stone-700">{row.stage}</span>
        <span className="text-stone-500">{row.total.toLocaleString()}</span>
      </div>
      <div className="h-8 overflow-hidden rounded-sm bg-stone-100">
        <div className="flex h-full items-center bg-mcb-terracotta px-3 text-xs font-bold text-white" style={{ width: `${width}%` }}>
          {conversion}
        </div>
      </div>
    </div>
  );
}

function DataTable({ columns, rows, empty }: { columns: string[]; rows: string[][]; empty: string }) {
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
                <td key={`${cell}-${cellIndex}`} className="max-w-[280px] px-2 py-3 align-top text-stone-700">
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
