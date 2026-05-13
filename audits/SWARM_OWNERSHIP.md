# CRO Swarm — Ownership & Branch Rules

This doc governs the agent swarm that's rolling out the CRO + analytics improvements.
Every agent reads it before opening a PR. Lead agent (Alex / human-in-the-loop)
owns updates to this file.

## Pre-swarm primitives landed on `main` (2026-05-13)

| Piece | File(s) | Notes |
|---|---|---|
| Shared CTA component | `src/components/PrimaryCTA.tsx`, `src/lib/hooks/useImpression.ts` | All quote CTAs must funnel through this. Variants: `hero / section / sticky-mobile / sticky-desktop / inline / navbar / decision-card / mobile-menu / nav-megamenu`. Style presets: `primary / light / ghost / dark / link`. |
| Experiment / flag layer | `src/lib/experiments.ts` | Deterministic FNV-1a hash bucketing off `mcb_visitor_id`. No external dep. URL override: `?mcb_exp_<key>=<variant>` for QA. |
| Tracking vocabulary | `src/lib/analytics.ts` (header docblock) | Reserved event names. Adding a new event = update the docblock in the same PR. |
| Bot-filtered SQL surface | `supabase/migrations/20260513_analytics_clean_view.sql` | Defines `is_bot_user_agent(text)`, `analytics_events_clean` view, plus `dashboard_traffic_quality_30d`, `dashboard_engagement_totals_30d_clean`, `dashboard_cta_performance_30d`, `dashboard_experiment_results_30d`. **Apply via Supabase SQL editor** when dashboard recovers. |

## File-ownership table

These files are **locked** — only the lead agent edits them. Other agents that
need a change here open a PR-comment request, not a direct edit.

| File | Owner | Why locked |
|---|---|---|
| `src/app/layout.tsx` | Lead | Shared mount order. |
| `src/middleware.ts` | Lead / Agent 1 | Bot detection sits here. |
| `src/lib/analytics.ts` | Lead | Vocabulary contract. |
| `src/lib/experiments.ts` | Lead | Reserved flag keys live in header. |
| `src/lib/site.ts` | Lead | Trust line copy + `quoteHref`. |
| `src/components/PrimaryCTA.tsx` | Lead | Single source of truth for CTA styling + tracking. |
| `src/lib/hooks/useImpression.ts` | Lead | Used by PrimaryCTA. |

Every other component file in `src/` is owned by **exactly one** agent at a time.
Two agents touching the same component = merge conflict; the second blocks until
the first lands.

## Reserved experiment keys

| Key | Owner | Status |
|---|---|---|
| `hero_cta_v2` | Agent 2 | Pending |
| `sticky_dismissable` | Agent 4 | Pending |
| `chat_v2` | Agent 6 | Pending |

Add new keys to this table **before** opening a PR. Header comment in
`experiments.ts` must match this table.

## Wave / dependency order

```
Pre-swarm (Lead, done)
        │
        ▼
┌───── Wave 1 (parallel) ─────┐
│  Agent 1 — bot filter       │
│  Agent 5 — UTM + attribution│
│  Agent 6 — chat experiment  │
└──────────────┬──────────────┘
               │
┌───── Wave 2 (parallel after Wave 1) ─────┐
│  Agent 2 — hero CTA experiment           │
│  Agent 3 — curtains-page rescue          │
│  Agent 4 — sticky-mobile upgrade         │
│  Agent 8 — validation dashboard          │
└──────────────┬───────────────────────────┘
               │
        ▼
   Wave 3
   Agent 7 — awnings-pattern replication
```

## Per-agent contracts

### Agent 1 — `bot-traffic-filter`
- **Branch:** `feat/cro-1-bot-filter`
- **Touches:** `src/middleware.ts`, `src/app/api/analytics/event/route.ts`, new `supabase/migrations/2026MMDD_bot_column.sql`
- **Deliverable:** `is_bot` boolean column written at ingest; backfill historical via `update analytics_events set is_bot = is_bot_user_agent(user_agent) where is_bot is null;`. The `analytics_events_clean` view (already shipped today) can switch from regex to column lookup once backfilled.
- **Acceptance:** `dashboard_traffic_quality_30d` returns a real bot_share_pct. Clean session count drops 30–60% vs raw. 9–10pm spike disappears from `analytics_events_clean`.

