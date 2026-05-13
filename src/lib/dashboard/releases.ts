/**
 * Release log — manually-curated record of meaningful changes to the site.
 *
 * The dashboard's ReleaseTracker reads this list and computes before/after
 * metrics for each entry over 24h / 48h / 7d windows. Add a new entry every
 * time you ship something worth measuring.
 *
 * Keep entries terse — the point is "did this needle move?", not changelog
 * prose. Link to the commit if you want detail.
 */

export interface Release {
  /** Stable id used in querystrings / analytics events. snake_case. */
  id: string;
  /** Human-readable title shown in the panel. */
  title: string;
  /** When the change went live in production. ISO-8601 UTC. */
  releasedAt: string;
  /** 1-2 line summary visible on the dashboard. */
  summary: string;
  /** Bullet items the release contained. */
  items: string[];
  /** Optional GitHub commit URL or PR link. */
  commitUrl?: string;
}

export const RELEASES: Release[] = [
  {
    id: "2026-05-14-vic-postcode-warning",
    title: "Quote form flags non-Victorian postcodes",
    releasedAt: "2026-05-14T00:00:00Z",
    summary:
      "Soft warning shown if the suburb / postcode in the quote form falls outside Victoria. Submission still allowed; lead is server-tagged so out-of-area entries can be triaged from the dashboard.",
    items: [
      "Postcode classified against VIC ranges (3000–3999, 8000–8999)",
      "Amber inline warning appears under the suburb field if non-VIC",
      "quote_out_of_area_warning event fires once per session when shown",
      "lead_submissions.is_victoria (boolean) populated server-side — never trusts the client",
      "Dashboard surfaces 30-day out-of-area lead count alongside the funnel",
    ],
  },
  {
    id: "2026-05-14-google-ads-conversions",
    title: "Google Ads conversion tracking for form submissions",
    releasedAt: "2026-05-14T00:00:00Z",
    summary:
      "Form submit now reports A$1,179 conversion value to Google Ads with Enhanced Conversions (hashed email/phone/name). gclid persisted server-side for offline conversion upload.",
    items: [
      "quote_success event carries value=1179, currency=AUD",
      "Hashed user_data (email/phone/firstName/lastName) attached for Enhanced Conversions",
      "gclid now persisted to mcb_gclid first-party cookie (180d) and to lead_submissions.gclid column",
      "New quote_field_error event for form validation drop-off diagnostics",
    ],
  },
  {
    id: "2026-05-13-seo-and-tracking",
    title: "SEO fixes + CTA tracking + Search Console sync",
    releasedAt: "2026-05-13T11:30:00Z",
    summary:
      "Fixed the 'Preston service radius' bug visible on every non-Preston suburb page, removed schema spam, redirected 25 thin product pages to category equivalents, and wired region-keyed copy into 693 suburb pages.",
    items: [
      "Killed literal 'within the Preston service radius' text on 32k+ pages",
      "Removed fake aggregateRating from per-suburb LocalBusiness schema",
      "Capped suburb internal links 47 → 12 (removed ~32k thin internal links)",
      "Stabilised sitemap lastModified dates per content tier",
      "/products/sheer-curtains etc. now 308-redirect to richer category pages",
      "Region-keyed content: Brighton talks bayside heritage, Sunbury talks NW period homes",
      "PrimaryCTA component fires cta_impression + quote_cta_click consistently",
      "Daily Search Console sync cron (env vars pending)",
    ],
    commitUrl: "https://github.com/AlexlekLewis/mcb_2026_1/commit/1c9d595",
  },
];

/**
 * The list of windows the dashboard renders for each release. Add or remove
 * here and the rest of the pipeline picks it up automatically.
 */
export const RELEASE_WINDOWS = [
  { id: "24h", label: "24 hours", hours: 24 },
  { id: "48h", label: "48 hours", hours: 48 },
  { id: "7d", label: "7 days", hours: 24 * 7 },
] as const;

export type ReleaseWindow = (typeof RELEASE_WINDOWS)[number];
