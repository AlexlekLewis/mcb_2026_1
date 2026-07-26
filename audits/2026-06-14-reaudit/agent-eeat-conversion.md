# E-E-A-T / Trust + Conversion RE-AUDIT — Modern Curtains and Blinds

**Date:** 2026-06-24
**Lens:** Conversion-rate optimization & E-E-A-T/trust strategy. Read-only, evidence-based.
**Site:** https://www.moderncurtainsandblinds.com.au · Repo: `/Users/alexlewis/Documents/Claude/Projects/MCB_WEBSITE_2026/repo`
**Baseline:** `audits/2026-06-14-growth-audit/agent-eeat-conversion.md` (grade B−)
**Conversion reality (unchanged):** ~92 humans/mo, ~68% bounce, ~4 leads/30d, ~4.3% lead rate. Too low for A/B testing — recommendations are high-confidence best-practice, not experiments.

**Method:** Verified each original finding against (a) current repo source and (b) the live production site. Sprint 1 (commit `039d63e`) was SEO/schema-only; the only conversion-adjacent change since is the `/terms` rewrite (commit `53867b5`). Two uncommitted WIP edits exist on disk (`GoogleReviewsWidget.tsx`, `Footer.tsx`) — **neither is deployed**, and as written neither resolves its finding (analysis below).

---

## Open vs Resolved — original findings

| # | Sev | Finding | Status | Evidence (2026-06-24) |
|---|-----|---------|--------|------------------------|
| 1 | P0 | Owners Deane & Dee never named on-page (no bio/photo names) | **OPEN** | Live `/our-story` and `/about` name no one; photo alt still "Modern Curtains and Blinds owners". `our-story/page.tsx:21`, `about/page.tsx:24-32` — no names, no bios. |
| 2 | P0 | Genuine reviews invisible — Elfsight "Loading…" embed; 12 real reviews unused | **OPEN** | Live home, `/blinds/roller-blinds` both show "Loading Google reviews…". `GoogleReviewsWidget.tsx:45-58` still Elfsight-only. `CURATED_REVIEWS` / `REVIEW_AGGREGATE` in `customer-reviews.ts` still render only inside `QuoteForm`. WIP edit is cosmetic (see note). |
| 3 | P0 | Pricing-transparency promise unkept — `/pricing-policy` promises per-product indicative ranges; no product page shows a price | **OPEN — now worse-framed** | `ProductTemplate.tsx` still has no price field (grep = 0 hits). Live `/pricing-policy` still states "Each product page shows the date its indicative range was last updated… 'as at [Month YYYY]'" and "The pricing shown on our product pages is indicative only" — a concrete promise of something no product page delivers. |
| 4 | P1 | No street address / real NAP anywhere | **OPEN** | `Footer.tsx:70` still "Melbourne, Victoria, Australia (We come to you)"; `contact/page.tsx:34` "Melbourne, Victoria. We come to you." No ABN, no entity, no address. |
| 5 | P1 | Quote form — 3 needless required fields (bestContactTime, projectStage, referral) | **OPEN** | `QuoteForm.tsx:130-135` `section3Valid` still requires `bestContactTime` AND `projectStage` AND `referralComplete`; `referralRequiresName` (`:41`) still forces referrer-name for "Friend or family" / "Repeat customer". Unchanged from baseline. |
| 6 | P1 | No honeypot / rate-limit / CAPTCHA on `/api/quote` | **OPEN** | grep for honeypot/rate-limit/captcha across `route.ts`, `QuoteForm.tsx`, `middleware.ts` = **none**. `route.ts:514` still fires `triggerOptimizationRun()` per POST on top of 2 emails + Supabase write. |
| 7 | P1 | Payright finance banner at literal top of every page | **OPEN** | `layout.tsx:78` still mounts `<PaymentOptions variant="banner" topOffset />` before `<main>`. Live home + product pages show "Interest free payment plans available" high above the value prop. |
| 8 | P2 | Trust claims asserted not substantiated ("30+ Years", "5-Year Warranty" unlinked, "Australian Made & Owned" no entity) | **OPEN** | `cro-data.ts` trustItems unchanged; warranty still not linked to `/terms` from the proof bar; no ABN/entity surfaced. |
| 9 | P2 | Footer social links likely placeholder (`facebook.com/moderncurtains`, `instagram.com/moderncurtains`) | **OPEN (partially touched)** | Both generic handles still present (`Footer.tsx:32-33`). WIP removed only the dead `linkedin.com` icon — FB/IG handles still unverified. |
| 10 | P2 | Repeat-customer / friend referral forces extra required text field | **OPEN** | `QuoteForm.tsx:41` `referralRequiresName` unchanged — warmest leads still must type a referrer name to submit. |
| 11 | P3 | "Read more reviews" links to `/#google-reviews` (the embed that may not load) | **OPEN** | Unchanged; still points at the Elfsight section that shows "Loading…". |

