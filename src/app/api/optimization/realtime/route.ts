/**
 * Server-Sent Events feed of optimization events.
 * Polls optimization_runs + lead_submissions + ai_citation_probes every 5s.
 * Client EventSource subscribes — dashboard updates without a refresh.
 *
 * (Supabase Realtime via the JS client would be ideal but requires the anon key
 *  exposed client-side; for the admin dashboard we prefer a server-side SSE
 *  loop over the service role.)
 */
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return new Response("supabase not configured", { status: 500 });
    }

    let lastRunId: string | null = null;
    let lastLeadAt: string | null = null;
    let lastProbeAt: string | null = null;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: string, data: unknown) => {
                controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
            };

            send("hello", { ts: new Date().toISOString() });

            const tick = async () => {
                try {
                    // Latest finished run
                    const { data: run } = await supabase
                        .from("optimization_runs")
                        .select("id, started_at, finished_at, composite_score, sub_scores")
                        .not("finished_at", "is", null)
                        .order("started_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    if (run && run.id !== lastRunId) {
                        lastRunId = run.id;
                        send("optimization_run", run);
                    }

                    // Latest lead
                    const { data: lead } = await supabase
                        .from("lead_submissions")
                        .select("id, created_at, source, suburb, product_interests")
                        .order("created_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    if (lead && lead.created_at !== lastLeadAt) {
                        lastLeadAt = lead.created_at;
                        send("lead_submitted", { id: lead.id, created_at: lead.created_at, source: lead.source, suburb: lead.suburb, product_interests: lead.product_interests });
                    }

                    // Latest probe
                    const { data: probe } = await supabase
                        .from("ai_citation_probes")
                        .select("id, probed_at, engine, query_text, cited")
                        .order("probed_at", { ascending: false })
                        .limit(1)
                        .maybeSingle();
                    if (probe && probe.probed_at !== lastProbeAt) {
                        lastProbeAt = probe.probed_at;
                        send("ai_probe", probe);
                    }

                    send("heartbeat", { ts: new Date().toISOString() });
                } catch (err) {
                    send("error", { message: err instanceof Error ? err.message : String(err) });
                }
            };

            const interval = setInterval(tick, 5000);
            await tick();

            // Auto-terminate after 4 minutes to stay under Vercel's 5min stream cap.
            setTimeout(() => {
                clearInterval(interval);
                send("bye", { ts: new Date().toISOString() });
                controller.close();
            }, 4 * 60 * 1000);
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
        },
    });
}
