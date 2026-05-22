# AI Search Strategy — Site Upgrade Plan

**Created:** 2026-05-22
**Horizon:** ~May 2027
**Owner:** Alex

This document is the planning artefact that drove PRs 1–4. Source briefs are linked at the end.

---

## Why this exists

By May 2027 the typical Melbourne homeowner researching curtains, blinds and shutters will do two distinct things that today look like one:

1. **Find-a-tradie intent** ("blinds installer Hampton") — still uses Google, still sees a Local Pack. The Local Pack appears on ~93% of these queries; AI Overviews on only 7–15%. MCB's suburb pages are largely protected here.
2. **Everything upstream of that** ("what blinds for a west-facing room", "are plantation shutters dated", "how much should plantation shutters actually cost") — increasingly answered in-place by Google AI Overviews, AI Mode, ChatGPT, Perplexity, Copilot. AI Overviews trigger on ~92% of informational-local hybrid queries; organic CTR drops 58–61% when an AIO is present.

The pipeline will be increasingly decided before a user types MCB's name into Google. Winning the upstream conversation is the new game.

---

## Three hard truths about MCB's position

1. **The 693 suburb pages are protected, but for the wrong reason.** Local-Pack-safe from AI cannibalisation; quality-system-vulnerable since Google's Dec 2025 Core Update specifically targeted "large-scale programmatic content from templates". Highest-leverage thing to fix.
2. **Informational content (or absence of it) is where AI search will eat MCB.** ~92 humans/month, 4 leads/30d. The upstream-research traffic that should seed the pipeline is exactly what AIO intercepts hardest.
3. **Reviews and brand mentions matter more than schema.** Best-evidenced AI-citation factor is unlinked brand mentions (Ahrefs, r=0.664). Best content lever is embedding statistics (Princeton GEO, +37–41%). Schema markup showed a null result in the only controlled experiment.

---

## Four-pillar strategy

| Pillar | What it owns |
|---|---|
| **A. Upstream Content Engine** | Cornerstone informational/comparison pages that win AI citations |
| **B. Suburb Page Consolidation** | Audit 693 → ~30–60 deep regional pages |
| **C. Off-Site Authority** | Reviews velocity, YouTube + transcripts, Wikidata, AU media mentions, Reddit |
| **D. Measurement & Refresh Loop** | AI citation tracking, bot crawl logging, GSC AI Mode filter, GA4 channel group, 90-day refresh cycle |

---

## Eight automations (all $0 — paid integrations env-gated)

| # | Automation | Status |
|---|---|---|
| 1 | AI bot crawler logger (middleware → `bot_crawls`) | **PR 1** |
| 2 | Daily AI citation probe | Manual UI in PR 3; Otterly Lite hook env-gated for later |
| 3 | Content freshness sweep | PR 3 |
| 4 | GBP review watcher | PR 3 (no LLM draft — pull + flag only) |
| 5 | Question discovery (PAA/RSS) | PR 3 (keyword-scored — no LLM) |
| 6 | Brief generator | PR 3 (template-based — LLM-assisted later) |
| 7 | Weekly KPI digest (email) | PR 3 |
| 8 | Suburb page auditor | PR 3 (consumed by PR 4) |

---

## Top 30 questions targeted for AI citation

Seeded into `tracked_questions` by `scripts/seed-tracked-questions.ts`.

Ranked by `(monthly search volume × commercial intent × content-gap × Melbourne relevance)`. Top 10:

1. How much do plantation shutters cost per window in Melbourne?
2. Are plantation shutters dated in 2026?
3. Blinds vs curtains for bedroom — which is better?
4. Best blinds to block heat in a west-facing Melbourne window
5. How do I know if a blinds quote is fair?
6. PVC vs basswood plantation shutters for Melbourne homes
7. S-fold vs pinch pleat vs eyelet curtains — what's the difference?
8. How much does it cost to curtain a whole house in Australia?
9. Are motorised blinds worth it?
10. Are plantation shutters good for Victorian terraces?

Full list in the seed script.

---

## Dashboard IA (delivered in PR 2 + PR 3)

