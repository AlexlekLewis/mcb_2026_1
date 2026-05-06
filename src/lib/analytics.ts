"use client";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;
type ClientTrackingContext = {
  visitorId?: string;
  sessionId?: string;
  pagePath?: string;
  pageUrl?: string;
  pageTitle?: string;
  referrerUrl?: string;
  landingPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
};

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

  sendFirstPartyEvent(event, cleanPayload);
}

export function getClientTrackingContext(): ClientTrackingContext {
  if (typeof window === "undefined") return {};

  const currentUrl = new URL(window.location.href);
  const pagePath = `${currentUrl.pathname}${currentUrl.search}`;

  return {
    visitorId: getOrCreateId(window.localStorage, "mcb_visitor_id"),
    sessionId: getOrCreateId(window.sessionStorage, "mcb_session_id"),
    pagePath,
    pageUrl: window.location.href,
    pageTitle: document.title,
    referrerUrl: getOrCreateValue(window.sessionStorage, "mcb_referrer_url", document.referrer),
    landingPath: getOrCreateValue(window.sessionStorage, "mcb_landing_path", pagePath),
    utmSource: getOrCreateValue(window.sessionStorage, "mcb_utm_source", currentUrl.searchParams.get("utm_source") || ""),
    utmMedium: getOrCreateValue(window.sessionStorage, "mcb_utm_medium", currentUrl.searchParams.get("utm_medium") || ""),
    utmCampaign: getOrCreateValue(window.sessionStorage, "mcb_utm_campaign", currentUrl.searchParams.get("utm_campaign") || ""),
    utmTerm: getOrCreateValue(window.sessionStorage, "mcb_utm_term", currentUrl.searchParams.get("utm_term") || ""),
    utmContent: getOrCreateValue(window.sessionStorage, "mcb_utm_content", currentUrl.searchParams.get("utm_content") || ""),
    gclid: getOrCreateValue(window.sessionStorage, "mcb_gclid", currentUrl.searchParams.get("gclid") || ""),
    fbclid: getOrCreateValue(window.sessionStorage, "mcb_fbclid", currentUrl.searchParams.get("fbclid") || ""),
  };
}

function sendFirstPartyEvent(event: string, payload: Record<string, unknown>) {
  const body = JSON.stringify({
    event,
    payload,
    context: getClientTrackingContext(),
  });

  try {
    if ("sendBeacon" in navigator) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/event", blob);
      return;
    }

    fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics should never block the user journey.
  }
}

function getOrCreateId(storage: Storage, key: string) {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;

    const nextId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    storage.setItem(key, nextId);
    return nextId;
  } catch {
    return undefined;
  }
}

function getOrCreateValue(storage: Storage, key: string, fallback: string) {
  try {
    const existing = storage.getItem(key);
    if (existing) return existing;
    if (!fallback) return undefined;

    storage.setItem(key, fallback);
    return fallback;
  } catch {
    return fallback || undefined;
  }
}
