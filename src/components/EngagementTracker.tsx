"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;
const HEARTBEAT_INTERVAL_MS = 15_000;
const IDLE_THRESHOLD_MS = 30_000;

export function EngagementTracker() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const reachedRef = useRef<Set<number>>(new Set());
  const lastInteractionRef = useRef<number>(Date.now());
  const engagedSecondsRef = useRef<number>(0);
  const sessionStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isDashboard) return;
    if (typeof window === "undefined") return;

    reachedRef.current = new Set();

    const fireSessionStartIfNeeded = () => {
      if (sessionStartedRef.current) return;
      try {
        const sessionKey = "mcb_session_started";
        if (window.sessionStorage.getItem(sessionKey)) {
          sessionStartedRef.current = true;
          return;
        }
        window.sessionStorage.setItem(sessionKey, "1");
      } catch {
        // sessionStorage may be blocked; still fire the event once per page mount.
      }
      sessionStartedRef.current = true;
      trackEvent("session_start", {
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        screen_width: window.screen?.width,
        screen_height: window.screen?.height,
      });
    };

    fireSessionStartIfNeeded();

    const computeScroll = () => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollTop = window.scrollY || doc.scrollTop || body.scrollTop || 0;
      const viewport = window.innerHeight || doc.clientHeight;
      const fullHeight = Math.max(
        body.scrollHeight,
        doc.scrollHeight,
        body.offsetHeight,
        doc.offsetHeight,
        body.clientHeight,
        doc.clientHeight
      );
      const scrollable = Math.max(fullHeight - viewport, 0);
      if (scrollable <= 0) return 100;
      const percent = ((scrollTop + viewport) / fullHeight) * 100;
      return Math.min(100, Math.max(0, Math.round(percent)));
    };

    const handleScroll = () => {
      lastInteractionRef.current = Date.now();
      const percent = computeScroll();
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !reachedRef.current.has(threshold)) {
          reachedRef.current.add(threshold);
          trackEvent("scroll_depth", {
            scroll_percent: threshold,
          });
        }
      }
    };

    const markActive = () => {
      lastInteractionRef.current = Date.now();
    };

    const sendHeartbeat = () => {
      if (engagedSecondsRef.current <= 0) return;
      const seconds = engagedSecondsRef.current;
      engagedSecondsRef.current = 0;
      trackEvent("engagement_tick", {
        engagement_seconds: seconds,
        scroll_percent: computeScroll(),
      });
    };

    const tick = () => {
      if (document.hidden) return;
      const sinceInteraction = Date.now() - lastInteractionRef.current;
      if (sinceInteraction > IDLE_THRESHOLD_MS) return;
      engagedSecondsRef.current += HEARTBEAT_INTERVAL_MS / 1000;
    };

    const intervalId = window.setInterval(() => {
      tick();
      sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sendHeartbeat();
      } else {
        lastInteractionRef.current = Date.now();
      }
    };

    const handlePageHide = () => {
      sendHeartbeat();
      const percent = computeScroll();
      trackEvent("session_end", {
        scroll_percent: percent,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("click", markActive, { passive: true });
    window.addEventListener("keydown", markActive, { passive: true });
    window.addEventListener("mousemove", markActive, { passive: true });
    window.addEventListener("touchstart", markActive, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    handleScroll();

    return () => {
      sendHeartbeat();
      window.clearInterval(intervalId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", markActive);
      window.removeEventListener("keydown", markActive);
      window.removeEventListener("mousemove", markActive);
      window.removeEventListener("touchstart", markActive);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [isDashboard, pathname]);

  return null;
}
