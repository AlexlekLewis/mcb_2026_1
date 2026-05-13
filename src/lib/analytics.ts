"use client";

/**
 * MCB analytics event vocabulary
 * ------------------------------
 * Owned by the lead agent. New events go through review.
 *
 *   page_view              fired by EventTracker on each route change
 *   session_start          first event of a session (sets viewport, etc)
 *   session_end            on pagehide / beforeunload (sendBeacon)
 *   scroll_depth           25 / 50 / 75 / 100 thresholds, per page
 *   engagement_tick        every 15s of active (visible + interacted) time
 *   cta_impression         a CTA enters the viewport. payload: { location, variant?, product_context? }
 *   cta_dwell              CTA in viewport >2s. same payload as impression
 *   quote_cta_click        user clicks the Book Free Measure & Quote CTA. payload: { location, variant?, product_context? }
 *   phone_tap              tel: link tapped
 *   quote_form_start       first interaction with multi-step form
 *   quote_step_3_submit    submit of step 3
 *   quote_success          form completion (API 2xx)
 *   chat_widget_open       chat panel opened
 *   chat_lead_success      chat submitted a lead
 *   experiment_exposure    first time a user is bucketed into an experiment. payload: { experiment, variant }
 *
 * `location` is one of: navbar | hero | section | sticky-mobile | sticky-desktop | inline | decision-card | nav-megamenu | mobile-menu
 */

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

/**
 * Fire `cta_impression` once per (location, variant) per session.
 * Use with `useCtaImpression(ref, { location, variant })` from
 * @/lib/hooks/useCtaImpression — or call directly when an element first becomes visible.
 */
export function trackImpression(payload: AnalyticsPayload & { location: string }) {
  if (typeof window === "undefined") return;
  const key = `mcb_imp_${payload.location}_${payload.variant || "default"}`;
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
  } catch {
    // fall through and fire anyway
  }
  trackEvent("cta_impression", payload);
}

/**
 * Fire `experiment_exposure` exactly once per (experiment, visitor).
 * Called by getVariant() in lib/experiments.ts — components don't usually call this directly.
 */
export function trackExposure(experiment: string, variant: string) {
  if (typeof window === "undefined") return;
  const key = `mcb_exp_${experiment}`;
  try {
    if (window.localStorage.getItem(key) === variant) return;
    window.localStorage.setItem(key, variant);
  } catch {
    // fall through and fire anyway
  }
  trackEvent("experiment_exposure", { experiment, variant });
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
