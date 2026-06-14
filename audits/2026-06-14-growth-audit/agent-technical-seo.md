# Technical SEO Audit — Modern Curtains and Blinds

**Date:** 2026-06-14
**Auditor:** Senior Technical SEO engineer (read-only)
**Live host (prod):** https://www.moderncurtainsandblinds.com.au (apex 307-redirects to www)
**Method:** Code review of repo + live fetches as Googlebot UA. Evidence-based; no invented metrics.

---

## Findings table

| Sev | Finding | Evidence (file:line / live URL + observation) | Fix | Impact × Effort |
|---|---|---|---|---|
| **P0** | **Massive sitemap bloat: 33,321 URLs.** Sitemap emits 693 suburbs × 48 location-products = 33,264 thin templated URLs on a site with ~92 humans/month. | Live `GET /sitemap.xml` → 33,321 `<loc>` (6.9 MB). `src/app/sitemap.ts:102-109` flat-maps `LOCATIONS × LOCATION_PRODUCTS` (693 × 48). `src/lib/location-products.ts:14` = 48 products. CLAUDE.md warns site "has had thin-content issues". | Trim to indexable money pages: keep 693 suburb hubs + the ~12 featured location-products per suburb (`FEATURED_LOCATION_PRODUCTS`), `noindex,follow` the long tail OR consolidate. Don't submit 33k thin URLs. | H × M |
| **P0** | **Canonical missing on ~38 indexable pages**, incl. the homepage, ALL 6 category hubs (`/blinds`, `/curtains`, `/shutters`, `/security`), `/locations` hub, `/about`, `/contact`, and ~24 product pages. | Live: `GET /` → "NO canonical link found"; `GET /blinds` → no `<link rel=canonical>`. `src/app/page.tsx` exports **no** `metadata`. `src/app/blinds/page.tsx:5-8` metadata has title+desc only, no `alternates`. Diff of all `page.tsx` vs files containing `canonical` lists 38 gaps. | Add self-referencing `alternates.canonical` to the root layout default (relative `/` resolves via `metadataBase`) and to every category/product/static page lacking it. | H × M |
| **P1** | **Redirect chain on `/curtains/velvet-curtains` (2 hops).** `next.config.ts` redirects it to `/curtains/velvet`, which then in-page redirects to `/curtains/theatre-velvet`. | Live: `/curtains/velvet-curtains` →308→ `/curtains/velvet` →307→ `/curtains/theatre-velvet` (200, num_redirects=2). `next.config.ts:41-45` targets `/curtains/velvet`; `src/app/curtains/velvet/page.tsx:4` `redirect("/curtains/theatre-velvet")`. | Point the `next.config.ts` redirect straight to `/curtains/theatre-velvet`. Collapse to a single 308. | M × L |
| **P1** | **og:url is wrong on every page that doesn't set its own OpenGraph** — it inherits the root layout's `url:'/'` and resolves to the homepage, so non-home pages advertise the homepage as their OG canonical. | Live: `/blinds` and `/curtains/sheer` both emit `og:url=https://www.moderncurtainsandblinds.com.au` (homepage). Source: `src/app/layout.tsx:29` `url:'/'`. Location-product template overrides openGraph so it's fine there; most category/product pages don't. | Remove the static `url` from root `openGraph`, or set per-page `openGraph.url` to match the page's canonical. | M × L |
| **P1** | **Near-duplicate titles/descriptions across 693 suburb pages.** Only suburb name + postcode vary. | Live titles: `Curtains & Blinds Preston/Brunswick/Footscray \| Free Quote \| ...` identical pattern. Descriptions identical except name+postcode. `src/app/locations/[suburb]/page.tsx:59-60`. Compounds the bloat risk. | Vary title/description by region bucket (region-content.ts already exists) or product mix; combine with the sitemap trim. | M × M |
| **P2** | **`robots.txt` disallows phantom `/admin/`; real admin is `/dashboard`.** Dead rule; `/dashboard` not explicitly blocked (relies on auth redirect + login noindex). | Live `GET /robots.txt`: `Disallow: /admin/`. `src/app/robots.ts:11`. No `/admin` route exists. `/dashboard` is the admin (CLAUDE.md). | Replace `/admin/` with `/dashboard/` in `robots.ts` disallow. (Auth + login `noindex` already protect it — this is hygiene.) | L × L |
| **P2** | **Static `public/llms.txt` emits apex URLs that 307-redirect to www.** Inconsistent canonical host vs live www render. | `public/llms.txt`: 7× `https://moderncurtainsandblinds.com.au` (no www). Live apex →307→ www. Lead #1 confirmed. `src/lib/site.ts:3` and `CLAUDE.md` also default to apex. | Update `llms.txt` (and `site.ts` default / CLAUDE.md) to www to match prod. Set `NEXT_PUBLIC_BASE_URL` consistently. | L × L |
| **P2** | **Apex→www is a 307 (temporary), not 301/308.** Google treats 307 as temporary; weaker host-consolidation signal than a permanent redirect. | Live `GET https://moderncurtainsandblinds.com.au/` → `HTTP/2 307`, `location: https://www.…/` (path preserved). http→https is correctly 308. | If configurable at Vercel domain level, make the apex→www redirect permanent (308). | M × L |
| **P2** | **`<html lang="en">`, not `en-AU`; no hreflang.** Single-locale AU business; minor but easy locale signal. | Live homepage `<html lang="en"`. `src/app/layout.tsx:68` `lang="en"`. No `hreflang` tags. | Set `lang="en-AU"`. hreflang not required (single locale). | L × L |
| **P3** | **36 of 48 location-products per suburb not linked from their parent suburb page** (only first 12 linked). Reachable only via sibling-product lists + sitemap → deep crawl depth. | `src/app/locations/[suburb]/page.tsx:168` `LOCATION_PRODUCTS.slice(0, 12)`. Live `/locations/preston/roller-blinds` links 17 siblings + 6 nearby suburbs but **0** links to the national `/blinds/roller-blinds` money page. | If keeping these pages, link all products from the suburb hub and add a link from each suburb-product to its national product page (equity to money pages). Most resolve via the sitemap trim. | M × M |
| **P3** | **Inner `/dashboard/(with-sidebar)/*` pages have no `noindex` of their own.** Protected only by middleware auth redirect. Defense-in-depth gap. | `src/app/dashboard/(with-sidebar)/layout.tsx` has no `robots` metadata. Only `/dashboard/login` sets `noindex` (`src/app/dashboard/login/page.tsx:7-10`). Middleware 307s unauth users to login. | Add `robots:{index:false,follow:false}` to the `(with-sidebar)` dashboard layout as a belt-and-braces. | L × L |

