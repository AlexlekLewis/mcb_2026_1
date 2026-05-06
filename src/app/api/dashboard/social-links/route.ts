import { NextRequest, NextResponse } from "next/server";
import { SITE } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const platforms = new Set(["instagram", "facebook", "tiktok", "linkedin", "pinterest", "youtube", "other"]);
const mediums = new Set(["organic_social", "paid_social", "social", "influencer", "referral"]);

export async function POST(request: NextRequest) {
  if (!isDashboardSession(request)) {
    return NextResponse.redirect(new URL("/dashboard/login?next=/dashboard/social", request.url), 303);
  }

  const formData = await request.formData();
  const name = cleanText(formData.get("name"), 160);
  const platform = cleanChoice(formData.get("platform"), platforms, "instagram");
  const placement = cleanSlug(formData.get("placement"), "post");
  const destinationPath = cleanPath(formData.get("destinationPath"));
  const utmMedium = cleanChoice(formData.get("utmMedium"), mediums, "organic_social");
  const utmCampaign = cleanSlug(formData.get("utmCampaign"), "social");
  const utmContent = cleanOptionalSlug(formData.get("utmContent")) || `${placement}_link`;
  const notes = cleanText(formData.get("notes"), 1000);

  if (!name || !destinationPath || !utmCampaign) {
    return NextResponse.redirect(new URL("/dashboard/social?error=missing_fields", request.url), 303);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.redirect(new URL("/dashboard/social?error=supabase", request.url), 303);
  }

  const destinationUrl = buildTrackedUrl({
    destinationPath,
    platform,
    utmMedium,
    utmCampaign,
    utmContent,
  });

  const { error } = await supabase.from("social_tracking_links").insert({
    name,
    platform,
    placement,
    destination_path: destinationPath,
    destination_url: destinationUrl,
    utm_source: platform,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    notes,
  });

  if (error) {
    console.error("Failed to save social tracking link:", error);
    return NextResponse.redirect(new URL("/dashboard/social?error=save_failed", request.url), 303);
  }

  return NextResponse.redirect(new URL("/dashboard/social?created=1", request.url), 303);
}

function isDashboardSession(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;
  return Boolean(password && request.cookies.get("mcb_dashboard_session")?.value === password);
}

function buildTrackedUrl({
  destinationPath,
  platform,
  utmMedium,
  utmCampaign,
  utmContent,
}: {
  destinationPath: string;
  platform: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
}) {
  const url = new URL(destinationPath, SITE.url);
  url.searchParams.set("utm_source", platform);
  url.searchParams.set("utm_medium", utmMedium);
  url.searchParams.set("utm_campaign", utmCampaign);
  url.searchParams.set("utm_content", utmContent);
  return url.toString();
}

function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function cleanChoice(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) {
  if (typeof value !== "string") return fallback;
  return allowed.has(value) ? value : fallback;
}

function cleanPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "/";
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("http://") || trimmed.startsWith("https://")) return "/";
  return trimmed.startsWith("/") ? trimmed.slice(0, 500) : `/${trimmed.slice(0, 499)}`;
}

function cleanSlug(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string") return fallback;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);

  return slug || fallback;
}

function cleanOptionalSlug(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.trim()) return "";
  return cleanSlug(value, "");
}
