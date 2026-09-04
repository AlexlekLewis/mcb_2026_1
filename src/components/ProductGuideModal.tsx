"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";

export interface ComparisonRow {
    label: string;
    bestFor: string;
    notes: string;
}

interface ProductGuideModalProps {
    rows: ComparisonRow[];
    /** Product name, used to make the dialog heading specific. */
    title?: string;
}

/**
 * The comparison table used to be a full-width section between the FAQ and the
 * fit promise — roughly 700px of vertical space on every product page for a
 * reference people consult once. It is now a subtle trigger that opens the same
 * table in a dialog.
 *
 * The table markup stays mounted at all times rather than rendering on open, so
 * the comparison content remains available to crawlers and answer engines; the
 * closed dialog is inert and aria-hidden so it is skipped by assistive tech.
 */
export function ProductGuideModal({ rows, title }: ProductGuideModalProps) {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headingId = useId();

    const clearHoverTimer = useCallback(() => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
    }, []);

    // Hover-to-open, but only where hovering is a real gesture. On touch the
    // pointer-coarse check keeps this a plain tap-to-open button.
    const handleHover = useCallback(() => {
        if (typeof window === "undefined") return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        clearHoverTimer();
        // Short intent delay so a cursor crossing the button doesn't fire it.
        hoverTimer.current = setTimeout(() => setOpen(true), 220);
    }, [clearHoverTimer]);

    const close = useCallback(() => {
        clearHoverTimer();
        setOpen(false);
    }, [clearHoverTimer]);

    useEffect(() => clearHoverTimer, [clearHoverTimer]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };
        document.addEventListener("keydown", onKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        const trigger = triggerRef.current;
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
            trigger?.focus();
        };
    }, [open, close]);

    if (rows.length === 0) return null;

    // Several pages pass a title with trailing whitespace; don't let that leak
    // into the heading.
    const trimmedTitle = title?.trim();
    const heading = trimmedTitle ? `${trimmedTitle} — product guide` : "Product guide";

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                onMouseEnter={handleHover}
                onMouseLeave={clearHoverTimer}
                onFocus={clearHoverTimer}
                aria-haspopup="dialog"
                aria-expanded={open}
                className="inline-flex items-center gap-2 rounded-sm border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-mcb-charcoal transition-colors hover:border-mcb-terracotta hover:text-mcb-terracotta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcb-terracotta"
            >
                <BookOpen className="h-4 w-4 text-mcb-terracotta" aria-hidden />
                Product guide
            </button>

            <div
                inert={!open}
                aria-hidden={!open}
                className={`fixed inset-0 z-[70] flex items-end justify-center p-0 transition-opacity duration-200 sm:items-center sm:p-6 ${
                    open ? "visible opacity-100" : "invisible opacity-0"
                }`}
            >
                <div
                    onClick={close}
                    aria-hidden
                    className="absolute inset-0 bg-mcb-charcoal/60 backdrop-blur-sm"
                />
                <div
                    role="dialog"
                    aria-modal={open || undefined}
                    aria-labelledby={headingId}
                    className={`relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-sm bg-white shadow-2xl transition-transform duration-200 sm:rounded-sm ${
                        open ? "translate-y-0" : "translate-y-3"
                    }`}
                >
                    <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
                        <div>
                            <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-mcb-terracotta">
                                Compare options
                            </span>
                            <h2 id={headingId} className="font-serif text-2xl text-mcb-charcoal">
                                {heading}
                            </h2>
                            <p className="mt-1 text-sm leading-relaxed text-stone-500">
                                A quick view of the most common choices before we bring samples to your home.
                            </p>
                        </div>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={close}
                            aria-label="Close product guide"
                            className="-mr-2 -mt-1 shrink-0 rounded-sm p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-mcb-charcoal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcb-terracotta"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto px-6 py-5">
                        <div className="overflow-hidden rounded-sm border border-stone-200">
                            <div className="hidden grid-cols-3 bg-mcb-charcoal text-sm font-bold uppercase tracking-wider text-white md:grid">
                                <div className="p-4">Option</div>
                                <div className="p-4">Best For</div>
                                <div className="p-4">Notes</div>
                            </div>
                            {rows.map((row) => (
                                <div
                                    key={row.label}
                                    className="grid grid-cols-1 border-t border-stone-200 first:border-t-0 md:grid-cols-3 md:first:border-t"
                                >
                                    <div className="p-4 font-semibold text-mcb-charcoal">{row.label}</div>
                                    <div className="px-4 pb-2 text-stone-600 md:p-4">
                                        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400 md:hidden">
                                            Best for
                                        </span>
                                        {row.bestFor}
                                    </div>
                                    <div className="px-4 pb-4 text-stone-600 md:p-4">
                                        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-stone-400 md:hidden">
                                            Notes
                                        </span>
                                        {row.notes}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
