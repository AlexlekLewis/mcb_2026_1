import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { authoriseCron } from "@/lib/optimization/auth";

/**
 * Weekly content freshness sweep.
 *
 * Walks every URL in public.content_freshness and refreshes the read-side
 * caches (ai_citations_30d, visits_30d, leads_attributed_90d). No external
 * calls — pure DB aggregation off existing analytics + ai_citation_probes +
 * ai_citations tables.
 *
 * Cron: Mondays 22:00 UTC (08:00 AEST). See vercel.json.
 */

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const unauthorised = authoriseCron(request);
  if (unauthorised) return unauthorised;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  const { data: pages, error: pagesErr } = await supabase
    .from("content_freshness")
    .select("id, url");

  if (pagesErr || !pages) {
    return NextResponse.json({ error: pagesErr?.message ?? "fetch failed" }, { status: 500 });
  }

  const since30 = new Date(Date.now() - 30 * 86_400_000).toISOString();
  // since90 was for leads_attributed_90d; attribution lookup deferred
  // (see leadsCount = 0 note below).

  let updated = 0;
  for (const page of pages) {
    try {
      // Visits 30d (from analytics_events_clean). The events vocabulary
      // uses event_name (not event_type) — see src/lib/analytics.ts.
      const visitsResp = await supabase
        .from("analytics_events_clean")
        .select("id", { count: "exact", head: true })
        .eq("event_name", "page_view")
        .eq("page_path", page.url)
        .gte("created_at", since30);

      // AI citations 30d — sum across both tables that store probe results
      const [probesNew, probesOld] = await Promise.all([
        supabase
          .from("ai_citations")
          .select("id", { count: "exact", head: true })
          .eq("mcb_cited", true)
          .eq("mcb_cited_url", page.url)
          .gte("probed_at", since30),
        supabase
          .from("ai_citation_probes")
          .select("id", { count: "exact", head: true })
          .eq("cited", true)
          .eq("citation_url", page.url)
          .gte("probed_at", since30),
      ]);

      // Leads attributed 90d — lead_submissions has no page_path column;
      // attribution requires parsing tracking_context. Skipping for now —
      // proper attribution can ship in a follow-up once we land an
      // intermediate denormalised view.
      const leadsCount = 0;

      const updateData = {
        visits_30d: visitsResp.count ?? 0,
        ai_citations_30d: (probesNew.count ?? 0) + (probesOld.count ?? 0),
        leads_attributed_90d: leadsCount,
      };

      await supabase.from("content_freshness").update(updateData).eq("id", page.id);
      updated++;
    } catch (err) {
      console.warn(`freshness-sweep: failed on ${page.url}:`, err);
    }
  }

  return NextResponse.json({ ok: true, sweptCount: pages.length, updatedCount: updated });
}
