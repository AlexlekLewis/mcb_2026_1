---
name: ai-content-engine
description: Generate the weekly batch of inline answers for the MCB site's AI Presence questions. Use when invoked by the weekly schedule or manually for a one-off content cycle. Builds 3-5 inline answers per run, runs deterministic + judgement gates, auto-publishes to main if all gates pass, logs every run for learning across weeks. Triggered by the schedule on Sunday 21:00 AEST or manually by the user saying "run the content engine" / "generate this week's answers" / "weekly content cycle".
---

# AI Content Engine — weekly run procedure

You are running the AI Content Engine for **Modern Curtains and Blinds** (Melbourne window-furnishings business). Your job: write 3-5 inline answers this week, place them on the right product pages, and ship to main — but only if every safety gate passes.

The owner is Alex Lewis. The site is Next.js 16 + TypeScript + Tailwind + Supabase, repo root is `/repo` relative to the project, Vercel deploys from main. CLAUDE.md is at `/repo/CLAUDE.md` — read it before touching anything that ships to production.

**Critical liability rule** (from Alex, verbatim): *"False content is never allowed and hallucinations are never allowed. Answering questions wrong or guessing causes liability issues legally."* The skill is allowed to publish to main ONLY because the gate stack is strict enough to make hallucination impossible. If you can't satisfy a gate, **stop and route the piece to manual review** — never relax the gate.

---

## Mental model

```
  tracked_questions  ──►  fetch-week-targets  ──►  draft (you)  ──►  validate-content
                                                       │                    │
                                                       │              all gates pass?
                                                       │                    │
                                              add to InlineAnswer ──►  register-answer
                                                                            │
                                                                       commit + push
                                                                            │
                                                                       log-run --finish
                                                                            │
                                                              dashboard reads performance,
                                                              next week reads learning signal
```

You touch:

- **Tactical spec:** `.claude/skills/ai-content-engine/reference/best-practices.md` — what to do for AI citations (research-backed).
- **Brand guide:** `.claude/skills/ai-content-engine/reference/brand-guide.md` — *who* MCB is. The brand-fit test for every draft.
- **Truth source:** `src/content/approved-facts.ts` — the only place factual claims may come from (besides verbatim restatement of existing site content).
- **Voice anchor:** `src/content/voice-anchors.ts` — sample paragraphs as a tuning fork.
- **Forbidden list:** `src/content/forbidden-claims.ts` — every regex-deterministic forbidden pattern.
- **Component:** `src/components/InlineAnswer.tsx` — the only thing you render generated content into.
- **Scripts:** `.claude/skills/ai-content-engine/scripts/*.ts` — five CLI scripts you call via `npx tsx`.

---

## Procedure

### 0. Read the spec

Before doing anything else, read these four files completely. They are not optional context — they are the contract you operate under.

```
.claude/skills/ai-content-engine/reference/best-practices.md   # tactics
.claude/skills/ai-content-engine/reference/brand-guide.md      # identity
src/content/approved-facts.ts                                   # truth source
src/content/voice-anchors.ts                                    # voice samples
```

The brand guide is non-negotiable. If a draft passes every deterministic gate but doesn't feel like MCB (per §11 of the brand guide — the six tuning-fork sentences), it FAILS the brand-fit check and you rewrite. The validate-content script can't catch this — it's your judgement gate.

If `best-practices.md` OR `brand-guide.md` has been revised since the last run (`skill_runs.best_practices_hash` differs), note the changes in your run hypothesis.

### 1. Start a skill_runs row

Get the skill_run_id you'll use throughout this cycle.

```bash
cd /repo
npx tsx .claude/skills/ai-content-engine/scripts/log-run.ts \
  --start \
  --trigger=schedule \
  --hypothesis="<one-sentence hypothesis about what you're testing this week>"
```

Save the returned `skill_run_id`. You'll need it for every piece.

A good hypothesis is testable next week. Examples:
- "Test whether anecdote-bearing answers (lead with a real install story) outperform neutral feature-list answers on AI bot crawls"
- "Test whether referencing a named brand (Verosol, Crimsafe, Luxaflex) in the first sentence raises citation rate vs generic descriptors"
- "Test whether answers with an inline citation to BoM or an Australian Standard get more bot hits than answers without"

### 2. Fetch this week's targets

```bash
npx tsx .claude/skills/ai-content-engine/scripts/fetch-week-targets.ts > /tmp/targets.json
```

