#!/usr/bin/env tsx
/**
 * validate-content.ts — deterministic gates for the AI Content Engine.
 *
 * Run as:
 *   npx tsx .claude/skills/ai-content-engine/scripts/validate-content.ts <draft.json>
 *
 * Or pipe a draft to stdin:
 *   cat draft.json | npx tsx .claude/skills/ai-content-engine/scripts/validate-content.ts
 *
 * Input shape (one draft per invocation):
 *
 *   {
 *     "question_id": 4,
 *     "question_text": "Best blinds to block heat in a west-facing Melbourne window",
 *     "answer_text": "We mostly run...",
 *     "anchor": "q-west-facing-heat",
 *     "url": "/blinds/honeycomb-blinds",
 *     "fact_markers": ["region-west-facing-heat", "blinds-honeycomb-insulation"],
 *     "byline_author": "Modern Curtains and Blinds — Preston, Melbourne"
 *   }
 *
 * Output:
 *   JSON to stdout listing every gate's pass/fail + diagnostic.
 *   Exit code: 0 if all blocking gates pass, 1 otherwise.
 *
 * This script handles ONLY the deterministic gates (regex / pattern / count).
 * Judgement gates (does it actually sound like a Preston installer?) live in
 * SKILL.md and are run by the agent during drafting.
 */

import { readFileSync } from "node:fs";
import {
  AI_TELL_PHRASES,
  BANNED_SUPERLATIVES_WITHOUT_EVIDENCE,
  REGULATORY_TOPICS,
  US_TO_AU_SPELLING,
  US_IDIOM_BANNED,
  PRICE_PATTERNS,
  STRUCTURAL_ANTIPATTERNS,
} from "../../../../src/content/forbidden-claims";
import {
  getFactById,
  pricingApprovedForQuestion,
  regulatoryApprovedForQuestion,
} from "../../../../src/content/approved-facts";
import { VOICE_RULES } from "../../../../src/content/voice-anchors";

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

interface Draft {
  question_id: number;
  question_text: string;
  answer_text: string;
  anchor: string;
  url: string;
  fact_markers: string[]; // approved-fact ids cited in the draft
  byline_author?: string;
}

type Severity = "block" | "warn" | "info";

