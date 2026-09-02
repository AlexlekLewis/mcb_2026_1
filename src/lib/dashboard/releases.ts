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
    id: "2026-09-02-product-structure-plus-single-payright",
    title: "Product page restructure, single Payright placement, Product Guide modal, 50% tighter spacing",
    releasedAt: "2026-09-02T00:00:00Z",
    summary:
      "Two requested changes shipped together. (1) STRUCTURE: every ProductTemplate-driven page (~41 routes across blinds, curtains, shutters, awnings, security and locations/[suburb]) reordered to Hero -> Choose with Confidence -> Which Option Is Right for You? -> Benefits -> Reviews -> Product spiel/overview -> Common Questions. Buyers now hit the product choices and the decision guide before any prose; social proof follows the choice rather than preceding it. Sections not named in the brief (features grid, Product Guide comparison table, fit promise, process timeline, internal links, closing CTA) keep their relative order below the FAQ. (2) PAYRIGHT: the finance banner was rendering at the top of EVERY page, directly under the fixed nav and above the hero, plus a second white Payright card mid-page on every product page, plus an unprompted brand mention in the chat fallback — three touches per product page. Cut to exactly one: a single full-bleed banner anchored immediately below the 'Which option is right for you?' decision guide, where finance is a live question rather than an interruption. Watch: scroll depth past the decision guide, quote CTA clicks, bounce on product pages, and whether hero engagement improves now that the banner no longer pushes it ~40px down the fold.",
    items: [
      "src/components/ProductTemplate.tsx — sibling JSX blocks reordered to the requested a-g sequence. No markup or copy changed in the move itself.",
      "src/app/layout.tsx — removed the site-wide <PaymentOptions variant=\"banner\" topOffset />. It also doubled as the spacer clearing the fixed announcement bar + nav, so an explicit aria-hidden spacer div replaces it at identical heights (112/116/120px) — no layout shift on any page.",
      "src/components/ProductTemplate.tsx — removed the mid-page white Payright card from the 'Choose with confidence' grid; added the single <PaymentOptions variant=\"banner\" /> directly after the decision guide. Rendered unconditionally so pages without a decisionGuide still carry exactly one finance placement.",
      "src/components/PaymentOptions.tsx — banner variant reworked from a compressed top-of-page strip into an in-page band: dropped the now-unused topOffset prop, outer padding py-1/py-2 -> py-8/py-10, inner padding px-2 py-1 -> px-4 py-4 (md px-6 py-5). Disclaimer and approval wording untouched.",
      "src/components/ChatWidget.tsx — the unprompted capability fallback named 'Payright'; now says 'finance' to match the opening message. The direct finance answer and its 'subject to Payright approval' disclaimer are unchanged.",
      "PRODUCT GUIDE — src/components/ProductGuideModal.tsx (NEW): the comparison table was a full-width section (~700px of vertical space on 28 product pages) for a reference people consult once. Now a subtle bordered 'Product guide' button under the 'Choose with confidence' heading that opens the same table in a dialog. Opens on hover after a 220ms intent delay on fine-pointer devices, on click/tap everywhere, Esc + backdrop + close button to dismiss, body scroll locked while open, focus moved to close and returned to the trigger. The table markup stays mounted (inert + aria-hidden when closed) so the comparison content is still in the served HTML for crawlers and answer engines — verified present in the production build output.",
      "SPACING — section-scale vertical padding halved across 41 customer-facing files (113 class tokens): py-28->14, py-24->12, py-20->10, py-16->8, py-12->6 plus the pt/pb and responsive equivalents, and the large heading bottom margins mb-16->8, mb-12->6. ProductTemplate's own section padding goes 1312px -> 656px, exactly 50%. Two clearance values were deliberately excluded after review: the Navbar's full-screen mobile menu overlay keeps pt-32 (it clears the fixed announcement bar + nav, not page rhythm) and the PaymentOptions banner keeps the py-8/py-10 it was just given. The internal /dashboard is untouched. Watch scroll depth and engaged time — less scrolling to reach the same content should raise completion but could cut dwell.",
      "BOOKING PAGE — src/components/QuoteForm.tsx: new Payright card in the right-hand sidebar, between 'What Happens Next?' and 'No pressure. Just clear advice.' — finance lands after the buyer understands the process, not before. Uses a new compact PaymentOptions variant=\"sidebar\" so all Payright copy and the approval disclaimer stay in one file; the existing wide 'section' variant would have broken in the 0.72fr column. This is the one sanctioned exception to the site-wide Payright de-duplication.",
      "INDEXING AUDIT — full crawl/canonical/AEO review of all 792 built pages. Result: the indexable set is healthy and deliberate. 663 pages carry noindex (661 thin /locations/<suburb> hubs per the 2026-06-14 growth-audit decision, plus /dashboard and /_not-found); 129 are indexable; 98 are in the sitemap. Every page in the 31-page gap is correctly excluded — 26 /products/* cross-canonicalise into the current URL structure, 6 are 308 redirect stubs (all covered by next.config.ts with permanent: true) and /quote is dynamic so it has no prerendered file. The ~33k suburb x product tier is dynamic and correctly serves 'noindex, follow'. Zero aggregateRating or Review nodes remain anywhere (the 2026-07 removal held), all 41 ProductTemplate pages carry FAQPage JSON-LD, and every URL in llms.txt / llms-full.txt is on the www origin. No indexing defects found.",
      "INDEXING FIX — src/lib/site.ts: SITE.url fell back to the APEX origin, which 307-redirects to www. metadataBase derives from it, so an unset NEXT_PUBLIC_BASE_URL flips every canonical, og:url, JSON-LD @id and breadcrumb item across ~780 pages to a redirecting host — while the sitemap (hardened in 2026-07) kept advertising www, so the two would contradict each other. Production is currently correct because NEXT_PUBLIC_BASE_URL is set in Vercel; this closes the same latent hole that sitemap.ts and robots.ts had closed and site.ts missed. Verified: local build canonicals go 783/783 apex -> 783/783 www.",
      "NOTE: Payright now appears on ProductTemplate pages only. The homepage, /guides, /locations, /contact and the other non-product routes no longer carry it — flagged to Alex in case he wants a placement there.",
    ],
  },
  {
    id: "2026-08-13-energy-guide-plus-plain-language-home",
    title: "Seasonal energy-efficiency guide + plain-language homepage + site hygiene fixes",
    releasedAt: "2026-08-26T13:55:59Z",
    summary:
      "Two changes from the 2026-08-13 GSC query mining (first query-level pull ever — API sync still empty, pulled via authenticated browser). (1) NEW flagship editorial /guides/energy-efficient-curtains-blinds-melbourne targeting the energy/thermal query cluster where the site had ZERO visibility across 1,000 query rows, while blockout/honeycomb/double-roller money pages sit at positions 26–80 with ~1,400 combined impressions and ~zero clicks. Answer-first, questions woven in prose, FAQPage + Article JSON-LD, internal links to 10 money pages, WovenQuestion engagement tracking on four sections, indicative pricing reusing the already-approved pooja-guide figures with the standard protective T&Cs. Featured hero card on /guides hub + sitemap entry (a 'Guides' navbar item was tried and reverted — the desktop nav is already at capacity and it collided with the phone number; guides stay reachable via the footer link and the hub). (2) Homepage copy simplified from Flesch-Kincaid grade 8.5 → 5.2 (~10-year-old readable): hero subline, all six need-cards (also fixes their Mid-Word Capitalisation), section intros, family story (now names Deane & Dee — E-E-A-T fix from the June audit's 'invisible owners' finding), security cross-sell and final CTA. Watch: guide impressions/clicks from zero on energy-cluster queries, generative-AI feature impressions (3.81K/3mo baseline), homepage bounce + quote CTA clicks, question dwell events on the four tracked sections.",
    items: [
      "src/app/guides/energy-efficient-curtains-blinds-melbourne/page.tsx — NEW seasonal flagship guide (winter–spring 2026): dark editorial hero, 40% heat-loss pull-stat, six product cards linking money pages, honest honeycomb-vs-roller comparison, improve-vs-move section (general CGT info with 'ask your accountant'), protected pricing block, room-by-room call sheet, reduced-motion-safe Reveal animations.",
      "src/components/Reveal.tsx — NEW shared scroll-entrance wrapper. Deliberately visible-by-default: no hidden styles in the server HTML, content already on screen is never hidden, entrance skipped when document.hidden or prefers-reduced-motion, opacity/transform only so zero CLS. (First cut used framer-motion whileInView and was replaced: it rendered opacity:0, and with the tab backgrounded all 7 article sections stayed invisible to humans while crawlers still saw the markup.)",
      "src/components/RichSchema.tsx — NEW ArticleSchema component (Organization author/publisher, en-AU).",
      "src/app/guides/page.tsx — featured hero card for the energy guide; meta description updated.",
      "src/app/sitemap.ts — new guide slug; GUIDE_LAST_MODIFIED → 2026-08-13.",
      "src/lib/cro-data.ts — six need-card descriptions rewritten plain-language (also fixes their Mid-Word Capitalisation).",
      "src/app/page.tsx + src/components/CROSections.tsx — hero subline, BrowseByNeed/ExpandedCategoryGrid/ProcessStrip intros, FamilyBusinessStory (Deane & Dee named), SecurityMoat, FinalCTA rewritten at ~grade-5 reading level.",
      "SITE HYGIENE — src/components/Footer.tsx: the contact email (admin@moderncurtainsandblinds.com.au, 315px) overflowed the viewport by ~35px and put a horizontal scrollbar on EVERY page at 1280px. Now min-w-0 + break-words with shrink-0 icons. Verified scrollWidth 1299 -> 1265 = clientWidth.",
      "SITE HYGIENE — src/components/Navbar.tsx: at the xl breakpoint the 250px logo overlapped the first nav item (Blinds). Logo widths reduced md 190->180, lg 220->200, xl 250->220. Nav, phone and CTA now clear at 1280px.",
      "AI SEARCH — public/llms.txt: NEW \"Buyer's guides\" section listing all 7 guides, plus explicit citation guidance for energy/thermal/winter-warmth queries. public/llms-full.txt: 7 NEW self-contained Q&A blocks on the energy cluster (heat loss through windows, do blockout curtains keep heat in, best warm blinds, what makes a covering actually insulate, honeycomb vs roller, motorisation, improve-vs-sell) — 12 blocks to 19. Structured-data list now declares Article. src/app/robots.ts: sitemap host fallback apex to www (matches the sitemap.ts hardening).",
      "SEO — doubled brand suffix removed from 12 page titles. These hardcoded the brand in their own title AND received the root layout template again, so Google saw it twice and truncated the keyword: /motorisation was 95 chars, /shutters/plantation-shutters/aluminium 108. Now 37-79. Affected: motorisation, awnings, awnings/zipscreens, curtains/blockout, curtains/sheer, blinds/roller-blinds/blockout, shutters/roller-shutters, all 3 plantation-shutter material pages, about, our-story. (The 2026-07-27 release fixed this for the guides tier + pricing-policy only.) Watch SERP CTR - GSC 3mo baseline is 0.5% on 166K impressions.",
    ],
  },
  {
    id: "2026-07-27-seo-week1-quick-wins",
    title: "SEO/AEO week-1: publish the guides tier, recover legacy 404s, remove ineligible review schema",
    releasedAt: "2026-08-26T13:55:59Z", // shipped late: branch sat undeployed until this date
    summary:
      "Week-1 fixes from the 2026-07-26 SEO/AEO/GEO audit. (1) The six hand-written /guides pages were live, indexable and self-canonical but absent from the sitemap, had no index page (/guides 404'd) and zero internal links — effectively unpublished. Added a /guides hub, listed all six + /pricing-policy in the sitemap, and linked both from the footer. (2) Legacy pre-2026 URLs (/tcs, /blogs-articles/*, /about-us, /faq, /gallery, /terms-and-conditions) were 404ing with NO redirect rules at all while still taking ~87 sessions/month from stale index entries and old backlinks — now 301'd to their closest live equivalent, with a catch-all for unmapped blog slugs. (3) Added a branded not-found.tsx: the site was serving the unstyled Next.js default 404, which also inherited the homepage meta description (soft-404 signal). (4) REMOVED aggregateRating + 6 Review nodes from the homepage JSON-LD — self-serving review markup under LocalBusiness/Organization is not supported by Google and had no visible server-rendered counterpart (Elfsight renders client-side, so the DOM only said 'Loading Google reviews…'); reviewCount was also a hardcoded literal. Reviews are genuine — this is a markup-eligibility fix, not an authenticity one; stars still surface via GBP and the widget still shows them to humans. This also removes the duplicate HomeAndConstructionBusiness node on the homepage. (5) llms.txt + llms-full.txt: all internal URLs apex → www (apex 307-redirects and several AI crawlers don't follow), and dropped the unverifiable 'consistently 5-star' aggregate claim. (6) sitemap.ts baseUrl fallback hardcoded to the www origin so an unset NEXT_PUBLIC_BASE_URL can't silently flip all URLs to a redirecting host. (7) Stripped the doubled brand suffix from the six guide titles + /pricing-policy (root layout template already appends it). (8) Roller-blinds H1 'Roller Blinds' → 'Roller Blinds Melbourne' (title tag already carried the geo, H1 didn't). Watch: /guides impressions + clicks from zero, recovered sessions on the 301'd legacy paths, and that no rich-result loss follows the review-schema removal.",
    items: [
      "src/app/guides/page.tsx — NEW /guides hub (route previously 404'd); cards for all six guides + quote CTA.",
      "src/app/sitemap.ts — added /guides hub + 6 guide URLs + /pricing-policy; new GUIDE_LAST_MODIFIED; baseUrl fallback hardcoded to https://www.moderncurtainsandblinds.com.au.",
      "src/components/Footer.tsx — Company column now links Buyer's Guides + Pricing Policy (first internal links to the guides tier).",
      "next.config.ts — 15 new legacy 301s: /tcs→/terms, /terms-and-conditions→/terms, /about-us→/about, /gallery→/projects, /faq→/guides, 8 mapped /blogs-articles/* slugs, plus /blogs-articles/:slug* and /blog/:slug* catch-alls→/guides.",
      "src/app/not-found.tsx — NEW branded 404 with nav chips, quote CTA, phone, and noindex,follow metadata.",
      "src/components/RichSchema.tsx — REMOVED OrganizationReviewSchema (aggregateRating + Review nodes) with a do-not-reintroduce note; src/app/page.tsx unmounts it. CURATED_REVIEWS/REVIEW_AGGREGATE still power visible trust copy in QuoteForm.tsx.",
      "public/llms.txt + public/llms-full.txt — apex→www throughout; removed the 'consistently 5-star' claim and the AggregateRating/Review advertisement from the schema list.",
      "src/app/guides/*/page.tsx + src/app/pricing-policy/page.tsx — removed the doubled ' | Modern Curtains and Blinds' title suffix.",
      "src/app/blinds/roller-blinds/page.tsx — H1 now 'Roller Blinds Melbourne'.",
    ],
    affectsGrowthCorridor: true,
  },
  {
    id: "2026-07-27-footer-service-partners",
    title: "Footer — Service Partners block with Tricoat Painting backlink",
    releasedAt: "2026-08-26T13:55:59Z", // shipped late: branch sat undeployed until this date
    summary:
      "Added a 'Service Partners' section to the global footer (between the four-column link grid and the copyright bar), carrying one entry: Tricoat Painting & Decorating with a two-sentence description and a followed outbound link to https://www.tricoatpainting.com.au. Editorial partner link, not paid — so no rel=nofollow, just target=_blank + rel=noopener noreferrer. Grid is 2-up on desktop so further partners can be added without a layout change. Watch: this is the first outbound link in the footer, so keep an eye on pages-per-session and exit rate; if footer exits climb noticeably, consider dropping target=_blank or moving the block behind /our-story.",
    items: [
      "src/components/Footer.tsx — NEW 'Service Partners' block above the bottom bar; heading styled to match the existing footer column headings (font-serif, mcb-clay-light); partner name links to https://www.tricoatpainting.com.au in a new tab with rel=noopener noreferrer; description in stone-400 text-sm.",
    ],
  },
  {
    id: "2026-07-12-dashboard-botfilter-redesign-phase1",
    title: "Dashboard Phase 1 — bot-filtered numbers + owner performance report (Home)",
    releasedAt: "2026-07-12T00:00:00Z", // TODO: set to actual deploy time when shipped
    summary:
      "Internal analytics correctness + legibility fix (dashboard only — no customer-facing change). The headline traffic views (dashboard_daily_metrics / _top_pages_30d / _conversion_funnel_30d) still read RAW analytics_events bucketed by UTC, so bots inflated visitors/sessions (visitors > page_views on some days — impossible) and 'today' started at 10am Melbourne; the 20260601 fix migration was never applied and there's no DDL path from the app. Fixed in APP CODE instead: new src/lib/dashboard/v2/report-metrics.ts computes every headline metric from the bot-filtered analytics_events_clean view, bucketed to Australia/Melbourne, with visitor/session distincts scoped to page_view (so visitors <= page_views always) — paginated to beat PostgREST's 1000-row cap, head-counts where possible, cache()-wrapped, route revalidate=1800. Repointed data.ts fetchers (fetchDailyMetrics/fetchLeadsHeroData/fetchFunnelRows) at the clean computation so the Leads page and weekly-digest email inherit correct numbers too. Rebuilt /dashboard Home into an owner+marketing performance report: rolling-30d-vs-prev-30d headline tiles (real visitors, verified leads, lead rate, phone taps), calendar month-on-month (leads split organic vs ads + visitors), traffic & engagement (top pages, active time on site, scroll reach, device), key locations (Melbourne-led, international/datacenter noise called out honestly), and the quote-form funnel with per-stage drop-off. Validated live: June ~693 visitors / 47 leads / 6.8% / 22 taps. Since these are dashboard-internal, there's no on-site metric to move — the 'result' is that every downstream KPI on other pages is now bot-free and Melbourne-bucketed.",
    items: [
      "src/lib/dashboard/v2/report-metrics.ts — NEW: paginated, Melbourne-bucketed, bot-filtered aggregators (traffic, engagement/time-on-site, scroll reach, locations, rolling-30d deltas, calendar-month series, quote funnel, organic-vs-ads lead source) + clean replacements fetchDailyMetricsClean/fetchLeadsHeroDataClean/fetchFunnelRowsClean.",
      "src/lib/dashboard/v2/data.ts — fetchDailyMetrics/fetchLeadsHeroData/fetchFunnelRows repointed at the clean computation (fixes Leads page + weekly-digest email numbers too).",
      "src/app/dashboard/(with-sidebar)/page.tsx — rebuilt Home into the performance report; export revalidate=1800 (was force-dynamic).",
      "src/components/dashboard/v2/{FunnelBars,BarList,ScrollReach,MonthlyBars}.tsx — NEW v2 primitives (tokens palette; legacy DashboardCharts left untouched).",
      "src/lib/dashboard/growth-corridor-metrics.ts — fixed countScrollDepth filtering non-existent `depth` column (real column is `scroll_percent`); corridor scroll heatmap was silently always 0.",
      "src/lib/analytics.ts — documented quote_step_1_complete / quote_step_2_complete / quote_error in the event-vocabulary docblock.",
    ],
  },
  {
    id: "2026-07-03-google-reviews-widget-compress",
    title: "Compress Google Reviews widget (homepage + all product/location pages)",
    releasedAt: "2026-07-03T00:00:00Z", // TODO: set to actual deploy time when shipped
    summary:
      "Layout density fix. The Google Reviews section (GoogleReviewsWidget) was eating ~110-120px of vertical space more than it needed — pushing content further below the fold on the homepage and every ProductTemplate page (38 product money pages + the suburb route). Tightened four things without dropping any content or the 'Book a free quote' CTA: section padding (py-8/10 -> py-5/6), header block (40px icon -> 32px, py-4 -> py-3, heading xl/2xl -> lg/xl), inner padding (p-3/4 -> p-2.5/3), and the fixed Elfsight review frame (300/320px -> 230/250px). Verified on local dev at both breakpoints that the Elfsight carousel (renders ~225px tall) still fits with headroom — mobile 375px: 225px in a 230px frame (5px spare); desktop 1280px: 225px in a 250px frame (25px spare) — so nothing is clipped and reviews + star ratings render intact. Watch: engaged time / scroll depth on the homepage and product pages (more above-the-fold density), plus any CLS improvement from the shorter reserved frame. No regression expected.",
    items: [
      "src/components/GoogleReviewsWidget.tsx — section py-8 md:py-10 -> py-5 md:py-6; header px-5 py-4 -> px-4 py-3 and gap-4 -> gap-3; icon badge h-10 w-10 (icon h-5 w-5) -> h-8 w-8 (icon h-4 w-4); label text-[11px] -> text-[10px]; heading text-xl md:text-2xl -> text-lg md:text-xl; inner padding p-3 md:p-4 -> p-2.5 md:p-3; review frame h-[300px] md:h-[320px] -> h-[230px] md:h-[250px].",
      "Verified via local `next dev`: Elfsight carousel measures ~225px at both 375px and 1280px; fits both compressed frame heights with no clipping; real review content + stars render.",
    ],
  },
  {
    id: "2026-07-03-location-title-brand-dedup",
    title: "Fix doubled brand suffix in location page titles (12 corridor pages + Preston)",
    releasedAt: "2026-07-03T00:00:00Z", // TODO: set to actual deploy time when shipped
    summary:
      "Title-tag correctness fix. The root layout applies a title template ('%s | Modern Curtains and Blinds'), but the 12 woven growth-corridor location pages plus the new Preston page were ALSO hardcoding the brand in their own title, producing '… | Modern Curtains and Blinds | Modern Curtains and Blinds' in SERPs. Removed the redundant suffix from each page title so the brand appears exactly once and the head-term + suburb + postcode sits at the front of the tag. Affects the tracked growth-corridor cohort (Clyde North, Clyde, Officer, Officer South, Wollert, Donnybrook, Beveridge, Mickleham, Greenvale, Tarneit, Deanside, Fraser Rise) plus Preston. Pre-existing bug on the woven pages; introduced-then-fixed same-day on Preston. Watch: corridor-page SERP CTR (title is the clickable line).",
    items: [
      "src/app/locations/{clyde-north,clyde,officer,officer-south,wollert,donnybrook,beveridge,mickleham,greenvale,tarneit,deanside,fraser-rise}/page.tsx — removed ' | Modern Curtains and Blinds' from the metadata title (root layout template re-adds it once).",
      "src/app/locations/preston/page.tsx — same fix on the new established-suburb page; added a comment noting the layout template appends the brand.",
    ],
  },
  {
    id: "2026-07-03-preston-established-suburb-page",
    title: "Preston — bespoke established-suburb location page (Phase 2b pilot)",
    releasedAt: "2026-07-03T00:00:00Z", // TODO: set to actual deploy time when shipped
    summary:
      "First 'established suburb' page — the non-corridor counterpart to the woven pilot (Clyde North). Preston (MCB's home suburb) gets a bespoke, genuinely-unique /locations/preston page instead of the region-templated hub: home-base trust story, real local housing stock (period cottages/bungalows + medium-density infill around High St / Bell St / Preston Market / the station), heritage-overlay guidance, the west-facing-extension sun problem, owners'-corporation rules for the new apartments, and indicative pricing carrying protective T&Cs (baseline spec, on-site measure required, July-2026 refresh date). Wired so the static page overrides the dynamic /locations/[suburb] route (hasDedicatedSuburbPage) and stays indexable (ESTABLISHED_SUBURB_SLUGS). Kill-or-keep pilot: if 7d GSC/engagement beats the old templated Preston hub, replicate the pattern to the other established priority suburbs. Watch: Preston impressions/clicks/avg position + engaged time vs the templated version.",
    items: [
      "src/app/locations/preston/page.tsx — new bespoke established-suburb page (home-base story, period housing, heritage-overlay + body-corporate guidance, indicative pricing with protective T&Cs, FAQPage schema with Preston-named questions).",
      "src/lib/locations.ts — new ESTABLISHED_SUBURB_SLUGS set + hasDedicatedSuburbPage(); isSuburbHubIndexable now also covers established slugs.",
      "src/app/locations/[suburb]/page.tsx — generateStaticParams now excludes any slug with a dedicated page (woven or established), preventing the static/dynamic collision for /locations/preston.",
    ],
  },
  {
    id: "2026-07-01-suburb-h1-heading-semantics-geo-accuracy",
    title: "Suburb pages — intent-matched H1s, heading-semantics fix, inner-north region-copy accuracy",
    releasedAt: "2026-07-01T00:00:00Z", // TODO: set to actual deploy time when shipped
    summary:
      "On-page SEO pass on the location tier (Phase 1 + 2a of the hyperlocalisation plan). (1) Suburb H1 upgraded from the bare 'Curtains and Blinds {Suburb}' to 'Curtains, Blinds & Shutters in {Suburb}' — adds the shutters head term (a whole category previously absent from the H1) and reads as natural local intent; title tag matched ('Curtains, Blinds & Shutters {Suburb} | Free Quote'). Applies to the dynamic /locations/[suburb] route (all non-woven suburbs; the 12 woven corridor pages set their own titles). (2) Heading-semantics fix in ProductTemplate: the 60-100-word regional intro prose was rendering inside an <h2> (heading-misuse signal flagged P2 in the 2026-06-14 audit) — now a styled <p>, visuals identical, real section headings ('Choose with confidence' etc.) stay <h2>. Affects every ProductTemplate page (38 product money pages + the suburb route). (3) Region-copy accuracy: new manual overrides so Thornbury, Northcote, Bundoora and Mernda are served the correct 'north' copy instead of the 'north-east' Eltham mud-brick/bushland copy the CBD-bearing bucketing mis-assigned (audit-flagged trust + AI-citation risk; Bundoora is literally named in the north copy). Verified on local prod build: Thornbury H1 correct, now renders northern copy (Preston/Californian bungalows), zero mud-brick; Eltham control still north-east. tsc/eslint/build clean. Watch: impressions/CTR on the 20 indexed priority suburbs, and that money-page rankings hold through the heading change.",
    items: [
      "src/app/locations/[suburb]/page.tsx — H1 (ProductTemplate title) 'Curtains and Blinds {Suburb}' -> 'Curtains, Blinds & Shutters in {Suburb}'; metadata title gains '& Shutters'.",
      "src/components/ProductTemplate.tsx — intro description node motion.h2 -> motion.p (same className, identical rendering); fixes the 60-100-word-prose-inside-an-h2 heading misuse across all ProductTemplate pages.",
      "src/lib/region-content.ts — new SUBURB_REGION_OVERRIDES map consulted before the CBD-bearing bucketing in getSuburbContent; thornbury/northcote/bundoora/mernda -> 'north'. Fixes wrong-region copy on indexed inner-north/northern suburbs.",
      "Verified via local `next start`: Thornbury H1 = 'Curtains, Blinds & Shutters in Thornbury', region lede now a <p> with northern copy (Preston x11, zero mud-brick); Eltham control unchanged (north-east, mud-brick present). tsc clean, eslint --max-warnings 0 clean, npm run build clean.",
    ],
  },
  {
    id: "2026-06-15-terms-consult-fee-deposit-timing",
    title: "T&Cs — second-consult fee, deposit timing + commercial PO terms",
    releasedAt: "2026-06-15T06:54:00Z",
    summary:
      "Policy wording update on /terms (Payment and Order Policies). Added a Consultations clause: first consultation is free/no-obligation; a second consultation is charged at $250 (payable at the time of the consult) and deducted from the client's quoted price if the job proceeds — making the second consult effectively free — and retained as the consultation fee if they do not proceed. Tightened deposit timing: the 50% deposit is now stated as immediately due and payable once the client confirms the order, with production/supplier orders not scheduled until it is received. Added a Commercial Orders clause: per standard industry practice, the 50% deposit may be waived at our discretion for approved commercial/trade clients, with orders accepted and scheduled on receipt of a valid purchase order or written confirmation (incl. email) — which constitutes the customer's binding acceptance of the order, price and T&Cs — while we reserve the right to still require a deposit/progress payment. Legal/policy change, not a CRO experiment — no metric movement expected; logged per repo discipline.",
    items: [
      "src/app/terms/page.tsx — new 'Consultations' section in paymentSections (first consult free; $250 second consult charged upfront, deducted from quoted price on proceed = effectively free, retained as the consultation fee if not).",
      "src/app/terms/page.tsx — 'Order Placement and Deposit' now states the deposit is immediately due and payable on client confirmation; production/supplier orders not scheduled until deposit received.",
      "src/app/terms/page.tsx — new 'Commercial Orders' section in paymentSections (50% deposit may be waived for approved commercial/trade at our discretion; order accepted/scheduled on a valid purchase order or written confirmation incl. email = binding acceptance of order/price/T&Cs; payment per quote/PO/written agreement; right to require deposit/progress payment reserved).",
    ],
  },
  {
    id: "2026-06-14-growth-audit-sprint1",
    title: "Growth audit Sprint 1 — doorway noindex, review-schema scope, canonicals, redirect chain",
    releasedAt: "2026-06-14T08:10:32Z",
    summary:
      "Structural SEO/AEO cleanup from the 2026-06-14 five-lens growth audit (repo/audits/2026-06-14-growth-audit/). Biggest lever: the ~33k templated suburb×product URLs and the thin long-tail suburb hubs are now noindexed + removed from the sitemap (33,321 URLs → 89), keeping a 32-suburb shortlist (12 woven corridor + 20 priority core suburbs) indexed. Also: the AggregateRating/Review JSON-LD that was stamped on every URL via the global OrganizationSchema is now homepage-only (kills the schema-spam + Google review-snippet-policy risk); self-referencing canonicals added to the homepage + 11 static-metadata hub/info pages; og:url no longer wrongly inherits the homepage on every page; and the velvet-curtains 2-hop redirect chain collapsed to a single 308. Watch: crawl stats / indexed-page count dropping (intended), and that money-page + corridor impressions hold or rise as crawl budget refocuses. Report-first audit, shipped on branch audit/sprint-1-quick-wins.",
    items: [
      "Doorway noindex: src/app/locations/[suburb]/[product]/page.tsx → robots noindex,follow on the whole tier; src/app/locations/[suburb]/page.tsx → noindex,follow unless woven/priority (new isSuburbHubIndexable in src/lib/locations.ts: 12 woven + 20 priority core suburbs from llms.txt). Long tail still reachable + link-equity-passing, just out of index.",
      "Sitemap: src/app/sitemap.ts now emits only indexable suburb hubs and drops the suburb×product tier entirely (verified 89 total <loc>, 0 suburb-product, 32 hubs).",
      "Review schema scope-only: src/components/RichSchema.tsx — removed aggregateRating/review from the global OrganizationSchema; new homepage-only OrganizationReviewSchema (same @id, merges) mounted in src/app/page.tsx. NOTE: 'scope-only' step — reviews are still schema-only, not yet rendered as visible on-page HTML (deferred policy decision).",
      "Canonicals/OG: added alternates.canonical to homepage + blinds/curtains/shutters/security/locations hubs + about/contact/our-story/projects/privacy/terms; removed the root openGraph.url so pages stop inheriting the homepage og:url (homepage sets its own). Product pages already had canonicals via the pageMetadata(path) helper — audit's '~24 product pages missing' was a false positive.",
      "Redirects: next.config.ts velvet-curtains now points straight to /curtains/theatre-velvet (was a 2-hop chain); curtains/velvet/page.tsx uses permanentRedirect (308) instead of redirect (307).",
      "Quality gates: tsc clean, eslint clean, npm run build clean; rendered output verified on local preview (noindex tags, canonicals, sitemap count, homepage-only review schema, no console errors).",
    ],
    affectsGrowthCorridor: true,
  },
  {
    id: "2026-06-05-product-options-section-reorder",
    title: "Product pages — image 'options' section moved above the fold + retitled 'Choose with confidence'",
    releasedAt: "2026-06-05T00:00:00Z", // TODO: set to actual deploy time when shipped
    summary:
      "Layout + copy on every ProductTemplate-driven page (38 product pages across blinds/curtains/shutters/awnings/security, plus the dynamic locations/[suburb] landing route). The product-types image grid — the visual 'options' section — used to sit near the bottom of the page (below Features / Comparison / Process / Fit promise / Benefits / FAQ). Moved it up to render immediately after the intro so buyers reach the actual product choices + imagery first, and renamed its heading 'Which option is right for you?' → 'Choose with confidence'. The text 'decision guide' cards swapped down to just above the local-links block (they still carry their own 'Choose with confidence' eyebrow + 'Which option is right for you?' heading). Note: the PaymentOptions block is nested in the image-grid section, so it moved up too. Pure block swap, reversible. Watch scroll-depth into the grid, engaged time and quote CTA clicks; nothing should regress.",
    items: [
      "src/components/ProductTemplate.tsx — swapped the order of the always-on 'Product Types / Collection' image-grid section and the conditional 'Decision Guide' text-card section (symmetric 107/107-line block move). Image grid + PaymentOptions now render right after the Introduction; decision-guide cards now render just above the internal-links section.",
      "Renamed the image-grid H2 'Which option is right for you?' → 'Choose with confidence'. The decision-guide section is otherwise untouched, so the phrase 'Choose with confidence' now appears in both sections (one early as a heading, one late as an eyebrow). Flagged for follow-up if the repeat is unwanted.",
      "Unaffected: custom product pages (polymer/timber/aluminium shutters, sheer/velvet/blockout/s-fold curtains, veri-shades, outdoor-blinds, zipscreens, window-awnings, motorisation) use bespoke layouts. No growth-corridor URL renders via ProductTemplate (the 12 corridor suburb pages are static woven-style overrides), so affectsGrowthCorridor stays false.",
      "Quality gates: tsc clean, eslint clean, npm run build clean.",
    ],
  },
  {
    id: "2026-06-05-google-reviews-compact",
    title: "Google reviews section — compact rebuild (homepage + all product pages)",
    releasedAt: "2026-06-05T00:00:00Z",
    summary:
      "Footprint reduction. The #google-reviews section (renders on the homepage and every product page via ProductTemplate) was a tall two-column marketing block: a big serif heading + paragraph + 3 trust badges + CTA on the left, and a separately-labelled feed on the right. Rebuilt it as a slim header bar (brand icon + 'Google reviews' eyebrow + heading + CTA) above a full-width live Google feed. Roughly halves the section's height on mobile and trims ~20% on desktop, lifting the reviews higher in the scroll and giving the feed more width to show more cards. Same Elfsight embed, same #google-reviews anchor (QuoteForm links to it). Watch scroll-depth past this section / engaged time; nothing should regress.",
    items: [
      "src/components/GoogleReviewsWidget.tsx — removed the left marketing column (descriptive paragraph + 3 trust badges that duplicate ProofBar/ProcessStrip) and the redundant in-feed 'Customer feedback / Live review feed / Google feed' header chrome. Header is now one row; feed is full-width. Outer padding py-12/md:py-14 → py-8/md:py-10; heading text-3xl/md:text-4xl → text-xl/md:text-2xl. Brand gradient rule retained as a thin top accent.",
      "Elfsight widget container height unchanged (300/320px) so no reviews get clipped — the savings come from the surrounding chrome, not the feed.",
      "Section CTA now routes through <PrimaryCTA location=\"google-reviews\" label=\"Book a free quote\"> — it was previously a raw <Link> with no tracking, so this also closes a gap: the reviews-section CTA now emits cta_impression + quote_cta_click like every other quote CTA.",
      "Quality gates: tsc clean, eslint clean, npm run build clean.",
    ],
  },
  {
    id: "2026-06-02-quote-form-windowcount-optional",
    title: "Quote form — window count made optional (unblock Section 1)",
    releasedAt: "2026-06-02T12:20:00Z",
    summary:
      "Data-driven micro-CRO. The quote form's only on-site conversion leak was Section 1: clean 30d funnel showed quote_form_start 40 → quote_step_1_complete 25 (a 38% drop), then ~96% completion the rest of the way (step_2 24 → submit 24 → success 24). Section 1 required suburb + product + 'How many windows or doors?' before the contact section unlocked. Window count is a triage nicety we re-measure on-site, so requiring it gated would-be leads out before they could give contact details. Made windowCount optional: Section 1 now completes on suburb + product alone. Server already treated windowCount as optional, so no submission-path risk. Watch step_1_complete / lead count over the 7d window; revert if no lift.",
    items: [
      "src/components/QuoteForm.tsx — removed Boolean(formData.windowCount) from section1Valid (and its dep); '*' → '(optional)' on the window-count label; removed `required` from the windowCount radio inputs; dropped windowCount from reportMissingFields.",
      "No server change needed — /api/quote already defaults windowCount to 'N/A' and stores it null-safe.",
      "Hypothesis: recovers a share of the 15/40 Section-1 drop-offs; at ~96% downstream completion that should convert to incremental leads. Single-variable, reversible.",
    ],
  },
  {
    id: "2026-05-27-growth-corridor-pillars-and-dashboard-panels",
    title: "Growth Corridor — 3 pillar guides + dashboard panels 3, 4, 5",
    releasedAt: "2026-05-27T18:00:00Z",
    summary:
      "Three corridor pillar guides live (/guides/window-furnishings-south-east-growth-corridor, /northern-growth-corridor, /western-growth-corridor) — ~2,000-word authority pages per corridor with builder mix, named estates, product mix rationale, pricing depth, covenant overview, and cultural framing where appropriate. Each links the suburb pages, the answer-gap pages, and the pricing policy into a single internal-link spine. Dashboard panels 3 (question-level engagement), 4 (scroll-depth heatmap reading existing scroll_depth events), and 5 (AI citation tracker reading ai_citation_log) are now live with appropriate empty states until data populates. WovenQuestion client component built — fires question_scrolled_into_view (once/session/q_id) and question_section_dwell (after 8s + on exit) via IntersectionObserver. First instrumented on the new-build inclusions answer-gap page (5 q_ids); broader rollout follows in a future pass.",
    items: [
      "src/app/guides/window-furnishings-south-east-growth-corridor/page.tsx — net-new ~2,000-word SE corridor pillar; FAQPage schema; named estates (Smiths Lane, Five Farms, Eliston, Arcadia, Timbertop, Orana, Kaduna Park, Brompton, Arbourwood); builder mix",
      "src/app/guides/window-furnishings-northern-growth-corridor/page.tsx — net-new northern corridor pillar with multigenerational + pooja-room cultural framing; estates Aurora, Lyndarum, Cloverton, Olivine, Mickleham Rises, Mandalay, Greenvale Gardens",
      "src/app/guides/window-furnishings-western-growth-corridor/page.tsx — net-new western corridor pillar with wind-exposure and multicultural community framing; estates Riverdale, Habitat, Newgate, Newhaven, Bloomdale, Atherstone, Taylors Run, Aspect",
      "src/components/WovenQuestion.tsx — net-new client component. IntersectionObserver-driven question event firing. Once-per-session guarantees via sessionStorage. Exit dwell on pagehide + unmount.",
      "src/app/guides/new-build-window-furnishings-not-included/page.tsx — retrofitted with WovenQuestion wrapping 5 prose sections (q-builder-contracts-window-furnishings, q-builder-allowance-what-it-buys, q-new-build-realistic-budget, q-when-during-build-to-start, q-how-to-handle-builder-allowance). Smoke test of the instrumentation; broader rollout follows.",
      "src/lib/dashboard/growth-corridor-metrics.ts — extended with loadScrollDepthRows (panel 4), loadQuestionEngagementRows (panel 3), loadAiCitations (panel 5). All have graceful fallback when underlying tables/events are missing.",
      "src/app/dashboard/(with-sidebar)/growth-corridors/page.tsx — extended with three new panel sections (CorridorQuestionTable, CorridorScrollDepthTable, CorridorAiCitationsTable) and appropriate empty states.",
      "Quality gates: tsc clean, eslint clean, npm run build clean, local prod-mode smoke confirmed 200 + content + schema + new dashboard panels rendering.",
    ],
    affectsGrowthCorridor: true,
  },
  {
    id: "2026-05-27-growth-corridor-template-rollout",
    title: "Growth Corridor rollout — 11 suburb pages + 9 product pages in woven style",
    releasedAt: "2026-05-27T16:30:00Z",
    summary:
      "Full template rollout following sign-off on the Clyde North suburb and blockout roller pilot templates. All 11 remaining growth-corridor suburbs (Clyde, Officer, Officer South, Wollert, Donnybrook, Beveridge, Mickleham, Greenvale, Tarneit, Deanside, Fraser Rise) now run on the woven content style with corridor-aware framing, suburb-genuinely-unique micro-notes, named estates per suburb, FAQPage schema, LocalBusinessSchema, and PageViewTracker tagged `page_variant: woven_pilot` so the dashboard can isolate cohort engagement from the legacy template traffic. 9 product pages with confirmed pricing data (sheer curtains, blockout curtains, timber/polymer/aluminium plantation shutters, roller shutters, zipscreens, awnings, motorisation) rewritten in the same woven prose style with indicative pricing wired through to /pricing-policy and FAQPage JSON-LD schema. The 9 product pages awaiting pricing data (translucent curtains, sunscreen rollers, double rollers, roman, venetian, vertical, honeycomb, security doors, fixed fly screens) remain on the legacy ProductTemplate until pricing is supplied.",
    items: [
      "src/components/WovenSuburbPage.tsx — shared composition component for the 12 growth-corridor suburb pages. Takes suburb-specific props (estates, micro-note, nearby, FAQs) and composes corridor-aware shared framing. Avoids the thin-content trap by mandating unique entity density per suburb.",
      "11 new static-segment suburb override pages: /locations/clyde, /officer, /officer-south, /wollert, /donnybrook, /beveridge, /mickleham, /greenvale, /tarneit, /deanside, /fraser-rise. Each with hero, micro-note, named estates, FAQPage schema (suburb-named + corridor-shared questions), LocalBusinessSchema, PageViewTracker.",
      "src/app/locations/[suburb]/page.tsx — STATIC_OVERRIDE_SLUGS extended to filter all 12 growth-corridor slugs from the dynamic generateStaticParams.",
      "9 product page rewrites with confirmed pricing: /curtains/sheer (~$3,000-$4,000 whole house), /curtains/blockout ($600-$2,000 per bedroom layered), /shutters/plantation-shutters/{timber,polymer,aluminium} ($100-$1,000 per window, ~$299/sqm avg), /shutters/roller-shutters ($500-$1,200 per window), /awnings/zipscreens ($1,500-$2,500), /awnings ($2,500-$4,000 folding-arm), /motorisation ($180-$280 retrofit).",
      "All 20 pages composed in MCB-only voice, woven prose (FAQPage schema invisible in JSON-LD), PrimaryCTA per CLAUDE.md, indicative pricing wired to /pricing-policy.",
      "Quality gates: tsc clean, eslint --max-warnings 0 clean, npm run build clean, local prod-mode smoke confirmed 200 + schema markers + key entity names on all 20 URLs.",
    ],
    affectsGrowthCorridor: true,
  },
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
    id: "2026-05-26-lead-session-attribution",
    title: "Lead attribution: session_id on lead_submissions + view rewire",
    releasedAt: "2026-05-26T14:45:00Z",
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
    id: "2026-05-26-ai-content-engine-v1-dry-run",
    title: "AI Content Engine v1 — first batch shipped (3 inline answers on plantation-shutters)",
    releasedAt: "2026-05-26T14:15:00Z",
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
    id: "2026-05-26-sentence-case-typography",
    title: "Typography: drop site-wide text-transform: capitalize",
    releasedAt: "2026-05-26T14:00:00Z",
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
