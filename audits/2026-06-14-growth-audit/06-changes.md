# MCB Growth Audit — Sprint 1 Changes (gated, on branch)
_Date: 2026-06-14 · Branch: `audit/sprint-1-quick-wins` · Status: built + verified locally, NOT deployed_

Implements the Sprint 1 "stop the bleeding" quick wins from `01-audit.md`. Report-first: nothing is live; this awaits explicit approval to deploy.

## What changed (21 files, +147 / −51)

### 1. Doorway tier noindexed + de-sitemapped  (audit P0 #1)
- `src/lib/locations.ts` — new `WOVEN_SUBURB_SLUGS` (12), `PRIORITY_SUBURB_SLUGS` (20, from `llms.txt` top-suburbs), and `isSuburbHubIndexable()` as the single source of truth.
- `src/app/locations/[suburb]/page.tsx` — `noindex,follow` unless the suburb is woven/priority; replaced the local override set with the shared `WOVEN_SUBURB_SLUGS`.
- `src/app/locations/[suburb]/[product]/page.tsx` — `noindex,follow` on the **entire** ~33k tier.
- `src/app/sitemap.ts` — emits only indexable suburb hubs; the suburb×product loop removed.
- **Result:** sitemap **33,321 → 89 URLs** (0 suburb-product, 32 suburb hubs). Pages stay reachable + pass link equity (`follow`), just leave the index.

### 2. Review schema scoped to homepage  (audit P0 #2/#3 — "scope-only" per owner decision)
- `src/components/RichSchema.tsx` — removed `aggregateRating`/`review` from the global `OrganizationSchema`; added homepage-only `OrganizationReviewSchema` (same `@id`, merges into the one business entity).
- `src/app/page.tsx` — mounts `OrganizationReviewSchema`.
- **Result:** rating/reviews now appear on the homepage only, not on all ~33k URLs. Kills the schema-spam + review-snippet-policy risk.
- **Still pending (deferred):** reviews remain schema-only (not visible on-page HTML). The visible-vs-strip legitimacy decision was deferred by the owner.

### 3. Canonicals + og:url  (audit P1 #5/#6)
- Added `alternates.canonical` to: homepage + `blinds`/`curtains`/`shutters`/`security`/`locations` hubs + `about`/`contact`/`our-story`/`projects`/`privacy`/`terms`.
- `src/app/layout.tsx` — removed the root `openGraph.url` so pages no longer inherit the homepage as their og:url; homepage sets its own.
- **Correction to the audit:** the "~24 product pages missing canonical" finding was a **false positive** — those pages get canonicals from the `pageMetadata(path)` helper. Verified live on the branch. No change needed there.

### 4. Redirect chain collapsed  (audit P1 #16)
- `next.config.ts` — `/curtains/velvet-curtains` now → `/curtains/theatre-velvet` directly (was a 2-hop chain).
- `src/app/curtains/velvet/page.tsx` — `permanentRedirect` (308) instead of `redirect` (307).

### 5. Release log  (CLAUDE.md discipline)
- `src/lib/dashboard/releases.ts` — new `2026-06-14-growth-audit-sprint1` entry (`affectsGrowthCorridor: true`). `releasedAt` is a placeholder — **set it to the actual deploy time when shipping.**

## Verification (local preview, dev server)
| Check | Expected | Actual |
|---|---|---|
| sitemap total `<loc>` | ~small | **89** |
| — suburb×product URLs | 0 | **0** |
| — suburb hub URLs | 32 | **32** |
| homepage review schema | present | ✓ present |
| `/blinds` review schema | absent | ✓ absent |
| `/locations/preston-west/blinds` review schema | absent | ✓ absent |
| `/blinds` canonical | `/blinds` | ✓ |
| `/blinds/roller-blinds` canonical | self (helper) | ✓ |
| Thornbury (priority) robots | indexable | ✓ (no noindex) |
| Preston-West (thin) robots | noindex,follow | ✓ |
| suburb×product robots | noindex,follow | ✓ |
| build / tsc / eslint | clean | ✓ all clean |
| console errors | none | ✓ none |

_Note: local canonicals render the apex host because `NEXT_PUBLIC_BASE_URL` is unset in dev; production sets it to `www`. Pre-existing behaviour, unrelated to these changes._

## Not in this sprint (queued)
- Sprint 2: name Deane & Dee (E-E-A-T), render reviews visibly / resolve the legitimacy decision, ship indicative pricing + Product/Offer schema, quote-form friction + honeypot.
- Sprint 3: surface the 6 guides (sitemap + index + Article schema), mount BreadcrumbList, hero image + Framer-Motion perf, region-copy geographic overrides, AI-bot robots rules, finance-banner demotion.
- Phase 2: wire Google Search Console for data-driven targeting.

## To deploy (when approved)
`git` is on branch `audit/sprint-1-quick-wins`. Review the diff, set the `releasedAt` timestamp, merge, and `vercel deploy --prod` from `/repo`. A pre-launch `spend-safety-audit` is sensible since `/api/quote` abuse protection (P1 #13) is still open.
