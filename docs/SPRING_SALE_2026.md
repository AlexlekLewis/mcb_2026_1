# Spring Sale 2026 — plan and proposal

**Status:** SIGNED OFF 2026-09-02. Offer locked to **Option C — pre-Christmas
installation urgency, no discount**. The modal is live in code (`enabled: true` in
`src/lib/promotions.ts`) and goes live on the site at the next deploy.

**Window:** 1 Sept 2026 until the last order-by date passes.

## The locked offer

| Product group | Order by | Why |
|---|---|---|
| **Plantation shutters** | **Wed 30 September 2026** | Longer production lead time, so it has to close first |
| **All other products** | **Mon 30 November 2026** | Shorter lead time |

Both are conditional: **installation dates are allocated as orders are confirmed, and
pre-Christmas spots are filling fast.** Meeting an order-by date does not on its own
guarantee a pre-Christmas installation — that is confirmed in writing after the on-site
measure.

The modal filters out a deadline the moment it passes, so from 1 October the shutters
line disappears rather than advertising a cut-off that has been and gone, and the whole
campaign self-retires on 1 December.

---

## 1. The strategic problem with a discount sale

MCB's whole on-site position is *quality at affordable prices* — the middle tier —
and the copy deliberately talks price-only shoppers **out** of buying, using the
consequences of cheap window furnishings.

A headline "20% OFF EVERYTHING" sale contradicts that in three ways:

1. **It recruits exactly the buyer the site qualifies out.** Discount-led traffic
   converts worse on a considered, measured, installed product, and it wastes
   in-home measure appointments — the most expensive thing in the funnel.
2. **It devalues the written quote.** If the price moves 20% because of the
   calendar, the quote reads as padded.
3. **It is hard to withdraw.** Customers who bought in October at a discount and
   see full price in December feel stung, and the discount becomes the new price.

**Recommendation: don't discount. Sell the deadline instead.**

---

## 2. The honest urgency lever

Custom window furnishings have real lead times. That is a genuine, verifiable
deadline — not a fake countdown:

> Order by **[date]** to be measured, made and installed **before Christmas**.

This is the strongest spring angle MCB has, and it costs nothing in margin. It also
happens to be true, which matters for a business that trades on straight talk.

Melbourne spring gives three real triggers, in order of strength:

| Trigger | What it sells | Why now |
|---|---|---|
| Summer sun is coming | Sunscreen rollers, blockout for west-facing rooms, outdoor awnings, zipscreens | People feel the first hot week and act |
| Flies and mozzies | Fly screens, security doors, pet mesh | Same week, different symptom |
| Guests before Christmas | Curtains, plantation shutters — the "front of house" products | Deadline is self-imposed and real |

---

## 3. Offer options

As presented. **C was selected.**

### A. Free upgrade, not money off *(not taken)*
> "Book your measure this spring and we'll upgrade one room to motorised at no charge."

- Protects the headline price and the positioning.
- Motorisation is a convenience upgrade (not a thermal one — keep the claim honest),
  which makes it a genuine treat rather than a markdown.
- Naturally caps cost: one room, not the house.
- Easy to withdraw at the end of November without resetting price expectations.

### B. Whole-home threshold
> "Three rooms or more this spring and installation is on us."

- Rewards basket size instead of cutting unit price.
- Suits the growth-corridor new-build buyer doing a whole house at once.
- Needs a floor (e.g. minimum order value) so it can't be gamed on three tiny windows.

### C. Deadline-only, no offer at all *(SELECTED)*
> "Order by [date] for pre-Christmas installation."

- Zero margin cost, fully on-brand, no terms to police.
- Weakest pull for a cold visitor, strongest for someone already deciding.
- The right fallback if Deane/Dee don't want to commit margin.

### D. Percentage discount *(not recommended — see §1)*
If it has to happen, cap it hard: a single product line, a fixed dollar amount rather
than a percentage, and never sitewide.

---

## 4. The traffic reality — read this before expecting much

