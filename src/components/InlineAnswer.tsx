/**
 * InlineAnswer — the canonical answer block for the AI Content Engine.
 *
 * Renders 3-5 question/answer pairs as a hybrid accordion (first Q open on
 * desktop, all collapsed on mobile) with FAQPage JSON-LD, anchor IDs per
 * answer, and a closing CTA band. Designed against the spec in
 * .claude/skills/ai-content-engine/reference/best-practices.md.
 *
 * Critical placement rule: this component goes ABOVE the existing product
 * grid / decision guide on a product page — in the top 30% of the page
 * where ~44% of AI citations land (NAV43, BrightEdge). It is NOT a
 * replacement for the existing bottom-of-page FAQ used by ProductTemplate;
 * that serves a booking-stage purpose.
 *
 * Hash-link behaviour: if the URL is loaded with #q-<anchor>, the matching
 * answer auto-expands and scrolls into view. Supports AI engines that
 * deep-link to specific answers (Perplexity in particular).
 */
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface InlineAnswerItem {
  /**
   * The literal customer question. Used verbatim as both the visible H3
   * heading and the FAQPage JSON-LD Question.name — Google requires they
   * match and AI engines parse the visible DOM, so the two must be identical.
   */
  question: string;
  /**
   * The 40-60 word answer capsule. First sentence must be a declarative
   * answer (BLUF / inverted pyramid). Subsequent sentences add qualifier
   * or context.
   */
  answer: string;
  /**
   * URL-safe anchor (kebab-case, no leading '#'). Used for #fragment links
   * from AI citations and from the related-link of sibling answers.
   * Example: "q-cost-2026".
   */
  anchor: string;
  /**
   * Optional related-question link. Per the research spec, 2-3 of the 5
   * answers on a page should have one of these — sibling Qs on other
   * product pages.
   */
  related?: {
    label: string;
    href: string; // e.g. "/shutters/plantation-shutters#q-lifespan"
  };
}

export interface InlineAnswerProps {
  /** Block heading (H2). Default: "Questions we get on the visit". */
  heading?: string;
  /** 3-5 items. Render fails if outside that range. */
  items: InlineAnswerItem[];
  /**
   * ISO date the answers were last revised. Rendered visibly as "Updated
   * [Month YYYY]" — important freshness signal for AI engines (Averi:
   * +30% Perplexity citation lift for fresh content).
   */
  lastUpdated: string;
  /** Byline. Default: "Modern Curtains and Blinds — Preston, Melbourne". */
  byline?: string;
  /** Show the closing CTA band. Default true. */
  showCta?: boolean;
  /** CTA destination. Default "/quote". */
  ctaHref?: string;
  /** Tailwind class overrides for the outer section. */
  className?: string;
}

const DEFAULT_HEADING = "Questions we get on the visit";
const DEFAULT_BYLINE = "Modern Curtains and Blinds — Preston, Melbourne";

function formatUpdatedLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

