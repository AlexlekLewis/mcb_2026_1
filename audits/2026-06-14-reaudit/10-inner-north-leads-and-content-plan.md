# Inner-North Lead Geography + Location-Page Content Plan
_Date: 2026-06-14 · Source data: live `lead_submissions` (read-only pull), region-content code review, real question research (`inner-north-question-bank.md`)._

## 1. Lead geography — real data (last ~6.5 weeks)
63 quote-form leads, **2026-05-10 → 2026-06-25**, **0 spam**, **1 out-of-area** (98% in-area). 100% via the quote form. Product interest: **Blinds 33 · Curtains 28 · Security 8 · Shutters 4 · Awnings 2**. (Note: this is healthier than the old ~4/30d snapshot — ~1.4 leads/day now.)

**The inner-north / Preston cluster is real and clear.** Within ~10km of Preston:
| Postcode | Area | Leads |
|---|---|---|
| 3072 | **Preston** | 3 |
| 3073 | Reservoir | 2 |
| 3070 | Northcote | 2 |
| 3068 | Clifton Hill / Fitzroy Nth | 2 |
| 3066 | Collingwood | 2 |
| 3056/3057 | Brunswick | 2 |
| 3065 | Fitzroy | 1 |
| 3079 | Ivanhoe | 1 |
| 3084 | Rosanna/Heidelberg | 1 |
| 3083 | Bundoora | 1 |
| 3031/3041/3046 | Flemington/Essendon/Glenroy | 3 |

≈ **20 of 63 leads (≈32%)** come from the inner-north band — the densest cluster on the map, and exactly the high-value, low-drive-time work you want more of. The rest spread thinly across Melbourne, plus a notable **growth-corridor cluster (Deanside/Fraser Rise ×3, Tarneit ×2)** — which matters (see below).

## 2. Honest answer: "are those location pages working?"
**The demand is real; the pages are almost certainly NOT what's capturing it — yet.** Two hard caveats:
- **We can't attribute a lead to a specific landing page.** `lead_submissions` has no `page_path`, and session attribution is only partial. So we know the customer's *suburb*, not which *page* they arrived through. Most of these leads most likely came via the homepage + Google Ads (gclid), not the thin suburb pages.
- **The inner-north suburb pages are currently serving WRONG copy** (see §3). A thin, factually-wrong page isn't what's converting these customers.

**But two signals are genuinely encouraging:** (a) the inner-north *market* converts strongly, and (b) the **woven growth-corridor pages ARE producing leads** (5 from Deanside/Fraser Rise/Tarneit) — proof that *genuinely-unique, locally-accurate* suburb pages generate leads. That's the playbook to copy for the inner-north.

## 3. Page review — the inner-north pages serve the wrong region's copy (root cause found)
`region-content.ts` buckets suburbs by **compass bearing from the CBD**. The inner-north suburbs sit just *east* of due-north, so their bearing tips past the 22.5° boundary into the **"north-east"** bucket — which is the **Eltham mud-brick / bushland / Plenty-ranges** copy. Verified math: **Preston ≈ 27° bearing → "north-east" → Eltham copy.** Same fate for Thornbury, Reservoir, Bundoora, Heidelberg, Ivanhoe. Meanwhile **Northcote & Brunswick** fall inside the 6km "inner" radius → **CBD "warehouse conversions / high-rise apartments"** copy (also wrong — they're terraces & bungalows).

So your flagship suburb, **`/locations/preston`, currently tells visitors about mud-brick homes backing onto bushland.** That's the #1 thing to fix, and it's the same fix as the content upgrade.

## 4. The plan — promote the inner-north lead suburbs to unique, accurate, question-driven pages
One piece of work that **fixes the region bug AND builds real local pages** (and is conflict-safe — see §6):

**Mechanism:** add **per-suburb content overrides** that take precedence over the bearing-bucketed region copy, for the high-value inner-north set. (Not re-bucketing — overrides — so the woven 12 and the other region-content consumers are untouched.)

**Each page, structured from the real question bank** (`inner-north-question-bank.md`):
- **Earn the click** with the high-volume questions woven into prose: *how much do blinds/curtains cost in [suburb] / for a 3-bed home*, *do you come to me / free in-home measure in [suburb]*, *what blinds keep the west sun out*, *day privacy + night blackout on a street-facing room*. (Indicative pricing only with the protective T&Cs.)
- **Differentiate + earn AI citations** with accurate inner-north housing-stock detail: **Victorian/Edwardian terraces, double-hung sash windows, Californian-bungalow deep reveals, heritage overlays, narrow frontages, single-glazing heat loss, renter-friendly options** — the genuinely-local angles that make Preston read like Preston, not Eltham.
- **Format:** flowing prose + invisible **FAQPage JSON-LD**, plain Aussie tradie-pro tone, no competitor names, qualify-out framing on cheap-vs-quality. (Mirrors the winning woven-corridor pattern.)

## 5. Which suburbs first (data-driven priority order)
Lead-weighted inner-north build order:
1. **Preston** (flagship + 3 leads + currently broken) — pilot page, sets the template.
2. **Reservoir, Northcote, Brunswick, Thornbury, Coburg** — core inner-north, all kept indexed.
3. **Fitzroy, Carlton, Clifton Hill, Collingwood, Fitzroy North** — terrace heartland (Fitzroy/Carlton already indexed).
4. **Ivanhoe, Heidelberg, Bundoora** — inner-north-east band.

**Data-driven refinement to flag:** Clifton Hill (3068), Collingwood (3066), Flemington (3031) are **producing leads but were noindexed in Sprint 1** (not on the priority list). Recommend **adding the clear inner-north ones (Clifton Hill, Collingwood) to the indexed/build set** — the lead data says they're worth real pages.

## 6. Conflict-safety (per the earlier conflict check)
- **Per-suburb overrides**, not re-bucketing → the 12 woven pages (don't use region-content) and the other consumers (`voice-anchors`, `approved-facts`, `suburb-cluster`) are untouched.
- Pages stay on the existing dynamic `[suburb]` template; this is *content*, not a new page system (honours the CLAUDE.md "no new templated mass-page system" rule — these are genuinely-unique).
- Every shipped page batch → `releases.ts` entry; gated branch → verify → diff → deploy.

## 7. Recommended next step
Build a **Preston pilot** first: fix the flagship's wrong copy with the new question-driven, inner-north-accurate template, verify it on a branch, and use it as the pattern. Then roll out to the core inner-north set in lead-priority order. Measure via the dashboard + (once GSC is wired) real query/click data per page.
