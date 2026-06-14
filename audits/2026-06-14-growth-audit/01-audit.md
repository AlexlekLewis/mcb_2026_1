# MCB Growth Audit — Phase 1: Consolidated Findings
_Date: 2026-06-14 · Mode: `--audit-only` · Five-lens expert team (technical SEO, performance/CWV, on-page/content, AEO/GEO, E-E-A-T/conversion)_

Source reports in this folder: `agent-technical-seo.md`, `agent-performance.md`, `agent-onpage-content.md`, `agent-aeo-agentic.md`, `agent-eeat-conversion.md`.

---

## Executive summary — the honest picture

The **build quality is genuinely high**: clean Next.js 16 architecture, dashboard libs correctly kept off marketing routes, brotli + edge-cached prerenders, legitimate FAQ-as-prose + FAQPage schema, strong CTA system, well-structured `llms.txt`. The site is fast over the wire (homepage = **19.5 KB brotli, ~120 ms TTFB** — my Phase-0 "154 KB/1s" lead was the *uncompressed* figure; corrected).

But the site is carrying **one structural liability that caps everything else**, plus a cluster of **Google-policy and trust risks** that are cheap to fix:

1. **A ~33,000-URL doorway tier** (suburb × product templated pages) — indexed, sitemapped, near-zero unique content — on a site that sees ~92 humans/month. This is the textbook doorway-page pattern at scale and is almost certainly suppressing the whole domain's quality signal. **This is the headline.**
2. **Review schema that violates Google's policy** — a `5.0/47` AggregateRating + 6 Reviews that are *real* (from the GBP) but exist only in JSON-LD (the visible reviews are a broken Elfsight embed), and worse, are **injected identically on all ~33k URLs**. Manual-action risk + schema spam.
3. **The owners (Deane & Dee) are invisible on-page**, and the **pricing the policy promises is shown nowhere** — two self-inflicted E-E-A-T / conversion holes.

Net: this is **not** a "rebuild" — it's a **prune + legitimise + surface** job. The highest-ROI work is *removing and correcting*, not adding. Most of the critical fixes are low-effort.

### Scorecard

| Lens | Grade | One-line |
|---|---|---|
| Technical SEO | 🟠 C+ | Solid foundations, but 33k-URL sitemap bloat + missing canonicals on money pages |
| Performance / CWV | 🟢 B+ | Fast over the wire; hero JPEG-sequence (6.5 MB) + Framer-Motion-on-every-page are the only real risks |
| On-page / Content | 🔴 C− | Money pages are strong; the templated location tier is doorway-grade and drags everything |
| AEO / GEO / Agentic | 🟠 C+ | Best-in-class `llms.txt` + clean FAQ schema, undercut by the review-schema violation, no Product/price schema, no breadcrumbs |
| E-E-A-T / Conversion | 🟠 B− | Strong CTAs & quote UX; trust is asserted not shown (no owner identity, invisible reviews, no NAP/price) |

---

## Prioritised findings (consolidated, deduplicated)

Severity: **P0** = fix now (policy risk / caps growth) · **P1** = high ROI · **P2** = worthwhile · **P3** = polish.
"⚑" = independently flagged by ≥2 agents (high confidence).

### P0 — Critical