The site sees roughly **92 real humans a month** and converts about **4 leads / 30 days**.
A modal on that traffic is worth maybe a lead or two across the whole campaign. It is
worth shipping because it is cheap, but **the sale will live or die on demand
generation, not on-site conversion.**

Where the volume actually has to come from, in priority order:

1. **Past customers.** Highest-intent list MCB owns. A house rarely gets all its
   windows done at once — the second-room conversation is the easiest sale in the
   business. One email plus one SMS.
2. **Google Ads.** The account is already running on the A$1,179 lead model. Spring
   creative + a seasonal sitelink is a same-week change.
3. **Google Business Profile.** A GBP offer post plus fresh install photos. Free, and
   it feeds the local pack where MCB already appears.
4. **Growth-corridor estates.** The Tarneit / Wollert / Clyde North / Deanside cohort
   already has dedicated pages. New-build buyers in those estates are the single best
   spring audience — they have bare windows and a move-in deadline.
5. **On-site modal + banner.** Last, not first.

---

## 5. Six-week calendar

| Week | Action | Owner |
|---|---|---|
| 1 | ~~Lock the offer + terms~~ — done, modal is enabled. Deploy the branch | Dev |
| 1 | GBP offer post + 5 fresh install photos | MCB |
| 2 | Past-customer email — "second room" angle | MCB |
| 2 | Google Ads: spring RSA headlines + seasonal sitelink | Ads workstream |
| 3 | Past-customer SMS follow-up to non-openers | MCB |
| 3 | Corridor estate pages: spring callout above the fold | Dev |
| 4 | Mid-campaign read on the dashboard — leads vs the 4/30d baseline | Dev |
| 5 | Push the pre-Christmas install deadline hard across all channels | All |
| — | **Watch 30 Sept** — the shutters cut-off. Push shutters hardest in weeks 1–4 | All |
| 6 | Log the result. The campaign closes itself on 1 Dec | Dev |

---

## 6. The modal

Built at `src/components/SpringPromoModal.tsx`, configured entirely from
`src/lib/promotions.ts`.

**Spring feel:** sage gradient header with a soft blossom motif, drawn as inline SVG
in the existing MCB palette — seasonal without going saccharine or importing a stock
illustration.

**Deliberately restrained**, because an annoying modal on 92 visitors a month costs
more than it earns:

- Shows **once per visitor per promotion** (localStorage, keyed to the promo id).
- **Never on `/quote`** — no interrupting someone already converting. Also excluded on
  `/dashboard` and the legal pages.
- Appears after a **12-second delay**, so it can't land on top of a first read.
- Esc, backdrop click, close button and "No thanks" all dismiss it.
- Respects `prefers-reduced-motion`; body scroll locks while open.
- Shows a **live days-remaining count** against each order-by date, with the soonest
  deadline emphasised.
- **Retires each deadline the day after it passes**, so it can never advertise a
  cut-off that has been and gone. The campaign ends itself when the last one closes.
- Runs on the **Melbourne calendar date**, so days-remaining reads the same from Perth
  or overseas — and the AEST/AEDT switch on 4 Oct, which falls between the two
  deadlines, can't skew it.
- Fires `promo_modal_shown`, `promo_modal_dismissed` (with reason) and
  `promo_modal_cta_click`, all registered in the analytics vocabulary.

**Live in code.** To change a date, edit `deadlines` in `src/lib/promotions.ts` — the
modal updates itself. To pull the campaign early, set `enabled: false`.

---

## 7. What still needs a decision

1. ~~Which offer~~ — **decided: C, deadline-only.**
2. ~~The pre-Christmas order-by dates~~ — **decided: 30 Sept shutters, 30 Nov everything else.**
3. ~~Terms~~ — **written, conditional on installer availability.** Worth a read-through
   before deploy so Deane/Dee are happy to honour them in November.
4. **Whether to email past customers**, and from which list. Still open.

### Worth sanity-checking
The 30 November date leaves roughly three and a half weeks to make and install before
Christmas. If the installers say that is too tight for anything in particular, pull that
date forward in `promotions.ts` — it is a one-line change and the modal updates itself.