---

## Details (P0 / P1)

### P0-1 — Sitemap bloat (33,321 URLs)
`src/app/sitemap.ts` builds four tiers. The location-product tier is the problem:
```ts
// sitemap.ts:102-109
const locationProductRoutes = LOCATIONS.flatMap((loc) =>
  LOCATION_PRODUCTS.map((product) => ({ url: `${baseUrl}/locations/${loc.slug}/${product.slug}`, ... }))
)
```
With **693 suburbs** (live sitemap: exactly 693 suburb-only `/locations/X` URLs) and **48** `LOCATION_PRODUCTS`, that is **693 × 48 = 33,264** location-product URLs, plus 693 suburb hubs, plus ~57 core/product = **33,321 total** (verified live, 6.9 MB sitemap). The task brief's "693 location + location-product URLs" understates the real footprint by ~50×.

These are templated pages (`generateMetadata` produces formulaic title/description; body is region-bucketed but heavily patterned). At ~92 real humans/month, submitting 33k thin URLs is a textbook content-farm crawl-budget and quality signal. CLAUDE.md explicitly flags prior thin-content issues and forbids "another templated mass-page system without genuinely unique copy or a redirect strategy" — the sitemap currently exposes the full matrix anyway.

**Note (good):** `lastModified` is pinned to constants (`CORE/PRODUCT/LOCATION_LAST_MODIFIED`), not `new Date()` — correct freshness discipline. Don't break that.

### P0-2 — Canonical coverage gaps
`metadataBase` is set (`layout.tsx:20` → `new URL(SITE.url)`), so relative canonicals resolve to absolute www URLs in prod (confirmed: pages that DO set `alternates.canonical` emit correct self-referencing `https://www.…` canonicals live — e.g. `/blinds/roller-blinds`, `/locations/preston`, `/locations/preston/roller-blinds`, `/curtains/sheer`, the guide).

