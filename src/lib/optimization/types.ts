export type SubScore = "discoverability" | "crawlability" | "engagement" | "conversion";

export type SignalKey =
    | "llms_txt_present"
    | "sitemap_fresh"
    | "jsonld_org_complete"
    | "jsonld_localbusiness_per_location"
    | "jsonld_aggregaterating"
    | "jsonld_faqpage_coverage"
    | "ai_citation_rate"
    | "render_parity"
    | "lcp_under_2_5s"
    | "cls_under_0_1"
    | "no_broken_internal_links"
    | "mobile_viewport_ok"
    | "avg_engaged_seconds"
    | "pages_per_session"
    | "bounce_rate"
    | "avg_max_scroll_pct"
    | "rage_click_rate"
    | "quote_step1_start_rate"
    | "step1_to_step2_rate"
    | "step2_to_submit_rate"
    | "submit_to_lead_stored"
    | "phone_tap_rate"
    | "cost_per_lead_paid"
    | "lead_quality_score";

export interface Signal {
    key: SignalKey;
    subScore: SubScore;
    value: number;        // raw observed value
    normalized: number;   // 0..1 — used for scoring
    target: number;       // the value at which normalized = 1
    note?: string;
}

export interface Weight {
    signal_key: SignalKey;
    sub_score: SubScore;
    weight: number;
    version: number;
}

export interface ScoringResult {
    composite: number;             // 0..100
    subScores: Record<SubScore, number>; // each 0..100
    signals: Record<SignalKey, Signal>;
    weightsVersion: number;
}

export interface IssueDraft {
    signal_key: SignalKey;
    sub_score: SubScore;
    severity: "low" | "medium" | "high" | "critical";
    url_path?: string;
    title: string;
    detail: string;
    recommended_fix: string;
    expected_lift: number; // estimated composite-score lift if fixed
}

export interface PageCrawlSummary {
    url_path: string;
    status: number;
    bytes: number;
    fetched_at: string;
    has_h1: boolean;
    h1_count: number;
    jsonld_types: string[];
    jsonld_count: number;
    title_length: number;
    meta_description_length: number;
    has_faq_block: boolean;
    has_canonical: boolean;
    raw_text_length: number;
    js_only_render_suspected: boolean;
    broken_internal_links: string[];
    score: number;
    flags: string[];
}
