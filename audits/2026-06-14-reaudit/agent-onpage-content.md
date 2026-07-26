# MCB On-Page SEO & Content RE-AUDIT — 2026-06-24

Auditor: senior on-page SEO & content strategist (read-only, evidence-based).
Baseline: `audits/2026-06-14-growth-audit/agent-onpage-content.md` (Sprint 1, graded **C−**).
Method: read Sprint 1 commit `039d63e` + current `/src`, computed region bucketing for all 32 indexed suburbs from code, and curled live PROD HTML (`https://www.moderncurtainsandblinds.com.au`) for robots meta, titles, metas, body copy, and the live `sitemap.xml`.

**TL;DR:** The doorway P0 is genuinely mitigated at the index level — verified in PROD. But the *content* items Sprint 1 left open are mostly still open, and two of them are now **worse** because they land on the pages that stayed indexed: (1) the **region-copy geographic bug now actively misfires on indexed priority suburbs — including MCB's own home suburb, Preston**, and (2) the **doubled `| MCB | MCB` title suffix was never fixed and is live on ~26 indexed money pages** (woven suburbs, guides, product subpages, `/awnings`, `/motorisation`).

---

## Doorway mitigation verification (PROD)

All four checks pass in production. The single biggest liability from Sprint 1 is contained.

| Check | Expected | Live PROD result | Verdict |
|---|---|---|---|
| Suburb×product pages (`/locations/[suburb]/[product]`) | `noindex,follow`, absent from sitemap | `reservoir/roller-blinds`, `preston/curtains`, `thornbury/plantation-shutters` all return `<meta name="robots" content="noindex, follow">` | ✅ MITIGATED |
| Non-priority suburb hubs | `noindex,follow`, absent from sitemap | `epping`, `lalor`, `mill-park`, `footscray` all `noindex, follow` | ✅ MITIGATED |
| 32 kept suburbs (12 woven + 20 priority) | indexable (no robots meta), present in sitemap | `thornbury`, `preston`, `brunswick`, `reservoir`, `northcote`, `bundoora` — **no** robots meta (indexable) | ✅ CONFIRMED |
| `sitemap.xml` | doorway tier removed | **89 total URLs**, exactly **32** `/locations/*` (the 12 woven + 20 priority, zero two-segment suburb×product URLs) | ✅ CONFIRMED |

Code basis: `src/lib/locations.ts:48` `isSuburbHubIndexable()` (woven ∪ priority); suburb-hub metadata `src/app/locations/[suburb]/page.tsx:38` (`robots: isSuburbHubIndexable(slug) ? undefined : {index:false, follow:true}`); suburb×product metadata `src/app/locations/[suburb]/[product]/page.tsx:34` (`robots:{index:false, follow:true}` unconditionally); sitemap filter `src/app/sitemap.ts:97-104`. **The mechanism is correct and live.** Sprint 1's claim (33,321 → 89 sitemap URLs) is verified.

One residual: the indexed `/locations` index page (`src/app/locations/page.tsx:26`) still links to **all 693** suburb hubs, including the 661 noindexed thin ones, with no prioritisation. `noindex,follow` keeps them out of the index but crawlers still walk every link, and link equity from the index is split 693 ways instead of concentrated on the 32 kept pages. Not a P0 (index bloat is solved), but it blunts the benefit and keeps a fat crawl path into dead content. Flagged P2 below.

---

## Findings table (re-audit)

