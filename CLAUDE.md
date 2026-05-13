# CLAUDE.md

Brief context for Claude / future agents working in this repo. Read this before touching anything that affects the live site.

---

## What this is

Next.js 16 marketing site for **Modern Curtains and Blinds** (Melbourne window-furnishings business).

- Live: https://moderncurtainsandblinds.com.au
- Admin dashboard: `/dashboard` (password-protected via `DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD` env vars)
- Primary success metric: **quote-form lead submissions**
- Secondary metrics: phone taps, page engagement, scroll depth
- Stack: Next.js 16 App Router, TypeScript, Tailwind v4, Supabase, Vercel
- Repo root for app code: this directory. The parent dir contains `staging/` (raw asset files) — never include it in deploys.

---

## ⚠️ OPTIMIZATION TRACKING DISCIPLINE (most important rule in this file)

Every meaningful change shipped to production MUST be logged in `src/lib/dashboard/releases.ts` in the same commit. The dashboard's **Releases & Results** panel reads this list and computes before/after deltas at 24h, 48h, and 7d windows — that's how we know whether anything actually worked.

**Without this discipline, we accumulate optimizations whose effect is unknown, and the site bloats with changes that may have made things worse.**

### When to add a release entry

Add one when the change should plausibly move any of these:
- Bounce rate / pages-per-session / engaged time
- Quote CTA clicks or phone taps
- Lead submissions
- Organic traffic / SERP rankings
- Conversion rate by channel

Examples that warrant a release entry:
- New hero copy
- A redirect change (e.g. `/products/* → /curtains/*`)
- Schema-markup adjustments
- SEO content edits to high-traffic pages
- A new CTA placement or copy
- A change to the quote form flow
- Adding tracking that affects what counts as a "session"
- Performance work (LCP, CLS improvements)

### When NOT to log a release

- Pure refactors that don't change observable behaviour
- TypeScript / lint fixes
- Documentation-only changes
- Dependency bumps that don't change runtime behaviour
- Internal admin pages (`/dashboard/*`) — these aren't customer-facing

### How to add an entry

Edit `src/lib/dashboard/releases.ts` and prepend a new `Release` object to `RELEASES`:

```ts
{
  id: "2026-05-20-utm-launch",
  title: "Social UTMs live in IG / FB / GBP",
  releasedAt: "2026-05-20T08:00:00Z", // UTC, time you actually deploy
  summary: "1–2 line description for the dashboard.",
  items: [
    "Bullet of what specifically changed",
    "Another bullet",
  ],
  commitUrl: "https://github.com/AlexlekLewis/mcb_2026_1/commit/<sha>",
}
```

Commit the release entry **alongside the code change**, not separately. The timestamp should match deployment time. The Vercel deploy URL is fine if no GitHub commit URL exists yet.

### Reading the results

Open `/dashboard` after the release goes live and watch the windows fill in:

| Window | When meaningful | What you're looking for |
|---|---|---|
| 24h | Next day | Did the new code start firing? Are there obvious regressions? |
| 48h | Day 3 | Is the 24h trend holding? |
| 7d | Day 8 | Statistically more meaningful — if deltas are > 15% on human traffic, the change probably worked. Smaller deltas at this volume = noise. |

### Killing things that don't work

If 7d data shows **no improvement** or a **regression**:

1. **Revert** the change, OR
2. Add a note to the release entry explaining why you're keeping it anyway (e.g. "scrolling down still worse but the new CTA is more legible — keeping while we gather more data")

Don't silently accept failed optimizations. Most CRO experiments fail — the discipline is to kill what doesn't work, not to assume everything ships forever.

### What "meaningful" means at MCB's volume

As of 2026-05-13 the site sees ~92 real humans/month. At that volume:
- Deltas < 20% week-over-week are noise
- A/B tests need 6+ months per arm to reach significance — don't run them unless monthly humans > 250
- Focus optimization energy on traffic growth (SEO, content, channel UTMs), not CTR experiments

---

## Project conventions

### Tracking

- All quote CTAs MUST be rendered via `<PrimaryCTA>` (`src/components/PrimaryCTA.tsx`). Don't write raw `<Link href="/quote">` for the quote action — tracking will be inconsistent.
- New analytics events get added to `src/lib/analytics.ts` in the header docblock AND with a one-line description there. Treat that docblock as the schema.
- A/B test flag keys are reserved in `src/lib/experiments.ts` header — add your key there before opening a PR.

### Data layer

- Supabase project: `lrhgrmklpvwyjzaipioh.supabase.co`
- Service-role key in `.env.local` (`SUPABASE_SERVICE_ROLE_KEY`). Never commit it.
- Migrations live in `supabase/migrations/`. The Supabase MCP that's connected at the moment points at a **different project** (cricket academy) — do NOT run migrations through it. Apply via the Supabase SQL editor at https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new.
- Bot-filtering view is `analytics_events_clean`. Headline KPIs should read from there. Raw `analytics_events` retains everything.

### File ownership (don't touch without coordination)

These files have outsized blast radius:

- `src/lib/site.ts` — site-wide config (phone, URL, service area)
- `src/lib/analytics.ts` — event vocabulary
- `src/lib/experiments.ts` — flag keys
- `src/components/PrimaryCTA.tsx` — CTA primitive
- `src/middleware.ts` — auth + bot detection
- `src/app/layout.tsx` — global mounting order

### Locations / SEO

- 693 suburb pages live at `/locations/[suburb]` and `/locations/[suburb]/[product]`
- Region-keyed copy lives in `src/lib/region-content.ts` — bucketed by bearing from Melbourne CBD
- The site has had thin-content issues; do NOT add another templated mass-page system without writing genuinely unique copy or a redirect strategy
- Sitemap dates are pinned to constants in `src/app/sitemap.ts` — do NOT change to `new Date()` (signals content-farm freshness to Google across 600+ URLs)

---

## Dev commands

```bash
# from /repo
npm run build           # production build (must be clean before deploy)
npx tsc --noEmit        # type check
npx eslint --max-warnings 0 <files>   # lint (zero warnings or build fails)
vercel deploy --prod    # production deploy (Vercel CLI from /repo)
```

**Always type-check + lint + build locally before pushing.** Vercel build failures on main are visible to anyone with the deploy URL.

---

## Things to NOT do

- Add new quote CTAs outside `<PrimaryCTA>` (tracking breaks)
- Start an A/B experiment when monthly humans < 250 (won't reach significance)
- Set `lastModified: new Date()` on the sitemap (content-farm signal)
- Repeat the same `aggregateRating` across many `LocalBusinessSchema` instances (schema spam)
- Run migrations through the connected Supabase MCP (wrong project)
- Commit `.env.local` or any Vercel env values
- Skip the release log when shipping anything customer-facing

---

## Current state snapshot (2026-05-13)

- ~92 real humans/month, ~68% bounce, 4 leads / 30d, 4.3% lead rate
- Bot share of raw analytics: ~78% (SearchAtlas, meta-externalagent, etc.) — filtered out by `analytics_events_clean`
- Google Ads is auto-tagging via `gclid` (working). Social channels (IG, FB, email, GBP) need manual UTMs — see `audits/UTM_LINKS_TO_PASTE.md`
- Search Console sync scaffolded; needs OAuth env vars set per `audits/SEARCH_CONSOLE_SETUP.md`
- Supabase clean-view migration pending apply (file: `supabase/migrations/20260513_analytics_clean_view.sql`)
- Pre-swarm CTA primitives shipped. CRO swarm parked until traffic supports experiments (see `audits/SWARM_OWNERSHIP.md`)
