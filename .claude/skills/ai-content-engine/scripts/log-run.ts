#!/usr/bin/env tsx
/**
 * log-run.ts — start or finish a skill_runs row.
 *
 * Two modes:
 *   --start: insert a new row with status='started', return its id.
 *     npx tsx log-run.ts --start --trigger=schedule --hypothesis="..."
 *
 *   --finish <id>: update the row with final counts + status.
 *     npx tsx log-run.ts --finish 123 --status=completed --release=2026-05-25-ai-content-w1
 *
 * Inputs read via CLI flags rather than stdin because this script is
 * called twice in a single skill run (once at start, once at end).
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function makeSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    process.stderr.write(
      "[log-run] Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.\n",
    );
    process.exit(2);
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const out: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) {
        out[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const next = args[i + 1];
        if (next && !next.startsWith("--")) {
          out[a.slice(2)] = next;
          i++;
        } else {
          out[a.slice(2)] = "true";
        }
      }
    }
  }
  return out;
}

function bestPracticesHash(): string {
  try {
    const p = resolve(__dirname, "..", "reference", "best-practices.md");
    return createHash("sha256").update(readFileSync(p, "utf8")).digest("hex");
  } catch {
    return "unknown";
  }
}

async function startRun(args: Record<string, string>): Promise<void> {
  const supabase = makeSupabase();
  const { data, error } = await supabase
    .from("skill_runs")
    .insert({
      status: "started",
      skill_version: args.version ?? "v1",
      best_practices_hash: bestPracticesHash(),
      trigger_source: args.trigger ?? "manual",
      hypothesis: args.hypothesis ?? null,
    })
    .select("id")
    .single();
  if (error || !data) {
    process.stderr.write(`[log-run] start failed: ${error?.message ?? "no data"}\n`);
    process.exit(1);
  }
  process.stdout.write(JSON.stringify({ skill_run_id: data.id }) + "\n");
}

async function finishRun(args: Record<string, string>): Promise<void> {
  const runId = Number(args.finish);
  if (!Number.isFinite(runId)) {
    process.stderr.write("[log-run] --finish requires an integer skill_run id\n");
    process.exit(2);
  }
  const supabase = makeSupabase();

  const update: Record<string, unknown> = {
    finished_at: new Date().toISOString(),
    status: args.status ?? "completed",
  };
  if (args.targets_considered) update.targets_considered = Number(args.targets_considered);
  if (args.targets_attempted) update.targets_attempted = Number(args.targets_attempted);
  if (args.pieces_drafted) update.pieces_drafted = Number(args.pieces_drafted);
  if (args.pieces_passed_gates) update.pieces_passed_gates = Number(args.pieces_passed_gates);
  if (args.pieces_published) update.pieces_published = Number(args.pieces_published);
  if (args.pieces_rejected) update.pieces_rejected = Number(args.pieces_rejected);
  if (args.release) update.release_id = args.release;
  if (args.commit) update.commit_sha = args.commit;
  if (args.error) update.error_message = args.error;
  if (args.patterns) {
    try {
      update.pattern_summary = JSON.parse(args.patterns);
    } catch {
      process.stderr.write("[log-run] --patterns must be valid JSON\n");
      process.exit(2);
    }
  }

  const { error } = await supabase.from("skill_runs").update(update).eq("id", runId);
  if (error) {
    process.stderr.write(`[log-run] finish failed: ${error.message}\n`);
    process.exit(1);
  }
  process.stdout.write(JSON.stringify({ skill_run_id: runId, status: update.status }) + "\n");
}

async function main(): Promise<void> {
  const args = parseArgs();
  if (args.start) {
    await startRun(args);
  } else if (args.finish) {
    await finishRun(args);
  } else {
    process.stderr.write("[log-run] usage: --start | --finish <id>\n");
    process.exit(2);
  }
}

main().catch((err) => {
  process.stderr.write(`[log-run] error: ${(err as Error).message}\n`);
  process.exit(1);
});
