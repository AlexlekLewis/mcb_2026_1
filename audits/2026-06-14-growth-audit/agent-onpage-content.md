# MCB On-Page SEO & Content Audit — 2026-06-14

Auditor: senior on-page SEO & content strategist (read-only).
Scope: thin/duplicate content on the 693 templated suburb pages + suburb-product pages, titles/meta, headings, content depth on money pages, internal linking, alt text, cannibalization, freshness.
Method: read templates + content sources in `/src`, fetched live pages and curled raw HTML for head tags. Page counts computed from data files.

**Headline numbers**
- 693 suburb pages (`/locations/[suburb]`) — 12 are genuinely unique (woven growth-corridor template), **681 are thin region-templated**.
- 681 × 49 products = **~33,369 suburb-product pages** with near-zero unique prose. Total location URLs in the sitemap ≈ **34,650**, all `index,follow`.
- 9 region content blocks feed ~681 suburbs → on average **~75 suburbs share one set of 4 paragraphs**.

---

## Findings table

| Sev | Finding | Evidence | Fix | Impact × Effort |
|---|---|---|---|---|
| **P0** | **~33,369 suburb-product pages are doorway-grade thin content**: zero unique long-form prose, all indexable + in sitemap. Body = `product.description` + `product.localIntent` + boilerplate with suburb/product names swapped. ~60–70 unique words/page. | Template `src/app/locations/[suburb]/[product]/page.tsx:112-260` — all copy from `LOCATION_PRODUCTS` fields, no per-suburb prose. Live `/locations/reservoir/roller-blinds`: only unique sentences are the product one-liner + "We compare blockout, sunscreen…". Sitemap includes every pair: `src/app/sitemap.ts:102-109`. | Noindex (or remove from sitemap + `robots`) the entire `[suburb]/[product]` tier; keep only the 12 corridor suburbs' product pages if any are individually written. Consolidate intent into the category/product pages + the suburb hub. | Impact: High · Effort: Low |
| **P0** | **681 templated suburb pages are near-duplicate** — only 4 region paragraphs (+1 swapped opener sentence) differentiate ~75 suburbs each. Same architecture/light/product claims repeat verbatim across a whole region. | `src/lib/region-content.ts:87-186` (9 region blocks) + `getSuburbContent` swaps one opening sentence only (`:194-215`). Live `/locations/reservoir` vs any other northern suburb = byte-identical body after the suburb name. | Either (a) write genuinely unique ≥150-word micro-notes per retained suburb (the woven pattern already exists in `WovenSuburbPage.tsx`), or (b) keep ~20–40 priority suburbs indexable and noindex the long tail, or (c) collapse to region hubs. | Impact: High · Effort: Med |
| **P0** | **Region copy is geographically wrong for inner-north suburbs** — bearing-bucketing misassigns suburbs. Thornbury (adjacent to Preston, due north) is served "north-east"/Eltham mud-brick copy. Factually incorrect = trust + AI-citation risk. | `src/lib/region-content.ts:45-74` buckets purely by compass bearing from CBD. Live `/locations/thornbury` H1 "Curtains and Blinds Thornbury" + body "Mud-brick and timber Eltham-style homes… raked ceilings". Thornbury 3071 is an inner-north terrace/bungalow suburb. | Add manual region overrides for inner-north/border suburbs, or widen the inner radius. Audit all 681 for bearing mis-bucketing. | Impact: High · Effort: Low |
| **P1** | **Doubled title-template suffix** — pages that hard-code "\| Modern Curtains and Blinds" get it appended again by the layout template. | Live `/locations/clyde-north` title (96 chars): `…Clyde North 3978 \| Modern Curtains and Blinds \| Modern Curtains and Blinds`. Same on `/guides/new-build…` (105 chars). Layout suffix: `src/app/layout.tsx:23` `template: "%s \| Modern Curtains and Blinds"`. The 12 woven suburb pages + guides set their own full title. | Strip the suffix from page-level titles (let the template add it once). | Impact: Med · Effort: Low |
| **P1** | **6 guides (1,800–2,500 words each) are not in the sitemap and have no index page** — under-discovered, weak crawl path. Only reachable from ~5 deep product subpages + corridor pages; not from the 6 main category hubs, homepage, nav, or footer. | No `src/app/guides/page.tsx`; `src/app/sitemap.ts` has 0 "guides" entries; Navbar/Footer have no guides link. Inbound links only from `curtains/blockout`, `curtains/sheer`, `blinds/roller-blinds/blockout`, `shutters/roller-shutters`, `awnings/zipscreens`, `WovenSuburbPage`. | Add guides to sitemap, build a `/guides` index, link guides from the matching category hubs + footer. | Impact: Med-High · Effort: Low |
| **P1** | **Category-hub titles + several meta descriptions exceed render limits.** | Live: `/curtains` title 98 chars, `/blinds` title 105 chars; meta descriptions `/blinds` 233, `/locations/clyde-north` 233, `/guides/new-build…` 243 (display ~155–160). | Tighten titles to ≤60 incl. brand; trim descriptions to ≤155. | Impact: Med · Effort: Low |
| **P2** | **Suburb-page body prose renders inside `<h2>`** — the region paragraph is set as the intro `<h2>`, so 60–80 words of sentence copy become a heading. Heading-misuse signal, repeated across 681 pages. | `src/components/ProductTemplate.tsx:274-279` wraps `description` in `<h2>`. On suburb pages `description = regionalAngle + localTrustSignal` (`src/app/locations/[suburb]/page.tsx:151`). | Render the long description as `<p>`; reserve `<h2>` for a short section heading. | Impact: Med · Effort: Low |
| **P2** | **Generic/keyword templated alt text.** Hero alt = page title; type-card alt = card title. On suburb pages hero alt = "Curtains and Blinds {Suburb}" not a description of the image. No alts are *missing* (good), but quality is low and uniform across 700+ pages. | `ProductTemplate.tsx:194` `alt={title}`, `:320` `alt={type.title}`; product page `:73` is descriptive (good). | Author descriptive alts per image (material, room, finish). | Impact: Low-Med · Effort: Med |
| **P2** | **Homepage H1 is a brand slogan, not intent-matched** — "Made for your home. Made in Melbourne." carries no head-term keyword. | Live `/` H1; `src/app/page.tsx`. Title tag is well-optimised (66 chars) so partial mitigation. | Add a keyword-bearing visible H1 or strengthen the sub-headline (e.g. "Custom curtains, blinds & shutters, Melbourne"). | Impact: Low-Med · Effort: Low |
| **P2** | **Third-party Elfsight Google-reviews widget embeds on every ProductTemplate money page** (render-blocking script + its own `<h2>`). Borderline vs the "no third-party reviews on-site" positioning rule — these are MCB's own Google reviews, so likely acceptable, but it's an external embed with an H2 competing on every category/suburb page. | `src/components/GoogleReviewsWidget.tsx:48-58` (Elfsight `platform.js`), rendered at `ProductTemplate.tsx:257`. | Confirm this is intended under the positioning rule; if kept, consider lazy-loading below the fold (already `lazyOnload`) and demoting the heading. | Impact: Low · Effort: Low |
| **P3** | **Minor internal-cannibalization risk** between corridor *guides* and corridor *suburb pages* (both target "window furnishings {corridor} growth corridor"). Currently managed by distinct intent (guide = informational, suburb = local), but watch overlap. | `src/app/guides/window-furnishings-*-growth-corridor` vs `WovenSuburbPage` corridor prose. | Keep guides informational + cross-link down to suburb pages; ensure suburb pages don't repeat the guide's H2s verbatim. | Impact: Low · Effort: Low |

