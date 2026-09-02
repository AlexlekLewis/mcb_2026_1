/**
 * Site promotion config — single source of truth for the seasonal offer.
 *
 * The modal reads everything from here so the offer, dates, copy and terms can
 * be changed without touching component code.
 *
 * IMPORTANT: `enabled` ships as `false`. The offer below is a PROPOSAL — see
 * docs/SPRING_SALE_2026.md. Deane/Dee need to confirm the offer and the terms
 * before this goes live. Flip `enabled` to true to launch.
 *
 * Per MCB positioning (quality at affordable prices, not cheapest), the default
 * proposal is a value-add offer rather than a straight percentage discount:
 * discounting heavily attracts the price-only shoppers the site copy
 * deliberately qualifies out.
 */

export interface Promotion {
    /** Master switch. False = modal never renders, zero runtime cost. */
    enabled: boolean;
    /** Stable id. Changing it re-shows the modal to people who dismissed the old one. */
    id: string;
    /** Small line above the headline. */
    eyebrow: string;
    headline: string;
    /** One or two sentences. Plain spoken — no marketing throat-clearing. */
    body: string;
    /** Three short value points shown as ticks. */
    points: string[];
    ctaLabel: string;
    /** Where the CTA goes. Keep it pointed at the quote flow. */
    ctaHref: string;
    /** Shown small at the bottom. Must carry the real conditions. */
    terms: string;
    /** ISO dates. Outside this window the modal does not render. */
    startsAt: string;
    endsAt: string;
    /** Delay before it appears, ms. Long enough that it never interrupts a first read. */
    delayMs: number;
    /** Routes the modal must never appear on (prefix match). */
    excludedPaths: string[];
}

export const SPRING_PROMOTION: Promotion = {
    enabled: false,

    id: "spring-2026",
    eyebrow: "Spring 2026",
    headline: "Get your windows sorted before summer",
    body:
        "Book your free in-home measure before the spring rush and we will bring the full sample range to you — including the sunscreen and blockout fabrics that actually cope with a Melbourne summer.",
    points: [
        "Free in-home measure and quote",
        "Samples seen in your own light",
        "Installed before the summer heat",
    ],
    ctaLabel: "Book my free measure",
    ctaHref: "/quote",
    terms:
        "Offer applies to new in-home measure and quote bookings made during the promotion period. Availability depends on installer schedules and product lead times. Final pricing is confirmed in writing after an on-site measure.",

    startsAt: "2026-09-01",
    endsAt: "2026-11-30",

    delayMs: 12000,
    excludedPaths: ["/quote", "/dashboard", "/privacy", "/terms", "/pricing-policy"],
};

/** True when the promotion is switched on and today sits inside its window. */
export function isPromotionLive(promo: Promotion, now: Date = new Date()): boolean {
    if (!promo.enabled) return false;
    const start = new Date(`${promo.startsAt}T00:00:00`);
    const end = new Date(`${promo.endsAt}T23:59:59`);
    return now >= start && now <= end;
}
