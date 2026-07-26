# MCB Upgrade Roadmap — Traffic + Conversions
_Date: 2026-06-14 · Builds on the five-lens audit (`01-audit.md`) and Sprint 1 (shipped)._

## The honest model (what actually moves the needle here)

```
Daily organic visitors ≈ Addressable demand × Share captured
Conversions            ≈ Visitors × Intent quality × Trust/Offer/UX
```

At **~92 real humans/month**, **traffic is the binding constraint** — a conversion-rate gain is tiny in absolute terms until volume grows, and A/B tests can't reach significance at this volume (so conversion work = high-confidence best practice, not experiments). Therefore:

- **~70% of effort → traffic** (content depth, topical authority, AEO/agentic citability, GSC-targeted capture).
- **~30% → conversion**, weighted to upgrades that *also* help rankings/citation (trust/E-E-A-T, pricing transparency) so the work does double duty.
- **Demand reality:** a Preston-radius single-metro business does not have 1–2k/day of pure local demand. The path to the north-star is (a) more genuinely-unique service×geo pages, (b) informational/answer-gap top-of-funnel that captures research- and AI-stage queries beyond "near me", (c) owning the agentic surface, (d) optional geo expansion. Templated mass-pages are NOT the path (that's what Sprint 1 just unwound).

---

## Tier 1 — Double-duty upgrades (traffic + conversion). Do first.

### 1. Make trust visible — render real reviews + name the owners
**Why both:** E-E-A-T is a ranking + AI-citation signal *and* the #1 conversion lever for a family service business. Also closes the deferred review-schema fork the legitimate way (your own Google reviews, shown on-page, sourced from GBP).
- Server-render the genuine GBP reviews (`src/lib/customer-reviews.ts`) as visible HTML with the 5.0/47 aggregate — replaces the broken Elfsight "Loading…" embed. (Your in-progress `GoogleReviewsWidget.tsx` WIP may already be this.)
- Name **Deane & Dee** on `/our-story` + `/about`: real photos, years in trade, what they personally stand behind. Add `author`/`founder` entity links.
- Add a real NAP (street address / ABN) for `LocalBusiness` completeness.
**Impact: H · Effort: M.** Honours: quality-positioning, MCB-only voice.

### 2. Indicative pricing + Product/Offer schema (with protective T&Cs)
**Why both:** captures "how much do X cost in Melbourne" / PAA + AI-overview queries (huge informational demand), qualifies out price-shoppers per positioning, reduces quote-form hesitation, and makes prices machine-citable.
- Add indicative ranges to money pages (some FAQ copy already has them — e.g. folding-arm $2,500–4,000, sheers $3,000–4,000); surface them as structured price blocks carrying the `/pricing-policy` T&Cs (baseline spec, on-site measure binding, refresh date).
- Emit `Product`/`Service` + `Offer` (`priceRange`/`min`–`max` AUD) schema per money page.
**Impact: H · Effort: M.** Honours: pricing-transparency rule (T&Cs mandatory).

---

## Tier 2 — Traffic engine

### 3. Surface + expand the informational / answer-gap tier (highest-leverage traffic lever)
The 6 existing guides are genuinely strong but **stranded** (not in sitemap, unlinked, no `Article` schema). And the answer-gap pages (pooja-blackout, estate-covenants) are a smart first-mover model.
- Build a `/guides` index, add guides to the sitemap, link them from category/money pages, add `Article`/`BlogPosting` schema (datePublished, author).
- Then **write more answer-gap pages** targeting conversational/PAA queries no Melbourne operator owns yet (the model you already proved). This is the cleanest traffic growth with zero doorway risk — it builds topical authority and feeds the agentic surface.
**Impact: H · Effort: M–H (ongoing).**

### 4. Promote ~20–40 priority suburbs to genuinely-unique woven content
The 32 suburbs Sprint 1 kept indexed are the local-SEO core. Expand the woven template (real estates, builders, covenants, micro-notes — like the 12 corridor pages) to the priority shortlist, and **fix the region-copy geographic bug** (Thornbury served Eltham mud-brick copy). Real, defensible local pages instead of thin templates.
**Impact: M–H · Effort: H.**

### 5. AEO/agentic citability rollout
- Roll out the answer-first `InlineAnswer` block (live on only 1 page) across money pages + guides — the directly-quotable answer engines lift.
- Mount `BreadcrumbList` sitewide (`Breadcrumbs.tsx` is built but unused) — path context + SERP breadcrumbs.
- Decide + set AI-bot rules in robots (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) and reconcile the llms.txt claim.
**Impact: M · Effort: L–M.**

### 6. Wire Google Search Console (the targeting brain)
Stop guessing. GSC reveals striking-distance queries (positions 5–20 = fastest wins), CTR outliers (good rank/low CTR = title fix), and content decay — so Tiers 1–5 target real demand. OAuth env vars are scaffolded (`audits/SEARCH_CONSOLE_SETUP.md`).
**Impact: H (as a multiplier) · Effort: L.**

---

## Tier 3 — Conversion hardening (high-confidence, not experiments)

### 7. Quote-form friction + abuse guard
Make the 3 extra required fields (projectStage, referral, bestContactTime) optional — unlock submit on the 5 essentials (your own funnel data showed Section 1 was the only on-site leak). Add a honeypot + min-fill-time + per-IP rate limit (closes the open `/api/quote` abuse gap too).
**Impact: M (direct funnel lift) · Effort: L.**

### 8. Demote the finance banner
The Payright bar is the literal top of every page, above the value prop — it pushes the hero down and undercuts "quality, qualify-out price shoppers". Make it a slim bar lower on the page.
**Impact: M · Effort: L.**

### 9. Hero performance (LCP)
The 48-frame 6.5 MB JPEG scroll-sequence hurts LCP/INP (bounce + ranking). Convert to webp/avif + immutable cache (or use the existing `Curtains_Hero.mp4`), add `fetchPriority="high"`, get Framer Motion off the critical path, delete the 37 MB dead frames.
**Impact: M · Effort: M.**

---

## Suggested sequence
1. **Trust + pricing (Tier 1)** — biggest combined traffic+conversion lift, and settles the reviews decision. (1–2 days)
2. **Wire GSC (#6)** — cheap, makes everything after it data-driven. (½ day)
3. **Surface guides + answer-gap content (#3)** + **AEO rollout (#5)** — the traffic engine. (ongoing)
4. **Conversion hardening (#7–9)** — bank the high-confidence funnel + speed wins. (1 day)
5. **Suburb woven expansion (#4)** — once GSC shows which suburbs/queries justify the build effort.

Every change: branch → verify → diff → gated deploy (git push to `main`), logged in `releases.ts`, measured on the dashboard 24h/48h/7d windows.
