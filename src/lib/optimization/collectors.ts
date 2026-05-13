import type { SupabaseClient } from "@supabase/supabase-js";
import { buildSignal } from "./scoring";
import type { Signal } from "./types";
import { crawlPages } from "./crawler";

interface CollectorInput {
    supabase: SupabaseClient;
    baseUrl: string;
    samplePaths: string[];
}

export async function collectAllSignals({ supabase, baseUrl, samplePaths }: CollectorInput): Promise<{
    signals: Signal[];
    crawlSummaries: import("./types").PageCrawlSummary[];
}> {
    const [discoverabilitySignals, crawlSignals, engagementSignals, conversionSignals] = await Promise.all([
        collectDiscoverability(supabase, baseUrl),
        collectCrawlability(baseUrl, samplePaths),
        collectEngagement(supabase),
        collectConversion(supabase),
    ]);

    return {
        signals: [
            ...discoverabilitySignals.signals,
            ...crawlSignals.signals,
            ...engagementSignals,
            ...conversionSignals,
        ],
        crawlSummaries: crawlSignals.crawlSummaries,
    };
}

// ---------- discoverability ----------

async function collectDiscoverability(supabase: SupabaseClient, baseUrl: string) {
    const signals: Signal[] = [];

    // llms.txt
    const llmsRes = await safeHead(`${baseUrl}/llms.txt`);
    signals.push(buildSignal("llms_txt_present", "discoverability", llmsRes ? 1 : 0));

    // sitemap freshness (fetched < 7 days ago counts as fresh)
    const sitemapRes = await safeFetch(`${baseUrl}/sitemap.xml`);
    let sitemapFresh = 0;
    if (sitemapRes?.ok) {
        const xml = await sitemapRes.text();
        const lastmodMatches = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)];
        const newest = lastmodMatches
            .map((m) => Date.parse(m[1]))
            .filter((n) => Number.isFinite(n))
            .reduce((a, b) => Math.max(a, b), 0);
        const ageDays = (Date.now() - newest) / (24 * 3600 * 1000);
        sitemapFresh = ageDays < 7 ? 1 : ageDays < 30 ? 0.6 : 0.2;
    }
    signals.push(buildSignal("sitemap_fresh", "discoverability", sitemapFresh));

    // Organization, AggregateRating + LocalBusiness coverage measured from crawl flags
    // (set 1.0 if no flag, else partial — actual values filled by collectCrawlability)

    // AI citation rate — last 7 days
    const { data: probes } = await supabase
        .from("ai_citation_probes")
        .select("cited")
        .gte("probed_at", new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString());

    const total = probes?.length ?? 0;
    const cites = probes?.filter((p) => p.cited).length ?? 0;
    const citeRate = total > 0 ? cites / total : 0;
    signals.push(buildSignal("ai_citation_rate", "discoverability", citeRate, total === 0 ? "no probes yet — score reflects unknown state" : undefined));

    return { signals };
}

// ---------- crawlability ----------

async function collectCrawlability(baseUrl: string, samplePaths: string[]) {
    const summaries = await crawlPages({ baseUrl, urls: samplePaths });

    const renderParity = summaries.length === 0 ? 0
        : summaries.filter((s) => !s.js_only_render_suspected).length / summaries.length;

    const broken = summaries.filter((s) => s.status >= 400 || s.status === 0).length;
    const brokenRate = summaries.length === 0 ? 1 : 1 - broken / summaries.length;

    const orgComplete = summaries.length === 0 ? 0
        : summaries.filter((s) =>
            s.jsonld_types.includes("HomeAndConstructionBusiness") ||
            s.jsonld_types.includes("Organization")
        ).length / summaries.length;

    const lbCoverage = summaries.length === 0 ? 0
        : summaries.filter((s) => s.url_path.startsWith("/locations/") ? s.jsonld_types.includes("LocalBusiness") : true).length / summaries.length;

    const aggRatingCoverage = summaries.length === 0 ? 0
        : summaries.filter((s) => s.jsonld_types.includes("AggregateRating") || s.jsonld_types.includes("HomeAndConstructionBusiness")).length / summaries.length;

    const faqCoverage = summaries.length === 0 ? 0
        : summaries.filter((s) => s.has_faq_block).length / summaries.length;

    const signals: Signal[] = [
        buildSignal("jsonld_org_complete", "discoverability", orgComplete),
        buildSignal("jsonld_localbusiness_per_location", "discoverability", lbCoverage),
        buildSignal("jsonld_aggregaterating", "discoverability", aggRatingCoverage),
        buildSignal("jsonld_faqpage_coverage", "discoverability", faqCoverage),
        buildSignal("render_parity", "crawlability", renderParity),
        buildSignal("no_broken_internal_links", "crawlability", brokenRate),
        // CWV: without RUM we treat as 'unknown' = neutral 0.6 until GSC sync wired
        buildSignal("lcp_under_2_5s", "crawlability", 0.6, "stub until CWV/CrUX sync"),
        buildSignal("cls_under_0_1", "crawlability", 0.6, "stub until CWV/CrUX sync"),
        buildSignal("mobile_viewport_ok", "crawlability", 1, "Next.js viewport meta present"),
    ];

    return { signals, crawlSummaries: summaries };
}

