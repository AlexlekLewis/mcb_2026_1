/**
 * Site promotion config — single source of truth for the seasonal offer.
 *
 * Current campaign: pre-Christmas installation urgency. No discount — the lever
 * is the real production lead time, which makes the deadline verifiable rather
 * than a manufactured countdown. Signed off by Alex 2026-09-02.
 *
 * Two order-by dates, because plantation shutters have a much longer lead time
 * than everything else. Each deadline disappears from the modal once its date
 * has passed, so the site never advertises a deadline it can no longer honour.
 *
 * All date logic runs on the Melbourne calendar date (see melbourneToday), not
 * the visitor's clock — a customer browsing from Perth or overseas must see the
 * same days-remaining as someone in Melbourne, and the AEST/AEDT switch on
 * 2026-10-04 falls between the two deadlines.
 */

export interface PromotionDeadline {
    /** Product group this deadline applies to. */
    label: string;
    /** Last day to order for pre-Christmas installation. ISO YYYY-MM-DD, Melbourne calendar. */
    orderBy: string;
}

export interface Promotion {
    /** Master switch. False = modal never renders, zero markup shipped. */
    enabled: boolean;
    /** Stable id. Changing it re-shows the modal to people who dismissed the old one. */
    id: string;
    /** Small line above the headline. */
    eyebrow: string;
    headline: string;
    /** One or two sentences. Plain spoken — no marketing throat-clearing. */
    body: string;
    /** Order-by dates, soonest first. Passed deadlines are filtered out at render. */
    deadlines: PromotionDeadline[];
    /**
     * The availability condition. This is the honest form of scarcity: dates are
     * genuinely allocated as orders are confirmed. Never state a slot count —
     * a number we cannot verify is a fabricated claim.
     */
    availabilityNote: string;
    ctaLabel: string;
    ctaHref: string;
    /** Shown small at the bottom. Must carry the real conditions. */
    terms: string;
    /** Campaign start. ISO YYYY-MM-DD, Melbourne calendar. */
    startsAt: string;
    /** Delay before it appears, ms. Long enough that it never interrupts a first read. */
    delayMs: number;
    /** Routes the modal must never appear on (prefix match). */
    excludedPaths: string[];
}

export const SPRING_PROMOTION: Promotion = {
    enabled: true,

    id: "pre-christmas-2026",
    eyebrow: "Pre-Christmas installation",
    headline: "Order in time to be installed before Christmas",
    body:
        "Everything is made to your measurements, so the calendar decides what we can still fit in. Book a free measure and we will tell you straight what is achievable before Christmas.",

    deadlines: [
        { label: "Plantation shutters", orderBy: "2026-09-30" },
        { label: "All other products", orderBy: "2026-11-30" },
    ],

    availabilityNote:
        "Installation dates are allocated as orders are confirmed, and pre-Christmas spots are filling fast.",

    ctaLabel: "Book my free measure",
    ctaHref: "/quote",

    terms:
        "Conditions apply. Pre-Christmas installation is subject to installer availability at the time your order is confirmed, and to the order-by dates above being met. Plantation shutters carry a longer production lead time, which is why they close earlier. Meeting an order-by date does not on its own guarantee a pre-Christmas installation date — we will confirm what is achievable in writing after your on-site measure.",

    startsAt: "2026-09-01",

    delayMs: 12000,
    excludedPaths: ["/quote", "/dashboard", "/privacy", "/terms", "/pricing-policy"],
};

/**
 * Today's calendar date in Melbourne as YYYY-MM-DD.
 *
 * Comparing calendar dates as strings sidesteps UTC-offset arithmetic entirely,
 * which matters here: the first deadline falls in AEST (+10:00) and the second
 * in AEDT (+11:00), since DST starts 2026-10-04.
 */
export function melbourneToday(now: Date = new Date()): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Australia/Melbourne",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now);
}

/** Whole days from `from` to `to`, both YYYY-MM-DD. Negative once `to` is past. */
export function daysBetween(from: string, to: string): number {
    const [fy, fm, fd] = from.split("-").map(Number);
    const [ty, tm, td] = to.split("-").map(Number);
    return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000);
}

/** Deadlines that have not yet passed, soonest first. Ordering on the closing day still counts. */
export function openDeadlines(promo: Promotion, today: string): PromotionDeadline[] {
    return promo.deadlines
        .filter((d) => daysBetween(today, d.orderBy) >= 0)
        .sort((a, b) => a.orderBy.localeCompare(b.orderBy));
}

/**
 * The promotion runs while it is switched on, on or after its start date, and
 * at least one order-by date is still open. No separate end date to keep in
 * sync — the last deadline closing is what ends the campaign.
 */
export function isPromotionLive(promo: Promotion, today: string = melbourneToday()): boolean {
    if (!promo.enabled) return false;
    if (daysBetween(promo.startsAt, today) < 0) return false;
    return openDeadlines(promo, today).length > 0;
}

/** "Tuesday 30 September" — how a deadline reads to a customer. */
export function formatDeadline(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    return new Intl.DateTimeFormat("en-AU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** Short urgency line for a deadline, or null when it is far enough out not to press. */
export function urgencyLabel(daysLeft: number): string | null {
    if (daysLeft <= 0) return "Closes today";
    if (daysLeft === 1) return "1 day left";
    if (daysLeft <= 30) return `${daysLeft} days left`;
    return null;
}
