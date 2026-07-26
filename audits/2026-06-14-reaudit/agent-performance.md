# MCB — Performance RE-AUDIT

**Date:** 2026-06-24
**Scope:** Live https://www.moderncurtainsandblinds.com.au + repo. READ-ONLY (no edits/deploys).
**Baseline:** `audits/2026-06-14-growth-audit/agent-performance.md` (graded **B+**).
**Method:** Live `curl` (headers, TTFB, over-wire/uncompressed bytes, image format/cache probes with correct `Accept`), repo source reads, git history since baseline. Lighthouse/LCP/INP field timings cannot be run here — anything not directly measured is **labelled (est.)**.

---

## TL;DR

Sprint 1 (commit `039d63e`, 2026-06-14) was **SEO/schema only** and, as expected, **touched nothing on the performance critical path**. The one `next.config.ts` edit it made was a **redirect-only** change (collapsed the `/curtains/velvet-curtains` chain to a single 308) — the `images` block is byte-for-byte unchanged. The single later commit (`53867b5`, `/terms` copy) added ~33 lines of static text to one page and has **no perf impact**.

**Every P1 and P2 performance item from the baseline is still open and re-confirmed live.** Nothing regressed in the wire/cache profile. One item the baseline under-reported: a **third-party Elfsight reviews script** (`static.elfsight.com/platform.js`) loads on the homepage + product pages — it pre-dates the baseline (so not a new regression) but contradicts the baseline's "no third-party blocking scripts" all-clear. It is deferred (`lazyOnload`), which mitigates the blocking risk.

**Grade: holds at B+** (unchanged — no fixes shipped, no regressions). The wire-level fundamentals (brotli, edge HIT, immutable static cache, dashboard-lib isolation) remain excellent; the same two structural P1s (hero JPEG sequence, Framer Motion in global bundle) keep it off an A.

---

## Still-open vs resolved

| Baseline item | Sev | Status | Re-confirmed evidence (2026-06-24, Sydney edge) |
|---|---|---|---|
| Hero 48-frame JPEG scroll-sequence bypasses `next/image`, `max-age=0` | P1 | **STILL OPEN** | `/images/hero-sequence-optimized/0002.jpg` → `image/jpeg`, **143,055 B**, `cache-control: public, max-age=0, must-revalidate`. 48 frames / **6.5 MB** on disk. `HeroScroll.tsx:101` still `new window.Image(); src=".../000N.jpg"`. |
| Framer Motion in initial bundle on every page | P1 | **STILL OPEN** | Homepage chunk `a6dad97d9634a72d.js` = 110 KB raw / **41 KB brotli**, still carries framer markers. Total homepage JS = **260 KB brotli / 15 chunks**. No `dynamic()` in `layout.tsx` or components; `ChatWidget` still eager. |
| No `fetchPriority="high"` on LCP hero | P2 | **STILL OPEN** | Homepage HTML has exactly **one** `fetchPriority` and it is `="low"` (on a script preload). Hero poster `HeroScroll.tsx:269` still `priority` only, no `fetchPriority`. Both `logo-nav.png` **and** `0001.jpg` still preloaded `as="image"` (still competing). |
| avif not enabled | P2 | **STILL OPEN** | Poster requested with `Accept: image/avif,image/webp` still returns **`image/webp`** (80,508 B). `next.config.ts` images block has **no `formats`**. |
| Optimized images `max-age=0, must-revalidate` (no `minimumCacheTTL`) | P2 | **STILL OPEN** | `_next/image?...0001.jpg&w=1920` → webp, `cache-control: public, max-age=0, must-revalidate`. `next.config.ts` sets no `minimumCacheTTL`. |
| `prefers-reduced-motion` honored in only 1 of 8 motion components | P2 | **STILL OPEN** | Guard present only in `HeroScroll.tsx`. `Navbar`, `ChatWidget`, `StickyMobileCTA`, `Hero`, `ProcessTimeline`, `ProjectGallery`, `ProductTemplate` — **none**. |
| 37 MB dead raw frames + heavy assets in `public/` | P2 | **STILL OPEN** | `public/` = **163 MB**; `public/images/hero-sequence/` = **37 MB**, still **not referenced** in `src/`. |
| Tailwind v4 CSS ~87 KB uncompressed | P3 | STILL OPEN (low) | Unchanged; compresses well, acceptable post-brotli. |
| Cold ISR pages slow on first hit | P3 | STILL OPEN (expected) | `/locations/richmond` cold TTFB **0.97s**, then HIT **0.12s**. Expected ISR behaviour. |
| Suburb pages 7 JSON-LD blocks | P3 | STILL OPEN (fine) | `/locations/richmond` still 7 `ld+json` blocks. Homepage now 6 (was 2) — Sprint 1 scoped review schema to homepage; lean, not a perf concern. |
| **Third-party Elfsight reviews script** | **NEW (under-reported)** | **OPEN — not a regression** | `GoogleReviewsWidget.tsx:49-53` loads `static.elfsight.com/platform/platform.js` on `/` + product pages. Pre-dates baseline (last touched before `039d63e`). Deferred (`strategy="lazyOnload" async` + `data-elfsight-app-lazy`), so non-blocking — but it's an uncacheable third-party origin (extra DNS/TLS, its own JS + review images) the baseline's "no third-party scripts" all-clear missed. |

