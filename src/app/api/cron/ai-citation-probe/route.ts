import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { probePerplexity, TARGET_QUERIES } from "@/lib/optimization/probes";
import { authoriseCron } from "@/lib/optimization/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
    const unauthorised = authoriseCron(request);
    if (unauthorised) return unauthorised;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: "supabase not configured" }, { status: 500 });

    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
        return NextResponse.json({
            error: "PERPLEXITY_API_KEY missing — set it in Vercel env to enable live AI citation probes",
            probedCount: 0,
        }, { status: 200 });
    }

    // Probe 5 queries per run (every 6h × 5 = 20 queries/day ≈ $0.005/day).
    const sample = pickN(TARGET_QUERIES, 5);
    const inserts: Array<Record<string, unknown>> = [];

    for (const query of sample) {
        try {
            const result = await probePerplexity(query, apiKey);
            inserts.push({
                engine: result.engine,
                query_text: result.query_text,
                cited: result.cited,
                citation_url: result.citation_url,
                citation_rank: result.citation_rank,
                response_excerpt: result.response_excerpt,
                competitor_cited: result.competitor_cited,
                cost_usd: result.cost_usd,
                raw_response: result.raw_response,
            });
        } catch (err) {
            inserts.push({
                engine: "perplexity",
                query_text: query,
                cited: false,
                competitor_cited: [],
                response_excerpt: err instanceof Error ? err.message : String(err),
            });
        }
    }

    if (inserts.length > 0) {
        await supabase.from("ai_citation_probes").insert(inserts);
    }

    const cited = inserts.filter((r) => r.cited).length;
    return NextResponse.json({
        probedCount: inserts.length,
        citedCount: cited,
        sample,
    });
}

function pickN<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    const out: T[] = [];
    for (let i = 0; i < n && copy.length > 0; i += 1) {
        out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
}
