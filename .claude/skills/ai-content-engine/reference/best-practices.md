# Best Practices Spec — AI Content Engine

> This file is the **tactical spec** the skill reads on every weekly run — what to do for AI citations. It is paired with `brand-guide.md` (who MCB is) and `voice-anchors.ts` (sample paragraphs as tuning forks). Tactics here can be applied to any local-service site; the brand guide is what makes it MCB.
>
> This is **not a marketing artefact**. It distils empirical research on GEO (Generative Engine Optimisation), local-service voice/trust, and inline Q&A UX into testable rules. When `answer_performance` data in the dashboard shows what's actually moving citations and leads on this site, revise this file. The skill gets smarter every week without anyone re-writing it.
>
> **Last revised:** 2026-05-24 (initial draft from research pass; brand guide added 2026-05-24)
> **Confidence:** Most claims are sourced from public research. Where evidence is thin, the safer default is noted explicitly.

---

## 0. The single decision rule

Every piece of generated content must answer "yes" to all three:

1. **Could a Preston-based installer actually say this at a customer's kitchen table?** (voice / authenticity)
2. **Is the first sentence a declarative answer with a specific number, brand, or named place?** (citation extraction)
3. **Is every factual claim either (a) restated from `approved-facts.ts` or (b) already on the site verbatim?** (zero hallucination)

If any answer is "no", the gate fails. No exceptions — this is liability-bearing content.

---

## 1. Citation extraction tactics (the GEO layer)

Source priority: Princeton GEO paper (Aggarwal et al., KDD 2024), NAV43, Averi 2026 B2B benchmark, Ahrefs LLM-search study.

### High-leverage tactics — always apply

| # | Tactic | Empirical lift | Source |
|---|---|---|---|
| 1.1 | Named-expert quotation inside the answer | **+41% PAWC** | Princeton |
| 1.2 | Specific statistic in the answer (number, %, date, dimension) | **+33% PAWC** | Princeton |
| 1.3 | Inline citation to an authoritative source | **+28% PAWC** / **+115% for lower-ranked sites** | Princeton |
| 1.4 | "Answer capsule" pattern: 40-60 word declarative-first paragraph | 72% of ChatGPT-cited pages use this | Averi 2026 |
| 1.5 | Verbatim Q-as-H3 + bottom-line-first paragraph | +40% citation rate; 1.8x lift for Q-format H2/H3 | NAV43 |
| 1.6 | Table for any "X vs Y" question | 4.2x citation lift over prose | NAV43 |
| 1.7 | First 30% of page placement | Captures 44.2% of all citations | NAV43, BrightEdge |
| 1.8 | "Updated [Month YYYY]" stamp visible on the page | Updated pages cited 30% more on Perplexity; 60.5% of ChatGPT-cited pages <2yrs old | Averi |
| 1.9 | 120-180 words between H2/H3 headings | Pages with this density: +70% citations on ChatGPT | Averi |
| 1.10 | Real install photo near the answer | Highest E-E-A-T signal per Webimax + multiple 2025-26 analyses | Webimax |

### Tactics that hurt — never do

- **Keyword stuffing:** Princeton −9% PAWC, worse on Perplexity.
- **Artificial simplification / "dumbing down":** Princeton showed near-zero or negative lift.
- **Anonymous bylines on advice content:** measurable citation gap vs named expert.
- **More than one bolded phrase per major section:** dilutes the signal.

### Engine-specific notes (use when targeting a specific engine)

| Engine | Pulls from | Implications for MCB |
|---|---|---|
| ChatGPT | ~87% Bing-backed; favours Wikipedia + consensus sources | Maintain ProductReview.com.au listing; consensus phrasing helps |
| Perplexity | ~22 sources/query (vs ChatGPT's 8); 46.7% of citations from Reddit; real-time-indexed | Freshness + genuine Reddit presence in r/melbourne / r/AusRenovation > everything |
| Google AI Mode | 54% overlap with top-20 organic; YouTube 23%; multi-modal correlates r=0.92 with citation | Keep traditional Google rank; add product video + FAQ schema |
| Claude | Prefers technical depth + structured bullets (+30% from bullets) | Include a Technical Specs subsection per product |

Only 7 of top-50 cited domains overlap across all three engines (86% unique). **Optimise per engine in the longest-term content; don't assume universal wins.**

---

## 2. Voice spec — the Preston-installer test

The site's existing `region-content.ts` already nails this. Every piece of generated content is measured against it. Sample voice (don't copy this verbatim — use it as a tuning fork):