**Resolved since baseline:** none (Sprint 1 was SEO-only by design).
**New regressions introduced since baseline:** none on the wire/cache profile.

---

## Current measured numbers (live, 2026-06-24, Sydney/syd1 edge)

| Page | Cache | TTFB (HIT) | Cold TTFB | Uncompressed HTML | Over-wire (brotli) | JSON-LD | DOM tags |
|---|---|---|---|---|---|---|---|
| `/` | HIT + prerender | **0.13s** | — | 153,521 B | **19,408 B** | 6 blocks | 593 |
| `/curtains/theatre-velvet` | HIT + prerender | **0.12s** | 0.88s | 81,711 B | **13,708 B** | 3 blocks | 458 |
| `/locations/richmond` | HIT + prerender | **0.12s** | 0.97s | 109,842 B | **16,501 B** | 7 blocks | 592 |

- Homepage total JS over-wire: **260 KB brotli / 15 chunks** (baseline measured 254 KB / 15 — within noise; no material change).
- Hero animation frame `0002.jpg`: **143,055 B raw JPEG**, `max-age=0`. Hero poster via `_next/image`: **80,508 B webp** (no avif).
- All `_next/static` JS/CSS still `cache-control: public, max-age=31536000, immutable` + `content-encoding: br` (correct).
- `/curtains/velvet` now `308 → /curtains/theatre-velvet` (Sprint 1 redirect-chain collapse working; single hop).

### Still good (re-verified)
- **Brotli everywhere**, **edge HIT + prerender** on all three page types, **immutable static cache** intact.
- **Dashboard libs still NOT on marketing routes** — `recharts`/`leaflet`/`react-leaflet`/`leaflet.heat` appear only under `src/**/dashboard/**`. The two `@supabase/supabase-js` hits outside dashboard (`lib/optimization/collectors.ts`, `weights.ts`) are **`import type` only** (type-erased, zero runtime) and are imported solely by **API/cron routes**, never by a marketing component. Isolation holds.
- LCP poster still `next/image priority sizes="100vw"` + preloaded, served webp.
- Hero sequence still correctly gated behind `prefers-reduced-motion` + `max-width:480px` (mobile/reduced-motion users get poster only).

---

## Top 3 performance priorities (unchanged from baseline — none addressed)

1. **Fix the hero frame delivery (P1).** Route the 47 animation frames through proper optimization (webp/avif + immutable long-cache), cut frame count/resolution, **or** swap the canvas sequence for the existing `Curtains_Hero.mp4`. Still ~6.5 MB of re-validated JPEG + per-frame `drawImage` (desktop INP risk). Biggest single CWV win.
2. **Get Framer Motion off the critical path (P1).** `next/dynamic` the below-fold `ChatWidget` (`ssr:false`); add `experimental.optimizePackageImports: ['framer-motion','lucide-react']`; convert trivial Navbar/StickyCTA motion to CSS. Trims the 260 KB initial JS materially.
3. **Cheap config wins (P2, ~30 min, all still unset):** add `fetchPriority="high"` to the hero poster (and drop the competing nav-logo preload); set `images.minimumCacheTTL` (e.g. 2592000) so optimized images stop re-validating each navigation; enable `images.formats: ['image/avif','image/webp']`; delete the unreferenced 37 MB `public/images/hero-sequence/`. **Plus newly surfaced:** verify the Elfsight reviews widget's real client-side weight (it's `lazyOnload`, so low blocking risk, but it is the only third-party origin on the marketing pages) — consider whether a static/cached review snapshot would beat the live third-party loader.

---

### Notes on what changed in the repo since baseline
- `039d63e` (Sprint 1, SEO): noindex doorway tier, scoped review schema to homepage, canonicals, **redirect-only** `next.config.ts` edit, dropped root `og:url`. No perf-path code touched. Homepage JSON-LD went 2 → 6 blocks (review schema now concentrated here, still lean).
- `53867b5` (`/terms`): +33 lines static legal copy on one page. No perf impact.
- `GoogleReviewsWidget` (Elfsight): **not** changed since baseline — it was already live; the baseline simply didn't catch it.