The output gives you:
- `targets[]` — 3-5 questions ranked for writing this week, with available approved facts attached
- `flagged_for_alex[]` — questions you must NOT attempt because the truth source is missing
- `learning_signals.outperforming[]` / `.underperforming[]` — patterns that have empirically worked or not in past weeks. **Lean into outperforming, avoid underperforming.**

If `targets.length < 3`: continue with what you have, log a `partial` status at the end, and include in the release note that Alex should seed more approved facts.

### 3. For each target — draft

For each target, write a 40-60 word answer following the **answer capsule pattern** from `best-practices.md` §3:

```
Sentence 1: Direct declarative answer with one specific (number, brand, place, date).
Sentence 2-3: Qualifier / scope / trade-off. Optional context.
```

**Drafting rules (from best-practices.md, summarised):**

- **Rephrase the tracked question into a proper interrogative form for the visible H3 and schema.** The `tracked_questions.question` field is the search-query phrasing (often a sentence fragment, e.g. "Best blinds to block heat in a west-facing Melbourne window" or "PVC vs basswood plantation shutters"). The visible H3 + JSON-LD `Question.name` must read as a real question — starting with what/how/why/can/are/does/which, and ending with a `?`. Use the tracked question as input, write the H3 as proper-question output. Example: tracked "PVC vs basswood plantation shutters for Melbourne homes" → H3 "PVC vs basswood plantation shutters: which suits Melbourne homes best?". The two MUST share enough keyword overlap that the page still serves the original search query.
- Pull every factual claim from the `available_facts` array attached to this target, OR from existing live-site copy you've actually read (grep `src/lib/region-content.ts`, `src/lib/data.ts`, `src/lib/legacy-blind-content.ts` if needed).
- Track which approved-fact ids you used. You'll declare them as `fact_markers` at validation.
- Voice: first-person plural ("we", "we'd", "we install"); at least one named Melbourne suburb or region; one defensible number; one opinion-bearing sentence; vary sentence length deliberately.
- For comparison Qs ("X vs Y"): use a short table inside the answer if it's genuinely enumerative. NAV43 measured 4.2x citation lift for tables on comparison content.
- For at least one of the 3-5 pieces this run: include a named-expert quote or inline citation to an authoritative source (Australian Window Association, BoM heat data, manufacturer spec sheet). +28-41% citation lift per Princeton GEO paper.

**Drafting prohibitions (refused at validation, but easier to avoid up front):**

- No phrase from `AI_TELL_PHRASES` in `forbidden-claims.ts`. Skim that file before drafting if you haven't recently.
- No specific price unless an approved fact for this question has `is_price: true`.
- No statement about Victorian tenancy law, electrical regs, fire ratings, building codes etc. unless an approved fact has `is_regulatory: true`.
- No US spelling or idiom. AU only (colour, organisation, metre, $/m², "out the back").
- No three-bullet list of three parallel items (the canonical AI shape).
- No em-dash more than once per 200 words.
- No "Whether you're X, Y or Z" opener.

### 4. Self-critique (the judgement gates)

Before sending the draft through validate-content, run these judgement checks yourself. The deterministic gates are necessary but not sufficient — only you can do the final factuality + voice check.

For each draft, ask:

**Factuality (the most important gate):**
1. Could I point at the exact `approved-fact.id` (or verbatim site URL) backing every single factual statement in this answer?
2. Is there a single claim — even a small one — that I introduced without a source? If yes: rewrite or remove.
3. Have I implied something the source doesn't actually say? (E.g. an approved fact says "PVC suits bathrooms" — I must not extend that to "PVC lasts 30 years in bathrooms" without a second fact.)

**Voice (the Preston-installer kitchen-table test):**
1. Could the owner of a Preston window-furnishings business actually say this at a customer's kitchen table?
2. Is there a sentence here that feels like marketing copy instead of installer advice? Rewrite.
3. Does the answer take a position, or is it neutral-symmetric? Take a position.

**Brand-fit (the §11 test):**
1. Does the cadence and confidence of this answer match the six tuning-fork sentences in `brand-guide.md` §11? If not, rewrite.
2. Does the answer fall inside every paired-adjective range in §4 (warm not chummy, expert not showy, honest not cold, etc.)?
3. Does the answer use any "no" vocabulary from §6 ("transform", "elevate", "premier", US idiom)? If yes — rewrite.
4. Does the answer imply at least one of the always-do commitments from §7 (free in-home measure, samples, written quote, multi-product visit, honest about limits)? At least one should be present in most answers.