**Verified non-issues (don't fix):** legacy `/products/[slug]` 301-redirects to richer category pages where one exists (`src/app/products/[slug]/page.tsx:45-54`, `product-canonicals.ts`) — clean cannibalization hygiene. Sitemap `lastModified` is pinned to constants, not `new Date()` (`sitemap.ts:11-13`) — correctly avoids content-farm freshness. Exactly one H1 per page on every type sampled. Self-referential canonicals present on location pages. No stale "2024/2025" freshness dates (the two hits are descriptive prose "a 2024 two-storey" and a coordinate `145.202499`).

---

## Thin-content verdict on the 693 suburb pages

**Verdict: a two-tier system. 12 pages are genuinely strong; ~681 are thin/spun and the ~33k suburb-PRODUCT pages are doorway-grade. This is the site's single biggest on-page liability.**

### Tier 1 — the 12 woven growth-corridor suburbs: genuinely unique (keep)
`clyde-north, clyde, officer, officer-south, wollert, donnybrook, beveridge, mickleham, greenvale, tarneit, deanside, fraser-rise` (`STATIC_OVERRIDE_SLUGS`, `src/app/locations/[suburb]/page.tsx:26-42`) render via `WovenSuburbPage.tsx`. These carry corridor-shared substance + a suburb-unique micro-note + real estate names.

Live `/locations/clyde-north` (~1,200 words), genuinely local:
> "We fit curtains, blinds and shutters across the Clyde North growth corridor every week — from the new releases at **Smiths Lane and Eliston** through **Five Farms, Arcadia, Timbertop, Orana, Kaduna Park and Arbourwood**."
> "**Smiths Lane and Five Farms** in particular restrict what external treatments can sit on the front of the house."

This is the standard the rest of the estate should be held to. The architecture (`microNote` + `nearbyEstates` props, `WovenSuburbPage.tsx:44-66`) already exists to scale it.

### Tier 2 — the ~681 region-templated suburbs: thin and spun (the doorway risk)
Each pulls one of **9** region blocks from `region-content.ts`. `getSuburbContent` swaps only the **first sentence** via a hash-seeded opener (`:194-215`). So ~75 suburbs in a region are byte-identical after the suburb name.

Same-region duplication, live, verbatim:
- `/locations/reservoir` (north): *"The northern suburbs are the part of Melbourne we know best. From the Californian bungalows and weatherboard workers' cottages around Preston, Thornbury and Reservoir through to the brick-veneer family homes of Bundoora and Mill Park…"*
- Every other "north"-bucketed suburb (Bundoora, Mill Park, Lalor, Epping…) gets the **same paragraph**, only the opening sentence rotating among 3 variants.

And it's not just thin — it's **factually wrong** where bearing-bucketing misfires:
- `/locations/thornbury` H1 "Curtains and Blinds Thornbury" but body = *"Mud-brick and timber Eltham-style homes… raked ceilings and tall reveals."* Thornbury (3071) is an inner-north bungalow/terrace suburb beside Preston; the algorithm bucketed it "north-east" by compass bearing (`region-content.ts:45-74`). Wrong housing stock = AI-search and trust risk.

### Tier 3 — the ~33k suburb-PRODUCT pages: even thinner, fully indexable (the worst exposure)
`/locations/[suburb]/[product]` has **no per-suburb prose at all** — it's `product.description` + `product.localIntent` + fixed scaffolding with two names swapped (`src/app/locations/[suburb]/[product]/page.tsx:112-260`).

Live `/locations/reservoir/roller-blinds`, the *only* non-boilerplate sentences on the whole page:
> "Roller blinds for a clean, compact and practical window finish."
> "We compare blockout, sunscreen, translucent and double roller options in your home."

Everything else ("We check the opening, fixing points…", "Compare fabrics, mesh…", "You get advice, measurements and pricing…") is identical on all ~33k pages. These are in the sitemap (`sitemap.ts:102-109`) and `index,follow` (confirmed live). **This is the textbook Google doorway-pages pattern at ~33k-URL scale** and is the most likely single drag on the domain's quality signals.

**Recommendation:** noindex/de-sitemap the entire `[suburb]/[product]` tier immediately; for the suburb hubs, promote ~20–40 priority suburbs to the woven template and noindex the long tail. CLAUDE.md already warns about exactly this ("do NOT add another templated mass-page system without genuinely unique copy") — the existing tail predates that discipline and should be retired, not extended.

---

## Details on other P0/P1s

**Doubled title suffix (P1).** `layout.tsx:23` sets `template: "%s | Modern Curtains and Blinds"`. Pages that *also* hard-code the brand in their own `title` string (the 12 woven suburb pages and the 6 guides) get it twice. Live proof: Clyde North = `…Clyde North 3978 | Modern Curtains and Blinds | Modern Curtains and Blinds` (96 chars, truncates in SERP). Category hubs and templated suburb pages are fine because they don't hard-code the brand — fix is to make the woven/guide titles consistent with that convention.

**Guides orphaned from crawl/sitemap (P1).** Six substantial, on-brand guides (covenant/external treatments, pooja-room blackout, new-build inclusions, 3 corridor guides) — 1,800–2,500 words each — are not in `sitemap.ts`, have no `/guides` index, and aren't in nav/footer. Inbound links come only from a handful of deep product subpages and the woven suburb pages. They are MCB's best informational/AEO assets and are under-leveraged. Add to sitemap, build an index, and link each guide from its matching category hub (e.g. the new-build guide from `/curtains`, `/blinds`, `/shutters`; the covenant guide from `/shutters/roller-shutters` and `/awnings/zipscreens` — already done for those two).

**Category-hub money pages — depth is good, titles/meta need trimming (P1).** The 6 hubs and the dedicated product subpages (`/curtains/sheer`, `/blinds/roller-blinds`, etc.) carry hand-written, genuinely unique copy: decision guides, comparison tables, type breakdowns, woven FAQ + FAQPage JSON-LD, in MCB's tone. These are not thin. The only fixes are over-length titles (`/blinds` 105 chars) and meta descriptions (`/blinds` 233, etc.).

---

## What's already good

- **Money pages have real depth.** Category hubs + product subpages have unique, useful, on-tone copy (decision guides, comparison tables, woven FAQs) — they can rank and convert. No thin-content problem on the commercial core.
- **FAQ-as-prose + FAQPage JSON-LD** implemented as intended (`ProductTemplate.tsx:155-173`); buyer questions woven into copy, schema doing the AI-search capture invisibly.
- **Legacy `/products/*` cannibalization solved** with 301s to the stronger category pages (`product-canonicals.ts` + `products/[slug]/page.tsx:45-54`).
- **Sitemap freshness discipline** — dates pinned to constants, not `new Date()`, avoiding a content-farm signal across 600+ URLs.
- **Exactly one H1 per page** across every template sampled; self-referential canonicals on location pages.
- **Alt text present on all images** (no missing alts) — only the *quality* is templated.
- **The woven growth-corridor pages are genuinely excellent** — the right model and infrastructure already exist to fix the thin tail; it's a content/rollout problem, not an engineering one.

---

## Top 3 on-page priorities

1. **Kill the doorway tier.** Noindex + remove from sitemap the ~33k `/locations/[suburb]/[product]` pages (and noindex the ~681 region-templated suburb hubs beyond a priority shortlist). This is low-effort, high-impact, and directly removes the largest quality-signal drag on the domain. — `sitemap.ts:95-109`, add `robots: { index:false }` to both location templates' `generateMetadata`.
2. **Fix the region copy: accuracy + uniqueness.** Correct the bearing mis-bucketing (Thornbury et al. served wrong-region copy) with manual overrides, and promote ~20–40 priority suburbs to the existing `WovenSuburbPage` template with real ≥150-word micro-notes + estate names. Hold every retained suburb page to the Clyde North standard. — `region-content.ts:45-74`, `WovenSuburbPage.tsx`.
3. **Surface and connect the guides; tidy titles/meta.** Add the 6 guides to the sitemap, build a `/guides` index, and link each guide from its matching category hub + footer. In the same pass, strip the doubled brand suffix from woven/guide titles and trim over-length titles/descriptions. — `sitemap.ts`, new `app/guides/page.tsx`, `layout.tsx:23` convention, `WovenSuburbPage`/guide title strings.
