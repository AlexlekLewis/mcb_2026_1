"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const DURATION = "550ms";
const EASING = "cubic-bezier(0.21,0.65,0.36,1)";
/** Force visibility if the observer never fires (background tab, throttling). */
const FAILSAFE_MS = 3000;

/**
 * Reveal — scroll-entrance wrapper for editorial pages.
 *
 * Built so the animation can only ever ADD to the page, never subtract:
 *
 *  - Nothing is rendered hidden. The server HTML and the first client render
 *    carry no inline style at all, so the copy is readable with JS disabled,
 *    with JS still loading, or if hydration fails outright.
 *  - Content already on screen at mount is never hidden — only off-screen
 *    content is armed for the entrance.
 *  - A failsafe timer reveals the element even if the IntersectionObserver
 *    never fires.
 *  - `prefers-reduced-motion` skips the animation entirely.
 *
 * The first cut of this component used framer-motion's `whileInView`, which
 * emits `opacity: 0` at render time. When the observer didn't fire (e.g. the
 * page laid out in a background tab) the entire article body stayed invisible
 * to humans while crawlers still saw the markup. Hence the visible-by-default
 * approach here.
 *
 * Hiding/revealing is done by writing directly to the node's style rather than
 * through React state: this is DOM synchronisation, and it keeps the initial
 * markup free of any hidden state. Animates opacity/transform only, so it
 * cannot contribute to CLS.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Bail out entirely — the element simply stays as rendered: visible.
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    // If the page is laying out in a background tab, don't arm at all. Timers
    // are throttled and observer callbacks deferred while hidden, so arming
    // here risks content sitting at opacity 0 when the reader switches to it.
    // Skipping the entrance costs an animation; getting it wrong costs the
    // article.
    if (document.hidden) return;

    // Never hide something the reader can already see.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const reveal = () => {
      el.style.transition = `opacity ${DURATION} ${EASING} ${delay}s, transform ${DURATION} ${EASING} ${delay}s`;
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    // Arm: hide now, animate in on entry.
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);

    const failsafe = window.setTimeout(() => {
      reveal();
      observer.disconnect();
    }, FAILSAFE_MS);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
