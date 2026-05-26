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
  /**
   * Set true when the release ships changes to URLs in the growth-corridor
   * cohort (see src/lib/growth-corridors.ts). Used to filter releases on
   * /dashboard/growth-corridors panel 6. Defaults to false.
   */
  affectsGrowthCorridor?: boolean;
}

export const RELEASES: Release[] = [
  {
    id: "2026-05-27-growth-corridor-answer-gap-pages-2",
    title: "Growth Corridor — 2 more answer-gap pages live (pooja blackout + estate covenants)",
    releasedAt: "2026-05-27T15:00:00Z",
    summary:
      "Round 2 of the growth-corridor content launch. Two more first-mover answer-gap pages live, each owning a query no Australian competitor has FAQ-schema content for. /guides/pooja-prayer-room-blackout-curtains-australia targets the cultural-living blackout query for the northern and western corridors (Tarneit, Wollert, Mickleham, Truganina) — pooja-room darkness, mandir-corner curtaining, diya draft control, multigenerational parents' suite privacy, Diwali decorating on builder tracks. /guides/estate-covenant-roller-shutters-zipscreens-melbourne owns the covenant query across all three corridors with named estates (Smiths Lane, Five Farms, Aurora, Lyndarum, Cloverton, Riverdale, Atherstone) and a clear walkthrough of when external isn't allowed and the covenant-friendly internal alternatives. Both written in woven prose with FAQPage JSON-LD schema; same MCB-only voice as Round 1.",
    items: [
      "src/app/guides/pooja-prayer-room-blackout-curtains-australia/page.tsx — ~1,800-word answer-gap page; 5-item FAQPage schema; covers pooja blackout, mandir corner, diya draft, parents' suite, Diwali decorating; indicative pricing block ($600-$1,000 blockout-only / $1,500-$2,000 layered) wired to /pricing-policy",
      "src/app/guides/estate-covenant-roller-shutters-zipscreens-melbourne/page.tsx — ~1,800-word answer-gap page; 5-item FAQPage schema; corridor-by-corridor coverage of the covenant question (Casey/Cardinia, Whittlesea/Hume/Mitchell, Wyndham/Melton); names major estates without disparaging any",
      "src/lib/growth-corridors.ts — confirmed both URLs already listed in the 18-URL cohort; no constants update needed",
      "Quality gates: tsc clean, eslint clean, production smoke on local prod-mode server confirmed 200 + schema markers present on both URLs",
    ],
    affectsGrowthCorridor: true,
  },
  {
    id: "2026-05-27-growth-corridor-pilot-content",
    title: "Growth Corridor pilot content — answer-gap guide + Clyde North + blockout roller (woven style)",
    releasedAt: "2026-05-27T14:00:00Z",
    summary:
      "First batch of growth-corridor content in the new woven prose style — MCB voice only, no third-party brand or competitor references, plain spoken tradie-pro tone. Three pages live: the highest-leverage answer-gap guide (Are window furnishings included in your new build?), the pilot suburb rewrite for Clyde North targeting the Casey south-east growth corridor with named estates and builders, and the pilot product rewrite for blockout roller blinds with indicative pricing wired through to /pricing-policy. All three carry FAQPage JSON-LD schema so AI Overviews / Perplexity / ChatGPT can extract structured Q&A even though the visible pages read as flowing prose. Clyde North is the template for the remaining 11 growth-corridor suburb rewrites; blockout roller is the template for the remaining 18 product page rewrites. Watch /dashboard/growth-corridors for cohort-isolated metrics. Kill-or-keep gate at 7d per CLAUDE.md.",
    items: [
      "src/app/guides/new-build-window-furnishings-not-included/page.tsx — net-new ~2,400-word answer-gap page (first-mover on the H&L inclusion query nobody else owns); FAQPage schema with 5 Q&A pairs",
      "src/app/locations/clyde-north/page.tsx — static-segment override of the dynamic /locations/[suburb] route; woven prose with named estates (Smiths Lane, Eliston, Five Farms, Arcadia, Timbertop, Orana, Kaduna Park, Arbourwood) and builders (Metricon, Henley, Simonds, Carlisle, Burbank, Boutique); LocalBusinessSchema + FAQPage schema with 5 Q&A; PageViewTracker tagged page_variant: 'woven_pilot'",
      "src/app/locations/[suburb]/page.tsx — added STATIC_OVERRIDE_SLUGS set, filtered clyde-north from generateStaticParams to avoid build-time route conflict",
      "src/app/blinds/roller-blinds/blockout/page.tsx — replaced ProductTemplate-driven page with woven prose; indicative pricing ($1,200-$2,900 whole-house, $300-$500 single window) wired through to /pricing-policy accordion; pay-twice math in narrative form; FAQPage schema with 5 Q&A pairs",
      "All three pages use PrimaryCTA component (CLAUDE.md rule) with productContext where relevant",
      "All content in MCB-only voice — no competitor retailer names, no premium-brand comparators, no external citations. Builders named factually (allowed per the user's explicit call).",
      "Strategy goal: capture first-mover AI-search citations on the H&L inclusion answer-gap query; validate the woven content template before replicating across the other 28 growth-corridor URLs",
    ],
    affectsGrowthCorridor: true,
  },
  {
    id: "2026-05-27-growth-corridor-scaffolding",
    title: "Growth Corridor scaffolding — constants, dashboard, pricing-policy, ai_citation_log migration",
    releasedAt: "2026-05-27T13:30:00Z",
    summary:
      "Foundation layer for the Victorian growth-corridor strategy. New /dashboard/growth-corridors page isolates the 18-URL cohort (12 suburb pages, 3 corridor pillar guides, 3 first-mover answer-gap pages) with panels 1 (corridor KPI strip), 2 (per-page table), 6 (release impact corridor-filtered). New /pricing-policy canonical page hosts the indicative-pricing T&Cs that every product-page pricing block links to. New analytics event vocabulary (question_scrolled_into_view, question_section_dwell) registered for the question-level engagement panel that arrives in a future release once new events have been firing for a few days. New supabase/migrations/20260526_ai_citation_log.sql committed but NOT applied — must be applied via Supabase SQL editor at https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new because the connected MCP points at the cricket-academy project, not this one. Sidebar nav extended with 'Growth corridors' under Intelligence section.",
    items: [
      "src/lib/growth-corridors.ts — net-new constants file. Exports GROWTH_CORRIDOR_PAGES (18 URLs), GROWTH_CORRIDOR_URLS (Set), PAGE_BY_URL (Record), groupByCorridor(), formatCorridor(), isGrowthCorridorSuburb()",
      "src/lib/dashboard/growth-corridor-metrics.ts — net-new server-only data loader. Returns CorridorKpiStripData + per-page table rows + corridor-tagged releases. Bot filtering mirrors release-metrics.ts. Graceful fallback when Supabase env vars missing",
      "src/lib/dashboard/releases.ts — extended Release interface with optional affectsGrowthCorridor flag for panel 6 filtering",
      "src/app/dashboard/(with-sidebar)/growth-corridors/page.tsx — net-new dashboard page rendering panels 1, 2, 6",
      "src/components/dashboard/v2/Sidebar.tsx — added Growth corridors nav item under Intelligence section",
      "src/lib/analytics.ts — registered question_scrolled_into_view + question_section_dwell events in the vocabulary docblock (treated as schema per CLAUDE.md)",
      "supabase/migrations/20260526_ai_citation_log.sql — table for the quarterly AI-citation tracker (panel 5 in a future release). NOT YET APPLIED — Alex must apply via Supabase SQL editor",
      "src/app/pricing-policy/page.tsx — net-new canonical page hosting the indicative-pricing T&Cs",
    ],
    affectsGrowthCorridor: true,
  },
  {
    id: "2026-05-24-lead-session-attribution",
    title: "Lead attribution: session_id on lead_submissions + view rewire",
    releasedAt: "2026-05-24T14:30:00Z",
    summary:
      "Promotes session_id from the tracking_context JSONB blob to a top-level column on lead_submissions so the answer_performance view can join sessions to leads within a 14-day look-back window. The client side has been sending sessionId in trackingContext for ages (analytics_events has used it the whole time) — this just promotes it to a queryable column and backfills all 13 historic leads from the JSONB. The /dashboard/ai-presence Content Performance panel's `leads_attributed_30d` column can now show real numbers per published answer instead of always 0.",
    items: [
      "supabase/migrations/20260524_lead_session_id_attribution.sql: ADD COLUMN session_id text + index + backfill from tracking_context",
      "Same migration: CREATE OR REPLACE VIEW answer_performance with the real attributed_leads CTE (was stubbed yesterday because the column didn't exist)",
      "src/app/api/quote/route.ts: one new field on the lead_submissions INSERT — session_id from trackingContext.sessionId, same pattern as the analytics_events insert nearby",
      "Backfill stats: 13 of 13 historic leads now carry session_id (every one had it in tracking_context all along)",
      "Migration applied via Supabase SQL editor",
    ],
  },
  {
    id: "2026-05-24-ai-content-engine-v1-dry-run",
    title: "AI Content Engine v1 — first batch shipped (3 inline answers on plantation-shutters)",
    releasedAt: "2026-05-24T13:45:00Z",
    summary:
      "First batch from the new AI Content Engine skill. Three Q&A inline answers added to /shutters/plantation-shutters, wrapped in FAQPage JSON-LD with per-answer anchor IDs for AI deep-linking: 'PVC vs basswood plantation shutters: which suits Melbourne homes best?', 'How much do plantation shutters cost per window in Melbourne?' (answered with the honest-broker no-published-pricing pattern), and 'Can plantation shutters be installed in a bathroom (moisture)?'. All three passed 14 deterministic gates + judgement gates: voice checklist (first-person plural, defensible numbers, named local refs, opinion-bearing), AI-tell scan, AU spelling, regulatory check, price-approval gate (hard-blocks any $ or /m² without an approved fact). Watch: organic clicks to /shutters/plantation-shutters, AI bot crawls (GPTBot/ClaudeBot/PerplexityBot) on that URL, and quote-form submissions attributed via session within 14d of viewing those anchors.",
    items: [
      "/shutters/plantation-shutters#q-pvc-basswood-comparison — PVC vs basswood comparison (58 words, named brand Basswood + Tilia Americana)",
      "/shutters/plantation-shutters#q-plantation-shutters-cost — honest-broker pricing answer (59 words, no numbers per brand guide §8)",
      "/shutters/plantation-shutters#q-shutters-bathroom-moisture — bathroom shutters (60 words, references shutters-pvc-bathrooms fact)",
      "Block rendered via new InlineAnswer component (src/components/InlineAnswer.tsx): hybrid accordion (first open desktop / all closed mobile), 48px tap targets, hash-link auto-expand, FAQPage JSON-LD",
      "v1 placement caveat: block mounts after ProductTemplate (page bottom), not top-30% sweet spot — v1.5 fix is to extend ProductTemplate with inlineAnswerSlot prop",
      "Run id: dry-run-2026-05-24 (not yet logged to skill_runs — migration applies on Alex's side)",
      "Best-practices spec hash: ad919c3b… (initial)",
    ],
  },
  {
    id: "2026-05-24-sentence-case-typography",
    title: "Typography: drop site-wide text-transform: capitalize",
    releasedAt: "2026-05-24T13:30:00Z",
    summary:
      "Removed the site-wide `text-transform: capitalize` rule from globals.css that was title-casing every word in every <p>, <h1-h6>, and <summary> on the marketing site. Every page of body copy and every heading was rendering with each word's first letter capitalised — \"PVC vs basswood\" became \"PVC Vs Basswood\", \"AI presence\" would have read \"Ai Presence\" (the admin dashboard already had a scoped override for this exact reason). The site copy as written is in proper sentence case, so this CSS rule was visibly degrading otherwise-clean prose into 2010s-marketing-template look. Caught while previewing the new InlineAnswer block — symptom looked like bad copy, root cause was the global CSS. No content was changed; every page now renders the text the writer actually typed.",
    items: [
      "globals.css: removed `text-transform: capitalize` from h1-h6, p, and summary selectors",
      "globals.css: removed the now-redundant [data-surface=\"dashboard-v2\"] override that existed solely to undo the global capitalize rule on the admin surface",
      "Replaced both blocks with a comment documenting the case convention (sentence case, never CSS capitalize) so the rule isn't accidentally re-introduced",
      "No content edits — every page just renders sentence-case prose now instead of title-cased",
      "Affects: every page on moderncurtainsandblinds.com.au. Spot-check homepage, /shutters, /curtains, /blinds, /quote post-deploy",
    ],
  },
  {
    id: "2026-05-24-suburb-autocomplete-fuzzy-resolver",
    title: "Quote form: native suburb autocomplete + fuzzy postcode resolver",
    releasedAt: "2026-05-24T11:00:00Z",
    summary:
      "Triggered by Geography map showing only 9 of 11 recent leads mappable — the misses were a 'Nortcote' typo (real Melbourne lead lost to a single-letter slip) and a NSW postcode (out-of-state). Adds a native HTML5 <datalist> autocomplete to the suburb input on the quote form (suggests from ~693 known VIC suburbs as the user types) so future typos can't happen at source. Also hardens the server-side derivePostcode resolver with a Levenshtein-distance fuzzy match (≤2) so any typos that DO slip through still bucket onto the right postcode on the dashboard. Free-text entry still works for anyone whose suburb isn't in the list.",
    items: [
      "QuoteForm suburb input now has list='mcb-suburb-options' wired to a <datalist> of every VIC suburb-name + postcode pair from src/lib/locations.ts (~693 entries, +4 KB gzipped)",
      "InputField component extended to accept an optional `list` prop (additive — no impact on other inputs)",
      "src/lib/suburb-options.ts: new client-safe export, one 'Suburb 3072' string per location, alphabetised",
      "src/lib/dashboard/v2/location-resolve.ts: resolveLocation() and derivePostcode() gain a 4th-tier fuzzy fallback using Levenshtein distance with FUZZY_MAX_DISTANCE=2 + FUZZY_MIN_INPUT_LEN=4 (rejects very short ambiguous inputs)",
      "Sample patches via SQL: Annette (suburb 'Nortcote' → 'Northcote 3070', is_victoria=true), Olivia (suburb '2148' → is_victoria=false, NSW)",
    ],
    commitUrl: "https://github.com/AlexlekLewis/mcb_2026_1/tree/feat/fuzzy-resolver-and-suburb-autocomplete",
  },
  {
    id: "2026-05-17-quote-form-friction-pass",
    title: "Quote form: SSR shell, 6-category products, autofill, soft warnings",
    releasedAt: "2026-05-17T00:00:00Z",
    summary:
      "Diagnosed via dual UX + technical audit after dashboard showed 14 form-starts but only 4 leads in 30 days (64% drop between form-start and step-1 complete). The form previously rendered client-only behind a Suspense skeleton (useSearchParams forced this), shipping ~2-4s of grey rectangles on mobile before users could type. Also surfaced 35 product chips in step 1 — fine for a customer who already knows what they want, hostile to the 'not sure, need advice' customer the homepage actually targets. This release ships SSR + a flatter category model + the mobile autofill / keyboards / reassurance that should have been there from day one.",
    items: [
      "QuoteForm no longer uses useSearchParams; receives initialProductParam as a prop from the now-async server page. Suspense boundary and skeleton removed — form HTML ships in the initial server response",
      "35-item product grid collapsed to 6 broad categories (Curtains / Blinds / Shutters / Security Doors & Screens / Awnings & Outdoor / Not sure — need advice). Deep-link map preserves ?product= behavior by routing specific products to their parent category",
      "All form inputs gained autoComplete + inputMode + enterKeyHint (postal-code, given-name, family-name, tel/tel, email/email). Mobile autofill + correct keyboards now work",
      "Header subhead now leads with 'Takes about 60 seconds' (goal-gradient effect)",
      "New mobile-only trust strip above the form: ★4.9/47 reviews · family-owned in Melbourne · free & no obligation",
      "Out-of-area suburb warning softened: amber AlertTriangle → blue Info, copy rewritten from 'Heads up — we only service Victoria' to 'We mainly cover Victoria — if you're nearby, send your details anyway'",
      "Suburb placeholder: 'Preston, VIC' → 'e.g. 3072 or Preston'",
      "Inline reassurance under window count: 'Rough estimate is fine — we'll measure exactly when we visit.'",
      "Phone-anxiety reassurance under step 2: 'We'll call once to book your visit. No marketing calls or spam emails.'",
      "Removed the 'Please complete every required field above to submit' nag — disabled button already communicates this",
      "Canonical tag added on /quote (alternates.canonical = '/quote'). Layout-wide canonical intentionally deferred — would de-index every non-overridden page",
      "ContactPage + Service (free in-home measure, $0 Offer) JSON-LD on /quote",
      "Analytics: getClientTrackingContext now cached per pathname so repeat events (keystrokes, heartbeats) skip the cookie + storage reads",
      "Map metric 'Form Submits' on the dashboard renamed to 'Form Starts' and the bucket now counts only quote_form_start (was lumping form_start + step_3_submit + quote_success, producing misleading totals)",
    ],
  },
  {
    id: "2026-05-14-uiux-pass-hero-quote-trust-and-polish",
    title: "Hero H1 + /quote trust panel + CTA contrast + small-text bumps",
    releasedAt: "2026-05-13T23:38:17Z",
    commitUrl: "https://github.com/AlexlekLewis/mcb_2026_1/commit/a51c13f",
    summary:
      "Visual conversion pass from a UIUX Pro Max audit: shortened the homepage H1 from a 92-char SEO sentence to a scannable two-line headline (keywords moved into the subhead, so SEO is preserved); added a 5★ Google-reviews trust card to the top of the /quote aside; darkened the PrimaryCTA bg to lift contrast from AA-Large-only to AA-all-text; and raised the smallest disclaimer/promo text from 8–9px to 10–11px floor. Before: conversion page had zero social proof; primary CTA contrast was 4.07:1; finance disclaimer rendered at 8px on mobile.",
    items: [
      "Homepage H1 cut from 92 chars to 36 chars ('Made for your home. Made in Melbourne.')",
      "Hero subhead rewritten to retain all SEO keywords (curtains, blinds, shutters, security, outdoor, Melbourne)",
      "New TrustCard on /quote: 5★, 47-review count, featured Google review snippet, link to full reviews",
      "REVIEW_AGGREGATE moved from RichSchema.tsx to customer-reviews.ts as single source of truth",
      "New --color-mcb-terracotta-deep token (#8E5520) for CTA buttons; raises white-on-bg contrast 4.07 → 5.2",
      "PrimaryCTA 'primary' variant now uses terracotta-deep (every nav/section/sticky CTA on the site)",
      "Promo strip text bumped 12px → 13px mobile / 14px desktop",
      "PaymentOptions banner: 9px heading → 11px, 8px disclaimer → 10px (mobile); 10px disclaimer → 11px (desktop)",
      "No Hero CTA changes — still parked for the future experiment per the May-13 commit",
    ],
  },
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
      "Form submit now reports A$1,179 conversion value to Google Ads with Enhanced Conversions (hashed email/phone/name). gclid persisted server-side for offline conversion upload. The 'paid-attributed leads' bar on each release row is the headline signal for this change — it should go from ~0% to whatever share of real traffic is on Google Ads.",
    items: [
      "quote_success event carries value=1179, currency=AUD",
      "Hashed user_data (email/phone/firstName/lastName) attached for Enhanced Conversions",
      "gclid now persisted to mcb_gclid first-party cookie (180d) and to lead_submissions.gclid column",
      "GTM container Version 7 published: two dead Google Ads tags rewired from generate_lead/phone_click to quote_success/phone_tap",
      "New quote_field_error event for form validation drop-off diagnostics",
    ],
    commitUrl: "https://github.com/AlexlekLewis/mcb_2026_1/commit/2344285",
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
