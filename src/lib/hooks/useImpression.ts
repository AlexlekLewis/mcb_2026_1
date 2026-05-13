"use client";

import { useEffect, useRef } from "react";

/**
 * Fires `onImpression` exactly once when the element first crosses the
 * `threshold` of its bounding box into the viewport. Designed for tracking
 * CTA impressions / dwell. Cleans up its IntersectionObserver on unmount.
 */
export function useImpression<T extends HTMLElement>(
  onImpression: () => void,
  options: { threshold?: number } = {}
) {
  const ref = useRef<T | null>(null);
  const firedRef = useRef(false);
  const threshold = options.threshold ?? 0.5;

  useEffect(() => {
    if (firedRef.current) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            onImpression();
            observer.disconnect();
            return;
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onImpression, threshold]);

  return ref;
}
