# MCB Re-Audit — Post-Sprint-1 Health Check
_Date: 2026-06-14 (hours after Sprint 1 deploy) · Five-lens re-audit vs the 2026-06-14 baseline (`../2026-06-14-growth-audit/01-audit.md`)._

## Read this first — what this re-audit can and can't show
Sprint 1 deployed **the same morning**, and **GSC is still not connected**, so there is **no organic-traffic or ranking movement to report** (those lag recrawl by weeks). This re-audit measures the site's **current health/quality state** and **verifies the Sprint 1 fixes held in production** — not traffic performance. Real performance measurement is blocked until GSC is wired (see `../2026-06-14-growth-audit/09-dashboard-overhaul-plan.md`).

## Sprint 1 verification — ✅ ALL HELD IN PRODUCTION
Independently confirmed live by every relevant lens:
- **Sitemap 33,321 → 89 URLs** · 0 suburb×product · exactly 32 indexable hubs (12 woven + 20 priority). ✓
- Doorway + thin-hub tier returns `noindex, follow`; the 32 kept suburbs are indexable. ✓
- Self-referencing `www` canonicals on home + hubs + products; inherited `og:url` removed. ✓
- Review/AggregateRating JSON-LD now **homepage-only** (gone from `/blinds`, products, suburbs, doorway). FAQPage schema still clean. ✓
- `/curtains/velvet-curtains` collapsed to a single 308. ✓
- The later `/terms` deploy (`53867b5`) introduced no regression. ✓

## Scorecard — then → now
| Lens | Before | Now | Why |
|---|---|---|---|
| Technical SEO | C+ | **B+** | Both P0s + P1s resolved & verified live |
| Performance | B+ | **B+** | Sprint 1 didn't touch perf — nothing fixed, nothing regressed |
| On-page / Content | C− | **C+** | Doorway tier neutralised; but cheap content fixes left undone + region bug now on indexed pages |
| AEO / Agentic | C+ | **B−** | Review-spam removed; citability work (price/Article/breadcrumb) still undone |
| E-E-A-T / Conversion | B− | **B−** | Conversion/trust UX unchanged — 0 of 11 findings resolved (Sprint 1 was SEO-only) |

## 🔴 New / promoted findings (the headline of this re-audit)

1. **Region-copy geographic bug now lands on INDEXED money pages.** `region-content.ts` (bearing-bucketing) was never fixed, and Sprint 1 kept exactly the priority suburbs indexed — so **5 of 20 indexed priority suburbs now serve wrong-region copy**, worst of all **`/locations/preston`** — MCB's own home base — serving Eltham mud-brick/bushland copy. Also wrong: thornbury, bundoora, brunswick, northcote. **This is now the top on-page priority** (it moved from buried-in-the-noindexed-tail to live on the kept pages). Fix: manual region overrides for the 32 indexed suburbs, Preston first.

2. **Internal-link ↔ indexation mismatch.** The `/locations` hub still links **all 693** suburbs, including the ~661 now-noindexed thin hubs → 661 followed internal links to noindexed pages, diluting equity to the 32 kept suburbs and wasting crawl budget. Sprint 1's noindex created this gap. Fix: trim the `/locations` index to the 32 indexable suburbs.

3. **Doubled `| MCB | MCB` title suffix** live on ~26 indexed money pages (clyde-north, tarneit, guides, curtains/sheer, shutters/roller-shutters, awnings/zipscreens, `/awnings`, `/motorisation`, `/pricing-policy`). Was flagged in baseline, not fixed. One-line-each; also pulls over-length titles under 60 chars.

4. **`/pricing-policy` orphaned** — post-baseline page, not in the sitemap.

5. **WIP correction:** the uncommitted `GoogleReviewsWidget.tsx` (106 lines) is a **cosmetic restructure only** (swaps in `PrimaryCTA`) — it keeps the same Elfsight "Loading…" embed and does **NOT** render the real reviews. So the deferred "render reviews visibly" work is still genuinely open; fold the real fix in before committing.

6. **`/terms` change assessment: fine & on-brand.** $250 second-consult fee (credited if job proceeds) + deposit-on-confirmation is well-staged and contained to `/terms`; `/quote` still says "Free & no obligation." **Guardrail:** keep the $250/deposit language out of the quote form, success screen, and ChatWidget (would read as bait-and-switch vs the free-quote promise). Minor: warranty "$150 may/will apply" wording is muddled next to the "5-Year Warranty" claim.

## Still open (unchanged — the Sprint 2/3 backlog)
- **Conversion/trust (0/11 fixed):** owners Deane & Dee unnamed; reviews invisible (broken embed); `/pricing-policy` promises prices no product page shows; form over-gated (3 needless required fields); no honeypot/rate-limit on `/api/quote`; Payright finance banner top-of-page; no NAP/street address.
- **AEO citability:** no Product/Offer price schema; no BreadcrumbList (dead component); no Article schema on guides; InlineAnswer on 1 page; robots has no AI-bot rules while llms.txt claims it does; `sameAs` GBP-only; llms.txt apex host.
- **Performance:** 6.5 MB 48-frame hero JPEG sequence (raw, max-age=0); Framer Motion on every page's critical path (~260 KB JS); no `fetchPriority` on hero; avif off; `minimumCacheTTL` unset; 37 MB dead frames; reduced-motion in 1 of 8 motion components.
- **Technical hygiene:** guides stranded (no `/guides` index, not in sitemap, unlinked); duplicate titles on 20 priority suburbs; robots `/admin/`→`/dashboard/`; llms.txt/site.ts apex→www; `lang=en`→`en-AU`; apex→www 307→308.

## Verdict
Sprint 1 did exactly what it set out to do and is verified live — the structural SEO/AEO liabilities are gone and three lenses improved. The site is **healthier**, not yet **higher-traffic** (too early + GSC dark). The highest-value next moves: **(1) fix the region-copy on the 32 indexed suburbs (Preston first) — urgent, it's on your money pages now; (2) the quick consistency cleanup (trim `/locations` index, strip the double title suffix, sitemap `/pricing-policy`); (3) Sprint 2 trust+pricing** (name the owners, render real reviews, show indicative pricing + Product schema, cut form friction) — the biggest combined traffic+conversion lever, and none of it has shipped yet.
