import type { IssueDraft, Signal, SignalKey, SubScore } from "./types";

/**
 * Translate weak signals → actionable issues with file-path-style remediation.
 * Each issue carries an expected_lift (estimated composite-score points gained
 * if the fix lands). The learning loop later validates these estimates.
 */
export function generateIssues(signals: Signal[]): IssueDraft[] {
    const issues: IssueDraft[] = [];

    for (const sig of signals) {
        if (sig.normalized >= 0.85) continue;          // healthy — no issue
        const issue = mapSignalToIssue(sig.key, sig.subScore, sig.normalized, sig.value);
        if (issue) issues.push(issue);
    }

    return issues;
}

function mapSignalToIssue(key: SignalKey, sub: SubScore, n: number, value: number): IssueDraft | null {
    const severity = n < 0.25 ? "critical" : n < 0.5 ? "high" : n < 0.75 ? "medium" : "low";

    switch (key) {
        case "llms_txt_present":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Publish llms.txt for AI engines",
                detail: "llms.txt is missing or 404. AI engines fall back to robots.txt and may miss curated guidance.",
                recommended_fix: "Place public/llms.txt (and llms-full.txt) at the site root. Migration ships canonical templates.",
                expected_lift: 1.0,
            };
        case "jsonld_org_complete":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Organization schema incomplete",
                detail: `Organization JSON-LD is missing one or more of: aggregateRating, founders, sameAs, brand. Normalized score ${(n * 100).toFixed(0)}%.`,
                recommended_fix: "src/components/RichSchema.tsx → OrganizationSchema is the canonical source — ensure it is mounted in app/layout.tsx.",
                expected_lift: 1.2,
            };
        case "jsonld_localbusiness_per_location":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Per-suburb LocalBusiness schema missing",
                detail: "Some location pages do not emit a dedicated LocalBusiness JSON-LD block. AI 'near me' queries score worse.",
                recommended_fix: "Ensure <LocalBusinessSchema suburb={suburb} /> is present on every src/app/locations/[suburb]/**/page.tsx.",
                expected_lift: 1.6,
            };
        case "jsonld_aggregaterating":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "AggregateRating not extractable",
                detail: "AggregateRating + Review schema not present or malformed — review rich snippets won't render.",
                recommended_fix: "Confirm OrganizationSchema in src/components/RichSchema.tsx emits both aggregateRating and review[]. Refresh review counts every 90 days.",
                expected_lift: 0.9,
            };
        case "jsonld_faqpage_coverage":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "FAQPage schema coverage too low",
                detail: `Only ${Math.round(value * 100)}% of pages with a visible FAQ block emit FAQPage JSON-LD.`,
                recommended_fix: "Wrap visible FAQ blocks with <FaqPageSchema items={faqItems} /> from src/components/RichSchema.tsx.",
                expected_lift: 1.4,
            };
        case "ai_citation_rate":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Low AI citation rate",
                detail: `Currently ${Math.round(value * 100)}% of target queries return MCB in AI engine citations. Target is 35%.`,
                recommended_fix: "Bias content toward extractive Q&A blocks, refresh llms-full.txt, and shore up missing per-location schema. The learning loop will rebalance signal weights as new data arrives.",
                expected_lift: 3.5,
            };
        case "render_parity":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "JS-only rendering detected on key pages",
                detail: "One or more crawled pages had near-empty raw HTML, suggesting hydration-dependent content invisible to non-JS AI bots.",
                recommended_fix: "Audit any 'use client' pages above the fold. Convert to server components or fall back to static HTML for critical product/location pages.",
                expected_lift: 2.2,
            };
        case "no_broken_internal_links":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Broken internal links",
                detail: `Crawler returned non-200 for some internal links.`,
                recommended_fix: "Inspect crawler flags in optimization_page_scores.flags. Fix or redirect each entry.",
                expected_lift: 0.6,
            };
        case "avg_engaged_seconds":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Low average engaged time",
                detail: `Average engaged session length is ${value.toFixed(1)}s vs 60s target.`,
                recommended_fix: "Add interactive product comparators / fabric pickers on top product pages. Move trust signals above the fold.",
                expected_lift: 1.5,
            };
        case "pages_per_session":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Pages per session below target",
                detail: `Avg ${value.toFixed(2)} pages/session. Target 3.`,
                recommended_fix: "Strengthen internal linking on product pages — recommend related products + nearby suburb pages with strong CTAs.",
                expected_lift: 1.1,
            };
        case "bounce_rate":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Bounce rate above target",
                detail: `${Math.round(value * 100)}% bounce vs 40% target.`,
                recommended_fix: "Run Clarity heatmaps on top landing pages; reduce above-fold weight on hero images, surface CTA earlier on mobile.",
                expected_lift: 1.4,
            };
        case "quote_step1_start_rate":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Quote form start rate below target",
                detail: `Only ${(value * 100).toFixed(2)}% of sessions start the quote form. Target is 5%.`,
                recommended_fix: "A/B test single-step quote form variant. Move quote CTA above the fold on /locations/[suburb] pages.",
                expected_lift: 4.0,
            };
        case "step1_to_step2_rate":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Quote form step 1 → 2 drop-off",
                detail: `${Math.round(value * 100)}% complete step 1. Target 65%.`,
                recommended_fix: "Reduce required fields in step 1, add progress indicator, mobile-optimise selector chips.",
                expected_lift: 3.0,
            };
        case "step2_to_submit_rate":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Step 2 → submit drop-off",
                detail: `${Math.round(value * 100)}% submit after reaching step 2. Target 85%.`,
                recommended_fix: "Audit step 2 form fields for friction. Pre-fill from URL params where possible.",
                expected_lift: 2.5,
            };
        case "phone_tap_rate":
            return {
                signal_key: key, sub_score: sub, severity,
                title: "Phone tap rate below target",
                detail: `${(value * 100).toFixed(2)}% of sessions tap phone. Target 3%.`,
                recommended_fix: "Ensure sticky mobile CTA is visible. Add tel: link on every location page header.",
                expected_lift: 1.2,
            };
        default:
            return {
                signal_key: key, sub_score: sub, severity,
                title: `Signal ${key} below target`,
                detail: `Normalized ${(n * 100).toFixed(0)}%.`,
                recommended_fix: "Investigate.",
                expected_lift: 0.5,
            };
    }
}
