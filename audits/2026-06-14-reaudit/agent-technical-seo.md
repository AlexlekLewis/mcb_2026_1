# Technical SEO RE-AUDIT — Modern Curtains and Blinds

**Date:** 2026-06-24
**Auditor:** Senior Technical SEO engineer (read-only)
**Live host (prod):** https://www.moderncurtainsandblinds.com.au (apex 307-redirects to www)
**Baseline:** `audits/2026-06-14-growth-audit/agent-technical-seo.md` (grade **C+**)
**Sprint 1 commit:** `039d63e` (shipped 2026-06-14 ~18:09 AEST). `/terms` update `53867b5` shipped after.
**Method:** Code review of repo HEAD + live fetches as Googlebot UA. Evidence-based; no invented metrics.

> **Timing caveat:** Sprint 1 shipped only ~10 days ago and the `noindex` + sitemap-trim signals take weeks-to-months for Google to fully digest (re-crawl 33k URLs, drop them from the index). This is a **HEALTH check of the current served state**, not a ranking/traffic assessment — no organic movement is claimed.

---

## Sprint 1 verification — PASS / FAIL

All checks fetched live as Googlebot on 2026-06-24.

| # | Claim to verify | Result | Evidence (live) |
|---|---|---|---|
| 1 | Sitemap trimmed to ~89 URLs (was 33,321) | **PASS** | `GET /sitemap.xml` → **89** `<loc>`, 16.9 KB (was 6.9 MB). |
| 2 | 0 suburb×product (`/locations/X/Y`) URLs in sitemap | **PASS** | `grep /locations/X/Y` → **0**. |
| 3 | 32 indexable suburb hubs present (12 woven + 20 priority) | **PASS** | **32** `/locations/X` `<loc>`: all 12 woven (clyde-north, clyde, officer, officer-south, wollert, donnybrook, beveridge, mickleham, greenvale, tarneit, deanside, fraser-rise) + 20 priority (preston, northcote, brunswick, coburg, reservoir, thornbury, carlton, fitzroy, heidelberg, bundoora, ivanhoe, kew, hawthorn, richmond, doncaster, templestowe, eltham, greensborough, diamond-creek, mernda). |
| 4 | Self-referencing www canonical on homepage | **PASS** | `GET /` → `<link rel="canonical" href="https://www.moderncurtainsandblinds.com.au"/>`. |
| 5 | Canonical on `/blinds` | **PASS** | `…/blinds` (self, www, absolute). |
| 6 | Canonical on `/curtains` | **PASS** | `…/curtains`. |
| 7 | Canonical on a product page (`/blinds/roller-blinds`) | **PASS** | `…/blinds/roller-blinds`. |
| 8 | Canonical on a priority suburb (`/locations/thornbury`) | **PASS** | `…/locations/thornbury`; **indexable** (no `noindex`). |
| 9 | Thin suburb `/locations/preston-west` = `noindex,follow` | **PASS** | `<meta name="robots" content="noindex, follow">`, returns 200. |
| 10 | A suburb×product page = `noindex,follow` | **PASS** | `/locations/preston/roller-blinds` → `noindex, follow`; `/locations/preston/blockout-roller-blinds` → `noindex` (follow implied). |
| 11 | Root `og:url` inheritance removed | **PASS** | `/blinds`, `/curtains`, `/blinds/roller-blinds` emit **no** `og:url` (was inheriting homepage). Homepage still sets its own `og:url` = `…com.au` (correct). |
| 12 | `/curtains/velvet-curtains` = single 308 to theatre-velvet | **PASS** | `→ 308 → /curtains/theatre-velvet → 200`. `num_redirects` collapses to one hop. The old `/curtains/velvet` stub is now a clean `permanentRedirect` (308) too. |

**Sprint 1 verdict: 12/12 PASS.** Every committed change is live and behaving as designed. Build discipline held (canonicals absolute+self-referencing+www; `lastModified` still pinned to constants; Googlebot not blocked).

---

## Updated findings table