interface GateResult {
  gate: string;
  passed: boolean;
  severity: Severity;
  diagnostic?: string;
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findPhraseHits(text: string, phrases: string[]): string[] {
  const hits: string[] = [];
  const lower = text.toLowerCase();
  for (const p of phrases) {
    const pat = new RegExp(`\\b${escapeRegex(p.toLowerCase())}\\b`, "i");
    if (pat.test(lower)) hits.push(p);
  }
  return hits;
}

// ---------------------------------------------------------------------
// Individual gates
// ---------------------------------------------------------------------

function gateWordCount(draft: Draft): GateResult {
  const wc = countWords(draft.answer_text);
  // Hard block outside 30-90; warn outside 40-60.
  if (wc < 30 || wc > 90) {
    return {
      gate: "word_count",
      passed: false,
      severity: "block",
      diagnostic: `Answer is ${wc} words; must be 30-90 (target 40-60).`,
    };
  }
  if (wc < 40 || wc > 60) {
    return {
      gate: "word_count",
      passed: true,
      severity: "warn",
      diagnostic: `Answer is ${wc} words; target is 40-60 for AI extraction quality.`,
    };
  }
  return { gate: "word_count", passed: true, severity: "block" };
}

function gateBlufFirst(draft: Draft): GateResult {
  if (STRUCTURAL_ANTIPATTERNS.hedgeOpening.test(draft.answer_text)) {
    return {
      gate: "bluf_first",
      passed: false,
      severity: "block",
      diagnostic:
        "First sentence opens with a hedge ('It depends', 'Great question', etc.). Answer must lead with a declarative answer.",
    };
  }
  if (STRUCTURAL_ANTIPATTERNS.rhetoricalQuestionOpener.test(draft.answer_text)) {
    return {
      gate: "bluf_first",
      passed: false,
      severity: "block",
      diagnostic:
        "First sentence is a rhetorical question. Answer must lead with a declarative statement.",
    };
  }
  return { gate: "bluf_first", passed: true, severity: "block" };
}

function gateAiTell(draft: Draft): GateResult {
  const hits = findPhraseHits(draft.answer_text, AI_TELL_PHRASES);
  if (hits.length > 0) {
    return {
      gate: "ai_tell",
      passed: false,
      severity: "block",
      diagnostic: `AI-tell phrases detected: ${hits.join(", ")}.`,
    };
  }
  return { gate: "ai_tell", passed: true, severity: "block" };
}

function gateBannedSuperlatives(draft: Draft): GateResult {
  // Match the phrase; allow if followed by named evidence (a year, a proper
  // noun, or "by <Name>") within 20 chars.
  const offenders: string[] = [];
  for (const p of BANNED_SUPERLATIVES_WITHOUT_EVIDENCE) {
    const pat = new RegExp(
      `\\b${escapeRegex(p)}\\b([^.]{0,20})`,
      "i",
    );
    const m = pat.exec(draft.answer_text);
    if (!m) continue;
    const followingChars = m[1] ?? "";
    const hasEvidence =
      /\b(19|20)\d{2}\b/.test(followingChars) ||
      /\bby\s+[A-Z][a-z]+/.test(followingChars) ||
      /\b[A-Z][a-z]+\s+(Award|Magazine|Review)/.test(followingChars);
    if (!hasEvidence) offenders.push(p);
  }
  if (offenders.length > 0) {
    return {
      gate: "banned_superlatives",
      passed: false,
      severity: "block",
      diagnostic: `Superlatives used without supporting evidence: ${offenders.join(", ")}.`,
    };
  }
  return { gate: "banned_superlatives", passed: true, severity: "block" };
}

function gateStructural(draft: Draft): GateResult {
  // Em-dash count vs allowed-per-200-words.
  const wc = countWords(draft.answer_text);
  const emDashMatches = draft.answer_text.match(STRUCTURAL_ANTIPATTERNS.emDash);
  const emDashCount = emDashMatches ? emDashMatches.length : 0;
  const allowed = Math.max(
    1,
    Math.floor((wc / 200) * VOICE_RULES.maxEmDashesPer200Words) + 1,
  );
  if (emDashCount > allowed) {
    return {
      gate: "structural",
      passed: false,
      severity: "block",
      diagnostic: `Em-dash count is ${emDashCount}; max is ${allowed} for ${wc} words. Em-dash overuse is a known AI tell.`,
    };
  }

  // "Whether you're X, Y, or Z" opener.
  if (STRUCTURAL_ANTIPATTERNS.whetherYoureOpener.test(draft.answer_text)) {
    return {
      gate: "structural",
      passed: false,
      severity: "block",
      diagnostic: "Forbidden 'Whether you're X, Y or Z' opening.",
    };
  }

  // Uniform sentence-length cadence.
  const sentences = splitSentences(draft.answer_text);
  if (sentences.length >= 3) {
    const lens = sentences.map(countWords);
    let similar = 0;
    for (let i = 1; i < lens.length; i++) {
      if (Math.abs(lens[i] - lens[i - 1]) <= 2) similar++;
    }
    const ratio = similar / (lens.length - 1);
    if (ratio > VOICE_RULES.maxUniformCadenceRatio) {
      return {
        gate: "structural",
        passed: false,
        severity: "block",
        diagnostic: `Uniform sentence cadence: ${Math.round(ratio * 100)}% of consecutive sentences within ±2 words of each other (max ${Math.round(VOICE_RULES.maxUniformCadenceRatio * 100)}%). Vary sentence length.`,
      };
    }
  }

  return { gate: "structural", passed: true, severity: "block" };
}

function gateUsSpelling(draft: Draft): GateResult {
  const offenders: string[] = [];
  const lower = draft.answer_text.toLowerCase();
  for (const us of Object.keys(US_TO_AU_SPELLING)) {
    const pat = new RegExp(`\\b${escapeRegex(us)}\\b`, "i");
    if (pat.test(lower)) offenders.push(`${us} → ${US_TO_AU_SPELLING[us]}`);
  }
  if (offenders.length > 0) {
    // US spelling is a warn, not a hard block — easy to auto-correct.
    return {
      gate: "us_spelling",
      passed: false,
      severity: "warn",
      diagnostic: `US spellings detected (auto-correct before publish): ${offenders.join("; ")}.`,
    };
  }
  return { gate: "us_spelling", passed: true, severity: "warn" };
}

function gateUsIdiom(draft: Draft): GateResult {
  const hits = findPhraseHits(draft.answer_text, US_IDIOM_BANNED);
  if (hits.length > 0) {
    return {
      gate: "us_idiom",
      passed: false,
      severity: "block",
      diagnostic: `US idiom that should never appear in AU copy: ${hits.join(", ")}.`,
    };
  }
  return { gate: "us_idiom", passed: true, severity: "block" };
}

function gateRegulatory(draft: Draft): GateResult {
  const triggered: string[] = [];
  for (const { pattern, topic } of REGULATORY_TOPICS) {
    if (pattern.test(draft.answer_text)) triggered.push(topic);
  }
  if (triggered.length === 0) {
    return { gate: "regulatory_check", passed: true, severity: "block" };
  }
  // A regulatory topic appeared. Verify the question has an approved
  // regulatory fact backing it.
  if (regulatoryApprovedForQuestion(draft.question_id)) {
    return {
      gate: "regulatory_check",
      passed: true,
      severity: "block",
      diagnostic: `Regulatory topics (${triggered.join(", ")}) mentioned; backed by an approved regulatory fact for this question.`,
    };
  }
  return {
    gate: "regulatory_check",
    passed: false,
    severity: "block",
    diagnostic: `Regulatory topics mentioned (${triggered.join(", ")}) but no approved regulatory fact exists for question ${draft.question_id}. Add an entry to approved-facts.ts with is_regulatory=true, or remove the regulatory claim.`,
  };
}

function gatePriceApproval(draft: Draft): GateResult {
  const hits: string[] = [];
  for (const pat of PRICE_PATTERNS) {
    const m = draft.answer_text.match(pat);
    if (m) hits.push(m[0]);
  }
  if (hits.length === 0) {
    return { gate: "price_approval", passed: true, severity: "block" };
  }
  if (pricingApprovedForQuestion(draft.question_id)) {
    return {
      gate: "price_approval",
      passed: true,
      severity: "block",
      diagnostic: `Price mentioned (${hits.join(", ")}); backed by an approved pricing fact for this question.`,
    };
  }
  return {
    gate: "price_approval",
    passed: false,
    severity: "block",
    diagnostic: `Price-shaped values mentioned (${hits.join(", ")}) but no approved pricing fact exists for question ${draft.question_id}. Add an entry to approved-facts.ts with is_price=true, or remove the price.`,
  };
}

function gateFactProvenance(draft: Draft): GateResult {
  const unresolved: string[] = [];
  for (const id of draft.fact_markers ?? []) {
    if (!getFactById(id)) unresolved.push(id);
  }
  if (unresolved.length > 0) {
    return {
      gate: "fact_provenance",
      passed: false,
      severity: "block",
      diagnostic: `Unresolved fact markers (missing or expired in approved-facts.ts): ${unresolved.join(", ")}.`,
    };
  }
  if ((draft.fact_markers ?? []).length === 0) {
    // No fact markers declared at all — the skill must declare its sources.
    return {
      gate: "fact_provenance",
      passed: false,
      severity: "block",
      diagnostic:
        "Draft declared no fact_markers. Every generated answer must cite at least one approved-fact id OR explicitly declare it's restating verbatim site content. Hallucination guardrail.",
    };
  }
  return { gate: "fact_provenance", passed: true, severity: "block" };
}

function gateVoiceChecklist(draft: Draft): GateResult {
  const text = draft.answer_text;
  const wc = countWords(text);

  // First-person plural (we / we'll / we've / we're / our / ours / us).
  const firstPersonPlural = /\b(we|we'll|we've|we're|we'd|our|ours|us)\b/i.test(text);

  // At least one defensible number/measurement.
  const hasNumber =
    /\b\d+(\.\d+)?\s?(mm|cm|m|m²|m2|sqm|°c|%|gsm|kg|year|years|month|months|week|weeks|day|days)\b/i.test(
      text,
    ) || /\b(20\d{2}|19\d{2})\b/.test(text);

  // At least one named local reference. List of common Melbourne suburbs +
  // generic place markers we expect the skill to use.
  const localRefPat =
    /\b(Melbourne|Preston|Thornbury|Reservoir|Bundoora|Mill Park|Brighton|Hampton|Sandringham|Black Rock|Mentone|Mordialloc|Footscray|Yarraville|Williamstown|Altona|Werribee|Point Cook|Tarneit|Truganina|Toorak|Hawthorn|Camberwell|Brunswick|Coburg|Carlton|Fitzroy|Northcote|Heidelberg|Ivanhoe|Eltham|Richmond|Hawthorn|Doncaster|Box Hill|Glen Waverley|Ringwood|Croydon|Lilydale|Frankston|Mornington|Geelong|Bayside|Inner West|North-East|South-East|Victorian|VIC|Victoria)\b/;
  const hasLocalRef = localRefPat.test(text);

  // Opinion verb proxies — words suggesting MCB takes a position.
  const opinionPat =
    /\b(we'd|we mostly|we install|we run|we stop|we prefer|we recommend|we'll|we choose|we reach|we land|we'?re a fan|our (pick|go-to|first call|most[- ]requested|usual|default|preferred)|tends? to|usually|typically|honestly|the honest answer|in our experience|in 8 years|the bottom line|reach for|stick with|skip)\b/i;
  const hasOpinion = opinionPat.test(text);

  // Aggregate
  const missing: string[] = [];
  if (!firstPersonPlural) missing.push("first-person-plural (we/our/us)");
  if (!hasNumber) missing.push("defensible number (mm, %, year, weeks, etc.)");
  if (!hasLocalRef) missing.push("named local reference");
  if (!hasOpinion && wc >= 50) missing.push("opinion-bearing language");

  if (missing.length > 0) {
    return {
      gate: "voice_checklist",
      passed: false,
      severity: "block",
      diagnostic: `Voice checklist failures: missing ${missing.join("; ")}.`,
    };
  }
  return { gate: "voice_checklist", passed: true, severity: "block" };
}

function gateNamedSource(draft: Draft): GateResult {
  // The Princeton GEO trifecta: named-expert quote OR inline citation OR
  // specific brand/source. At least one of these must be present for max
  // citation lift (+28-41% PAWC).
  const text = draft.answer_text;

  const namedQuote = /"[^"]{6,}"\s+(?:—|–|--|says|told|noted)\s+[A-Z][a-z]+/.test(text);
  const inlineCitation =
    /\((?:[A-Z][a-z]+\s?){1,3}(?:\d{4})?\)/.test(text) ||
    /\baccording to\s+[A-Z][a-z]+/i.test(text) ||
    /\b(?:per|cite[ds]?)\s+[A-Z][a-z]+/i.test(text);
  const namedBrandOrSpec =
    /\b(Luxaflex|Verosol|Crimsafe|Wynstan|Hunter Douglas|Basswood|Tilia|3-pass|AS\/NZS|AS\s?\d{4})\b/i.test(
      text,
    );

  if (!namedQuote && !inlineCitation && !namedBrandOrSpec) {
    return {
      gate: "named_source",
      passed: false,
      severity: "warn",
      diagnostic:
        "No named-expert quote, inline citation, or named brand/spec detected. Princeton GEO research shows these raise citation likelihood +28-41%. Consider adding one.",
    };
  }
  return { gate: "named_source", passed: true, severity: "warn" };
}

function gateQuestionMatch(draft: Draft): GateResult {
  if (!draft.question_text || draft.question_text.trim().length === 0) {
    return {
      gate: "question_match",
      passed: false,
      severity: "block",
      diagnostic: "question_text is empty.",
    };
  }
  // Question must be a question (ends with ? or starts with what/how/why/etc).
  const looksLikeQuestion =
    /\?$/.test(draft.question_text.trim()) ||
    /^(how|what|why|when|where|are|can|do|does|is|will|should|which)\b/i.test(
      draft.question_text.trim(),
    );
  if (!looksLikeQuestion) {
    return {
      gate: "question_match",
      passed: false,
      severity: "block",
      diagnostic:
        "question_text doesn't look like a question. Visible H3 + FAQPage schema must be a real question for AI extraction.",
    };
  }
  return { gate: "question_match", passed: true, severity: "block" };
}

function gateAnchorFormat(draft: Draft): GateResult {
  if (!/^q-[a-z0-9-]+$/.test(draft.anchor)) {
    return {
      gate: "anchor_format",
      passed: false,
      severity: "block",
      diagnostic: `Anchor "${draft.anchor}" must match pattern q-<kebab-case>. Used for #fragment links from AI citations.`,
    };
  }
  return { gate: "anchor_format", passed: true, severity: "block" };
}

// ---------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------

const GATES: Array<(d: Draft) => GateResult> = [
  gateAnchorFormat,
  gateQuestionMatch,
  gateWordCount,
  gateBlufFirst,
  gateStructural,
  gateAiTell,
  gateBannedSuperlatives,
  gateUsSpelling,
  gateUsIdiom,
  gateRegulatory,
  gatePriceApproval,
  gateFactProvenance,
  gateVoiceChecklist,
  gateNamedSource,
];

function readInput(): Draft {
  const arg = process.argv[2];
  let raw: string;
  if (arg) {
    raw = readFileSync(arg, "utf8");
  } else {
    raw = readFileSync(0, "utf8"); // stdin
  }
  const parsed = JSON.parse(raw);
  return parsed as Draft;
}

function main(): void {
  let draft: Draft;
  try {
    draft = readInput();
  } catch (err) {
    process.stderr.write(
      `[validate-content] failed to read draft JSON: ${(err as Error).message}\n`,
    );
    process.exit(2);
  }

  const results = GATES.map((g) => {
    try {
      return g(draft);
    } catch (err) {
      return {
        gate: g.name,
        passed: false,
        severity: "block" as Severity,
        diagnostic: `Gate threw: ${(err as Error).message}`,
      };
    }
  });

  const blocking = results.filter((r) => r.severity === "block" && !r.passed);
  const warnings = results.filter((r) => r.severity === "warn" && !r.passed);
  const allPassed = blocking.length === 0;

  const summary = {
    draft: {
      question_id: draft.question_id,
      question_text: draft.question_text,
      anchor: draft.anchor,
      url: draft.url,
      word_count: countWords(draft.answer_text),
    },
    passed: allPassed,
    blocking_failures: blocking.length,
    warnings: warnings.length,
    results,
  };

  process.stdout.write(JSON.stringify(summary, null, 2) + "\n");
  process.exit(allPassed ? 0 : 1);
}

main();
