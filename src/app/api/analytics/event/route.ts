import { NextResponse } from "next/server";
import { getRequestMeta, objectOrEmpty, stringOrNull } from "@/lib/server/request-meta";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = objectOrEmpty(await request.json());
    } catch {
      body = {};
    }

    const eventName = stringOrNull(body.event, 120);
    if (!eventName) {
      return new NextResponse(null, { status: 204 });
    }

    const payload = objectOrEmpty(body.payload);
    const context = objectOrEmpty(body.context);

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return new NextResponse(null, { status: 204 });
    }

    const { userAgent, ipHash } = getRequestMeta(request);

    const { error } = await supabase.from("analytics_events").insert({
      event_name: eventName,
      visitor_id: stringOrNull(context.visitorId, 120),
      session_id: stringOrNull(context.sessionId, 120),
      page_path: stringOrNull(context.pagePath, 1200) || stringOrNull(payload.page_path, 1200),
      page_url: stringOrNull(context.pageUrl, 2000),
      page_title: stringOrNull(context.pageTitle, 300),
      referrer_url: stringOrNull(context.referrerUrl, 2000),
      landing_path: stringOrNull(context.landingPath, 1200),
      source_path: stringOrNull(payload.source_path, 1200),
      target_path: stringOrNull(payload.target_path, 1200),
      product_interest: stringOrNull(payload.product_interest, 300),
      properties: payload,
      utm_source: stringOrNull(context.utmSource, 300),
      utm_medium: stringOrNull(context.utmMedium, 300),
      utm_campaign: stringOrNull(context.utmCampaign, 300),
      utm_term: stringOrNull(context.utmTerm, 300),
      utm_content: stringOrNull(context.utmContent, 300),
      gclid: stringOrNull(context.gclid, 300),
      fbclid: stringOrNull(context.fbclid, 300),
      user_agent: userAgent,
      ip_hash: ipHash,
    });

    if (error) {
      console.error("Failed to store analytics event:", error);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Analytics event error:", error);
    return new NextResponse(null, { status: 204 });
  }
}
