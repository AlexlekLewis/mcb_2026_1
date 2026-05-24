# Suburb Consolidation Runbook

**Created:** 2026-05-24
**Owner:** Alex

How to use the suburb consolidation tooling to reduce the 693 templated `/locations/[suburb]` pages down to ~8 deep regional pages — the defensive move against the December 2025 Helpful Content Update.

---

## Why this exists

The Dec 2025 Core Update specifically targeted "large-scale programmatic content from templates, bulk prompts, or automated aggregation". The 693 suburb pages — generated from a single template with thin per-suburb variation — sit in the danger zone. The Helpful Content System scores at site-level, so a fleet of thin pages can drag down the cornerstone pages that ARE good.

Documented winning pattern post-2024: fewer pages, each with genuinely unique data. Successful programmatic SEO sites (Nomad List, Zapier integrations) typically run ~50 deep pages over 700 thin ones.

---

## The workflow

### Step 1 — Audit (automated, monthly)

Cron `/api/cron/suburb-uniqueness-audit` runs on the **1st of each month at 14:00 UTC** (00:00 AEST). Each run:

- Fetches 60 suburb URLs (rotated by day-of-month so the full set covers in ~12 months)
- Strips chrome (nav, footer, scripts, styles)
- Computes Jaccard similarity vs a baseline page
- Writes `unique_pct`, `unique_word_count`, and a `recommendation` (keep / consolidate / redirect) to `public.suburb_audit`

To run on-demand (e.g. first time, or after a content change):

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://moderncurtainsandblinds.com.au/api/cron/suburb-uniqueness-audit
```

### Step 2 — Review the proposal

Open `/dashboard/content/suburb-audit`. You'll see:

- **Top KPIs:** total pages audited, recommended to consolidate, recommended to keep, regional clusters
- **Regional cluster proposal table:** how many pages per region, current organic clicks, target landing URL
- **Per-page audit results:** sorted by lowest uniqueness first (most consolidation candidates at top)
- **"View consolidation plan" button:** generates a markdown plan including the redirect map

### Step 3 — Generate the consolidation plan

Click "View consolidation plan" on the suburb audit page. Copies a markdown doc to your clipboard with:

1. Summary stats
2. Per-region breakdown
3. Per-region detail (which pages to consolidate vs keep)
4. A ready-to-paste TS redirect map

The thresholds used (tunable in `src/lib/dashboard/v2/suburb-cluster.ts`):

```ts
const KEEP_THRESHOLD_UNIQUE_PCT = 40;
const KEEP_THRESHOLD_CLICKS_30D = 50;
```

Keep if `unique_pct >= 40%` OR `organic_clicks_30d >= 50`. Otherwise consolidate.

### Step 4 — Ship the redirect map

Paste the generated TS into a new file:

```ts
// src/lib/suburb-redirects.ts
export const SUBURB_REDIRECTS: Record<string, string> = {
  "/locations/some-suburb": "/locations/north",
  // ...
};
```

Then extend `src/middleware.ts` to check this map for incoming `/locations/*` requests and return a 301 if matched. (This is the only piece NOT auto-generated — it's a deliberate manual ship so you can sanity-check the list first.)

### Step 5 — Create the regional landing pages

For each region (north / north-east / east / south-east / south / bayside / west / north-west), create a deep landing page at `/locations/<region>/page.tsx` with:

- Real local content (suburbs covered, install lead times, photos of jobs in the region, region-specific style notes)
- Statistics (Princeton GEO: +37-41% citation lift for stat-rich content)
- Reviews from clients in the region
- LocalBusiness schema referencing the region

### Step 6 — Update sitemap

Remove the 600+ consolidated suburb URLs from `src/app/sitemap.ts`. Add the 8 regional pages.

### Step 7 — Resubmit sitemap to Google Search Console

Force a re-crawl of the cleaned-up structure.

---

## Expected impact

Per the strategy memo and the December 2025 Core Update notes:

- **Within ~30 days of the redirect ship:** the dragged-down quality scoring on good pages (homepage, cornerstone product pages) should start to lift.
- **Within ~90 days:** if the consolidation is sound, organic traffic to retained pages (homepage + cornerstones + the 8 new regional pages) typically rises by 10-25%, even though total indexed URL count drops by ~95%.
- **Risk:** if a suburb page was actually ranking and capturing leads, redirecting it kills that signal. The KEEP threshold of 50 clicks/30d is conservative — but watch GSC closely for 30 days post-ship and unwind any redirects that lost meaningful traffic.

---

## Tunable knobs

In `src/lib/dashboard/v2/suburb-cluster.ts`:

- `KEEP_THRESHOLD_UNIQUE_PCT` — raise to be MORE aggressive about consolidation (more pages redirected)
- `KEEP_THRESHOLD_CLICKS_30D` — raise to keep MORE pages with traffic (less aggressive)
- Cluster targeting — currently uses Melbourne region buckets (north / east / etc). If you want suburb-cluster pages instead (e.g. "Hampton + Brighton + Sandringham" as one bayside page), modify `buildClusterProposals()` to group by a different bucket function.

In `src/app/api/cron/suburb-uniqueness-audit/route.ts`:

- `CAP = 60` — pages-per-run cap. Raise if Vercel function maxDuration allows.
- `tokenise()` minimum word length (4) — raise to reduce noise tokens.

---

## What this runbook does NOT cover

- **Writing the regional page content.** That's a manual content job, one page at a time. The strategy memo's top-10 questions are a good source of section ideas.
- **Updating `region-content.ts`.** The cluster targets live there if you want region-specific copy on the regional pages.
- **Adjusting `LOCATIONS` array.** The suburb list is the source of truth for which pages get audited.

---

## Files involved

| File | What |
|---|---|
| `src/app/api/cron/suburb-uniqueness-audit/route.ts` | The monthly audit cron |
| `src/lib/dashboard/v2/suburb-cluster.ts` | Cluster proposal + plan markdown generator |
| `src/app/dashboard/(with-sidebar)/content/suburb-audit/page.tsx` | Dashboard surface |
| `src/components/dashboard/v2/ConsolidationPlanModal.tsx` | Plan copy-to-clipboard |
| `supabase/migrations/20260522_ai_search_strategy.sql` | The `suburb_audit` table |
| `src/lib/region-content.ts` | Region bucket definitions |
| `src/lib/locations.ts` | Suburb list source-of-truth |