But the root layout sets **no** default canonical, and the homepage + 6 category hubs + `/locations` hub + many static/product pages never add one:
- Live `GET /` → no `<link rel="canonical">` (homepage has no `metadata` export at all — `src/app/page.tsx`).
- Live `GET /blinds` → no canonical (`src/app/blinds/page.tsx:5-8` is title+description only).
- Full gap list (38 files) from diffing every `page.tsx` against files containing `canonical`: homepage, `/blinds`, `/curtains`, `/shutters`, `/security`, `/locations`, `/about`, `/contact`, `/our-story`, `/projects`, `/privacy`, `/terms`, `/shutters/plantation-shutters`, and ~24 product pages (`roller-blinds`, `honeycomb-blinds`, `venetian-blinds`, `roman-blinds`, `vertical-blinds`, `panel-glide`, `security/security-doors`, `security/fly-screens`, etc.).

Without a self-canonical, Google chooses its own canonical — risky given parameterised URLs (`/quote?product=`) and the apex/www duplication. Cleanest fix: add a default `alternates.canonical` derivation, or set one per page.

### P1-1 — Redirect chain (verified live)
```
/curtains/velvet-curtains  →308→  /curtains/velvet  →307→  /curtains/theatre-velvet  (200)
```
`next.config.ts:41-45` sends `velvet-curtains → /curtains/velvet`, but `/curtains/velvet/page.tsx` is itself a `redirect("/curtains/theatre-velvet")` stub. Two hops. Fix: change the `next.config.ts` destination to `/curtains/theatre-velvet`. (The product-canonical redirects `/products/* → /curtains/*` are clean single 308s — verified `/products/sheer-curtains →308→ /curtains/sheer`.)

### P1-2 — og:url inheritance
`layout.tsx:29` sets `openGraph.url:'/'`. Next.js merges OpenGraph; pages that don't define their own `openGraph` inherit the homepage URL. Live proof: `/curtains/sheer` has a correct canonical but `og:url=…com.au` (homepage). The location and location-product templates set their own openGraph (fine). Category and most product pages do not. og:url is a secondary signal (canonical is authoritative and correct where set), hence P1 not P0, but it's an easy consistency fix.

---

## What's already good (don't break)

- **metadataBase is set** (`layout.tsx:20`) — relative canonicals resolve to absolute www URLs in prod.
- **Canonicals that exist are correct**: self-referencing, absolute, point to www, no canonical points at a redirecting URL (verified live on product/suburb/suburb-product/guide).
- **Sitemap is host-consistent**: 33,321/33,321 `<loc>` are www, 0 apex — matches the live render host.
- **`/products/*` correctly excluded from sitemap**: all 32 `productData` slugs map to canonical category paths, so the sitemap filter (`sitemap.ts:86-93`) emits zero `/products/*` URLs (verified live).
- **Sitemap `lastModified` pinned to constants**, not `new Date()` — avoids content-farm freshness signal. Keep it.
- **Googlebot is NOT blocked.** `src/middleware.ts` only logs bot identity and returns `NextResponse.next()` — no blocking, no cloaking. Crawlers get the same HTML.
- **Dashboard is safe from indexing**: `/dashboard` 307-redirects unauthenticated requests to `/dashboard/login`, which carries `robots: noindex,nofollow` (verified live).
- **Product canonical redirects are clean single 308s** (`/products/* → /curtains/*`), permanent.
- **trailing-slash → 308 to no-slash**, **http → 308 https** — both correct and consistent.
- **Viewport meta present**; `NEXT_PUBLIC_NOINDEX` kill-switch wired correctly in `layout.tsx:48-58` (currently index=true in prod — verified `index, follow` live).
- **Suburb hubs are crawlable in 2 clicks**: home → `/locations` (footer link) → all 693 suburbs listed on the hub (verified 693 links live).

---

## Top 3 technical priorities

1. **Trim the 33k-URL sitemap (P0).** Cut the location-product matrix down to the indexable money pages (suburb hubs + featured products), `noindex,follow` or consolidate the long tail. This is the single biggest quality/crawl-budget lever for a 92-human/month site and directly addresses the documented thin-content history.
2. **Close the canonical gap (P0).** Add a default self-referencing `alternates.canonical` (homepage + 6 category hubs + `/locations` + ~24 product/static pages currently have none). Pair with fixing the inherited `og:url` so OG and canonical agree.
3. **Fix the redirect chain + host hygiene (P1/P2).** Collapse `/curtains/velvet-curtains` to a single 308 to `/curtains/theatre-velvet`; make apex→www permanent (308) if Vercel allows; align `llms.txt`/`site.ts`/`robots.ts` (`/admin/`→`/dashboard/`) to the www host the site actually serves.
