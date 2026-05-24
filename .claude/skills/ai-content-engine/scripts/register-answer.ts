#!/usr/bin/env tsx
/**
 * register-answer.ts — write a published answer into answer_registry +
 * content_pieces + content_gate_log.
 *
 * Run as:
 *   npx tsx .claude/skills/ai-content-engine/scripts/register-answer.ts <published.json>
 *
 * Input shape:
 *   {
 *     "skill_run_id": 123,
 *     "question_id": 4,
 *     "question_text": "Best blinds...",
 *     "answer_text": "We mostly run...",
 *     "anchor": "q-west-facing-heat",
 *     "url": "/blinds/honeycomb-blinds",
 *     "mode": "inline",
 *     "byline_author": "Modern Curtains and Blinds — Preston, Melbourne",
 *     "product_slug": "honeycomb-blinds",
 *     "fact_markers": ["region-west-facing-heat", "blinds-honeycomb-insulation"],
 *     "gate_results": [ {...validate-content output rows...} ],
 *     "related": [{"label": "...", "href": "..."}]
 *   }
 *
 * Side effects:
 *   1. Insert one row into content_pieces (status="published") with the
 *      gate_summary attached and registry_id populated.
 *   2. Insert one row into answer_registry (the live record).
 *   3. Insert N rows into content_gate_log (one per gate result).
 *
 * Output: JSON to stdout with the new registry_id and content_piece_id.
 */

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

interface GateResult {
  gate: string;
  passed: boolean;
  severity: string;
  diagnostic?: string;
}

interface PublishInput {
  skill_run_id: number;
  question_id: number;
  question_text: string;
  answer_text: string;
  anchor: string;
  url: string;
  mode: "inline" | "region" | "journal";
  byline_author: string;
  product_slug?: string;
  fact_markers: string[];
  gate_results: GateResult[];
  related?: Array<{ label: string; href: string }>;
}

function makeSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    process.stderr.write(
      "[register-answer] Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.\n",
    );
    process.exit(2);
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function contentHash(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  if (!arg) {
    process.stderr.write("[register-answer] usage: register-answer.ts <published.json>\n");
    process.exit(2);
  }
  const input = JSON.parse(readFileSync(arg, "utf8")) as PublishInput;
  const supabase = makeSupabase();

  // Build the gate summary roll-up (one key per gate, value pass/fail).
  const gateSummary: Record<string, string> = {};
  for (const r of input.gate_results) {
    gateSummary[r.gate] = r.passed ? "pass" : `fail:${r.severity}`;
  }

  // 1. Insert into answer_registry first (we need its id for content_pieces).
  const { data: regData, error: regErr } = await supabase
    .from("answer_registry")
    .insert({
      question_id: input.question_id,
      url: input.url,
      anchor: input.anchor,
      mode: input.mode,
      product_slug: input.product_slug,
      question_text: input.question_text,
      answer_text: input.answer_text,
      byline_author: input.byline_author,
      content_hash: contentHash(input.answer_text),
      meta: {
        fact_markers: input.fact_markers,
        related: input.related ?? [],
      },
    })
    .select("id")
    .single();

  if (regErr || !regData) {
    process.stderr.write(
      `[register-answer] answer_registry insert failed: ${regErr?.message ?? "no data"}\n`,
    );
    process.exit(1);
  }
  const registryId = regData.id as number;

  // 2. Insert content_pieces row.
  const { data: pieceData, error: pieceErr } = await supabase
    .from("content_pieces")
    .insert({
      skill_run_id: input.skill_run_id,
      question_id: input.question_id,
      draft_question_text: input.question_text,
      draft_answer_text: input.answer_text,
      status: "published",
      gate_summary: gateSummary,
      target_url: input.url,
      target_anchor: input.anchor,
      registry_id: registryId,
    })
    .select("id")
    .single();

  if (pieceErr || !pieceData) {
    process.stderr.write(
      `[register-answer] content_pieces insert failed: ${pieceErr?.message ?? "no data"}\n`,
    );
    process.exit(1);
  }
  const pieceId = pieceData.id as number;

  // 3. Insert one row per gate into content_gate_log.
  if (input.gate_results.length > 0) {
    const gateRows = input.gate_results.map((r) => ({
      content_piece_id: pieceId,
      gate_name: r.gate,
      passed: r.passed,
      severity: r.severity,
      diagnostic: r.diagnostic ?? null,
    }));
    const { error: gateErr } = await supabase.from("content_gate_log").insert(gateRows);
    if (gateErr) {
      process.stderr.write(
        `[register-answer] content_gate_log insert failed: ${gateErr.message}\n`,
      );
      // Don't exit — registry and piece are written. Log and continue.
    }
  }

  process.stdout.write(
    JSON.stringify({ registry_id: registryId, content_piece_id: pieceId }, null, 2) + "\n",
  );
}

main().catch((err) => {
  process.stderr.write(`[register-answer] failed: ${(err as Error).message}\n`);
  process.exit(1);
});
