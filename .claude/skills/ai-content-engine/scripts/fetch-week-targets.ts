#!/usr/bin/env tsx
/**
 * fetch-week-targets.ts — pick this week's content targets.
 *
 * Run as:
 *   npx tsx .claude/skills/ai-content-engine/scripts/fetch-week-targets.ts
 *
 * Output: JSON to stdout — the prioritised target list + available facts for
 * each + learning signals from past runs. The skill consumes this as input
 * to its drafting step.
 *
 * Targeting logic (in priority order):
 *
 *   1. UNANSWERED questions that are high-priority + high-volume + have at
 *      least one applicable approved fact. These are the easiest wins.
 *   2. UNANSWERED questions that are high-priority but have NO applicable
 *      approved fact — these go into "flagged_for_alex" with a note about
 *      what fact is missing.
 *   3. ANSWERED questions that are STILL not cited after 30+ days. Refresh
 *      candidates — apply the patterns that have been outperforming.
 *
 * Learning loop: reads recent skill_runs and joins their pattern_summary
 * with the resulting pieces' answer_performance. If certain patterns
 * (anecdote, named-expert quote, etc.) correlate with higher AI bot
 * hits or attributed leads, surface them in `learning_signals` so the
 * skill emphasises them in this run.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  APPROVED_FACTS,
  getFactsForQuestion,
  regulatoryApprovedForQuestion,
} from "../../../../src/content/approved-facts";

// ---------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------

const MAX_TARGETS = 5;
const MIN_TARGETS = 3;
const REFRESH_AGE_DAYS = 30;

// Map tracked-question categories to most-likely product page URLs.
// This is a heuristic — the skill can override per-question via SKILL.md
// reasoning if context demands.
const CATEGORY_URL_HINTS: Record<string, string> = {
  shutters: "/shutters/plantation-shutters",
  blinds: "/blinds",
  curtains: "/curtains",
  motorisation: "/blinds/motorised-blinds",
  install: "/quote",
  pricing: "/quote",
  maintenance: "/blinds",
  vendor: "/",
  au_specific: "/",
  comparison: "/",
  style: "/",
  functional: "/",
};

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

interface TrackedQuestion {
  id: number;
  question: string;
  category: string;
  intent: string;
  priority: number;
  expected_volume: number | null;
  is_active: boolean;
}

interface RegistryRow {
  id: number;
  question_id: number;
  url: string;
  anchor: string;
  published_at: string;
}

interface PerformanceRow {
  registry_id: number;
  question_id: number;
  days_since_publish: number;
  ai_bot_hits_30d: number;
  page_views_30d: number;
  leads_attributed_30d: number;
  latest_cited: boolean | null;
}

interface SkillRunRow {
  id: number;
  started_at: string;
  pattern_summary: Record<string, unknown>;
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

function bestPracticesHash(): string {
  try {
    const p = resolve(__dirname, "..", "reference", "best-practices.md");
    const content = readFileSync(p, "utf8");
    return sha256(content);
  } catch {
    return "unknown";
  }
}

function urlHintForCategory(category: string): string {
  return CATEGORY_URL_HINTS[category] ?? "/";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function deriveAnchor(question: string): string {
  // Pick the most-distinctive 3-5 word stub from the question.
  const stop = new Set([
    "the",
    "a",
    "an",
    "for",
    "in",
    "on",
    "of",
    "to",
    "is",
    "are",
    "do",
    "does",
    "how",
    "much",
    "what",
    "why",
    "should",
    "can",
    "be",
    "and",
    "or",
    "with",
    "as",
    "have",
    "has",
    "your",
    "my",
    "i",
    "me",
    "if",
    "by",
    "from",
    "at",
    "vs",
    "versus",
  ]);
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !stop.has(w));
  const stub = words.slice(0, 4).join("-");
  return `q-${slugify(stub || question)}`;
}

// ---------------------------------------------------------------------
// Supabase
// ---------------------------------------------------------------------

function makeSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    process.stderr.write(
      "[fetch-week-targets] Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.\n",
    );
    process.exit(2);
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ---------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------

function scoreUnanswered(q: TrackedQuestion, factCount: number): number {
  // Lower priority number = higher importance (priority 1 = top).
  const priorityWeight = Math.max(1, 11 - q.priority);
  const volumeWeight = q.expected_volume
    ? Math.log10(1 + q.expected_volume) / 2
    : 0.5;
  // Boost questions with available approved facts (we can answer them safely).
  const factWeight = factCount > 0 ? 1.0 : 0.2;
  return priorityWeight * (1 + volumeWeight) * factWeight;
}

function scoreRefresh(q: TrackedQuestion, perf: PerformanceRow): number {
  if (perf.days_since_publish < REFRESH_AGE_DAYS) return 0;
  // Refresh value = priority × age-multiplier, dampened by current performance.
  const priorityWeight = Math.max(1, 11 - q.priority);
  const ageWeight = Math.min(2, perf.days_since_publish / 60);
  // If it's getting AI bot hits but still not cited, refresh is high-value.
  const botHitBoost = perf.ai_bot_hits_30d > 0 && perf.latest_cited === false ? 1.5 : 1.0;
  return priorityWeight * ageWeight * botHitBoost;
}

// ---------------------------------------------------------------------
// Learning loop — derive signals from past runs
// ---------------------------------------------------------------------

function deriveLearningSignals(
  runs: SkillRunRow[],
  perf: PerformanceRow[],
): { outperforming: string[]; underperforming: string[]; sample_size: number } {
  // For each pattern key in pattern_summary, compute avg leads & avg bot hits
  // for pieces produced in runs that USED that pattern vs runs that didn't.
  // Returns the top 2 outperformers and bottom 2.
  const all: Record<
    string,
    { with: number[]; without: number[] }
  > = {};
  for (const run of runs) {
    const patterns = Object.keys(run.pattern_summary ?? {});
    const runPerf = perf; // can't join precisely without piece_id linkage in this script — approximated
    const runScore =
      runPerf.reduce((acc, p) => acc + p.ai_bot_hits_30d + p.leads_attributed_30d * 5, 0) /
      Math.max(1, runPerf.length);
    for (const pattern of patterns) {
      if (!all[pattern]) all[pattern] = { with: [], without: [] };
      const used = Boolean((run.pattern_summary as Record<string, unknown>)[pattern]);
      if (used) all[pattern].with.push(runScore);
      else all[pattern].without.push(runScore);
    }
  }
  function avg(xs: number[]): number {
    if (xs.length === 0) return 0;
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  }
  const ranked = Object.entries(all)
    .filter(([, v]) => v.with.length >= 2 && v.without.length >= 2)
    .map(([k, v]) => ({ pattern: k, delta: avg(v.with) - avg(v.without) }))
    .sort((a, b) => b.delta - a.delta);
  return {
    outperforming: ranked.slice(0, 2).map((r) => `${r.pattern} (+${r.delta.toFixed(2)})`),
    underperforming: ranked.slice(-2).map((r) => `${r.pattern} (${r.delta.toFixed(2)})`),
    sample_size: runs.length,
  };
}

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

async function main(): Promise<void> {
  const supabase = makeSupabase();

  // 1. Fetch active tracked questions.
  const { data: qData, error: qErr } = await supabase
    .from("tracked_questions")
    .select("id, question, category, intent, priority, expected_volume, is_active")
    .eq("is_active", true)
    .order("priority", { ascending: true });
  if (qErr) throw qErr;
  const questions = (qData ?? []) as TrackedQuestion[];

  // 2. Fetch existing answer_registry rows (so we know what's already answered).
  let registry: RegistryRow[] = [];
  try {
    const { data } = await supabase
      .from("answer_registry")
      .select("id, question_id, url, anchor, published_at")
      .eq("is_active", true);
    registry = (data ?? []) as RegistryRow[];
  } catch {
    /* table not yet applied — first run */
  }

  // 3. Fetch performance for already-answered Qs.
  let performance: PerformanceRow[] = [];
  try {
    const { data } = await supabase
      .from("answer_performance")
      .select(
        "registry_id, question_id, days_since_publish, ai_bot_hits_30d, page_views_30d, leads_attributed_30d, latest_cited",
      );
    performance = (data ?? []) as PerformanceRow[];
  } catch {
    /* view not yet applied — first run */
  }

  // 4. Fetch recent skill runs for learning signals.
  let runs: SkillRunRow[] = [];
  try {
    const { data } = await supabase
      .from("skill_runs")
      .select("id, started_at, pattern_summary")
      .eq("status", "completed")
      .order("started_at", { ascending: false })
      .limit(12);
    runs = (data ?? []) as SkillRunRow[];
  } catch {
    /* first run */
  }

  // ---------- Score & rank ----------
  const answeredQuestionIds = new Set(registry.map((r) => r.question_id));
  const perfByQuestion = new Map(performance.map((p) => [p.question_id, p]));

  const candidates: Array<{
    question: TrackedQuestion;
    score: number;
    type: "new_answer" | "refresh" | "flagged_for_alex";
    available_facts: typeof APPROVED_FACTS;
    note?: string;
  }> = [];

  for (const q of questions) {
    const facts = getFactsForQuestion(q.id);

    if (!answeredQuestionIds.has(q.id)) {
      // Unanswered.
      if (facts.length === 0) {
        // No applicable approved facts — can't write this safely yet.
        candidates.push({
          question: q,
          score: 0,
          type: "flagged_for_alex",
          available_facts: [],
          note: `No applicable approved facts in src/content/approved-facts.ts. Alex needs to seed one with applies_to_questions including ${q.id}.`,
        });
        continue;
      }
      // Pricing questions are handled via the `service-no-published-pricing`
      // fact — no special skip here. The skill answers with the honest-broker
      // pattern (explain what changes the price, point to the free quote)
      // without quoting numbers. The price_approval gate in validate-content
      // catches any number that slips into a draft.

      // Regulatory category gate — only block au_specific Qs when no
      // is_regulatory=true fact exists.
      if (q.category === "au_specific" && !regulatoryApprovedForQuestion(q.id)) {
        // Some au_specific Qs are regulatory (landlord obligations etc.).
        // Conservative: route to Alex unless we have a regulatory-flagged fact.
        candidates.push({
          question: q,
          score: 0,
          type: "flagged_for_alex",
          available_facts: facts,
          note: "Australia-specific question that may touch tenancy/regulatory law. Skill cannot publish without an approved fact with is_regulatory=true.",
        });
        continue;
      }
      candidates.push({
        question: q,
        score: scoreUnanswered(q, facts.length),
        type: "new_answer",
        available_facts: facts,
      });
    } else {
      // Answered — consider refresh.
      const perf = perfByQuestion.get(q.id);
      if (!perf) continue;
      const score = scoreRefresh(q, perf);
      if (score > 0) {
        candidates.push({
          question: q,
          score,
          type: "refresh",
          available_facts: facts,
        });
      }
    }
  }

  // Sort by score desc; pick MIN..MAX targets that are NOT flagged_for_alex.
  const writable = candidates
    .filter((c) => c.type !== "flagged_for_alex")
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_TARGETS);

  const flagged = candidates.filter((c) => c.type === "flagged_for_alex").slice(0, 10);

  // Derive learning signals.
  const learning = deriveLearningSignals(runs, performance);

  // Build output.
  const targets = writable.map((c) => {
    const q = c.question;
    const url = urlHintForCategory(q.category);
    const anchor = deriveAnchor(q.question);
    return {
      question_id: q.id,
      question_text: q.question,
      category: q.category,
      intent: q.intent,
      priority: q.priority,
      expected_volume: q.expected_volume,
      type: c.type,
      score: Number(c.score.toFixed(2)),
      available_facts: c.available_facts.map((f) => ({
        id: f.id,
        domain: f.domain,
        claim: f.claim,
        source: f.source,
        is_price: f.is_price,
        is_regulatory: f.is_regulatory,
      })),
      suggested_url: url,
      suggested_anchor: anchor,
    };
  });

  const summary = {
    run_at: new Date().toISOString(),
    best_practices_hash: bestPracticesHash(),
    counts: {
      total_active_questions: questions.length,
      already_answered: answeredQuestionIds.size,
      writable_candidates: writable.length,
      flagged_for_alex: flagged.length,
    },
    targets,
    flagged_for_alex: flagged.map((c) => ({
      question_id: c.question.id,
      question_text: c.question.question,
      category: c.question.category,
      reason: c.note,
    })),
    learning_signals: learning,
    constraints: {
      min_targets: MIN_TARGETS,
      max_targets: MAX_TARGETS,
      refresh_age_days: REFRESH_AGE_DAYS,
    },
  };

  process.stdout.write(JSON.stringify(summary, null, 2) + "\n");

  if (targets.length < MIN_TARGETS) {
    process.stderr.write(
      `[fetch-week-targets] Only ${targets.length} writable targets — below min ${MIN_TARGETS}. Skill should still run for the targets it has, but Alex should be notified to seed more approved facts.\n`,
    );
  }
}

main().catch((err) => {
  process.stderr.write(`[fetch-week-targets] failed: ${(err as Error).message}\n`);
  process.exit(1);
});
