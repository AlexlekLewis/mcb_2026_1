import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE } from "@/lib/site";
import { LOCATIONS } from "@/lib/locations";
import { collectAllSignals } from "./collectors";
import { scoreRun } from "./scoring";
import { generateIssues } from "./issues";
import { getActiveWeights } from "./weights";

const DEFAULT_SAMPLE_PATHS = [
    "/",
    "/about",
    "/contact",
    "/quote",
    "/blinds",
    "/curtains",
    "/shutters",
    "/awnings",
    "/security",
    "/motorisation",
    "/our-story",
];

interface RunOptions {
    trigger?: "cron" | "manual" | "event" | "learn";
    samplePaths?: string[];
}

export async function runOptimization(options: RunOptions = {}) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return { error: "Supabase not configured", runId: null };
    }

    const trigger = options.trigger ?? "cron";
    const samplePaths = options.samplePaths ?? buildSamplePaths();

    const weights = await getActiveWeights(supabase);
    if (weights.length === 0) {
        return { error: "No active weights configured", runId: null };
    }

    const { data: runRow, error: runErr } = await supabase
        .from("optimization_runs")
        .insert({ trigger, weights_version: weights[0].version })
        .select()
        .single();

    if (runErr || !runRow) {
        return { error: runErr?.message ?? "failed to insert run", runId: null };
    }

    const runId: string = runRow.id;

    try {
        const { signals, crawlSummaries } = await collectAllSignals({
            supabase,
            baseUrl: SITE.url,
            samplePaths,
        });

        const result = scoreRun(signals, weights);
        const issues = generateIssues(signals);

        // Persist run summary.
        await supabase.from("optimization_runs").update({
            finished_at: new Date().toISOString(),
            composite_score: result.composite,
            sub_scores: result.subScores,
            signals: serializeSignals(result),
        }).eq("id", runId);

        // Persist page-level scores.
        if (crawlSummaries.length > 0) {
            await supabase.from("optimization_page_scores").insert(
                crawlSummaries.map((s) => ({
                    run_id: runId,
                    url_path: s.url_path,
                    page_score: s.score,
                    sub_scores: { discoverability: s.score, crawlability: s.score },
                    flags: s.flags,
                })),
            );
        }

        // Upsert issues — re-open or extend existing rows.
        await upsertIssues(supabase, runId, issues);

        return { runId, score: result.composite, subScores: result.subScores, signalsCount: signals.length, issuesCount: issues.length };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await supabase.from("optimization_runs").update({
            finished_at: new Date().toISOString(),
            error: msg,
        }).eq("id", runId);
        return { error: msg, runId };
    }
}

function buildSamplePaths(): string[] {
    // Stable sample: static set + 8 random locations + 4 location-product combos.
    const locationSamples = pickN(LOCATIONS.map((l) => `/locations/${l.slug}`), 8);
    const locationProduct = pickN(
        LOCATIONS.flatMap((l) => [`/locations/${l.slug}/blinds`, `/locations/${l.slug}/curtains`, `/locations/${l.slug}/shutters`]),
        4,
    );
    return [...DEFAULT_SAMPLE_PATHS, ...locationSamples, ...locationProduct];
}

function pickN<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    const result: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i += 1) {
        const idx = Math.floor(Math.random() * copy.length);
        result.push(copy.splice(idx, 1)[0]);
    }
    return result;
}

function serializeSignals(result: ReturnType<typeof scoreRun>) {
    const obj: Record<string, { value: number; normalized: number; target: number; note?: string }> = {};
    for (const [k, sig] of Object.entries(result.signals)) {
        obj[k] = { value: sig.value, normalized: sig.normalized, target: sig.target, note: sig.note };
    }
    return obj;
}

async function upsertIssues(supabase: ReturnType<typeof getSupabaseAdmin>, runId: string, drafts: ReturnType<typeof generateIssues>) {
    if (!supabase) return;
    for (const draft of drafts) {
        const lookupKey = { signal_key: draft.signal_key, url_path: draft.url_path ?? null };
        const { data: existing } = await supabase
            .from("optimization_issues")
            .select("id, times_seen, status")
            .match(lookupKey)
            .maybeSingle();

        if (existing) {
            await supabase.from("optimization_issues").update({
                last_seen_run: runId,
                severity: draft.severity,
                detail: draft.detail,
                recommended_fix: draft.recommended_fix,
                expected_lift: draft.expected_lift,
                status: existing.status === "closed" ? "open" : existing.status,
                times_seen: existing.times_seen + 1,
            }).eq("id", existing.id);
        } else {
            await supabase.from("optimization_issues").insert({
                first_seen_run: runId,
                last_seen_run: runId,
                signal_key: draft.signal_key,
                sub_score: draft.sub_score,
                severity: draft.severity,
                url_path: draft.url_path ?? null,
                title: draft.title,
                detail: draft.detail,
                recommended_fix: draft.recommended_fix,
                expected_lift: draft.expected_lift,
            });
        }
    }
}