**Score: 0 of 11 original findings resolved.** Sprint 1's note in the brief holds — it was SEO/schema only and did not touch conversion/trust UX. The review schema being scoped to homepage-only does not change any of the above (reviews remain schema-only, never visible on-page).

---

## WIP edits on disk (uncommitted, NOT deployed) — do they help?

**`GoogleReviewsWidget.tsx` (106 lines changed):** Pure layout restructure — collapses the two-column card into a compact header bar and swaps a hand-rolled `<Link>` for the tracked `<PrimaryCTA>` (good for tracking consistency). **It still renders the identical Elfsight embed and the same "Loading Google reviews…" placeholder.** It does **not** server-render the real `CURATED_REVIEWS` / `REVIEW_AGGREGATE`. So Finding #2 stays fully open even if this WIP ships. Net effect if deployed: a tidier shell around the same broken-feeling empty state.

**`Footer.tsx` (3 lines):** Removes the placeholder LinkedIn icon only. The unverified `facebook.com/moderncurtains` and `instagram.com/moderncurtains` handles remain (Finding #9 partially addressed — the worst of the three is gone, two still unverified).

Recommendation: when these WIPs are finished, fold in the actual fix for #2 (render curated reviews + "5.0 from 47" as server HTML) before committing — the widget is already open for edit, so the high-value fix is cheap to add now. Each is customer-facing → must get a `releases.ts` entry per CLAUDE.md.

---

## New `/terms` change — conversion-impact assessment

The `/terms` rewrite (commit `53867b5`) added, under **Payment and Order Policies**:

1. **Consultations** — "Your first consultation is free and carries no obligation. A second consultation is charged at $250, payable at the time of the consultation. If your job proceeds, the $250 is deducted from your quoted price — so the second consultation is effectively free. If you choose not to proceed, the $250 is retained as the consultation fee."
2. **Order Placement and Deposit** — "Once you confirm your order, the deposit becomes immediately due and payable. We do not schedule production or place your order with our suppliers until the deposit has been received." (50% deposit.)
3. **Commercial Orders** — PO-in-lieu-of-deposit terms for trade clients (sensible, low consumer-conversion relevance).

**Verdict: fine as written, *because* it is correctly contained to `/terms` — but it carries a latent risk if it ever leaks up-funnel.** Reasoning:

- **It does NOT create friction at the quote stage today.** Live `/quote` still says "Free & no obligation" and "Free in-home measure" with no fee or deposit language. The first (and only marketed) consultation remains free. A prospect filling the form encounters zero new cost signal. The $250 only applies to a *second* consult, and the deposit only to a *confirmed order* — both well past the lead conversion this site optimizes for. So the funnel-stage placement is currently correct: friction terms live where committed buyers read them, not where leads are captured.
- **The $250 second-consult fee is defensible and even on-brand.** For a "quality, qualify-out price-shoppers" middle-tier business, charging for a second site visit deters tyre-kickers and is framed well (fully credited if the job proceeds; "effectively free"). It protects Deane & Dee's time without touching the warm top-of-funnel.
- **The one thing to watch:** the framing "$250 retained as the consultation fee" if you don't proceed reads slightly punitive out of context. As long as it stays buried in `/terms` it's invisible to 99% of leads. The risk is purely if this language ever migrates into the quote flow, the chat widget's answers, or a confirmation email — there it *would* read as a bait-and-switch against the "Free & no obligation" promise and dampen lead rate. **Action: keep it `/terms`-only. Do not surface "$250"/"deposit immediately due" in the quote UI, the post-submit success screen, or the ChatWidget.** Confirm the ChatWidget's pricing answers don't quote it.
- Minor consistency note: `/terms` Warranty still says "A $150.00 service fee may apply for all claims within 12 months. $150.00 service fee will apply for claims processed after 12 months" — the "may apply within 12 months / will apply after" wording is muddled, and a flat warranty service fee sits awkwardly beside the proof-bar's unqualified "5-Year Warranty" claim (Finding #8). Worth a copy pass, low priority.

**No new conversion regression introduced** by the `/terms` change. It is well-staged. Flagging only the do-not-leak-upward guardrail.

---

## Newly introduced / newly observed

- **Tracking-discipline gap risk:** the two WIP edits are customer-facing (home + every product page render `GoogleReviewsWidget`; footer is global). Per CLAUDE.md's optimization-tracking rule, both need a `releases.ts` entry when shipped. No entry exists yet (expected — they're uncommitted). Flag so they aren't committed without it.
- **`/terms` length:** the page is now very long (consultation + deposit + commercial + 12-section online-roller-blind terms). Not a conversion problem (legal page, low traffic), but the new consumer-relevant clauses (consultation fee, deposit timing) are buried mid-page with no anchor/summary — if a diligent buyer is hunting for "what will this cost me to start," it's hard to find. Optional: a short "Before you book" plain-English summary box up top. Low priority.
- **Nothing resolved since baseline.** The only material shipped change (`/terms`) is net-neutral-to-positive for conversion and does not touch any open finding.