export function InlineAnswer({
  heading = DEFAULT_HEADING,
  items,
  lastUpdated,
  byline = DEFAULT_BYLINE,
  showCta = true,
  ctaHref = "/quote",
  className = "",
}: InlineAnswerProps) {
  const detailsRefs = useRef<Array<HTMLDetailsElement | null>>([]);
  const outOfRange = items.length < 3 || items.length > 5;

  // Open the answer matching the URL hash on mount + on hashchange; in the
  // absence of a hash, open the first item on desktop only (md+ viewports).
  // Done post-mount to avoid SSR hydration mismatch from viewport-conditional
  // open state.
  useEffect(() => {
    if (outOfRange) return;
    function syncOpenState() {
      const hash =
        typeof window !== "undefined" && window.location.hash
          ? window.location.hash.slice(1)
          : "";
      if (hash) {
        const idx = items.findIndex((it) => it.anchor === hash);
        if (idx >= 0) {
          const node = detailsRefs.current[idx];
          if (node) {
            node.open = true;
            requestAnimationFrame(() =>
              node.scrollIntoView({ behavior: "smooth", block: "start" }),
            );
            return;
          }
        }
      }
      // No matching hash: open first item on desktop only.
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        const first = detailsRefs.current[0];
        if (first) first.open = true;
      }
    }
    syncOpenState();
    window.addEventListener("hashchange", syncOpenState);
    return () => window.removeEventListener("hashchange", syncOpenState);
  }, [items, outOfRange]);

  // Spec gate — refuse to render outside 3-5 items.
  if (outOfRange) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[InlineAnswer] expected 3-5 items, got ${items.length}. Block not rendered.`,
      );
    }
    return null;
  }

  // FAQPage schema — 1:1 with visible Q/A pairs per Google's requirement.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };

  const updatedLabel = formatUpdatedLabel(lastUpdated);

  return (
    <section
      className={`bg-white py-12 md:py-16 ${className}`.trim()}
      aria-labelledby="inline-answer-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto max-w-3xl px-4">
        {/* Header: heading + byline + updated date */}
        <div className="mb-6">
          <h2
            id="inline-answer-heading"
            className="font-serif text-2xl text-mcb-charcoal md:text-3xl"
          >
            {heading}
          </h2>
          <p className="mt-2 text-sm text-mcb-warm-grey">
            <span className="font-medium text-mcb-charcoal">{byline}</span>
            {updatedLabel ? (
              <>
                {" · "}
                <time dateTime={lastUpdated}>Updated {updatedLabel}</time>
              </>
            ) : null}
          </p>
        </div>

        {/* Accordion — hybrid: first Q open on desktop (md+), all collapsed on mobile */}
        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {items.map((item, idx) => {
            const headingId = `q-heading-${item.anchor}`;
            return (
              <details
                key={item.anchor}
                ref={(el) => {
                  detailsRefs.current[idx] = el;
                }}
                id={item.anchor}
                // Hybrid open-state is set post-mount by the useEffect above
                // (first item on md+, hash-matched item if URL has a fragment).
                // Default render is closed to avoid SSR/CSR hydration mismatch.
                className="group"
              >
                <summary
                  id={headingId}
                  className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 py-4 transition-colors hover:bg-mcb-paper/50"
                >
                  <h3 className="font-serif text-lg text-mcb-charcoal md:text-xl">
                    {item.question}
                  </h3>
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-mcb-terracotta transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="pb-5">
                  <p className="leading-relaxed text-mcb-charcoal/85">{item.answer}</p>
                  {item.related ? (
                    <p className="mt-3 text-sm text-mcb-warm-grey">
                      Related:{" "}
                      <Link
                        href={item.related.href}
                        className="text-mcb-terracotta underline-offset-4 hover:underline"
                      >
                        {item.related.label}
                      </Link>
                    </p>
                  ) : null}
                </div>
              </details>
            );
          })}
        </div>

        {/* Closing CTA band — one per block, never inside individual answers */}
        {showCta ? (
          <div className="mt-8 rounded-sm border border-mcb-sand-deep bg-mcb-paper p-5 md:flex md:items-center md:justify-between md:gap-6">
            <div>
              <p className="font-serif text-lg text-mcb-charcoal md:text-xl">
                Want a real number for your windows?
              </p>
              <p className="mt-1 text-sm text-mcb-warm-grey">
                Free in-home measure and quote across Melbourne. No obligation, ~30-second form.
              </p>
            </div>
            <Link
              href={ctaHref}
              className="mt-4 inline-block w-full rounded-sm bg-mcb-terracotta px-5 py-3 text-center font-medium text-white transition-colors hover:bg-mcb-terracotta/90 md:mt-0 md:w-auto"
            >
              Get a Free Quote
            </Link>
          </div>
        ) : null}
      </div>

    </section>
  );
}