| # | Finding | Evidence | Fix | Imp×Eff |
|---|---|---|---|---|
| 1 ⚑ | **~33,000-URL doorway tier.** Live `/sitemap.xml` = **33,321 URLs / 6.9 MB**. ~33,264 `/locations/[suburb]/[product]` pages have ~60 unique words (product one-liner + suburb name); ~681 suburb hubs share just 9 region paragraphs. All `index,follow` + sitemapped. | live sitemap; `[suburb]/[product]/page.tsx`; `region-content.ts:87-215`; `sitemap.ts:102-109` | Noindex + remove from sitemap the suburb-product tier and thin suburb hubs; keep the 12 woven suburbs + a priority shortlist. Infra already exists (`WovenSuburbPage.tsx`). | H×M |
| 2 ⚑ | **Illegitimate review schema, site-wide.** `AggregateRating 5.0/47` + 6 `Review` are JSON-LD-only (visible reviews = broken Elfsight "Loading…" iframe). Real source `src/lib/customer-reviews.ts` (genuine GBP reviews) but **never rendered**. Google requires review snippets to reflect on-page content → manual-action risk. | live home JSON-LD; `OrganizationSchema` in `layout.tsx:83`; `customer-reviews.ts`; `GoogleReviewsWidget.tsx:43-58` | Server-render the curated reviews as visible HTML, **and** scope AggregateRating/Reviews to the homepage only. | H×L |
| 3 ⚑ | **Schema spam: identical AggregateRating on all ~33k URLs** via global `OrganizationSchema`. CLAUDE.md explicitly forbids this pattern. | `layout.tsx:83` mounts `OrganizationSchema` globally | Move review/rating markup out of the global layout onto the homepage only (same change as #2). | H×L |
| 4 | **Region copy is geographically wrong.** Bearing-bucketing bug serves e.g. Thornbury (inner-north bungalows) the north-east "Eltham mud-brick" paragraph. On a quality-positioned brand, factually wrong local copy is an E-E-A-T own-goal. | `region-content.ts:45-74`; live `/locations/thornbury` | Manual region overrides for priority suburbs; the noindex of the tail (#1) neutralises the rest. | M×M |

### P1 — High ROI

| # | Finding | Evidence | Fix | Imp×Eff |
|---|---|---|---|---|
| 5 ⚑ | **Canonical missing on ~38 indexable money pages** — homepage, all 6 category hubs, `/locations`, `/about`, `/contact`, ~24 product pages. Next only emits canonical when `alternates.canonical` is set. | live `/`, `/blinds` = no `<link rel=canonical>` | Add default self-referencing canonical (root `generateMetadata` helper) + per-page where templated. | H×M |
| 6 ⚑ | **`og:url` wrong site-wide** — pages without their own OpenGraph inherit root `url:'/'`, advertising the homepage as every page's OG URL. | `layout.tsx:29`; live `/blinds` og:url=home | Set per-page canonical/og:url via metadata helper. | M×L |
| 7 ⚑ | **Owners never named on-page.** "Deane & Dee" appear in their own reviews and email signature but have no bio/photo/identity anywhere. Biggest single E-E-A-T gap for a family business. | `/our-story`, `/about` live | Add named founder bios + real photos + years of experience. | H×M |
| 8 ⚑ | **Pricing contradiction.** `/pricing-policy` promises indicative pricing; **no product page shows any price** (`ProductTemplate` has no price field). Also blocks AEO price-citability. | `pricing-policy/page.tsx`; `ProductTemplate.tsx` (no price) | Ship indicative ranges **with the policy's protective T&Cs** + add `Product`/`Offer` (or `Service`) schema with min/max AUD. | H×M |
| 9 ⚑ | **6 strong guides (1.8–2.5k words) are stranded** — not in sitemap, no `/guides` index, not linked from category hubs, no `Article` schema. | no `guides/page.tsx`; 0 sitemap entries | Add to sitemap, build `/guides` index, link from hubs, add `Article`/`BlogPosting` schema. | M×M |
| 10 | **Hero = 48-frame JPEG scroll sequence**, 6.5 MB, frames bypass `next/image` (raw JPEG, `max-age=0` revalidated each load). LCP/INP risk + bandwidth. | `HeroScroll.tsx:97-121`; raw frame 143 KB jpeg | webp/avif + immutable cache + fewer frames, or use the existing `Curtains_Hero.mp4`. Add `fetchPriority="high"`. | M×M |
| 11 | **Framer Motion in the initial bundle on every page** (global Navbar/ChatWidget/StickyMobileCTA) → homepage JS ~254 KB brotli. | `layout.tsx:62-71`; chunk confirmed on `/` | `next/dynamic` the below-fold ChatWidget; `optimizePackageImports`; CSS for trivial motion. | M×M |
| 12 ⚑ | **Quote-form friction** — 3 extra *required* fields (projectStage, referral, bestContactTime) beyond the 5 essentials. | `QuoteForm.tsx:130-137` | Make them optional; unlock submit on suburb+product+name+phone+email. | M×L |
| 13 ⚑ | **`/api/quote` has no honeypot / rate-limit / CAPTCHA** (each POST = 2 emails + DB write + optimization run). Overlaps the open cost-security audit item. | `api/quote/route.ts` | Honeypot + min-fill-time + per-IP rate limit (zero human friction). | M×L |
| 14 | **No `BreadcrumbList` anywhere** — `Breadcrumbs.tsx` is dead code, never mounted. | grep: component unused | Mount breadcrumbs + emit `BreadcrumbList` (path context for deep URLs + SERP breadcrumbs). | M×L |
| 15 | **No AI-bot rules in `/robots.txt`** while `llms.txt` claims "specific bot rules in /robots.txt" — the claim is false/stale. | live `/robots.txt`; `public/llms.txt:51` | Decide policy (allow GPTBot/ClaudeBot/PerplexityBot/Google-Extended) and either add rules or fix the llms.txt claim. | M×L |
| 16 | **Redirect chain + temporary apex redirect.** `/curtains/velvet-curtains` →308→ `/curtains/velvet` →307→ `/curtains/theatre-velvet` (2 hops); apex→www is **307 (temporary)** not 308. | `next.config.ts:41-45`; live headers | Collapse to single 308; make apex→www 308; align `llms.txt`/`site.ts` to www + fix `/admin/`→`/dashboard/` in robots. | M×L |

### P2 / P3 — Worthwhile & polish

| Sev | Finding | Fix |
|---|---|---|
| P2 ⚑ | Payright finance banner is the literal top of every page, above the value prop — undercuts "quality, qualify-out price shoppers" positioning | Demote to a slim bar lower on the page |
| P2 | Category-hub titles/metas over length (`/blinds` title 105, desc 233 chars); doubled "… \| MCB \| MCB" suffix on woven/guide pages | Trim ≤60/≤155; strip brand from page-level titles |
| P2 | `InlineAnswer` answer-first block deployed on **1 page** (plantation-shutters) only | Roll out across money pages + guides |
| P2 | Optimized images served `max-age=0, must-revalidate`; avif not enabled; 37 MB dead raw hero frames in `public/` | `images.minimumCacheTTL`, add avif, delete dead frames |
| P2 | `sameAs` lists only GBP (no FB/IG); `llms-full.txt` thin on pricing; `.txt` files use apex host vs www canonicals | Add socials, add pricing-with-T&Cs block, switch host to www |
| P2 | No real street address / ABN in NAP anywhere (footer + contact say only "we come to you") | Add registered address / ABN for LocalBusiness completeness |
| P3 | `<html lang="en">` not `en-AU`; suburb body prose rendered inside `<h2>`; templated alt text; duplicate dead `JsonLd.tsx`/`Breadcrumbs.tsx`; `prefers-reduced-motion` honored in only 1 of 8 motion components | Housekeeping pass |
| P3 | Likely-dead footer social links; "read more reviews" points at the non-loading widget | Verify socials; fix link target |

---

## The big rock, explained

**Why the 33k tier caps everything:** Google evaluates site quality partly at the domain level. ~33,000 near-identical, thin, auto-generated location×product URLs is the canonical "doorway pages / scaled content abuse" signal (a documented spam policy). On a 92-human/month domain, this dilutes crawl budget and almost certainly drags the *good* pages (the 6 hubs + product subpages, which are genuinely strong) down with it. **Pruning the tier is the single highest-leverage SEO action available** — and it's a config/rollout change, not a rebuild.

The recommended shape: keep the **12 woven growth-corridor suburbs** (these are genuinely good — ~1,200 words, real street/estate names) + a **priority shortlist** of high-demand suburbs promoted to the woven template with correct local overrides; **noindex + de-sitemap everything else**, especially all suburb-product pages. This shrinks the sitemap from 33,321 to a few hundred high-quality URLs.

---

## Quick wins (high impact, low effort — bang these out first)

1. **Scope review/AggregateRating schema to the homepage** — fixes the policy risk *and* the 33k-URL spam in one tiny change (#2/#3).
2. **Server-render the real reviews** (already in `customer-reviews.ts`) so the schema is legitimate and humans actually see 5.0/47 (#2, #7-adjacent).
3. **Noindex the suburb-product tier + thin suburb hubs** (#1) — config-level, biggest SEO lever.
4. **Name Deane & Dee** with bios + photos on `/our-story` (#7).
5. **Default self-referencing canonical + og:url fix** via one metadata helper (#5/#6).
6. **Honeypot + make 3 form fields optional** (#12/#13).
7. **Hero: `fetchPriority`, `minimumCacheTTL`, enable avif, delete 37 MB dead frames** (~30 min) (#10/#P2).
8. **Collapse the velvet redirect chain + 308 the apex** (#16).

---

## What's already good (do NOT break)

- Dashboard libs (Recharts/Leaflet/Supabase) correctly **not** bundled on marketing routes.
- Brotli everywhere; immutable static JS/CSS; static prerender + edge cache HIT; `font-display: swap`; no CLS from fixed chrome.
- The **6 category hubs + product subpages have real, unique, converting depth** in MCB's tone; FAQ-as-prose + **legitimate** FAQPage JSON-LD; one H1/page; alts present on money pages.
- `llms.txt` / `llms-full.txt` live and well-structured; accurate Org entity + consistent NAP; per-suburb AggregateRating omission is *consciously* coded (only the global Org one spams).
- Sitemap `lastModified` pinned to constants (no content-farm freshness signal); legacy `/products/*` cleanly 301'd; Googlebot not blocked by middleware.
- Strong CTA system (`PrimaryCTA`), quote-page reassurance, and post-submit confirmation email.

---

## Recommended sequencing

- **Sprint 1 — "Stop the bleeding" (½ day, all low-effort):** #2, #3, #1 (noindex), #5/#6 canonical, #16 redirects. → removes policy risk + the doorway drag immediately.
- **Sprint 2 — "Show the trust" (1–2 days):** #7 owners, #2 reviews visible, #8 pricing + Product schema, #12/#13 form. → lifts conversion + E-E-A-T + citability.
- **Sprint 3 — "Surface & polish" (1–2 days):** #9 guides + Article schema, #14 breadcrumbs, #10/#11 hero+bundle, #4 region overrides, #15 bot rules, P2 banner/metas/InlineAnswer.
- **Then Phase 2 (data):** wire Google Search Console (OAuth env vars pending) so the next pass is driven by real query data, not just crawl signals.

_All changes to land on a branch/preview with a diff for approval. Nothing ships without an explicit go, per guardrails._
