# MCB Dashboard Overhaul — Plan
_Date: 2026-06-14 · Goal: a dashboard that actually measures SEO + agentic-search + conversion performance over selectable time ranges, with drill-down._

## Diagnosis (why a re-layout alone isn't enough)

The dashboard has **good bones** (token system, Recharts theme, reusable `KpiCard`/`HeroMetric`/`MetricTrendChart`, sensible nav) but is **blind to the two things you asked about**:

- **SEO:** Google Search Console is built end-to-end but **not connected** (4 OAuth env vars unset → cron 412; no read-side loader exists). `seo_search_console_metrics` has 0 rows.
- **AEO/agentic:** 3 competing citation tables, mostly empty; only a Perplexity probe, gated on an unset API key, writing to a table no migration creates.
- **Trust of existing numbers:** headline views likely still bot-inflated + UTC-bucketed; the fix migration `20260601` is pending apply to the live DB.
- **Time controls:** only the Leads page has a selector (28/90/180d, URL param). Everything else is hardcoded (Home 28d/7d, AI-Presence 7d, Geography 90d). No global range, no custom range, period-over-period in only 2 places.
- **Drill-down:** essentially none — every table is read-only.
- **Dead queries:** growth-corridor loader filters non-existent columns (`depth`→`scroll_percent`, `payload`→`properties`, `lead_submissions.page_path` never created) → 3 panels silently show 0.

## Phase A — Data foundation (do FIRST; without this the rest shows nothing)

1. **Wire Google Search Console** (the SEO scoreboard). Set `GSC_PROPERTY_URL`, `GSC_CLIENT_ID`, `GSC_CLIENT_SECRET`, `GSC_REFRESH_TOKEN` (OAuth Playground flow, ~10 min — `audits/SEARCH_CONSOLE_SETUP.md`). Then build the read-side loaders + a Search section. **Needs Alex** (his Google account / GSC property).
2. **Apply `20260601_fix_dashboard_views_botfilter_tz.sql`** to the live DB → de-bots + AEST-buckets the headline views so traffic numbers are trustworthy. **Needs Alex** (paste into Supabase SQL editor) or explicit authorisation for me to run it via the service-role key.
3. **Consolidate AI-citation** to one model (recommend `ai_citations` + the `ai_citation_probes` probe), add the missing migration for `ai_citation_probes`, and **decide on the paid Perplexity probe** (cost per run — needs a spend cap + Alex's OK). **Decision needed.**
4. **Fix the dead growth-corridor queries** (column names) so scroll-depth / question-engagement / corridor-lead panels populate. Pure code.

## Phase B — Global time-range control (your "select blocks of time")

- One **global range selector** in the dashboard header: presets **7d / 28d / 90d / 180d / YTD / custom range**, persisted in the **URL** (so it cascades to every page, is bookmarkable, shareable).
- **Period-over-period everywhere:** every KPI shows Δ vs the prior equal-length period; every trend chart can overlay the prior period.
- Standardise **all** time bucketing on **AEST day boundaries** reading **`analytics_events_clean`** (kills the UTC/bot drift). Refactor the hardcoded-30d SQL views to be range-parameterised by the loaders.

## Phase C — Drill-down (your "drill down on data sets")

A consistent **detail drawer** pattern. Click to drill:
- a **GSC query** → its landing pages, position trend, CTR;
- a **page** → its queries, impressions/clicks trend, on-page engagement, leads attributed;
- a **lead** → full detail, channel/UTM, session path, status update;
- a **suburb / corridor** → its pages, queries, AI-bot crawls, leads;
- an **AI question** → per-engine citation history + which answer page covers it.

## Phase D — IA / layout rebuild (the structure)

Reorganise from today's *Operations / Intelligence / Reference* into a performance-question hierarchy:

| Section | Answers the question | Core surfaces |
|---|---|---|
| **Overview** | "Are we winning, vs last period?" | North-star scorecard (below), each with Δ + trend + drill |
| **Search (SEO)** | "Are we found in Google?" | GSC clicks/impr/CTR/position; **striking-distance** (pos 5–20); **CTR outliers** (good rank, low CTR = title fix); content decay; query & page tables (drillable) |
| **AI / Agentic** | "Are AI engines citing us?" | Citation share-of-voice by engine & question; AI-bot crawl coverage by page; answer performance |
| **Conversion** | "Are visitors becoming leads?" | Funnel, leads, lead-rate, channels, phone taps, geography (all range-aware) |
| **Content** | "What to write/refresh next?" | Freshness queue, backlog (scored), suburb audit |
| **Ops** | "What changed & did it work?" | Releases (range-flexible windows), social UTM links, optimizer signals |

## North-star scorecard (what I deem most important to capture)

Shown on Overview, all range-aware with Δ vs prior period and a trend sparkline:

| KPI | Source | Why it's the scoreboard |
|---|---|---|
| Organic clicks | GSC | the actual SEO traffic result |
| Impressions + avg position | GSC | leading indicator (visibility before clicks) |
| Striking-distance queries (pos 5–20) | GSC | the fastest-win pipeline |
| AI citation share-of-voice | citation tables | the agentic-search scoreboard |
| AI-bot crawl coverage | `bot_crawls` | leading indicator of citation eligibility |
| Real humans (clean, AEST) | `analytics_events_clean` | de-botted traffic |
| Leads + lead rate | `lead_submissions` | the money metric |
| Indexed-page count | GSC coverage | confirms the Sprint-1 doorway prune (should drop, intended) |

## Dependencies that need Alex
1. **GSC OAuth** (his Google account) — the single biggest unlock; ~10 min, I'll guide step-by-step.
2. **Apply the `20260601` migration** to the live DB (or authorise me to run it via service-role).
3. **Perplexity probe** spend decision (enable paid AI-citation probing + a hard cost cap, or stay manual).

## Sequencing
A (foundation) → B (time control) + C (drill-down) → D (IA rebuild), each on a branch, verified, gated deploy, logged in `releases.ts`. Phase A item 1 (GSC) is the critical path — start there.
