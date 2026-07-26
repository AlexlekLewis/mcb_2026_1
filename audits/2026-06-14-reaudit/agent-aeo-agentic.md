# MCB AEO / GEO RE-AUDIT — Agentic & Answer-Engine Readiness

**Date:** 2026-06-24
**Baseline:** `audits/2026-06-14-growth-audit/agent-aeo-agentic.md` (grade **C+**)
**Scope:** Verify Sprint 1's review-schema scoping in PROD; re-build the schema-coverage matrix; restate still-open AEO items; flag new issues. Read-only, evidence-based.
**Method:** Read repo source (commit `039d63e` "Sprint 1 growth-audit fixes") + fetched live SSR HTML via `curl` with a desktop UA (raw markup, since markdown-converting fetchers strip `<script type="application/ld+json">`). All live URLs returned HTTP 200.

---

## 1. Review-schema scoping verification — **PASS ✅**

Sprint 1's single big AEO change is **confirmed live and working as designed**. The `AggregateRating`/`Review` block was removed from the global `OrganizationSchema` and now ships only on the homepage via `OrganizationReviewSchema` (same `@id`, so Google still merges it into one business entity).

| Page (live URL) | AggregateRating | `Review` nodes | `reviewCount:47` | Verdict |
|---|---|---|---|---|
| Home `/` | **present** | **6** | **present** | ✅ rating lives here only |
| Category `/blinds` | 0 | 0 | 0 | ✅ spam gone |
| Product `/blinds/honeycomb-blinds` | 0 | 0 | 0 | ✅ spam gone |
| Suburb `/locations/tarneit` | 0 | 0 | 0 | ✅ spam gone |
| Guide `/guides/…northern-growth-corridor` | 0 | 0 | 0 | ✅ spam gone |
| Doorway `/locations/tarneit/roller-blinds` | 0 | 0 | 0 | ✅ spam gone (+ `noindex,follow`) |

**Evidence (code):** `RichSchema.tsx:55-61` — `OrganizationSchema` (mounted globally at `layout.tsx:85`) now carries an explicit comment and **no** rating/review keys. `RichSchema.tsx:80-110` — new `OrganizationReviewSchema` carries the rating + 6 reviews and is mounted **only** at `src/app/page.tsx:28` (homepage). Shared `@id` = `SITE.url` on both nodes.
**Evidence (prod):** homepage raw HTML returns `"@type":"AggregateRating"`, `ratingValue":"5.0"`, `reviewCount":47`, and 6× `"@type":"Review"`; every other page type returns **0** of each. The ~33k-URL identical-rating spam pattern (baseline P0) is eliminated.

**FAQPage — still present and clean (PASS).** Money pages still emit valid `FAQPage` JSON-LD AND render the Q&A as visible DOM text:
- `/blinds`, `/blinds/honeycomb-blinds`, `/locations/tarneit`, the guides, and `/shutters/plantation-shutters` all return `FAQPage` schema.
- Stripping `<script>` blocks from `/blinds/honeycomb-blinds`, the schema question *"Are honeycomb blinds good for insulation?"* still appears in the visible HTML (inside an `aria-expanded` accordion) — so schema == on-page content. No FAQ schema spam.

**Caveat (unchanged, still open):** the homepage review markup is now correctly *scoped*, but the 6 reviews are still **schema-only** — the visible "reviews" section remains the Elfsight Google-reviews iframe, not the 6 hardcoded `CURATED_REVIEWS`. The baseline's underlying Google "review snippet must be visible on the page" policy concern is therefore **reduced in blast radius (1 page, not 33k) but not resolved**. The "render visibly vs strip" decision was explicitly deferred (documented at `RichSchema.tsx:76-78`).

---

## 2. Schema coverage matrix (current live HTML)

| Page type (live URL) | Org / HomeAndConstructionBusiness | AggregateRating + Review | FAQPage | LocalBusiness | Service | Product + Offer/price | BreadcrumbList | Article | Canonical |
|---|---|---|---|---|---|---|---|---|---|
| Home `/` | ✅ | ✅ scoped here (schema-only display) | ✅ displayed | — | — | ❌ | ❌ | — | ✅ **now present** |
| Category `/blinds` | ✅ (global) | ✅ removed | ✅ displayed | — | — | ❌ | ❌ | ✅ **now present** |
| Product `/blinds/honeycomb-blinds` | ✅ (global) | ✅ removed | ✅ displayed | — | — | ❌ **gap** | ❌ **gap** | ✅ |
| Suburb `/locations/tarneit` | ✅ (global) | ✅ removed | ✅ | ✅ (no rating — correct) | — | ❌ | ❌ | ✅ |
| Suburb×product `/locations/[s]/[p]` | ✅ (global) | ✅ removed | (varies) | ✅ (Service.provider) | ✅ | ❌ | ❌ | ✅ + `noindex,follow` |
| Guide `/guides/…growth-corridor` | ✅ (global) | ✅ removed | ✅ | — | — | ❌ | ❌ **gap** | ✅ |
| Quote `/quote` | ✅ | — | — | — | ✅ (free-measure Service+Offer) | n/a (price:0) | ❌ | ✅ |