| Sev | Finding | Evidence (live / file) | Fix | Status |
|---|---|---|---|---|
| **P0** | ~~33,321-URL sitemap bloat~~ | Sitemap now **89** URLs; 0 suburb×product. `sitemap.ts:97-104` filters on `isSuburbHubIndexable`. | — | **RESOLVED** |
| **P0** | ~~Canonical missing on homepage + hubs + ~24 pages~~ | Self-canonicals live on `/`, `/blinds`, `/curtains`, `/shutters`-class hubs, products, `/terms`, info pages. `page.tsx:21`, per-page `alternates.canonical`. | — | **RESOLVED** |
| **P1** | ~~`/curtains/velvet-curtains` 2-hop chain~~ | Single 308 → theatre-velvet (live). `next.config.ts:44-46`. | — | **RESOLVED** |
| **P1** | ~~og:url inherits homepage on non-home pages~~ | Root `openGraph.url` removed (`layout.tsx:29-31`); non-home pages emit no `og:url`. | — | **RESOLVED** |
| **P1** | **Near-duplicate titles/descriptions across the 32 KEPT indexable suburb hubs.** The 20 priority suburbs run the legacy template: title `Curtains & Blinds {name} \| Free Quote`, description varies only by name+postcode. (The 661 noindexed hubs no longer matter, but the *indexable* set still self-competes.) | `src/app/locations/[suburb]/page.tsx:34-35`. 12 woven suburbs have unique copy; the 20 priority ones do not. | Give the 20 priority suburbs region-bucketed or product-mix-varied title/description (region-content.ts exists), or promote them into the woven template. | **OPEN** (was P1, scope shrank from 693→20) |
| **P2** | **`robots.txt` disallows phantom `/admin/`; real admin is `/dashboard`.** | Live `/robots.txt`: `Disallow: /admin/`. `src/app/robots.ts:11`. No `/admin` route exists; `/dashboard` is the admin. | Replace `/admin/` with `/dashboard/` in `robots.ts`. (Auth + login `noindex` already protect it — hygiene only.) | **OPEN** (unchanged) |
| **P2** | **`public/llms.txt` emits 7 apex URLs that 307→www.** Host inconsistent with live www render. | Live `GET /llms.txt` (on www): **7** `https://moderncurtainsandblinds.com.au` (no www). `site.ts:3` and CLAUDE.md also default to apex. | Update `llms.txt` (and `site.ts` default / `NEXT_PUBLIC_BASE_URL`) to www. | **OPEN** (unchanged) |
| **P2** | **Apex→www is a 307 (temporary), not 308.** Weaker host-consolidation signal. | Live `GET https://moderncurtainsandblinds.com.au/` → `HTTP/2 307`, `location: https://www.…/`. (http→https is correctly 308.) | Vercel domain-level redirect → make apex→www permanent (308) if configurable. Not a code change. | **OPEN** (unchanged) |
| **P2** | **`<html lang="en">`, not `en-AU`; no hreflang.** | Live homepage `<html lang="en"`; 0 hreflang tags. `src/app/layout.tsx:70`. | Set `lang="en-AU"`. hreflang not required (single locale). | **OPEN** (unchanged) |
| **P2 → P1** | **NEW / regression-class: the `/locations` hub still links all 693 suburbs**, including the ~661 now-`noindex` thin hubs. Internal links now point overwhelmingly at noindexed pages, diluting equity to the 32 kept suburbs and keeping Googlebot crawling 661 noindexed hubs (→ their noindexed suburb-product children) on a ~92-human/month crawl budget. | Live `GET /locations` → **693** unique `/locations/X` anchors; thornbury & preston each linked once among 693. Sitemap exposes only 32, but the hub exposes 693. | Trim the `/locations` hub to the 32 indexable suburbs (or a curated regional index); link the noindexed long-tail, if at all, only from a low-priority "full service area" sub-page. Aligns internal-link graph with the indexation policy. | **NEW** |
| **P3** | **Suburb-product pages: noindexed but still link 0 → national product money pages.** Equity from the (followed) long tail isn't routed to `/blinds/roller-blinds` etc. | `src/app/locations/[suburb]/[product]/page.tsx` — sibling + nearby-suburb links only. Noindex,follow means the follow is wasted without a money-page link. | If keeping the tier crawlable, add one link per suburb-product → its national product page. (Lower priority now they're out of the index.) | **OPEN** (downgraded — tier is noindexed) |
| **P3** | **Inner `/dashboard/(with-sidebar)/*` has no own `noindex`** (protected only by middleware auth redirect). | `src/app/dashboard/(with-sidebar)/layout.tsx` — no `robots` metadata. `/dashboard/login` does set noindex. | Add `robots:{index:false,follow:false}` to the dashboard layout (belt-and-braces). | **OPEN** (unchanged) |