**Pricing-shaped questions:**
1. The answer must NOT quote a specific price, range, or per-m² number. Even if the question demands one.
2. Use the `service-no-published-pricing` approved fact as the backbone. Reference the trade-offs (material, motor type, custom shaping) that move the price, and point to the free in-home quote.
3. The price_approval gate will block any dollar amount or per-unit price; don't try to slip one through.

**Legal-adjacent (the conservative gate):**
1. Does this answer make any claim about safety, regulations, codes, warranties, refunds, or rights? If yes — STOP. Flag the piece for Alex and skip to the next target.

If any of the above is "no" or "yes" wrong-way: don't proceed. Either rewrite or skip the piece.

### 5. Validate

Save the draft as JSON and pipe through the deterministic gate:

```bash
cat > /tmp/draft.json <<'EOF'
{
  "question_id": <int>,
  "question_text": "<exact tracked question>",
  "answer_text": "<your 40-60 word capsule>",
  "anchor": "<q-kebab-slug>",
  "url": "<product page url>",
  "fact_markers": ["<approved-fact id>", "..."],
  "byline_author": "Modern Curtains and Blinds — Preston, Melbourne"
}
EOF

npx tsx .claude/skills/ai-content-engine/scripts/validate-content.ts /tmp/draft.json > /tmp/gate.json
```

Exit code 0 = all blocking gates passed. Exit code 1 = at least one blocking failure.

**If a blocking gate fails:**
- Read the `diagnostic` field for the specific failure.
- Rewrite the answer to fix it.
- Re-validate. Maximum 3 retry cycles per piece.
- If still failing after 3 attempts: skip this piece, log it as `rejected_human` in your pattern_summary, move on. **Never weaken the gate to make a draft pass.**

**If warnings (severity=warn) appear but no blocks:**
- Auto-correct US spelling (the gate output tells you what to swap).
- Re-validate to confirm warnings clear.
- Proceed.

### 6. Place — edit the target product page

Add the `InlineAnswer` component to the target product page using the validated draft.

Most product pages today render via `ProductTemplate`. Open the target page (`src/app/<url>/page.tsx`), import `InlineAnswer`, and insert it IMMEDIATELY AFTER the `<ProductTemplate>` element in the JSX. Wrap the return in a fragment if needed.

**v1 placement caveat:** `ProductTemplate` is a self-contained component — the InlineAnswer ends up mounting at the bottom of the page rather than in the "top 30%" sweet spot identified by GEO research (NAV43: 44% of citations land in the first 30%). The proper fix is to extend `ProductTemplate` to accept an `inlineAnswerSlot` prop. Track this as v1.5 work; do not block v1 ships on it. The block still helps citation rate substantially even from the lower placement.

Example shape after the edit:

```tsx
import { InlineAnswer } from "@/components/InlineAnswer";
// ...

<>
  <ProductTemplate {...productProps} />  {/* existing — leave alone */}
  <InlineAnswer
    lastUpdated="2026-05-25"
    items={[
      {
        question: "Best blinds to block heat in a west-facing Melbourne window",
        answer: "<your validated capsule>",
        anchor: "q-west-facing-heat",
        related: { label: "How honeycomb blinds insulate", href: "/blinds/honeycomb-blinds#q-insulation" },
      },
      // ...up to 5 items total
    ]}
  />
</>
```

If the target page already has an `<InlineAnswer>` block, ADD the new item to its `items` array rather than creating a second block. One block per page only.

### 7. Register the publish

Once each piece is placed, register it in the database:

```bash
cat > /tmp/published.json <<'EOF'
{
  "skill_run_id": <id from step 1>,
  "question_id": <int>,
  "question_text": "<exact>",
  "answer_text": "<final>",
  "anchor": "<q-...>",
  "url": "<url>",
  "mode": "inline",
  "byline_author": "Modern Curtains and Blinds — Preston, Melbourne",
  "product_slug": "<slug>",
  "fact_markers": ["<id>", "..."],
  "gate_results": <paste validate-content output's results array>,
  "related": [{"label": "...", "href": "..."}]
}
EOF

npx tsx .claude/skills/ai-content-engine/scripts/register-answer.ts /tmp/published.json
```

### 8. Build + type-check before commit

CLAUDE.md is non-negotiable on this. Run:

