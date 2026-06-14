# MCB — Core Web Vitals / Performance Audit

**Date:** 2026-06-14
**Scope:** Live https://www.moderncurtainsandblinds.com.au + repo. READ-ONLY (no edits/deploys).
**Method:** Live `curl` (headers, TTFB, transfer bytes, compression), repo source reads, existing `.next/` build artifacts. No `npm run build` was needed. Lighthouse/LCP timings cannot be run here — anything not directly measured is **labelled (est.)**.

---

## Headline correction to the surfaced lead

The "~154 KB homepage" is the **uncompressed** HTML. Over the wire it is **brotli-compressed to 19.5 KB**, and TTFB on a cache HIT is **~120 ms** (not 1.0s) from Sydney edge.

- Measured: `content-encoding: br`, `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`, `time_starttransfer: 0.120s`, `size_download: 19,563` bytes (brotli) vs `153,945` bytes (decompressed).
- Of the 154 KB uncompressed: **~70 KB is the RSC flight payload** (`self.__next_f.push`, 32 chunks) and ~75 KB total inline `<script>`; JSON-LD is only **4.8 KB**; DOM is modest (**~598 tags**); inline `style=` attrs: 16. **The HTML payload is NOT the problem** — it compresses ~87% and the DOM is small. The real CWV risks are the JS bundle and the hero image sequence.

---

## Findings table

| Sev | Finding | Evidence (measured / file:line) | Fix | Impact × Effort |
|---|---|---|---|---|
| **P1** | **Hero is a 48-frame JPEG scroll-sequence; the 47 animation frames bypass `next/image`** — loaded via raw `new Image()` as `.jpg`, so no webp/avif conversion, no resizing, and served with `cache-control: max-age=0, must-revalidate` (re-validated every load). ~6.5 MB total. | `HeroScroll.tsx:97-121` (`new window.Image(); img.src = "/images/hero-sequence-optimized/000N.jpg"`); raw frame fetch = `image/jpeg`, `143,055` bytes, `cache-control: public, max-age=0, must-revalidate`; dir = 48 frames / 6.5 MB | Convert frames to webp/avif; serve from an immutable-cached path; reduce frame count or resolution; or replace the canvas sequence with the existing `Curtains_Hero.mp4` (4 MB) | High × Med |
| **P1** | **Framer Motion ships in the initial bundle on EVERY page** (incl. homepage) via globally-mounted client components Navbar, ChatWidget, StickyMobileCTA. | `layout.tsx:62-71` mounts them globally; framer-motion imported in `Navbar.tsx`, `ChatWidget.tsx`, `StickyMobileCTA.tsx`, `HeroScroll.tsx` + 4 more; homepage-delivered chunk `a6dad97d9634a72d.js` (110 KB raw) contains framer-motion code — confirmed loaded on `/`. Total homepage JS = **254 KB brotli** | `next/dynamic` the ChatWidget (largest, 639 lines / 31 KB src, below-fold); add `optimizePackageImports` for `framer-motion`+`lucide-react`; replace trivial Navbar/StickyCTA motion with CSS transitions | High × Med |
| **P2** | **No `fetchpriority="high"` on the LCP hero image.** Poster is correctly `next/image priority` + preloaded, but it competes with the nav-logo preload. | `HeroScroll.tsx:265-274` (`priority` set, no `fetchPriority`); homepage `<head>` preloads BOTH `logo-nav.png` AND `0001.jpg` as images; `grep fetchpriority="high"` = 0 | Add `fetchPriority="high"` to hero poster; drop `priority`/preload on the nav logo (small, not LCP) | Med × Low |
| **P2** | **Framer Motion ignores `prefers-reduced-motion` everywhere except HeroScroll.** Scroll/entrance animations run regardless of user setting (a11y + main-thread cost). | `useReducedMotion`/`prefers-reduced-motion` found ONLY in `HeroScroll.tsx:66`; framer-motion animations in `Navbar`, `ChatWidget`, `StickyMobileCTA`, `Hero`, `ProcessTimeline`, `ProjectGallery`, `ProductTemplate` have no guard | Wrap motion in `useReducedMotion()` checks or gate with the `motion-reduce:` Tailwind variant | Med × Low |
| **P2** | **Optimized images get `cache-control: max-age=0, must-revalidate` to the browser** — every navigation re-validates each `_next/image` request (304 round-trips). | `_next/image?...0001.jpg` → `cache-control: public, max-age=0, must-revalidate` (webp, 80,508 bytes, but revalidated each load); `next.config.ts` sets no `minimumCacheTTL` | Set `images.minimumCacheTTL` (e.g. 2592000) in `next.config.ts` so optimized images carry a long browser TTL | Med × Low |
| **P2** | **37 MB of unused raw hero frames + heavy unoptimized assets sit in `public/`** (163 MB total; deploys/bloats build). Raw `public/images/hero-sequence/` (37 MB) is **not referenced** in `src/`. | `du -sh public/` = 163M; `public/images/hero-sequence/` = 37M, `grep -rl "hero-sequence/" src/` = none; `Curtain_Animation.gif` = 7.7 MB; 11 product PNGs > 2 MB each | Delete unreferenced `public/images/hero-sequence/`; convert the >2 MB product PNGs to webp; drop the 7.7 MB GIF (mp4 twin exists) | Med × Low |
| **P2** | **avif not enabled** — `next.config.ts` has no `images.formats`, so Next serves webp only (default), not the smaller avif. | `next.config.ts` images block has `remotePatterns` only; no `formats`; hero served as `image/webp` (confirmed) | Add `images.formats: ['image/avif','image/webp']` | Low-Med × Low |
| **P3** | **Tailwind v4 CSS is 87 KB uncompressed** (10 KB second sheet). Compresses well but large for a marketing site. | `.next/static/chunks/35fd9531...css` = 87.3 KB on disk; delivered with brotli | Verify Tailwind content globbing isn't over-including; acceptable post-brotli | Low × Low |
| **P3** | **Cold product/suburb pages are slow on first hit** (PRERENDER then HIT). | `/curtains/velvet` first hit: `x-vercel-cache: PRERENDER`, TTFB **1.42s**; subsequent = HIT ~0.1s. Suburb `/locations/richmond` HIT TTFB 0.92s | Expected ISR cold-start behaviour; consider warming top pages or longer `s-maxage` | Low × Low |
| **P3** | **Suburb pages carry 7 JSON-LD blocks (7.4 KB).** Heaviest structured-data payload of the three page types. | `/locations/richmond`: 7 × `application/ld+json` = 7,377 bytes; DOM 594 tags; 115 KB uncompressed → 17.6 KB brotli | Fine for SEO; only trim if blocks duplicate | Low × Low |