// ---------- engagement (from dashboard views) ----------

async function collectEngagement(supabase: SupabaseClient): Promise<Signal[]> {
    const { data } = await supabase
        .from("dashboard_engagement_totals_30d")
        .select("avg_engaged_seconds, avg_pages_per_session, avg_max_scroll_percent, bounced_sessions, total_sessions")
        .maybeSingle();

    const totals = data ?? { avg_engaged_seconds: 0, avg_pages_per_session: 0, avg_max_scroll_percent: 0, bounced_sessions: 0, total_sessions: 0 };
    const bounceRate = totals.total_sessions > 0 ? totals.bounced_sessions / totals.total_sessions : 1;

    return [
        buildSignal("avg_engaged_seconds", "engagement", totals.avg_engaged_seconds || 0),
        buildSignal("pages_per_session", "engagement", totals.avg_pages_per_session || 0),
        buildSignal("avg_max_scroll_pct", "engagement", totals.avg_max_scroll_percent || 0),
        buildSignal("bounce_rate", "engagement", bounceRate),
        buildSignal("rage_click_rate", "engagement", 0.04, "stub until Clarity API import"),
    ];
}

// ---------- conversion ----------

async function collectConversion(supabase: SupabaseClient): Promise<Signal[]> {
    const { data: funnel } = await supabase
        .from("dashboard_conversion_funnel_30d")
        .select("stage, total")
        .order("sort_order", { ascending: true });

    const stageTotal = new Map<string, number>();
    for (const row of funnel ?? []) stageTotal.set(row.stage, row.total);

    const sessions = stageTotal.get("sessions") ?? stageTotal.get("page_view") ?? 0;
    const step1 = stageTotal.get("quote_step_1_complete") ?? stageTotal.get("quote_step_1") ?? 0;
    const step2 = stageTotal.get("quote_step_2_complete") ?? stageTotal.get("quote_step_2") ?? 0;
    const submitted = stageTotal.get("quote_submitted") ?? stageTotal.get("lead_submitted") ?? stageTotal.get("quote_success") ?? 0;

    const { count: storedLeads } = await supabase
        .from("lead_submissions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString());

    const { data: leadSources } = await supabase
        .from("dashboard_lead_sources_30d")
        .select("leads");
    const leadCount = leadSources?.reduce((s, r) => s + (r.leads || 0), 0) ?? storedLeads ?? 0;

    const step1Rate = sessions > 0 ? step1 / sessions : 0;
    const step1To2 = step1 > 0 ? step2 / step1 : 0;
    const step2ToSubmit = step2 > 0 ? submitted / step2 : 0;
    const submitToStored = submitted > 0 ? Math.min(1, leadCount / submitted) : (leadCount > 0 ? 1 : 0);

    const { data: phoneEvents } = await supabase
        .from("analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("event_name", "phone_tap")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString());
    const phoneCount = (phoneEvents as unknown as { count?: number })?.count ?? 0;
    const phoneRate = sessions > 0 ? phoneCount / sessions : 0;

    return [
        buildSignal("quote_step1_start_rate", "conversion", step1Rate),
        buildSignal("step1_to_step2_rate", "conversion", step1To2),
        buildSignal("step2_to_submit_rate", "conversion", step2ToSubmit),
        buildSignal("submit_to_lead_stored", "conversion", submitToStored),
        buildSignal("phone_tap_rate", "conversion", phoneRate),
        buildSignal("cost_per_lead_paid", "conversion", 0, "stub until ad spend API wired"),
        buildSignal("lead_quality_score", "conversion", 0.7, "stub until per-lead scoring wired"),
    ];
}

// ---------- helpers ----------

async function safeHead(url: string): Promise<boolean> {
    try {
        const r = await fetch(url, { method: "HEAD", cache: "no-store" });
        return r.ok;
    } catch { return false; }
}

async function safeFetch(url: string): Promise<Response | null> {
    try {
        return await fetch(url, { cache: "no-store" });
    } catch { return null; }
}
