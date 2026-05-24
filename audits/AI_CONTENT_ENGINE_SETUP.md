# AI Content Engine — setup & handoff

Hi Alex — this is the manual setup the auto-content skill needs before its first run. Total time: ~25 minutes. Don't skip the approved-facts step in particular — that's the layer keeping hallucinations from going live.

## What got built

A weekly content-generation skill at `.claude/skills/ai-content-engine/` that:

1. Reads `tracked_questions` + `answer_registry` to find this week's targets (3-5 per run).
2. Drafts 40-60 word "answer capsules" against the spec in `reference/best-practices.md` (the research synthesis from Princeton GEO + NN/g + Averi 2026).
3. Runs 14 deterministic gates + 3 judgement gates per draft. Any blocking failure → rewrite or skip. Never weakens a gate to ship.
4. Places passed drafts via `<InlineAnswer>` on the relevant product page (top 30% of page — where 44% of AI citations land per NAV43).
5. Registers each piece into `answer_registry`, logs gate results into `content_gate_log`, ships to main, logs the run into `skill_runs`.
6. Dashboard at `/dashboard/ai-presence` shows per-piece performance (AI bot crawls × page views × attributed leads × citation status) so we can see what's working.
7. Reads its own history each run to identify patterns that outperformed — gets smarter every week.

## Setup steps

### 1. Apply the Supabase migration (5 min)

Open https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new and paste the contents of:

```
supabase/migrations/20260524_ai_content_engine.sql
```

Click Run. Verify:

```sql
select count(*) from public.answer_registry;        -- 0
select count(*) from public.content_pieces;         -- 0
select count(*) from public.skill_runs;             -- 0
select count(*) from public.content_gate_log;       -- 0
select * from public.answer_performance limit 1;    -- (empty result is fine)
```

If the view fails to create because `lead_submissions` doesn't have a `session_id` column, see "Known gotchas" at the bottom.

### 2. Review (don't seed) approved facts — 5 min

Open `src/content/approved-facts.ts`. The file is seeded with ~21 facts extracted from your live site content (PVC for bathrooms, basswood timber, double rollers, motorisation, etc.) plus the `service-no-published-pricing` fact that's the canonical pattern for any pricing question. The skill restates these verbatim or rephrases tightly — no extrapolation.

**Your decisions, not the skill's:**

- **Pricing is OFF by design.** Per your call, MCB never publishes specific per-window or per-m² prices. The seeded `service-no-published-pricing` fact gives the skill a citation-worthy "honest broker" answer pattern for all 5 pricing-shaped tracked questions (1, 8, 21, 22, 29) plus the two vendor-trust Qs (5, 23). The price_approval gate is the safety net — any dollar number that slips into a draft hard-blocks publish. If you ever change your mind on this, see `forbidden-claims.ts` and `approved-facts.ts` comments at the bottom of each file.

- **Regulatory facts.** None seeded — same conservative position. Tracked question 11 ("Do Victorian landlords have to provide curtains and blinds?") will route to `flagged_for_alex` until you either:
  - Add an approved regulatory fact with the actual answer (sourced from Consumer Affairs Victoria), OR
  - Decide that's a question MCB doesn't answer publicly (perfectly fine — leave it flagged forever).

- **Brand guide.** A new file lives at `.claude/skills/ai-content-engine/reference/brand-guide.md`. It's your identity spec — who MCB is, what voice attributes apply, what the brand never says, the customer in our head, six tuning-fork sentences as a cadence reference. The skill reads it on every run as a brand-fit gate. Edit it freely as your positioning evolves; the skill auto-detects revisions via file hash and notes them in `skill_runs`.

- **Voice anchors.** As your own writing on the site grows in confidence (new region copy, new long-form text), lift the strongest paragraphs into `src/content/voice-anchors.ts`. The skill's voice improves automatically.

### 3. Set environment variables on the remote agent runtime (3 min)

The weekly remote agent needs Supabase credentials and Git push access:

```
SUPABASE_URL=https://lrhgrmklpvwyjzaipioh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<from .env.local>
NEXT_PUBLIC_SUPABASE_URL=https://lrhgrmklpvwyjzaipioh.supabase.co
GIT_USER_EMAIL=<your email>
GIT_USER_NAME=Alex Lewis (via AI Content Engine)
```

Set these wherever the schedule skill stores per-routine env vars. Don't put them in the cron command itself — they'd leak into logs.

### 4. Smoke-test the scripts locally before scheduling (5 min)

From `/repo`, with `.env.local` loaded:

```bash
# Should print {} or a meaningful summary — confirms Supabase access + migration applied
npx tsx .claude/skills/ai-content-engine/scripts/fetch-week-targets.ts | head -50

# Should print a passing gate report
cat <<'EOF' > /tmp/draft-test.json
{
  "question_id": 28,
  "question_text": "Can plantation shutters be installed in a bathroom?",
  "answer_text": "Yes — we install PVC plantation shutters in Melbourne bathrooms most weeks. PVC handles moisture and humidity in a way timber never will, and the louvres still tilt for airflow after a long shower. The trade-off is finish: PVC reads cleaner and more modern; if you want the warmth of real timber, we'd save that for living areas and bedrooms.",
  "anchor": "q-shutters-bathroom",
  "url": "/shutters/plantation-shutters",
  "fact_markers": ["shutters-pvc-bathrooms"],
  "byline_author": "Modern Curtains and Blinds — Preston, Melbourne"
}
EOF
npx tsx .claude/skills/ai-content-engine/scripts/validate-content.ts /tmp/draft-test.json
```

