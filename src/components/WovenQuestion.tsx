"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * WovenQuestion — wraps a woven Q&A section on a growth-corridor page and
 * emits the two question-engagement events the dashboard reads.
 *
 *   question_scrolled_into_view   fires once per session per question_id when
 *                                 the section first enters the viewport with
 *                                 ≥50% visibility.
 *
 *   question_section_dwell        fires twice per session per question_id —
 *                                 once after 8 continuous seconds of visibility
 *                                 (kind: "first"), and again on section exit
 *                                 with the total accumulated dwell time
 *                                 (kind: "exit").
 *
 * The component is wrapped around any Q&A section we want to track. Question
 * IDs should be stable across builds — they're used as the join key in the
 * dashboard panel and in the AI-citation tracker.
 */

interface WovenQuestionProps {
  /**
   * Stable identifier for this question section. snake_case recommended.
   * Examples: "q-clyde-north-pricing", "q-pooja-room-blackout-fabric".
   * Must be unique on the page.
   */
  questionId: string;
  /**
   * If true, also adds an `id` attribute to the wrapping section so that
   * deep-links and dashboard anchor previews work. Defaults to true.
   */
  anchor?: boolean;
  /**
   * Optional className passthrough for layout.
   */
  className?: string;
  children: ReactNode;
}

const SESSION_KEY_PREFIX = "mcb-wq-scrolled:";
const DWELL_FIRST_KEY_PREFIX = "mcb-wq-dwell-first:";

export function WovenQuestion({
  questionId,
  anchor = true,
  className,
  children,
}: WovenQuestionProps) {
  const ref = useRef<HTMLElement | null>(null);
  const visibleSinceRef = useRef<number | null>(null);
  const accumulatedMsRef = useRef<number>(0);
  const dwellFirstFiredRef = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const scrolledKey = SESSION_KEY_PREFIX + questionId;
    const dwellFirstKey = DWELL_FIRST_KEY_PREFIX + questionId;

    // Read sessionStorage state so the "once per session" guarantees hold
    // across remounts within the same session (e.g. soft nav back/forward).
    let scrolledFired = false;
    try {
      scrolledFired = sessionStorage.getItem(scrolledKey) === "1";
      dwellFirstFiredRef.current =
        sessionStorage.getItem(dwellFirstKey) === "1";
    } catch {
      // sessionStorage can be unavailable (private mode, etc.). Soft-fail.
    }

    const pagePath =
      typeof window !== "undefined" ? window.location.pathname : "";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Start dwell timer.
            if (visibleSinceRef.current === null) {
              visibleSinceRef.current = Date.now();
            }
            // Fire scroll-in event once per session.
            if (!scrolledFired) {
              scrolledFired = true;
              try {
                sessionStorage.setItem(scrolledKey, "1");
              } catch {
                /* noop */
              }
              trackEvent("question_scrolled_into_view", {
                question_id: questionId,
                page_url: pagePath,
              });
            }
          } else {
            // Leaving viewport — accumulate dwell and check 8s threshold.
            if (visibleSinceRef.current !== null) {
              const delta = Date.now() - visibleSinceRef.current;
              accumulatedMsRef.current += delta;
              visibleSinceRef.current = null;

              if (
                accumulatedMsRef.current >= 8000 &&
                !dwellFirstFiredRef.current
              ) {
                dwellFirstFiredRef.current = true;
                try {
                  sessionStorage.setItem(dwellFirstKey, "1");
                } catch {
                  /* noop */
                }
                trackEvent("question_section_dwell", {
                  question_id: questionId,
                  page_url: pagePath,
                  dwell_ms: Math.round(accumulatedMsRef.current),
                  kind: "first",
                });
              }
            }
          }
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(el);

    // Emit exit-dwell on unmount (route change, tab close via pagehide handler).
    const emitExitDwell = () => {
      // Capture any in-progress visible time.
      if (visibleSinceRef.current !== null) {
        accumulatedMsRef.current += Date.now() - visibleSinceRef.current;
        visibleSinceRef.current = null;
      }
      if (accumulatedMsRef.current > 0) {
        trackEvent("question_section_dwell", {
          question_id: questionId,
          page_url: pagePath,
          dwell_ms: Math.round(accumulatedMsRef.current),
          kind: "exit",
        });
      }
    };

    const onPageHide = () => emitExitDwell();
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.removeEventListener("pagehide", onPageHide);
      observer.disconnect();
      emitExitDwell();
    };
  }, [questionId]);

  return (
    <section
      ref={ref}
      id={anchor ? questionId : undefined}
      data-question-id={questionId}
      className={className}
    >
      {children}
    </section>
  );
}
