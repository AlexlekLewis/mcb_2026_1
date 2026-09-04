"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarClock, X } from "lucide-react";
import {
    SPRING_PROMOTION,
    formatDeadline,
    daysBetween,
    isPromotionLive,
    melbourneToday,
    openDeadlines,
    urgencyLabel,
} from "@/lib/promotions";
import { trackEvent } from "@/lib/analytics";

const dismissKey = (id: string) => `mcb_promo_dismissed_${id}`;

/**
 * Seasonal promotion modal — currently the pre-Christmas installation deadline.
 *
 * Deliberately restrained for a site at MCB's traffic level: it shows once per
 * visitor per promotion, never on the quote flow (no interrupting someone who
 * is already converting), and only after a long enough delay that it can't
 * land on top of a first read. Nothing renders at all when the promotion is
 * switched off or every order-by date has passed.
 */
export function SpringPromoModal() {
    const promo = SPRING_PROMOTION;
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    const excluded = promo.excludedPaths.some((p) => pathname?.startsWith(p));

    const dismiss = useCallback(
        (reason: "close" | "backdrop" | "escape" | "cta") => {
            setOpen(false);
            try {
                window.localStorage.setItem(dismissKey(promo.id), "1");
            } catch {
                // Private browsing / storage disabled — the modal simply shows again.
            }
            trackEvent("promo_modal_dismissed", { promo_id: promo.id, reason });
        },
        [promo.id]
    );

    useEffect(() => {
        if (!isPromotionLive(promo) || excluded) return;

        let dismissed = false;
        try {
            dismissed = window.localStorage.getItem(dismissKey(promo.id)) === "1";
        } catch {
            dismissed = false;
        }
        if (dismissed) return;

        const timer = setTimeout(() => {
            setOpen(true);
            trackEvent("promo_modal_shown", { promo_id: promo.id });
        }, promo.delayMs);

        return () => clearTimeout(timer);
    }, [promo, excluded]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") dismiss("escape");
        };
        document.addEventListener("keydown", onKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [open, dismiss]);

    const today = melbourneToday();
    const deadlines = openDeadlines(promo, today);

    if (!isPromotionLive(promo, today) || excluded || !open) return null;

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
            role="presentation"
        >
            <button
                type="button"
                aria-label="Close offer"
                onClick={() => dismiss("backdrop")}
                className="absolute inset-0 h-full w-full cursor-default bg-mcb-charcoal/55 backdrop-blur-sm motion-safe:animate-[fadeIn_200ms_ease-out]"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={`promo-${promo.id}-title`}
                className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-sm bg-mcb-paper shadow-2xl motion-safe:animate-[promoIn_320ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-sm"
            >
                {/* Spring band — sage gradient with a soft blossom motif. */}
                <div className="relative h-24 shrink-0 overflow-hidden bg-gradient-to-br from-mcb-sage to-mcb-sage-dark">
                    <svg
                        aria-hidden
                        viewBox="0 0 400 96"
                        preserveAspectRatio="xMidYMid slice"
                        className="absolute inset-0 h-full w-full opacity-30"
                    >
                        {[
                            [40, 68, 22],
                            [120, 28, 15],
                            [206, 74, 27],
                            [292, 34, 18],
                            [356, 78, 21],
                        ].map(([cx, cy, r], i) => (
                            <g key={i}>
                                {[0, 72, 144, 216, 288].map((deg) => (
                                    <ellipse
                                        key={deg}
                                        cx={cx}
                                        cy={cy - r * 0.55}
                                        rx={r * 0.36}
                                        ry={r * 0.6}
                                        fill="#F9F8F6"
                                        transform={`rotate(${deg} ${cx} ${cy})`}
                                    />
                                ))}
                                <circle cx={cx} cy={cy} r={r * 0.24} fill="#F3EFE6" />
                            </g>
                        ))}
                    </svg>
                    <span className="absolute bottom-4 left-6 text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                        {promo.eyebrow}
                    </span>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={() => dismiss("close")}
                        aria-label="Close offer"
                        className="absolute right-3 top-3 rounded-sm p-2 text-white/85 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 pb-5 pt-6 sm:px-8">
                    <h2
                        id={`promo-${promo.id}-title`}
                        className="font-serif text-2xl leading-tight text-mcb-charcoal sm:text-3xl"
                    >
                        {promo.headline}
                    </h2>
                    <p className="mt-3 leading-relaxed text-stone-600">{promo.body}</p>

                    {/* Order-by dates. Passed deadlines are already filtered out, so the
                        modal can never advertise a cut-off that has been and gone. */}
                    <div className="mt-5 overflow-hidden rounded-sm border border-stone-200 bg-white">
                        <div className="border-b border-stone-200 bg-mcb-sand px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-mcb-charcoal">
                            Order by
                        </div>
                        {deadlines.map((deadline, idx) => {
                            const daysLeft = daysBetween(today, deadline.orderBy);
                            const urgency = urgencyLabel(daysLeft);
                            const soonest = idx === 0;
                            return (
                                <div
                                    key={deadline.label}
                                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-stone-200 px-4 py-3 last:border-b-0"
                                >
                                    <span className="text-sm font-semibold text-mcb-charcoal">
                                        {deadline.label}
                                    </span>
                                    <span className="flex items-baseline gap-2">
                                        <span className="text-sm text-stone-600">
                                            {formatDeadline(deadline.orderBy)}
                                        </span>
                                        {urgency ? (
                                            <span
                                                className={`rounded-sm px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                                                    soonest
                                                        ? "bg-mcb-terracotta-deep text-white"
                                                        : "bg-mcb-sand text-stone-600"
                                                }`}
                                            >
                                                {urgency}
                                            </span>
                                        ) : null}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* The condition. Availability is the honest scarcity — no slot counts. */}
                    <p className="mt-4 flex items-start gap-2 rounded-sm bg-mcb-clay-light/40 px-4 py-3 text-sm leading-relaxed text-mcb-charcoal">
                        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-mcb-terracotta-deep" aria-hidden />
                        <span>{promo.availabilityNote}</span>
                    </p>

                    <p className="mt-5 border-t border-stone-200 pt-4 text-xs leading-relaxed text-stone-400">
                        {promo.terms}
                    </p>
                </div>

                {/* Pinned footer. The CTA must never depend on scrolling — on a
                    1366x650 laptop it previously sat 250px below the fold. */}
                <div className="shrink-0 border-t border-stone-200 bg-mcb-paper px-6 py-4 sm:px-8">
                    <Link
                        href={promo.ctaHref}
                        onClick={() => {
                            trackEvent("promo_modal_cta_click", { promo_id: promo.id });
                            dismiss("cta");
                        }}
                        className="flex h-12 w-full items-center justify-center rounded-sm bg-mcb-terracotta px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-terracotta-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcb-terracotta"
                    >
                        {promo.ctaLabel}
                    </Link>

                    <button
                        type="button"
                        onClick={() => dismiss("close")}
                        className="mt-2.5 w-full text-center text-sm font-semibold text-stone-500 transition-colors hover:text-mcb-charcoal"
                    >
                        No thanks
                    </button>
                </div>
            </div>
        </div>
    );
}