---

## Details for P1 items (measured numbers)

### P1 — Hero JPEG sequence (LCP + bandwidth + cache)
The homepage hero (`HeroScroll.tsx`) is a **scroll-scrubbed canvas animation of 48 JPEG frames**.

- **LCP element:** the poster image `0001.jpg`, rendered correctly via `next/image` with `fill priority sizes="100vw"` and preloaded in `<head>`. Served as **webp, 80.5 KB @ 1920w** (good). The canvas then fades in over it.
- **The problem is the other 47 frames.** They are loaded imperatively (`new window.Image(); img.src = "/images/hero-sequence-optimized/000N.jpg"`, `HeroScroll.tsx:101-103`). Because they don't go through `next/image`:
  - served as **raw JPEG ~143 KB each** (measured `0002.jpg` = 143,055 bytes), no webp/avif, no responsive resize;
  - served with **`cache-control: public, max-age=0, must-revalidate`** — re-validated on every visit;
  - total sequence on disk = **6.5 MB** (`hero-sequence-optimized/`).
- Loading is throttled (8 frames eager via `initialPreload`, rest on `requestIdleCallback`/700ms timeout with 30ms gaps, `HeroScroll.tsx:178-215`) and **correctly gated behind `prefers-reduced-motion` and `max-width:480px`** (`HeroScroll.tsx:65-81`) — so mobile and reduced-motion users get only the poster. Good. But on desktop this is ~6.5 MB of re-validated JPEG plus per-frame `drawImage` on scroll (main-thread INP risk).
- **Fix priority:** convert frames to webp/avif and serve from an immutable path (`max-age=31536000, immutable`); or drop to ~24 frames / lower res; or swap the canvas for the existing `public/assets/Curtains_Hero.mp4` (4 MB, hardware-decoded) which removes the per-frame JS entirely.

### P1 — Framer Motion in the global bundle
`layout.tsx` mounts `Navbar`, `ChatWidget`, `StickyMobileCTA` (all `"use client"`, all importing `framer-motion`) on **every route**. Measured: a homepage-delivered chunk (`a6dad97d9634a72d.js`, 110 KB raw) contains framer-motion code, and **total homepage JS = 254 KB brotli-compressed** (15 unique `/_next/static` chunks).

