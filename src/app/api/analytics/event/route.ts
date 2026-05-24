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

    const { userAgent, ipHash, geo, device } = getRequestMeta(request);

    const scrollPercent = clampInt(payload.scroll_percent, 0, 100);
    const engagementSeconds = clampInt(payload.engagement_seconds, 0, 86400);
    const viewportWidth = clampInt(payload.viewport_width, 0, 32767);
    const viewportHeight = clampInt(payload.viewport_height, 0, 32767);

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
      country: geo.country,
      region: geo.region,
      city: geo.city,
      postcode: geo.postcode,
      latitude: geo.latitude,
      longitude: geo.longitude,
      device_type: device.deviceType,
      browser: device.browser,
      os: device.os,
      scroll_percent: scrollPercent,
      engagement_seconds: engagementSeconds,
      viewport_width: viewportWidth,
      viewport_height: viewportHeight,
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

function clampInt(value: unknown, min: number, max: number): number | null {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return null;
  const rounded = Math.round(num);
  if (rounded < min) return min;
  if (rounded > max) return max;
  return rounded;
}