### Agent 2 — `hero-cta-conversion`
- **Branch:** `feat/cro-2-hero-cta`
- **Touches:** `src/components/Hero.tsx` ONLY
- **Deliverable:** Experiment `hero_cta_v2` with variants `control / static / video`. Use `getVariant("hero_cta_v2", ["control", "static", "video"])`. All variants render `PrimaryCTA location="hero"`.
- **Acceptance:** `cta_impression { location: "hero" }` ≥ 95% of hero views. Static/video CTRs ≥ 1.5× control on clean data over 14 days, 95% CI excludes zero. No regression on `phone_tap`.

### Agent 3 — `curtains-page-rescue`
- **Branch:** `feat/cro-3-curtains-rescue`
- **Touches:** `src/app/curtains/page.tsx`, `src/components/ProductTemplate.tsx` (props only)
- **Deliverable:** Verify `EngagementTracker` is firing (today shows 0). Add a 3-choice decision card (Sheer / Blockout / Double) each with inline `PrimaryCTA location="decision-card"`. Match the awnings pattern.
- **Acceptance:** /curtains logs `scroll_milestone:25` events at >40% of visitor count. `quote_cta_click` from `/curtains` rises from ~0 to match `/awnings` per-100-visitor rate.

### Agent 4 — `sticky-cta-upgrade`
- **Branch:** `feat/cro-4-sticky-cta`
- **Touches:** `src/components/StickyMobileCTA.tsx` ONLY
- **Deliverable:** Show after 150px OR 8s (currently 300px). Add a "Call" tap target alongside the quote CTA. Fire `cta_impression { location: "sticky-mobile" }` on first appearance. 24h-dismissible variant gated on `sticky_dismissable` flag.
- **Acceptance:** `cta_impression { location: "sticky-mobile" }` fires on ≥90% of mobile sessions with scroll-depth >25%. CTR on impressions ≥ 4%.

### Agent 5 — `utm-and-attribution`
- **Branch:** `feat/cro-5-utm`
- **Touches:** `src/lib/site.ts` (add `withUtm()`), `README.md` UTM doc, new `src/app/api/analytics/channel-rollup/route.ts`
- **Deliverable:** Documented UTM conventions for 6 owned channels (GBP, email, IG bio, FB, business cards, direct mail QR). Pre-generated URLs to paste into GBP and IG. Channel rollup endpoint that buckets traffic by referrer + UTM + landing path heuristics.
- **Acceptance:** Within 14 days of GBP/IG/email updates, "Direct" share drops from 87% → <40%.

### Agent 6 — `chat-widget-or-remove`
- **Branch:** `feat/cro-6-chat-experiment`
- **Touches:** `src/components/ChatWidget.tsx`, `src/app/layout.tsx` (mount conditional)
- **Deliverable:** 3-arm experiment `chat_v2`: (A) hidden, (B) current, (C) collapsed "call me back" → short form.
- **Acceptance:** 14-day decision. If C generates ≥1 lead per 200 sessions, ship C. Otherwise ship A.

### Agent 7 — `awnings-pattern-replication`
- **Branch:** `feat/cro-7-replicate-pattern`
- **Touches:** `src/lib/cro-data.ts`, 5 blinds sub-pages (roller, venetian, plantation, roman, honeycomb), 3 curtains sub-pages (sheer, blockout, s-fold)
- **Deliverable:** Apply winning awnings pattern (narrower scope, decision-led, denser internal links).
- **Acceptance:** Each retrofitted page reaches ≥10 visitors AND ≥1 `quote_cta_click` within 30 days on clean data.

### Agent 8 — `validation-dashboard`
- **Branch:** `feat/cro-8-validation-dashboard`
- **Touches:** `src/app/dashboard/optimization/*`, new dashboard panels
- **Deliverable:** Per-experiment cards (assignment counts, exposure → conversion, CI on lift) reading `dashboard_experiment_results_30d`. Channel rollup tile from Agent 5. Bot vs human split from `dashboard_traffic_quality_30d`. Pre/post comparison with hard cut-off `event_timestamp >= '2026-05-13'`. CTA performance table from `dashboard_cta_performance_30d`.
- **Acceptance:** "Is variant A winning?" answerable without SQL.

## Branch & merge discipline

- All branches off the same `main` commit AFTER pre-swarm primitives landed (today, 2026-05-13).
- One agent = one PR. Don't bundle.
- Each PR includes a screen recording of the variant in action plus a check that `npm run build` is clean.
- Lead agent merges in wave order. No skipping waves.

## Assets

Each agent prefixes new files in `/public` with `agent-<n>-` to avoid name collisions.

## Risk register

See [audits/SWARM_PLAN.md](./SWARM_PLAN.md) (forthcoming) for the full risk + forecast doc.
