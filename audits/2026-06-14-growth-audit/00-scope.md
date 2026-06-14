# MCB Growth Audit — Phase 0: Scope & Baseline
_Date: 2026-06-14 · Mode: `--audit-only` (report-first, no deploys, no secrets echoed)_

## Target (fingerprinted, confirmed)
- **Business:** Modern Curtains and Blinds (MCB) — family-owned (Deane & Dee), Preston-based, greater-Melbourne window furnishings.
- **Live:** https://www.moderncurtainsandblinds.com.au  (apex 307→ www)
- **Stack:** Next.js 16.1.2 (App Router) · React 19 · Tailwind v4 · Framer Motion 12 · Supabase · Recharts · Leaflet · Vercel (project `mcb_2026_1`, node 24.x).
- **Repo:** `repo/` (GitHub `AlexlekLewis/mcb_2026_1`). Parent dir holds `staging/` (assets, not deployed).
- **Primary conversion:** quote-form lead submission. Secondary: phone taps, engagement/scroll.

## Surface area
- Core marketing pages: home, 6 category hubs (curtains/blinds/shutters/security/awnings/motorisation), contact, about, our-story, quote, projects, pricing-policy, privacy, terms.
- ~80 product/sub-product pages under the category hubs.
- **693 templated suburb pages** (`/locations/[suburb]` + `/locations/[suburb]/[product]`) + 12 hand-built location pages. CLAUDE.md flags prior thin-content issues here.
- 6 growth-corridor guide pages (`/guides/*`).
- Dashboard + automation layer (`/dashboard`, 8 Vercel crons: optimization, AI-citation probe, GSC sync, freshness sweep, question discovery, digest, suburb-uniqueness audit).
- Agentic assets present: `public/llms.txt`, `public/llms-full.txt`.

## Baseline scoreboard (from CLAUDE.md snapshot 2026-05-13 — to be refreshed from GSC/analytics)
| Metric | Value | Note |
|---|---|---|
| Real humans/month | ~92 | bot share ~78% of raw analytics, filtered via `analytics_events_clean` |
| Bounce | ~68% | |
| Leads / 30d | 4 | primary metric |
| Lead rate | 4.3% | of real humans |
| GSC | scaffolded, not wired | OAuth env vars pending (`audits/SEARCH_CONSOLE_SETUP.md`) |

**Demand reality:** single-metro service business. The 1–2k/day north-star far exceeds current Preston-radius local demand; growth path is the existing lever set — more genuinely-unique service+geo pages, informational/top-of-funnel guides, and the agentic surface. Audit prioritises fixing what blocks capture before adding more pages.

## Early findings surfaced during scoping (feed into Phase 1)
1. **Host/canonical inconsistency** — apex 307→www; rendered `og:url` = www; but `site.ts`, `sitemap.ts` default, static `public/llms.txt`, and `CLAUDE.md` all use apex. Prod env (`NEXT_PUBLIC_BASE_URL`) overrides to www. Static `llms.txt` still emits apex URLs (which redirect).
2. **No `<link rel="canonical">` on homepage** (Next emits it only when `alternates.canonical` is set; root layout doesn't). Need to confirm coverage across page types.
3. **Homepage weight/speed** — ~154 KB HTML, ~1.0s TTFB on a Vercel cache HIT (`x-vercel-cache: HIT`, prerendered). Heavier/slower than expected for a static prerender.
4. **Review/AggregateRating schema on homepage** — 6 `Review` + `AggregateRating` + 8 `Person`. Must reconcile with the "no third-party reviews on MCB site" policy and Google's genuine-review requirement (fabricated review schema = manual-action risk). **High priority to verify.**

## Guardrails (confirmed for this run)
- Report-first. No code changes, no deploys, no migrations. Nothing ships without explicit approval.
- No secrets printed/committed (`.env.local`, service-role key, Vercel env — by path only).
- No paid-API loops. Live checks via plain HTTP only.
- Treat the 2026-06-09 cost-security audit as covering the spend/exposure lane; this pass focuses on growth (technical/on-page/AEO/E-E-A-T/conversion/perf).

## Method
Five-lens audit fanned out to a parallel expert team (technical SEO, performance/CWV, on-page SEO & content depth, AEO/GEO/agentic, E-E-A-T & conversion). Findings consolidated into `01-audit.md`, prioritised by impact × effort.