| Status | Sev | Finding | Evidence (live + code) | Fix |
|---|---|---|---|---|
| **RESOLVED** | P0 | ~33k suburb×product doorway pages indexable + in sitemap | All sampled pages `noindex,follow` in PROD; 0 in live sitemap | Done (`[product]/page.tsx:34`, `sitemap.ts`) |
| **RESOLVED** | P0 | 661 thin long-tail suburb hubs indexable | `epping/lalor/mill-park/footscray` `noindex,follow` in PROD; only 32 hubs in sitemap | Done (`locations.ts:48`, `[suburb]/page.tsx:38`) |
| **OPEN — now WORSE** | **P0→still P1, higher urgency** | **Region-copy geographic bug now hits INDEXED priority suburbs.** `getMelbourneRegion` still buckets purely by CBD bearing/distance with **no manual overrides** — unchanged since Sprint 1. The pages it misfires on are now the ones that *stay indexed*. | **PROD `/locations/preston`** (MCB's home base) serves *"Mud-brick and timber Eltham… raked ceilings… bushland-adjacent"* — resolves to `north-east` (bearing 27°, 9.2km). **PROD `/locations/thornbury`** same Eltham copy (`north-east`). **PROD `/locations/bundoora`** same Eltham copy (`north-east`) — even though the `north` block *names* Bundoora. `/brunswick` + `/northcote` serve inner-city *"warehouse conversions / Victorian terraces"* (`inner`). Only `/reservoir` (`north`) is correct. Code: `region-content.ts:45-74`. | Add a manual `slug → region` override map consulted before the bearing math, or widen the inner-north handling. At minimum fix the 32 indexed suburbs by hand. Hold to: Preston/Thornbury/Bundoora = `north`; Brunswick/Northcote = `north` (inner-north bungalow/terrace, not warehouse `inner`). |
| **OPEN** | P1 | **Doubled `\| MCB \| MCB` title suffix — NOT fixed.** 26 pages hard-code the brand in their own `title:` and `layout.tsx:23` `template:"%s \| Modern Curtains and Blinds"` appends it again. | **PROD live, all doubled:** `/locations/clyde-north` (96ch), `/locations/tarneit` (92ch), `/guides/new-build…` (105ch), `/curtains/sheer` (82ch), `/shutters/roller-shutters` (92ch), `/awnings/zipscreens` (92ch), `/awnings` (87ch), `/motorisation` (99ch). Source list: 26 `page.tsx` files with brand inside `title:` (12 woven suburbs, 6 product subpages, guides, `awnings`, `motorisation`, `pricing-policy`, `terms`, `about`, `our-story`). Note: priority *templated* suburbs (thornbury/preston/etc.) are clean — they use `[suburb]/page.tsx:34` which does **not** hard-code the brand. | Strip `\| Modern Curtains and Blinds` from each page-level `title:` string and let the template add it once. ~26 one-line edits. |
| **OPEN** | P1 | **6 guides still stranded.** No `/guides` index, 0 guides in `sitemap.ts`, 0 guides links in Navbar/Footer. | `ls src/app/guides/page.tsx` → none. `sitemap.ts` guide matches are only `/awnings/fixed-guide-awnings` etc. (false positives). Live sitemap: 0 `/guides/*`. `grep guides` in Navbar/Footer → none. | Build `/guides` index, add guides to `sitemap.ts`, link from matching category hubs + footer, add `Article`/`FAQPage` schema. |
| **OPEN** | P1 | **Over-length category-hub titles + one bloated meta.** | PROD: `/curtains` title 98, `/blinds` 105, `/motorisation` 99, `/awnings` 87 (all >60). `/blinds` meta **233 chars** (display ~155). `/shutters` (88), `/security` (82) borderline. | Trim titles ≤60 incl. brand (removing the double suffix recovers ~28ch immediately); cut `/blinds` meta to ≤155. |
| **OPEN** | P1 (carried) | **InlineAnswer answer-first block still on only 1 page.** | `grep InlineAnswer src/app` → only `shutters/plantation-shutters/page.tsx`. Component exists (`src/components/InlineAnswer.tsx`). | Roll out to the high-intent money pages (category hubs + top product subpages + guides) — woven prose lead-in, FAQPage JSON-LD already present. |
| **OPEN** | P2 | **`/locations` index links to all 693 hubs incl. 661 noindexed** — equity dilution + crawl path into dead tier. | `src/app/locations/page.tsx:12,26` maps all `LOCATIONS`. | Render only `isSuburbHubIndexable()` suburbs as primary links (or visually group the 32 and drop the rest), so the index concentrates equity on indexed pages. |
| **OPEN** | P2 (carried) | Suburb region prose still rendered inside `<h2>` on hubs (heading misuse). | `ProductTemplate.tsx:274-279` wraps `description` in `<h2>`; suburb `description = regionalAngle + localTrustSignal` (`[suburb]/page.tsx:129`). Now lower-volume (32 indexed) but still wrong on indexed pages. | Render long description as `<p>`. |
| **OPEN** | P2 (carried) | Templated/keyword alt text on hubs (hero alt = page title). | `ProductTemplate.tsx:194`. | Descriptive alts (material/room/finish). |
| **OPEN** | P2 (carried) | Homepage H1 is a slogan, no head term. | Live `/` H1 "Made for your home. Made in Melbourne." | Add a keyword-bearing visible H1/sub-headline. |
| **NEW** | P2 | **`/pricing-policy` page is orphaned + double-suffixed.** New since baseline. Has self-canonical and is reachable (linked from `WovenSuburbPage.tsx`) but is **not in `sitemap.ts`** and its title `"Pricing Policy \| Modern Curtains and Blinds"` doubles to `…\| MCB \| MCB` live. Indexable (no noindex). | `src/app/pricing-policy/page.tsx:6,9`; absent from `sitemap.ts`. | Add to sitemap (it's a positioning-relevant page that carries the protective pricing T&Cs), and fix its title suffix in the same pass as the other 25. |
| **NEW (non-issue, note)** | — | **`/terms` consultation-fee + deposit copy (commit `53867b5`).** New T&Cs: first consult free, second consult $250 (deducted from job if it proceeds), 50% deposit due on confirmation, commercial-PO terms. On-brand, no competitor/3rd-party content, supports the "qualify out price shoppers" + pricing-transparency positioning. `/terms` is indexed + in sitemap. | `src/app/terms/page.tsx:17-60`; `git show 53867b5`. | None — content-only, correctly logged in `releases.ts`. Carries the doubled-suffix bug (title hard-codes brand) — folds into the P1 fix. |

**Verified still-good (don't touch):** sitemap `lastModified` still pinned to constants (`sitemap.ts:10-12`); self-referential canonicals present on all priority/woven suburbs (confirmed live on thornbury/preston/brunswick/reservoir/northcote/bundoora); money-page depth (decision guides, comparison tables, woven FAQ + FAQPage JSON-LD) intact; `/products/*` → category 301s unchanged; exactly one H1 per page on every type sampled.

---

## Verdict: does the region-copy bug now hit indexed priority suburbs? **YES — and it's the headline regression.**

Sprint 1 noindexed the long tail but **did not touch `region-content.ts`**, so the bearing-bucketing bug is byte-for-byte unchanged. The consequence is that the wrong-region copy is now concentrated on exactly the 32 pages MCB chose to *keep* in Google's index. Computed region for all 20 priority suburbs (from code, confirmed live where sampled):

| Suburb (indexed) | Resolves to | Copy it serves | Correct? |
|---|---|---|---|
| **preston** | `north-east` | Eltham mud-brick / bushland / raked ceilings | ❌ **WRONG — this is MCB's home suburb.** The `north` block literally says *"Preston is our home address."* Preston's own page doesn't get it. |
| **thornbury** | `north-east` | Eltham mud-brick / bushland | ❌ WRONG (inner-north bungalow/terrace) — the original Sprint 1 bug, now on an indexed page |
| **bundoora** | `north-east` | Eltham mud-brick / bushland | ❌ WRONG — the `north` block *names* Bundoora, but bundoora buckets to `north-east` |
| **brunswick** | `inner` | Victorian terraces / warehouse conversions / strata | ❌ Partly wrong — Brunswick has some of this but reads as CBD/Docklands, not inner-north |
| **northcote** | `inner` | warehouse conversions / apartment glazing | ❌ Partly wrong — inner-north, not warehouse-conversion territory |
| reservoir | `north` | Californian bungalows / northern suburbs | ✅ correct |
| coburg | `north` | northern suburbs | ✅ correct |
| heidelberg, ivanhoe, eltham, greensborough, diamond-creek, mernda, greenvale(woven) | `north-east` | leafy-river / bushland | ✅ plausibly correct |
| kew, hawthorn, doncaster, templestowe | `east` | post-war brick / rebuilds | ✅ plausibly correct |
| carlton, fitzroy, richmond | `inner` | terraces / warehouse | ✅ correct |

So **5 of the 20 indexed priority suburbs serve materially wrong-region copy** (preston, thornbury, bundoora, brunswick, northcote), and Preston — the brand's home and the most important single suburb page — is the worst case. This is a trust + AI-citation risk on the pages that matter most, and it's the clearest "we kept the right URLs but left the wrong copy on them" gap from Sprint 1.

---

## Grade

**C → C+.** Up from **C−**.

- **+** The headline P0 (doorway/scaled-content) is genuinely and verifiably mitigated in PROD — the single largest quality drag is gone from the index.
- **−** Every *content* item Sprint 1 flagged as still-open is still open, and two of them (region-copy bug, doubled title suffix) are now live on indexed money pages — the doubled suffix is on ~26 pages and was a one-line-each fix that didn't ship; the region bug misfires on MCB's own home suburb. These are cheap, high-trust fixes left on the table, which is what keeps this below a B.

A focused content sprint (region overrides + title suffix + guides surfacing) moves this to **B/B+** quickly — no engineering, all on-page.

---

## Top 3 priorities

1. **Fix region copy on the 32 indexed suburbs — start with Preston.** Add a manual `slug→region` override consulted before the bearing math in `region-content.ts:45-74` (or hand-correct the 32 indexed slugs): Preston/Thornbury/Bundoora → `north`; Brunswick/Northcote → `north` (inner-north). MCB's home suburb serving Eltham mud-brick copy is the most damaging single on-page issue live today. *Highest trust/AEO impact, low effort.*
2. **Kill the doubled `\| MCB \| MCB` suffix across ~26 indexed pages, and tidy hub titles/metas in the same pass.** Strip the hard-coded brand from each page-level `title:` (12 woven suburbs, 6 product subpages, guides, `/awnings`, `/motorisation`, `/pricing-policy`, `/terms`, `/about`, `/our-story`); removing it also pulls the over-length titles (`/blinds` 105, `/curtains` 98, `/motorisation` 99) back under 60. Cut `/blinds` meta from 233 → ≤155. *Low effort, every indexed money page.*
3. **Surface the 6 guides + roll out InlineAnswer.** Build `/guides`, add guides (and `/pricing-policy`) to `sitemap.ts`, link guides from matching category hubs + footer with `Article`/`FAQPage` schema; extend the InlineAnswer answer-first block from its single page to the category hubs + top product subpages + guides. Also de-list the 661 noindexed hubs from the `/locations` index so equity concentrates on the 32 kept pages. *Unlocks MCB's best AEO assets + concentrates internal equity.*
