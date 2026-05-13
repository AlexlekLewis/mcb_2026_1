import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { authoriseCron } from "@/lib/optimization/auth";
import { promoteNewWeightVersion } from "@/lib/optimization/weights";
import type { SignalKey } from "@/lib/optimization/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const MEASURE_WINDOW_DAYS = 14;

/**
 * Self-improvement loop:
 *   For every issue closed >= 14 days ago that hasn't been measured yet:
 *     - Compute baseline conversion rate (14 days before close).
 *     - Compute post conversion rate (14 days after close).
 *     - Record lift in optimization_learning_log.
 *     - Adjust active weight for that signal_key proportional to measured lift,
 *       capped at ±20% per learn cycle.
 *
 * Result: weights drift toward signals that produced real conversion lift on
 * MCB's actual traffic.
 */
export async function GET(request: Request) {
    const unauthorised = authoriseCron(request);
    if (unauthorised) return unauthorised;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: "supabase not configured" }, { status: 500 });

    const cutoff = new Date(Date.now() - MEASURE_WINDOW_DAYS * 24 * 3600 * 1000).toISOString();

    // 1. Find issues closed at least MEASURE_WINDOW_DAYS ago that have no learning log row yet.
    const { data: candidates } = await supabase
        .from("optimization_issues")
        .select("id, signal_key, closed_at")
        .eq("status", "closed")
        .lte("closed_at", cutoff);

    if (!candidates || candidates.length === 0) {
        return NextResponse.json({ measured: 0, message: "no candidate issues" });
    }

    const { data: alreadyLogged } = await supabase
        .from("optimization_learning_log")
        .select("issue_id");
    const loggedIds = new Set((alreadyLogged ?? []).map((r) => r.issue_id));
    const toMeasure = candidates.filter((c) => !loggedIds.has(c.id));

    if (toMeasure.length === 0) {
        return NextResponse.json({ measured: 0, message: "all candidate issues already logged" });
    }

    const deltas: Array<{ signal_key: SignalKey; new_weight: number; rationale: string }> = [];

    for (const issue of toMeasure) {
        const closedAt = new Date(issue.closed_at).getTime();
        const baselineStart = new Date(closedAt - MEASURE_WINDOW_DAYS * 24 * 3600 * 1000).toISOString();
        const baselineEnd = new Date(closedAt).toISOString();
        const postStart = baselineEnd;
        const postEnd = new Date(closedAt + MEASURE_WINDOW_DAYS * 24 * 3600 * 1000).toISOString();

        const baseline = await convRate(supabase, baselineStart, baselineEnd);
        const post     = await convRate(supabase, postStart, postEnd);

        const lift = baseline > 0 ? ((post - baseline) / baseline) * 100 : 0;

        // Look up current active weight for this signal.
        const { data: weightRow } = await supabase
            .from("optimization_weights")
            .select("weight")
            .eq("signal_key", issue.signal_key)
            .eq("is_active", true)
            .maybeSingle();

        const weightBefore = Number(weightRow?.weight ?? 0);

        // Adjustment policy:
        //   lift > +20% → weight × 1.2  (signal proven important)
        //   lift > +5%  → weight × 1.1
        //   lift < -5%  → weight × 0.95 (signal less important than thought)
        //   lift < -20% → weight × 0.8
        let factor = 1.0;
        if (lift > 20) factor = 1.2;
        else if (lift > 5) factor = 1.1;
        else if (lift < -20) factor = 0.8;
        else if (lift < -5) factor = 0.95;

        const weightAfter = Math.max(0.1, weightBefore * factor);

        await supabase.from("optimization_learning_log").insert({
            issue_id: issue.id,
            signal_key: issue.signal_key,
            closed_at: issue.closed_at,
            measure_window_days: MEASURE_WINDOW_DAYS,
            measured_at: new Date().toISOString(),
            baseline_conv_rate: baseline,
            post_conv_rate: post,
            measured_lift_pct: lift,
            weight_before: weightBefore,
            weight_after: weightAfter,
            notes: `factor=${factor.toFixed(2)}`,
        });

        if (Math.abs(weightAfter - weightBefore) > 0.01) {
            deltas.push({
                signal_key: issue.signal_key as SignalKey,
                new_weight: weightAfter,
                rationale: `lift=${lift.toFixed(1)}% over ${MEASURE_WINDOW_DAYS}d after closing issue ${issue.id}`,
            });
        }
    }

    let newVersion: number | null = null;
    if (deltas.length > 0) {
        newVersion = await promoteNewWeightVersion(supabase, deltas);
    }

    return NextResponse.json({ measured: toMeasure.length, deltas: deltas.length, newWeightVersion: newVersion });
}

async function convRate(supabase: ReturnType<typeof getSupabaseAdmin>, fromIso: string, toIso: string): Promise<number> {
    if (!supabase) return 0;
    const { count: sessions } = await supabase
        .from("analytics_events")
        .select("session_id", { count: "exact", head: true })
        .gte("created_at", fromIso).lt("created_at", toIso);

    const { count: leads } = await supabase
        .from("lead_submissions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", fromIso).lt("created_at", toIso);

    if (!sessions || sessions === 0) return 0;
    return (leads ?? 0) / sessions;
}
