import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Google Search Console → Supabase sync.
 *
 * Pulls the last `SYNC_DAYS_BACK` days of search analytics from Google Search
 * Console using a refresh-token-based OAuth flow and upserts them into
 * `seo_search_console_metrics`. Designed to be hit by Vercel Cron once daily.
 *
 * Setup is documented in audits/SEARCH_CONSOLE_SETUP.md.
 *
 * Required env (set in Vercel project settings):
 *   GSC_PROPERTY_URL       The site property in Search Console
 *                          (e.g. "sc-domain:moderncurtainsandblinds.com.au"
 *                          or "https://moderncurtainsandblinds.com.au/")
 *   GSC_CLIENT_ID          OAuth client ID from Google Cloud Console
 *   GSC_CLIENT_SECRET      OAuth client secret
 *   GSC_REFRESH_TOKEN      Refresh token from OAuth Playground
 *   CRON_SECRET            Shared secret. Vercel Cron sends it as
 *                          `Authorization: Bearer ${CRON_SECRET}`.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEARCH_ANALYTICS_URL = (siteUrl: string) =>
  `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;

const SYNC_DAYS_BACK = 7;
const MAX_ROWS_PER_DAY = 5000;

type SearchAnalyticsRow = {
  keys?: string[]; // dimensions array in the order set by the request
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

async function run(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization") || "";
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const property = process.env.GSC_PROPERTY_URL;
  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;

  if (!property || !clientId || !clientSecret || !refreshToken) {
    return NextResponse.json(
      {
        error: "missing_env",
        missing: [
          !property && "GSC_PROPERTY_URL",
          !clientId && "GSC_CLIENT_ID",
          !clientSecret && "GSC_CLIENT_SECRET",
          !refreshToken && "GSC_REFRESH_TOKEN",
        ].filter(Boolean),
      },
      { status: 412 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 500 });
  }

  let accessToken: string;
  try {
    accessToken = await fetchAccessToken(clientId, clientSecret, refreshToken);
  } catch (error) {
    console.error("GSC token fetch failed", error);
    return NextResponse.json({ error: "token_failed", detail: String(error) }, { status: 502 });
  }

  const today = new Date();
  // Search Console data lands with a 2-day delay typically. We sync the
  // 7-day window ending 2 days ago, upserting so partial-day data gets corrected.
  const endDate = formatDate(addDays(today, -2));
  const startDate = formatDate(addDays(today, -2 - SYNC_DAYS_BACK + 1));

  let totalRows = 0;
  let totalUpserts = 0;
  const errors: string[] = [];

  try {
    const rows = await fetchSearchAnalytics({
      accessToken,
      property,
      startDate,
      endDate,
    });
    totalRows = rows.length;

    const records = rows
      .map((row) => {
        const [date, query, page, country, device] = row.keys || [];
        if (!date || !page) return null;
        return {
          metric_date: date,
          page_path: extractPath(page),
          search_query: query || "",
          country: country || "",
          device: device || "",
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    // Batch upsert in chunks of 1000 so we don't blow Supabase's payload limit.
    const chunkSize = 1000;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const { error } = await supabase
        .from("seo_search_console_metrics")
        .upsert(chunk, {
          onConflict: "metric_date,page_path,search_query,country,device",
        });
      if (error) {
        errors.push(error.message);
      } else {
        totalUpserts += chunk.length;
      }
    }
  } catch (error) {
    console.error("GSC sync error", error);
    errors.push(String(error));
  }

  return NextResponse.json({
    ok: errors.length === 0,
    window: { startDate, endDate },
    rows_fetched: totalRows,
    rows_upserted: totalUpserts,
    errors,
  });
}

async function fetchAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`token endpoint ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { access_token?: string; error?: string };
  if (!json.access_token) {
    throw new Error(`no access_token in response: ${json.error || "unknown"}`);
  }
  return json.access_token;
}

async function fetchSearchAnalytics(args: {
  accessToken: string;
  property: string;
  startDate: string;
  endDate: string;
}): Promise<SearchAnalyticsRow[]> {
  const rows: SearchAnalyticsRow[] = [];
  let startRow = 0;
  // Paginate; GSC returns at most 25k rows per request but we slice smaller.
  // Loop until we get fewer than MAX_ROWS_PER_DAY back, meaning end of data.
  for (let iteration = 0; iteration < 10; iteration += 1) {
    const res = await fetch(SEARCH_ANALYTICS_URL(args.property), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate: args.startDate,
        endDate: args.endDate,
        dimensions: ["date", "query", "page", "country", "device"],
        rowLimit: MAX_ROWS_PER_DAY,
        startRow,
        dataState: "all",
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`searchAnalytics ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as { rows?: SearchAnalyticsRow[] };
    const batch = json.rows || [];
    rows.push(...batch);
    if (batch.length < MAX_ROWS_PER_DAY) break;
    startRow += batch.length;
  }
  return rows;
}

function extractPath(urlOrPath: string): string {
  try {
    if (urlOrPath.startsWith("/")) return urlOrPath;
    const url = new URL(urlOrPath);
    return url.pathname + (url.search || "");
  } catch {
    return urlOrPath;
  }
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