Expected: validate-content prints a result block where every gate's `passed: true`, exit code 0. If a gate fails, the diagnostic tells you what to fix — usually it's `voice_checklist` complaining about no defensible number (the test answer above has none — add one to confirm).

### 5. Fire the weekly schedule

Once 1-4 are green, run this in any Claude Code session:

```
/schedule create
```

Or invoke the schedule skill directly with:

- **Cron:** `0 21 * * 0` (Sunday 21:00 Melbourne time — or whatever you prefer)
- **Timezone:** `Australia/Melbourne`
- **Prompt:**
  ```
  Run the weekly AI Content Engine cycle. Invoke the `ai-content-engine` skill at .claude/skills/ai-content-engine/SKILL.md and follow its procedure end to end. Repo is at /repo. Read CLAUDE.md before committing. If any of the 14 deterministic gates or 3 judgement gates blocks a piece after 3 rewrite attempts, skip that piece and continue with the others — do not weaken any gate. If npm run build fails, abort the run, mark skill_runs status='failed', and notify Alex.
  ```

The first run will likely publish 2-3 pieces (you've only seeded the safe facts so far) and flag the rest for you. That's the expected first-week state.

## After it runs

- Check `/dashboard/ai-presence` for the new "Content performance" panel. The first day will show zeros — bot crawls take 24-72h to show up. Real signal at day 7+.
- Pull the commits from main and review the first batch by eye. The skill is designed to publish without you, but you should still spot-check the first 2-3 cycles to make sure the voice feels right.
- If a piece reads slightly off, edit `src/content/voice-anchors.ts` to add an example of your preferred phrasing. The skill picks up the new anchor automatically next run.
- If you spot a tactic that's worth promoting / demoting, edit `.claude/skills/ai-content-engine/reference/best-practices.md` directly. The skill records the file's hash on every run, so revisions are traceable in `skill_runs.best_practices_hash`.

## Known gotchas

- **`lead_submissions.session_id` join:** the `answer_performance` view assumes leads carry a `session_id` for attribution. If your `lead_submissions` schema uses a different column name (e.g. `lead_session_id`), edit the view's `attributed_leads` CTE in the migration before applying. If no session-ID column exists at all, drop the join entirely — leads-attributed will read as 0 forever, which is honest.
- **First skill_runs row of all time:** `fetch-week-targets.ts` reads recent skill_runs to compute learning signals. With zero history, it'll emit empty `learning_signals` arrays — that's fine, the targeting still works on priority × expected_volume × fact-availability.
- **Supabase RLS:** the four new tables enable RLS with no policies — anon access is denied, service-role bypasses. The dashboard's existing service-role pattern reads them fine; no client-side access needed.
- **Vercel build:** ensure the `lucide-react` import in InlineAnswer doesn't break the build — it's already used elsewhere in the dashboard so should be fine.
- **`hasSupabaseAdminConfig()` returning false:** the dashboard fetchers fail-safe to empty arrays. If the new "Content performance" panel shows the empty-state on a deployment that has Supabase configured, the env vars are missing on Vercel.

## v1 → v2 — when to invest more

Wait until you have ≥ 4 weeks of `answer_performance` data before doing any of:

- Adding the `/journal/[slug]` long-form route (the v2 idea we deferred).
- Tuning gate thresholds (you'll have empirical data on which gates are over- vs under-blocking).
- Engine-specific rewrite paths (one answer for ChatGPT, another for Perplexity).
- Automatic refresh of stale answers (>60 days, no citation movement).

The skill earns the right to grow when it ships clean weeks first.

## Where everything lives

| What | Where |
|---|---|
| Skill procedure | `.claude/skills/ai-content-engine/SKILL.md` |
| Research-backed tactics | `.claude/skills/ai-content-engine/reference/best-practices.md` |
| Brand guide (who MCB is) | `.claude/skills/ai-content-engine/reference/brand-guide.md` |
| Targeting script | `.claude/skills/ai-content-engine/scripts/fetch-week-targets.ts` |
| Validation gates | `.claude/skills/ai-content-engine/scripts/validate-content.ts` |
| DB writers | `.claude/skills/ai-content-engine/scripts/register-answer.ts`, `log-run.ts` |
| Approved facts (you own) | `src/content/approved-facts.ts` |
| Voice anchors (you grow over time) | `src/content/voice-anchors.ts` |
| Forbidden patterns | `src/content/forbidden-claims.ts` |
| UI component | `src/components/InlineAnswer.tsx` |
| Migration | `supabase/migrations/20260524_ai_content_engine.sql` |
| Dashboard panel | `src/app/dashboard/(with-sidebar)/ai-presence/page.tsx` |
| Dashboard data | `src/lib/dashboard/v2/data.ts` (look for `fetchAnswerPerformance`) |
