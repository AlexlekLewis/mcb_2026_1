"use client";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (command: "event", eventName: string, payload?: AnalyticsPayload) => void;
    clarity?: (command: "event", eventName: string) => void;
  }
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );

  window.dataLayer?.push({
    event,
    ...cleanPayload,
  });

  window.gtag?.("event", event, cleanPayload);
  window.clarity?.("event", event);
}