```bash
cd /repo
npx tsc --noEmit
npx eslint --max-warnings 0 src/components/InlineAnswer.tsx src/app/<edited-page>.tsx
npm run build
```

If any of these fails: do NOT commit. Fix the issue and re-run. If you can't fix it within 2 attempts, mark the skill_run as `failed` (next step) and exit.

### 9. Update the release log — NON-NEGOTIABLE

**Every single weekly run must prepend exactly one Release entry to `src/lib/dashboard/releases.ts`.** This is the mechanism that makes the dashboard's "Releases & Results" panel compute 24h / 48h / 7d before-after deltas for every batch — bounce rate, engaged time, quote CTA clicks, lead submissions, organic traffic. Without this entry the work is invisible and the engine can't be evaluated. Per CLAUDE.md: changes that go unmeasured are how sites bloat with unverified optimisations.

The dashboard automatically picks up new entries on next deploy — no other plumbing required.

Prepend a `Release` to `RELEASES` in `src/lib/dashboard/releases.ts`:

```ts
{
  id: "2026-05-25-ai-content-w1",  // YYYY-MM-DD-ai-content-w<n>
  title: "AI Content Engine: week 1 — <one-line summary>",
  releasedAt: "<UTC ISO time you commit>",
  summary: "Auto-generated inline answers for <N> tracked questions, all 14 deterministic gates + judgement gates passed. Targets: <Q1>, <Q2>, ...",
  items: [
    "<Q text> → <url>#<anchor>",
    "<Q text> → <url>#<anchor>",
    // ...
    "Run id: <skill_run_id>",
    "Best-practices hash: <first 8 chars>",
    "Hypothesis tested: <one line>",
  ],
}
```

### 10. Commit and push to main

```bash
cd /repo
git add -A
git commit -m "$(cat <<'EOF'
content: AI engine week <N> — <N> inline answers shipped

<list each Q → URL>

Hypothesis: <your one-liner>
Skill run id: <id>
All 14 deterministic gates + judgement gates passed.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"

git push origin main
```

Capture the commit SHA — you'll log it in the next step.

### 11. Finish the skill_runs row

```bash
npx tsx .claude/skills/ai-content-engine/scripts/log-run.ts \
  --finish <skill_run_id> \
  --status=completed \
  --targets_considered=<int> \
  --targets_attempted=<int> \
  --pieces_drafted=<int> \
  --pieces_passed_gates=<int> \
  --pieces_published=<int> \
  --pieces_rejected=<int> \
  --release=<release_id from step 9> \
  --commit=<git sha> \
  --patterns='{"anecdote_count":<int>,"statistic_count":<int>,"named_expert_quote":<bool>,"named_brand_count":<int>,"inline_citation_count":<int>,"avg_word_count":<int>}'
```

Status options:
- `completed` — all targets shipped cleanly
- `partial` — some shipped, some skipped (track skipped in pieces_rejected)
- `failed` — couldn't ship anything (build broke, gates couldn't be satisfied, etc.)

### 12. Notify (light-touch)

The dashboard at `/dashboard/ai-presence` automatically picks up the new pieces — no notification needed in v1.

If `pieces_rejected > 0` or there are flagged-for-alex items, leave a one-paragraph note in your final message so the user can see them: "Skipped 2 questions because they touch Victorian tenancy law and need an approved regulatory fact — see flagged_for_alex in /tmp/targets.json."

---

## When to escalate to Alex (don't auto-ship)

Stop the run and flag for manual review if:

- Any pricing or regulatory question made it past targeting (shouldn't happen — fetch-week-targets filters them, but defensive).
- A factual claim you want to make has no approved fact AND isn't already on the site verbatim.
- Gate failures persist after 3 rewrites and you can't find a way to express the answer truthfully within the constraints.
- A target question has a strongly contrarian framing that, if answered honestly, would damage MCB's commercial interests (e.g. "Are plantation shutters dated in 2026?" answered with "yes" — that's a content category Alex should sign off on).
- `npm run build` fails for any reason you can't immediately diagnose.

When in doubt, stop. The skill's value is precisely that it never publishes false or risky content. Speed is secondary.

---

## Failure modes worth knowing