- `ChatWidget` is the worst offender to ship eagerly: **639 lines / 31 KB source**, fully below the fold, never needed for first paint. It is **not** `next/dynamic`-imported (`grep dynamic(` in layout/components = none).
- `Navbar` uses 4 `motion.` calls, `StickyMobileCTA` 2 — both trivial (slide/fade) and replaceable with CSS, which would let framer-motion drop out of the critical path on pages that don't otherwise use it.
- No `experimental.optimizePackageImports` is set, so `lucide-react` (35 import sites) and `framer-motion` aren't barrel-optimized.
- **Fix:** `dynamic(() => import('@/components/ChatWidget'), { ssr: false })`; add `optimizePackageImports: ['framer-motion','lucide-react']`; convert Navbar/StickyCTA motion to CSS.

---

## What's already good (verified)

- **Brotli compression everywhere** — HTML 154 KB → 19.5 KB; static JS/CSS delivered `content-encoding: br`.
- **Static prerender + edge cache** — homepage `x-nextjs-prerender: 1`, `x-vercel-cache: HIT`, TTFB ~120 ms.
- **`/_next/static` JS/CSS is correctly immutable** — `cache-control: public, max-age=31536000, immutable` + brotli.
- **Dashboard-only libs are NOT leaking onto marketing routes** — `recharts`, `leaflet`, `react-leaflet`, `leaflet.heat` appear ONLY under `src/**/dashboard/**` (`grep` outside dashboard = none). Supabase client is not imported by any marketing component. This is the single biggest thing done right.
- **LCP hero poster done right** — `next/image` with `priority`, `sizes="100vw"`, preloaded, served as webp.
- **`font-display: swap`** present (11 font-faces); both `next/font` fonts self-hosted woff2 and preloaded → low font-CLS risk.
- **No CLS from sticky/fixed chrome** — Navbar bars are `fixed` and `PaymentOptions` banner reserves `~112px` (`topOffset`), `StickyMobileCTA` is `fixed bottom-0` (overlays, doesn't push). All `next/image` instances carry width/height or `fill`.
- **DOM is small** (~458–598 tags/page) and JSON-LD is lean (4.7–7.4 KB).
- **No external/third-party blocking scripts** — ChatWidget and analytics are self-hosted React, no external `<script src>` to a vendor; analytics is first-party.

---

## Top 3 performance priorities

1. **Fix the hero frame delivery (P1).** Route the 47 animation frames through proper optimization: webp/avif + immutable long-cache, fewer/smaller frames, OR replace the canvas sequence with the existing `Curtains_Hero.mp4`. Removes ~6.5 MB of re-validated JPEG and the per-frame main-thread `drawImage` work (INP). Biggest single CWV win for desktop.
2. **Get Framer Motion off the critical path (P1).** `next/dynamic` the below-fold `ChatWidget` (`ssr:false`) and add `experimental.optimizePackageImports: ['framer-motion','lucide-react']`. Trims the 254 KB initial JS materially; convert trivial Navbar/StickyCTA motion to CSS so framer-motion isn't forced into every page's first load.
3. **Cheap config wins (P2, ~30 min total):** add `fetchPriority="high"` to the hero poster (and drop the competing nav-logo preload); set `images.minimumCacheTTL` so optimized images stop re-validating every navigation; enable `images.formats: ['image/avif','image/webp']`; and delete the unreferenced 37 MB `public/images/hero-sequence/` raw frames.

---

### Measurement appendix (live, 2026-06-14, Sydney edge)
| Page | Cache | TTFB | HTML (uncompressed) | Over-wire (brotli) | JSON-LD | DOM tags |
|---|---|---|---|---|---|---|
| `/` | HIT | 0.12s | 153,945 B | 19,563 B | 4,788 B (2 blocks) | ~598 |
| `/curtains/velvet` | HIT (PRERENDER cold = 1.42s) | 0.10s | 86,779 B | 14,724 B | 4,676 B | ~458 |
| `/locations/richmond` | HIT | 0.92s | 115,284 B | 17,638 B | 7,377 B (7 blocks) | ~594 |

- Homepage total JS: **254 KB brotli** (15 chunks). Hero sequence: **48 frames / 6.5 MB** (`-optimized`) + **37 MB unused raw**. `public/` total: **163 MB**.