> "The northern suburbs are our backyard. From the Californian bungalows and weatherboard workers' cottages around Preston, Thornbury and Reservoir through to the brick-veneer family homes of Bundoora and Mill Park, you get a real mix of original tall sash windows, mid-century aluminium frames and newer double-glazed units. Northern light leans hot in summer and the western sun on rear extensions is the single most common thing customers want sorted."

### The 15-point voice checklist

Every answer is auto-checked against these:

1. **At least one named local reference** (suburb, era of housing, microclimate, road). Per 200 words minimum.
2. **First-person plural with a stance** — "we" + opinion verb ("we'd run", "we mostly stop", "we install").
3. **At least one defensible number per answer** (mm, gsm, weeks, %, $/m², °C, year). Falsifiable beats vague.
4. **Hedging where conditional, certainty where earned.** "On a 2.4m drop, motorisation usually pays for itself" — not "may potentially help".
5. **At least one opinion-bearing sentence per 300 words.** Take a position. Neutral feature lists fail the test.
6. **Named brands/product lines where relevant** (Luxaflex, Verosol, Crimsafe, Wynstan, basswood). Proper nouns = expertise.
7. **Concrete scenario over abstract benefit** — "a Californian bungalow with original sash windows on Plenty Road" beats "all home styles".
8. **Variable sentence length** — mix 6-word and 28-word sentences. Uniform cadence is the strongest surviving AI tell in 2026.
9. **Show working / trade-offs.** Admitting a downside is the strongest trust signal (NN/g).
10. **Pricing range visible** when answering a price Q (and only if approved in `approved-facts.ts`). "From $X/m² installed, most jobs land between $A and $B" beats "request a quote".
11. **Anecdote where possible** — "Last month, a Thornbury weatherboard with 3.1m ceilings…". Anecdotes are the single feature AI detectors flag as missing in synthetic content.
12. **Australian spelling and idiom** — colour, organisation, metre, $/m², "out the back", "the rear extension", "blockout" not "blackout", "shutters" not "shades", "curtains" not "drapes". No US idiom: never "reach out", "ballpark", "ZIP", "story" (for floor), "circle back".
13. **Owner/installer authorship.** Every piece has a byline (real person; default to the site owner) and a publish/updated date.
14. **Limits disclosed where relevant** — "we don't do commercial fit-outs" / "we don't service south of the Yarra" — upfront honesty (Nielsen's four credibility factors).
15. **Real install photo** — never stock. If no real photo exists for the topic, the skill flags it for Alex to supply rather than substituting stock.

### Banned phrases (deterministic gate)

These never appear in generated content. The validate-content gate fails on any match.

**AI-tell phrases (2026 zeitgeist):**
delve, delve into, navigate the landscape, in today's fast-paced world, in today's digital age, let's dive in, let's explore, it's important to note, it's worth noting, in conclusion, moreover, furthermore, at the end of the day, unlock (your potential / value), revolutionise, cutting-edge, seamless, robust, leverage, comprehensive guide, holistic approach, tailored solutions, bespoke solutions, elevate, empower, game-changer, ever-evolving, in the realm of, when it comes to, that being said, look no further, journey (as metaphor), as someone who.

**Banned superlatives without evidence:**
best, leading, premier, premium (without context), #1, top-rated, award-winning (without naming the award), trusted (without naming who trusts you), Melbourne's leading, voted best.

**Banned structural patterns:**
- Three-bullet lists of three parallel items (the canonical AI shape).
- Perfectly parallel headings ("Quality. Service. Trust.").
- Em-dash more than once per 200 words (training-data fingerprint).
- Identical sentence lengths in succession (>3 sentences with word-count within ±2).
- "Whether you're X, Y, or Z…" opening.
- Rhetorical questions as section openers.

---

## 3. Layout & UX spec — where the answer lives

### Placement on the product page

- **Position:** Immediately below the hero image + product description; **above** the feature/decision-guide grid that exists today. This is the "first 30% of page" zone that captures 44% of AI citations.
- **The existing generic FAQ block at page bottom is left alone** for now — it serves a different (booking-stage) purpose. The new InlineAnswer block is research-stage content.
- One InlineAnswer block per page. 3-5 questions per block. Never more than 5 — schema-density signal degrades.

### Layout

- **Hybrid accordion.** Desktop: first Q expanded by default, remainder collapsed. Mobile: all collapsed.
- All question headings always visible (only answer bodies collapse). This satisfies Google's FAQPage requirement that schema content be visible without "special tools".
- Use `<details>`/`<summary>` (or Headless UI Disclosure) — never `display:none` via JS-only state, which can break AI scraping.
- Each Q gets `id="q-<kebab-slug>"` for anchor links (e.g. `/shutters/plantation-shutters#q-cost-2026`). Per-anchor citation is free upside.
- Tap target on mobile: full row tappable, min 48px tall. Caret or `+` icon (NN/g: best clickability affordance).
- Animation 150-300ms (instant feels broken; slower feels laggy).
- On hash-link load (e.g. someone follows an AI citation to `#q-cost-2026`), auto-expand and scroll into view.

### Answer structure (the 40-60 word capsule)

```
Sentence 1: Direct declarative answer with one specific (number, brand, place, date).
Sentence 2-3: Qualifier / scope / trade-off. Optional context.
[Optional: 3-5 bullet list ONLY if the answer is genuinely enumerative.]
```

- **Word budget: 40-60 words for the primary answer.** Below 40 = AI parsers treat as fragment. Above 60 = AI parsers treat as paragraph prose and stop extracting cleanly.
- First sentence must contain the bottom-line answer (BLUF / inverted pyramid). No "It depends" or "Great question" openings.
- Vary sentence length to break uniform-cadence AI tell.

### CTAs

- **No buttons inside individual answers.** Rarely tapped on mobile and clutters AI-extractable text.
- **One CTA band immediately after the InlineAnswer block** restating "Get a Free Quote" + microcopy ("Free measure-up, no obligation, ~30-second form"). Friction-reducing microcopy near the CTA has been shown to lift conversion >200% in some tests (KISSmetrics).
- **2 inline text links across the 5 answers**, never buttons — "free measure", "request pricing". Text links convert better in narrative context.

### Schema markup

- One `FAQPage` JSON-LD per page covering every visible Q (1:1 with DOM — Google requires this).
- Visible H3 wording = `Question.name` wording. Identical. No "pretty for humans / literal for AI" split — Google rejects schema where they don't match.
- Mark up all 5 visible Qs, not "just three of them" — partial markup looks manipulative.

### Visual treatment

- Plain top/bottom hairline dividers per Q. Not a heavily styled callout box.
- One accent colour on the chevron only. F-pattern scanners treat heavy decorative containers as ads.
- Bordered card is acceptable for the whole block, but not per-Q.

### Related-question chaining

- 1 inline contextual link in 2-3 of the 5 answers pointing to a sibling Q on a different product page (e.g. shutter-cost answer → "Related: how long do shutters last? → /shutters/plantation-shutters#q-lifespan").
- Do NOT add a "People also asked" widget — pulls intent away from the quote CTA at this scale.

---

## 4. Conversion layer — beyond citations

The skill ships content that has to do two jobs: get cited by AI engines AND increase quote-form submissions. Tactics that serve both:

- **Pricing — the honest-broker pattern.** MCB's deliberate position is to never quote specific prices in marketing copy. The brand-guide §8 and the `service-no-published-pricing` approved fact are the source of truth. Pricing-shaped questions get answered by (a) acknowledging the question directly, (b) explaining the 3-4 variables that move the price most (material, motor type, custom shaping, fabric grade), (c) pointing to the free in-home quote. This is more citable than a number-on-the-page would be — AI engines reward the explanation, and the position positions MCB as the honest broker rather than the secretive one. The price_approval gate hard-blocks any dollar number that slips into a draft.
- **Phone-anxiety reassurance** — "we'll call once to book the visit, no marketing calls" — already exists on the quote form; mirror that tone here.
- **Show working** — explaining what changes the price (different materials, motorisation, custom shapes) converts higher than naming a single number and is also more citable.
- **Anchor to next step, not generic CTA** — "ask us about it during the free measure" beats "get a quote". The quote form is one click; this is the bridge.

---

## 5. Anti-patterns the skill must refuse to produce

Hard refusals — the validate-content gate fails on any of these:

- Answer word count <30 or >90.
- Answer leads with hedge ("It depends", "Great question", "Many factors").
- CTA button inside an accordion answer body.
- Mismatched JSON-LD `Question.name` vs visible H3 wording.
- **Any specific price, range, or per-m² number** — the price_approval gate blocks all of these by default. MCB never publishes prices; see brand-guide §8.
- Statement about Victorian tenancy law, electrical regulations, fire ratings, building codes, or any regulated matter not in `approved-facts.ts`.
- US English spelling or idiom.
- Stock photo reference (any `image: ` field pointing to a generic stock path).
- Any phrase from the banned-phrase list in §2 OR the brand-guide §6 "no" vocabulary.
- More than 5 Qs in one InlineAnswer block.
- FAQPage schema covering fewer/different Qs than visible on the page.
- New factual claim not sourced from `approved-facts.ts` OR not already on the site verbatim.

---

## 6. The learning loop — how this file gets revised

After every weekly run, the skill writes a `skill_runs` row capturing:
- Which Qs were targeted
- Which content patterns were used (statistic count, named-expert quote y/n, anchor-link inclusion, anecdote y/n, length, etc.)
- Hypothesis for each piece

After 4-6 weeks, the `answer_performance` view shows for each piece:
- AI-bot crawls 7d/30d (leading indicator — does Claude/GPTBot/PerplexityBot even read the URL?)
- Organic visits to the anchor URL
- Quote-form submissions attributed via session_id within 14d
- Citation movement (was the linked Q cited more often after publish?)

The skill compares performance across patterns and rewrites this `best-practices.md` file with empirical updates. Example revision the loop might produce in week 8:

> *"Anecdote-bearing answers (containing 'last month' / 'we measured up a' / suburb-named install story) outperformed neutral answers 3:1 on AI bot crawls in the first 30 days. Promote tactic 1.11 from 'where possible' to 'enforced when fact base allows'."*

That revision is committed alongside the next week's content, with a release log entry per `CLAUDE.md` discipline.

---

## 7. Sources

GEO research:
- Princeton GEO paper (Aggarwal et al., KDD 2024): https://arxiv.org/abs/2311.09735
- NAV43 LLM citation optimisation: https://nav43.com/blog/llm-citation-optimization-quote-ready-content-blocks/
- Averi 2026 B2B citation benchmark: https://www.averi.ai/how-to/chatgpt-vs.-perplexity-vs.-google-ai-mode-the-b2b-saas-citation-benchmarks-report-(2026)
- Discovered Labs engine comparison: https://discoveredlabs.com/blog/chatgpt-claude-perplexity-and-google-ai-overviews-how-each-platform-cites-sources-differently
- Ahrefs LLM search research: https://ahrefs.com/blog/llm-search/

Voice / trust:
- NN/g Trust or Bust: https://www.nngroup.com/articles/communicating-trustworthiness/
- NN/g Hierarchy of Trust: https://www.nngroup.com/articles/commitment-levels/
- Copyhackers specificity: https://copyhackers.com/how-to-be-specific/
- Wikipedia Signs of AI Writing: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing

UI/UX / inline Q&A:
- NN/g Strategic Design for FAQs: https://media.nngroup.com/media/reports/free/Strategic_Design_for_Frequently_Asked_Questions.pdf
- NN/g Accordions on Desktop: https://www.nngroup.com/articles/accordions-on-desktop/
- OuterBox accordion SEO test: https://www.outerboxdesign.com/articles/seo/should-i-use-tabbed-and-accordion-content-for-seo/
- web.dev accessible tap targets: https://web.dev/articles/accessible-tap-targets
- Averi answer capsule playbook: https://www.averi.ai/blog/answer-capsules-40-60-word-patterns-that-turn-h2s-into-citations