---

## Updated grade: **B−** (unchanged)

Rationale: the baseline grade was driven by the gap between strong *asserted* trust (excellent CTAs, warm post-submit, disciplined funnel) and weak *demonstrated* trust (invisible owners, invisible reviews, hollow pricing promise). None of those moved. The `/terms` change is competent and correctly staged but doesn't lift the trust surface a non-converting visitor sees. The genuinely good foundations from the baseline ("What's already good") all still hold — so this is a held B−, not a downgrade. It becomes a B+/A− the moment Findings #1 and #2 ship, because both are low-effort and reuse assets already in the repo.

---

## Top 3 conversion / trust priorities (re-confirmed, re-ordered for the WIP context)

1. **Finish the `GoogleReviewsWidget` WIP by actually rendering the real reviews (P0 #2) + name Deane & Dee (P0 #1).** The widget is already open on disk — don't ship a cosmetic-only restructure that keeps the "Loading…" empty state. Server-render the 12 `CURATED_REVIEWS` + "5.0 from 47 Google reviews" (`REVIEW_AGGREGATE`) as static HTML on home and product pages, keeping Elfsight only as a progressive enhancement. In the same pass, add named founder bios + the owner photo with alt "Deane and Dee, owners of Modern Curtains and Blinds" to `/our-story` and `/about`. These two are the cheapest, highest-trust fixes on the site and reuse assets already in the codebase. Log both in `releases.ts`.

2. **Cut quote-form friction to essentials + add a honeypot (P1 #5 + #6 together).** Flip `section3Valid` so submit unlocks at suburb + product + name + phone + email; make `projectStage`, `referral`, and the conditional referrer-name optional (the team can ask on the callback). Pair it with a hidden honeypot field + min-submit-time check in `QuoteForm` and a per-IP rate limit on `/api/quote` so loosening the form doesn't invite spam that buries 4 real leads/mo and runs up email/optimization-run cost. Both are low-effort gate flips.

3. **Resolve the pricing-policy contradiction and demote the finance banner (P0 #3 + P1 #7).** Decide one way on pricing: either add an indicative-range field to `ProductTemplate` and ship ranges with the date stamp + T&Cs `/pricing-policy` already promises (captures the AI-search/PAA price-capture value), or trim the policy so it stops promising per-product prices that don't exist — the current state actively undermines trust for anyone who reads the policy then finds no prices. Concurrently, move the Payright banner out of the top-of-every-page slot (`layout.tsx:78`) so each page leads with the quality value prop + a now-visible rating, not interest-free finance — which undercuts the intended middle-tier, qualify-out positioning. **And hold the line: keep the new `/terms` $250-second-consult / deposit-on-confirmation language *out* of the quote UI, success screen, and ChatWidget** so the up-funnel "Free & no obligation" promise stays clean.