Legend: ✅ present/correct · ❌ missing · — not expected. (`HomeAndConstructionBusiness` shows a count of 2 in raw grep on every page = the JSON-LD node + its RSC-escaped copy; one logical node.)

**Net change vs baseline:** the entire `AggregateRating + Review` column flipped from "⚠️ inherited 47 everywhere" to "✅ scoped to home / removed elsewhere," and the `Canonical` column flipped from "❌ missing" on Home and `/blinds` to "✅ present." Everything else is unchanged.

---

## 3. Still-open AEO items (re-verified 2026-06-24)

| # | Item | Status | Current evidence |
|---|---|---|---|
| A | **No `Product`/`Offer`/`priceSpecification` on product pages** | **OPEN** | `/blinds/honeycomb-blinds` @types = HomeAndConstructionBusiness + FAQPage only; `"@type":"Product"` = 0. Source grep for `priceCurrency` hits only the `/quote` free-measure `Offer` (`RichSchema.tsx:155`), not products. Indicative prices remain prose-only → engines must scrape and will hedge. **Highest citability miss.** |
| B | **No `BreadcrumbList`; `Breadcrumbs.tsx` still dead code** | **OPEN** | `BreadcrumbList` = 0 on every live page. `grep` for `<Breadcrumbs`/import across `src/app`+`src/components` = 0 usages; the component file exists but is never mounted. |
| C | **Guides have no `Article`/`BlogPosting`; no datePublished/dateModified/author** | **OPEN** | Guide live @types = FAQPage + global Org only; `Article`/`BlogPosting` = 0. Source grep for `Article`/`BlogPosting`/`ArticleSchema` = none. |
| D | **`InlineAnswer` (BLUF answer + freshness + anchors + 1:1 FAQ) on 1 page only** | **OPEN** | Source grep: only `src/app/shutters/plantation-shutters/page.tsx`. Live `/shutters/plantation-shutters` shows 2 "Updated" freshness markers; `/blinds/honeycomb-blinds` shows 0. The best GEO asset in the codebase is still on a single page. |
| E | **robots.txt has no AI-bot rules while llms.txt claims it does** | **OPEN** | Live `/robots.txt` = `User-Agent: *` only (no `GPTBot`/`ClaudeBot`/`PerplexityBot`/`Google-Extended`/`CCBot`/`OAI-SearchBot`). Source `src/app/robots.ts:6-13` confirms wildcard only. llms.txt still asserts *"Specific bot rules in /robots.txt. Honour those."* — a **verifiable falsehood** in an AI-facing manifest. |
| F | **`sameAs` lists only the GBP maps link — no FB/IG** | **OPEN** | Live home `"sameAs":["https://maps.app.goo.gl/zRBNX1LBoTc2DK2g9"]`; `RichSchema.tsx:52-54` unchanged. Weakens entity disambiguation. (MCB's own social profiles are policy-allowed and are exactly what `sameAs` is for.) |
| G | **llms.txt / llms-full.txt use apex host, not the canonical `www`** | **OPEN** | Live `/llms.txt` Website = `https://moderncurtainsandblinds.com.au` (apex) throughout; `/llms-full.txt` = 7 apex mentions, 0 `www`. Live canonicals/sitemap/og:url all use `www`. Apex 307→www. Citations may split across hosts. |
| H | **llms-full.txt thin on money topics — no pricing numbers** | **OPEN** | Live `/llms-full.txt` (80 lines) contains **0** `$` price figures, while on-site guides publish concrete ranges. Engines will cite the vaguer source. |
| I | **`JsonLd.tsx` dead duplicate `HomeAndConstructionBusiness`** | **OPEN** | Unused component still present (0 `<JsonLd` usages); only the rich `RichSchema` ships. Low-risk cleanup; invites future double-emission. |
| J | **Suburb `LocalBusiness` uses the suburb's locality as the business address** | **OPEN (mitigated)** | `RichSchema.tsx:209-215` still sets `addressLocality: suburb.name` for a Preston-based business. Blast radius now far smaller — most suburb×product doorways are `noindex` (Sprint 1), and indexable suburb hubs are a curated ~20–32. Still technically a per-suburb implied address. |

### Resolved since baseline ✅
- **R1 — Site-wide AggregateRating spam (was P0):** removed from global Org; scoped to homepage. Verified across 6 page types (Section 1).
- **R2 — Missing self-canonical on Home and `/blinds` (was P2):** both now emit `<link rel="canonical">` (`src/app/page.tsx:21`, `src/app/blinds/page.tsx` metadata). Live-verified.
- **R3 — Doorway-tier bloat (adjacent, from technical-SEO sprint):** `/locations/[suburb]/[product]` now serves `noindex, follow` and is de-sitemapped (sitemap 33,321 → ~89 URLs). Live-verified on `/locations/tarneit/roller-blinds`.

---

## 4. New issues flagged this re-audit

| Severity | New finding | Evidence | Note |
|---|---|---|---|
| **P2 (new framing)** | **Homepage review snippet is now an isolated, un-displayed schema island.** Pre-Sprint-1 the "schema-only reviews" problem was diffuse across 33k URLs; now it is concentrated on the single highest-value page (the homepage) with no visible 1:1 review text (Elfsight iframe ≠ the 6 `CURATED_REVIEWS`). This is *better* for the spam signal but means the remaining Google "reviews must be visible" policy exposure is squarely on the page Google scrutinises most. | Home raw HTML: `AggregateRating` + 6 `Review` in `<script>`; visible reviews = `elfsight-app-…` iframe. `RichSchema.tsx:76-78` documents the deferral. | Decision still owed: render the 6 reviews as visible HTML on the homepage (1:1 with schema) **or** strip the rating/review node entirely and lean on GBP `sameAs`. |
| **P3 (new)** | **Homepage canonical is host-bare (no trailing slash, no path).** Live canonical = `https://www.moderncurtainsandblinds.com.au` (no trailing `/`). Functionally fine and self-consistent, but worth a glance that it matches the form used in the sitemap entry for `/` to avoid a trivial canonical/sitemap string mismatch. | Live home `<link rel="canonical" href="https://www.moderncurtainsandblinds.com.au"/>`. | Cosmetic; verify sitemap home entry uses the identical string. |

No regressions found. The Sprint 1 change introduced no new schema errors, broke no existing valid schema, and the `noindex` doorway change did not accidentally `noindex` any money page (spot-checked `/blinds`, product, indexable suburb, guide — all index-able).

---

## 5. Updated grade

**B− (up from C+).**

Rationale: Sprint 1 cleanly removed the single worst AEO liability — identical review-schema spam on ~33k URLs plus the manual-action risk it carried at scale — and added the missing self-canonicals, verified live. That is a real, correctly-scoped, low-regression fix and lifts the grade a notch. It does **not** reach B/B+ because the highest-*upside* citability work is still entirely undone: no `Product`/`Offer` price schema (MCB's stated AI-price-capture play), no `BreadcrumbList` (built but dead), no `Article` schema on the guides, and the best GEO component (`InlineAnswer`) is on 1 of 50+ money pages. The llms.txt↔robots.txt false claim and apex/www host split are still live trust nicks. And the deferred reviews-visible decision now sits on the homepage specifically.

---

## 6. Top 3 AEO priorities (post-Sprint-1)

1. **Ship `Product`/`Service` price schema + mount `BreadcrumbList` (P1, highest upside).** Add `Product` (or `Service`) with `offers`/`priceSpecification` (`minPrice`/`maxPrice`, `priceCurrency:"AUD"`) + a protective T&C `description` (baseline spec, on-site measure required, refresh date) to product/guide money pages, fed from the same indicative-range constants — this is the only way MCB's prose price ranges become directly-citable facts. In the same sprint, mount the already-built `<Breadcrumbs>` in the category/product/guide layouts so every deep URL carries path-context `BreadcrumbList`. Both are low-regression, high-leverage, and directly serve the documented AI-price-capture strategy.

2. **Scale the answer-first layer + add `Article` schema (P1).** Roll `InlineAnswer` (BLUF answer + `Updated <month>` freshness + deep-link anchors + 1:1 FAQ) from its single live page into `ProductTemplate` and the guide template, seeded from each page's existing FAQ array (no net-new copy needed). Add `Article`/`BlogPosting` schema (headline, author = MCB / Deane & Dee, `datePublished`, `dateModified`, `about`, `mainEntityOfPage`) to the 7 guides — they are the strongest citable long-form and currently carry only FAQPage.

3. **Close the AI-trust gaps + decide the homepage reviews (P2/trust).** (a) Reconcile llms.txt with reality — either add the named AI-bot `Allow` blocks to `robots.ts` or delete the false *"Specific bot rules in /robots.txt. Honour those."* sentence; (b) switch both `.txt` files to the `www` host and add concrete pricing-with-T&Cs to llms-full.txt so engines cite one host and the richer numbers; (c) add MCB's own FB/IG to `sameAs`; and (d) make the now-isolated homepage decision: render the 6 curated reviews as visible HTML (1:1 with schema) or strip the rating/review node. All are low-effort and remove verifiable-falsehood / policy-exposure signals.
