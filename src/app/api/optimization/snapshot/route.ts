import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Returns the latest optimization snapshot for the live dashboard.
 * Public (read-only) — but only returns aggregated metrics, not lead PII.
 */
export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: "supabase not configured" }, { status: 500 });

    const [
        currentRes,
        recentRunsRes,
        openIssuesRes,
        citationsRes,
        botTrafficRes,
        learningRes,
    ] = await Promise.all([
        supabase.from("optimization_current").select("*").maybeSingle(),
        supabase.from("optimization_runs").select("id, started_at, finished_at, composite_score, sub_scores, weights_version").order("started_at", { ascending: false }).limit(48),
        supabase.from("optimization_issues").select("id, signal_key, sub_score, severity, url_path, title, detail, recommended_fix, expected_lift, status, times_seen, updated_at").eq("status", "open").order("severity", { ascending: false }).order("expected_lift", { ascending: false }).limit(50),
        supabase.from("citation_rate_30d").select("*"),
        supabase.from("bot_traffic_7d").select("*"),
        supabase.from("optimization_learning_log").select("signal_key, measured_at, measured_lift_pct, weight_before, weight_after").order("measured_at", { ascending: false }).limit(20),
    ]);

    return NextResponse.json({
        current: currentRes.data,
        recentRuns: recentRunsRes.data ?? [],
        openIssues: openIssuesRes.data ?? [],
        citationsByEngine: citationsRes.data ?? [],
        botTraffic: botTrafficRes.data ?? [],
        learning: learningRes.data ?? [],
        errors: [currentRes.error, recentRunsRes.error, openIssuesRes.error, citationsRes.error, botTrafficRes.error, learningRes.error].filter(Boolean),
    });
}
