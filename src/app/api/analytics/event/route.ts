import { NextResponse } from "next/server";
import { getRequestMeta, objectOrEmpty, stringOrNull } from "@/lib/server/request-meta";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// Accepts beacon/fetch events from src/lib/analytics.ts -> sendFirstPartyEvent.
// Stores to Supabase if configured; otherwise no-ops with a 204 so we never
// 404 the client-side beacon.
export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = objectOrEmpty(await request.json());
    } catch {
      body = {};
    }

    const event = stringOrNull(body.event, 120);
    if (!event) {
      return new NextResponse(null, { status: 204 });
    }

    const payload = objectOrEmpty(body.payload);
    const context = objectOrEmpty(body.context);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      // No DB configured; analytics still flow to GA4/GTM client-side.
      return new NextResponse(null, { status: 204 });
    }

    const { userAgent, ipHash } = getRequestMeta(request);

    const { error } = await supabase.from("analytics_events").insert({
      event,
      payload,
      visitor_id: stringOrNull(context.visitorId, 80),
      session_id: stringOrNull(context.sessionId, 80),
      page_path: stringOrNull(context.pagePath, 1024),
      page_url: stringOrNull(context.pageUrl, 2048),
      page_title: stringOrNull(context.pageTitle, 512),
      referrer_url: stringOrNull(context.referrerUrl, 2048),
      landing_path: stringOrNull(context.landingPath, 1024),
      utm_source: stringOrNull(context.utmSource, 180),
      utm_medium: stringOrNull(context.utmMedium, 180),
      utm_campaign: stringOrNull(context.utmCampaign, 180),
      utm_term: stringOrNull(context.utmTerm, 180),
      utm_content: stringOrNull(context.utmContent, 180),
      gclid: stringOrNull(context.gclid, 240),
      fbclid: stringOrNull(context.fbclid, 240),
      user_agent: userAgent,
      ip_hash: ipHash,
    });

    if (error) {
      console.error("analytics_events insert failed", error);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("/api/analytics/event error", error);
    return new NextResponse(null, { status: 204 });
  }
}