```
/dashboard                          HOME — landing
  ├─ Hero: Leads 28d
  ├─ Secondary KPIs (4): Lead rate, AI SoV, Bot crawls, Brand search
  ├─ Attention strip (alerts)
  ├─ This week (3-5 ranked actions)
  └─ Release ticker

/dashboard/leads                    LEADS & CONVERSION
  ├─ Overview │ Funnel │ Lead detail │ Geography

/dashboard/ai-presence              AI PRESENCE
  ├─ Citations │ Bots │ Competitors

/dashboard/content                  CONTENT
  ├─ Refresh queue │ Backlog │ Briefs │ Performance │ Suburb audit

/dashboard/reputation               REPUTATION
  ├─ Reviews │ Brand search │ YouTube

/dashboard/releases                 RELEASES
  └─ Release log + per-release drill-down

/dashboard/explorer                 EXPLORER (power-user)
  └─ Pages │ Devices │ Countries │ Sources │ Hourly │ Event search
```

---

## Visual system

- **Palette:** warm earthy — MCB brand tokens (clay, sage, sand, terracotta, charcoal, paper) + derived neutrals (sand-deep, warm-grey, terracotta-red, state-bg tints). Defined in `src/app/globals.css`.
- **Type:** Playfair display headings, Inter body, JetBrains Mono for paths/IDs. Tabular numerals on all numbers.
- **Density:** sparse-and-confident (NOT data-dense). At 92 humans/month every extra panel whispers noise.
- **Nav:** left sidebar, dark charcoal, 240px. Six top-level sections grouped by user intent.
- **Charts (Recharts):** ≤3 series per chart, terracotta-deep / sage-dark / clay palette, dashed horizontal grid only, custom warm tooltip. Theme in `src/lib/dashboard/v2/chartTheme.ts`.
- **State colours:** sage-dark = good, clay/terracotta = attention, terracotta-red = critical. Always paired with an icon — never colour alone.

Full spec in `src/lib/dashboard/v2/tokens.ts`.

---

## Phased delivery

| PR | Scope |
|---|---|
| **PR 1 — Foundation** | Supabase migration (8 tables), bot crawler logger middleware + internal API route, tracked-questions seed script, design tokens, Recharts theme, derived CSS variables |
| **PR 2 — Dashboard shell rebuild** | New layout + sidebar + Home + Leads + Releases + Explorer wired to existing data |
| **PR 3 — Automation layer (free parts)** | Cron endpoints for freshness, question discovery, weekly digest, suburb audit. Manual citation entry UI. GBP review watcher (no draft). Template brief generator. |
| **PR 4 — Suburb consolidation** | Score 693 pages, cluster proposal UI, redirect map, regional pages, sitemap regen |

---

## What's deferred (and why)

| Item | Why | Cost to unlock |
|---|---|---|
| Otterly Lite citation auto-probe | Paid subscription | ~AUD $45/mo, plus env var |
| Claude API for review draft responses | Paid usage | API spend, plus env var |
| Claude API for brief generation | Paid usage | API spend, plus env var |
| Claude API for question discovery semantic dedup | Paid usage; keyword dedup is fine for now | API spend |
| YouTube channel | Not engineering — production work | Alex's time |
| AU media outreach | Not engineering — pitching | Alex's time |
| Wikidata entry | Not engineering — one-off | 1 hour |

All paid integrations are env-gated. Flipping them on is a config change, not a code change.

---

## Source briefs

The three research briefs that drove this plan live in the conversation transcripts and synthesised into the strategy memo. Key references:

- Princeton GEO paper (Aggarwal et al., KDD 2024) — peer-reviewed citation-lift study
- Ahrefs schema citation experiment — null result, drove the "don't bet on schema" call
- Ahrefs 75K brand correlation study — brand mentions r=0.664
- Whitespark / WebFX local-AIO data — Local Pack vs AIO trigger rates by query intent
- Local Falcon home-services AIO whitepaper — distance NOT a factor for AIO citation
- December 2025 Core Update — programmatic content targeting
- Industry questions mine across PAA, Whirlpool, Houzz, ProductReview.com.au, Mumsnet (Reddit blocked but proxied)