---

## New issues / regressions assessed this round

- **`/terms` (shipped post-Sprint-1, commit `53867b5`) — sanity check PASS.** Live `200`, self-referencing canonical `…/terms`, `index, follow`. No SEO regression introduced by the terms update. It is correctly in the sitemap (`sitemap.ts:75`).
- **`/curtains/velvet` stub — clean.** Now `permanentRedirect` (308), not the old 307; no residual 2-hop anywhere in the velvet path.
- **Indexation policy is internally consistent** between metadata (`isSuburbHubIndexable`) and sitemap (same predicate) — the 32 kept suburbs match exactly across both. Woven suburbs emit explicit `index, follow`; priority suburbs inherit root `index, follow` (no meta) — both indexable, just different code paths. No mismatch.
- **The one real new problem is the internal-link graph (`/locations` hub → 693).** It wasn't a Sprint 1 deliverable, but Sprint 1's noindex now makes it a *consistency regression*: the link graph and the index policy disagree. Promoted to **P1** because on a tiny crawl budget, pointing 661 followed internal links at noindexed pages is the kind of signal-muddying the doorway-tier cleanup was meant to end.

---

## What's still good (don't break)

- `metadataBase` set; all canonicals absolute, self-referencing, www, none point at a redirecting URL.
- Sitemap `lastModified` still pinned to constants (not `new Date()`).
- Googlebot not blocked; `/dashboard` 307→login (noindex). `NEXT_PUBLIC_NOINDEX` kill-switch intact (live `index, follow`).
- Product-canonical redirects (`/products/* → /curtains/*`) still clean single 308s.
- AggregateRating/Review JSON-LD scoped to homepage only (Sprint 1) — no longer stamped per-URL.

---

## Updated letter grade

**B+** (was **C+**).

Rationale: both P0s (33k sitemap bloat, missing canonicals) and both original P1s (redirect chain, og:url) are fully **RESOLVED and verified live** — that clears the material crawl-budget and duplicate-signal risks that capped the original grade. Held back from A-range by: (1) the **NEW** internal-link/index-policy mismatch (`/locations` hub still fans out to 661 noindexed pages); (2) the still-duplicative titles on the 20 kept priority suburbs; and (3) the cluster of unchanged low-effort hygiene items (apex 307, `/admin/` robots rule, `lang=en`, llms.txt apex host). None of the remainder is severe; all are cheap.

---

## Top 3 remaining technical priorities

1. **Align the internal-link graph with the indexation policy (P1, NEW).** Trim the `/locations` hub from 693 links to the 32 indexable suburbs (push the noindexed long-tail behind a single low-priority "full service area" page or drop the links). Right now 661 followed internal links point at noindexed pages — the cleanup's intent isn't reflected in crawl paths.
2. **De-duplicate the 20 kept priority suburb hubs (P1).** They still share the legacy `Curtains & Blinds {name} | Free Quote` title and a name+postcode-only description. Give them region-bucketed/product-varied metadata (or promote to the woven template) so the *indexable* suburb set doesn't self-compete.
3. **Clear the cheap host-hygiene batch (P2 ×4, ~1 hr total).** `robots.ts` `/admin/`→`/dashboard/`; `llms.txt` + `site.ts` apex→www; `lang="en"`→`"en-AU"`; and (Vercel domain config, not code) make apex→www a permanent 308.
