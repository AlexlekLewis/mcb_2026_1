import type { SignalKey } from "./types";

// Target values: the observed value at which a signal scores 1.0 (best).
// Tuned for MCB (Melbourne local-service business, mid-traffic).
export const SIGNAL_TARGETS: Record<SignalKey, number> = {
    llms_txt_present: 1,
    sitemap_fresh: 1,
    jsonld_org_complete: 1,
    jsonld_localbusiness_per_location: 1,
    jsonld_aggregaterating: 1,
    jsonld_faqpage_coverage: 1,
    ai_citation_rate: 0.35,           // 35% of probes citing MCB = ceiling
    render_parity: 1,
    lcp_under_2_5s: 1,
    cls_under_0_1: 1,
    no_broken_internal_links: 1,
    mobile_viewport_ok: 1,
    avg_engaged_seconds: 60,          // 60s engaged = great
    pages_per_session: 3,             // 3 pages/session = great
    bounce_rate: 0.4,                 // 40% bounce = great (note: inverted)
    avg_max_scroll_pct: 75,           // 75% scroll = great
    rage_click_rate: 0.02,            // 2% rage-click rate = ceiling (inverted)
    quote_step1_start_rate: 0.05,     // 5% of sessions start quote = great
    step1_to_step2_rate: 0.65,        // 65% of step1 → step2
    step2_to_submit_rate: 0.85,       // 85% of step2 → submit
    submit_to_lead_stored: 0.98,      // 98% server reliability
    phone_tap_rate: 0.03,             // 3% of sessions tap phone
    cost_per_lead_paid: 50,           // $50 CPL = ceiling (inverted; lower = better)
    lead_quality_score: 1,
};

// Signals where lower is better → invert when normalizing.
const INVERTED: ReadonlySet<SignalKey> = new Set<SignalKey>([
    "bounce_rate",
    "rage_click_rate",
    "cost_per_lead_paid",
]);

export function normalize(key: SignalKey, value: number): number {
    if (!Number.isFinite(value)) return 0;
    const target = SIGNAL_TARGETS[key];
    if (!target || target <= 0) return clamp01(value);

    if (INVERTED.has(key)) {
        // inverted: at value=0 → score 1, at value=target → score 0
        return clamp01(1 - value / target);
    }

    return clamp01(value / target);
}

export function clamp01(n: number): number {
    if (!Number.isFinite(n)) return 0;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
}