- **The Supabase project is not the one the MCP is pointing at.** Apply migrations via the SQL editor at https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new — never via the MCP. See CLAUDE.md.
- **Best-practices.md drift.** If the hash has changed, the spec has been revised. Don't assume yesterday's tactics still apply. Re-read.
- **Approved-facts expiry.** Pricing facts are time-bound. If a fact has expired (`expires_at < now`), it's invisible to `getActiveFacts()` — your draft will fail provenance even though the file shows the fact. Check `expires_at` if you're confused.
- **Hydration mismatch on `InlineAnswer`.** The component sets the default-open state via useEffect post-mount to avoid SSR/CSR mismatch. Don't add server-side `open` attributes — they'll break hydration.

---

## What this skill does NOT do (v1 scope)

- **No long-form `/journal` articles.** v1 is inline answers only. Deferred until inline answers have ≥ 4 weeks of data showing they move citations.
- **No social posts / off-site content.** GEO research shows Reddit + ProductReview.com.au mentions matter, but those are not in scope for an auto-publish skill.
- **No revision of EXISTING inline answers based on performance.** The skill only adds new ones. Refresh logic is wired in `fetch-week-targets.ts` (will surface refresh candidates after 30 days) but actual rewrite procedure is a v2 add.

---

## Lessons learned from previous runs

This section is the persistent memory of every prior skill run. When a run surfaces a rule, gate-tuning, or content-pattern insight that should apply to all future runs, append it here in the same commit. **The skill reads this section every cycle.**

### From v1 dry run (2026-05-24)

- **Tracked questions are search queries, not always grammatical questions.** Q4 "Best blinds to block heat..." and Q6 "PVC vs basswood..." are sentence fragments because that's how people search. The skill must rephrase them into proper interrogative form for the visible H3 + schema (start with what/how/why/can/are/does/which, end with `?`) while preserving keyword overlap. The validator's `question_match` gate enforces this.

- **The opinion-bearing regex was too narrow at v1.** Initial regex matched `we'd|we mostly|we install|we run|we stop|we prefer|we recommend` only — missed clear opinion markers like "our pick", "our most-requested", "we'd reach for", "reach for", "stick with". Widened. If future runs find more opinion idioms that don't match, extend the regex in `validate-content.ts` rather than rewriting drafts to fit it.

- **`text-transform: capitalize` was site-wide and ruining readability.** A pre-existing CSS rule on `<p>` and headings was title-casing every word ("PVC vs basswood" → "PVC Vs Basswood"). Removed in the same release as v1. Per brand-guide §10: never reintroduce. If you see your published prose looking title-cased on the live site, check `src/app/globals.css` first.

- **`InlineAnswer` requires 3-5 items, refuses to render outside that range.** If a week's targets only produce 2 valid drafts for a given page, hold them — wait until a third drafts cleanly before placing on that page. Better to skip a week than ship a half-block.

- **v1 placement caveat: InlineAnswer mounts after ProductTemplate, not in the top-30%.** GEO research says the first 30% of the page captures 44% of AI citations (NAV43). The v1.5 fix is to extend ProductTemplate with an `inlineAnswerSlot` prop so the block can mount between hero and decision-grid. Until that ships, accept the suboptimal placement — content still earns citations from the lower position, just less efficiently.

- **Approved-fact ID `service-no-published-pricing` is the canonical answer for ALL pricing-shaped questions.** Categories pricing and vendor both route through it. The answer pattern is: acknowledge the question, name 3-4 cost levers (material / motor type / custom shape), point to the free in-home quote. Never quote a number — the price_approval gate blocks any `$` or `/m²`.

- **A passing `named_source` warning is acceptable but worth lifting.** Drafts that don't reference Basswood/Verosol/Crimsafe/Wynstan/Tilia/3-pass/AS-NZS get a soft warning. Princeton GEO shows named-brand/spec lifts citation rate +28-41%. Where possible, weave one in. Where not, ship without — the warn doesn't block.

### From [future run] — template

```
### From [YYYY-MM-DD run]
- **[Finding]:** [what we learned, file references, action taken]
- **[Finding]:** [...]
```

---

## v1 → v2 watchlist (things to revisit after 4-6 weeks of data)

- Tune `voice_checklist` gate thresholds based on what answers actually got cited.
- If `learning_signals.outperforming` shows consistent patterns, hard-code them into the drafting rules.
- Add journal long-form route (`/journal/[slug]`) for cluster articles once inline answers prove out.
- Add automatic refresh of stale answers (>60 days, no citation).
- Per-engine optimisation paths — engine-specific drafts written when one engine consistently lags.
