import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { RELEASES, RELEASE_WINDOWS, type Release } from "./releases";

/**
 * For each release, compute headline metrics in the window AFTER the release
 * vs the same-length window BEFORE the release. Output drives the dashboard
 * ReleaseTracker panel.
 *
 * Bot filtering is best-effort (a handful of ILIKE patterns) until the
 * `analytics_events_clean` migration lands — then this should switch to
 * read from that view.
 *
 * Lead submissions are NOT bot-filtered because the lead_submissions table
 * only ever contains real form submissions (bots can't submit the form).
 */

/** Best-effort bot UA patterns. Mirrors the SQL is_bot_user_agent() but in JS. */
const BOT_UA_PATTERNS = [
  "%bot%",
  "%crawler%",
  "%spider%",
  "%external%agent%",
  "%headless%",
  "%puppeteer%",
  "%playwright%",
];

const COUNT_OPTS = { count: "exact" as const, head: true };

interface MetricCounts {
  page_views: number;
  quote_cta_clicks: number;
  phone_taps: number;
  leads: number;
  /**
   * Subset of `leads` where lead_submissions.gclid is non-null — meaning the
   * lead arrived with Google Ads attribution attached. Ratio leads_with_gclid
   * / leads is the headline signal for the 2026-05-14 conversion-tracking
   * release. Should jump from ~0 to whatever share of real traffic is paid.
   */
  leads_with_gclid: number;
}

export interface ReleaseWindowMetrics {
  windowId: (typeof RELEASE_WINDOWS)[number]["id"];
  windowLabel: string;
  hours: number;
  /** True if `now` has not yet reached `releasedAt + hours`. */
  inProgress: boolean;
  before: MetricCounts;
  after: MetricCounts;
}

export interface ReleaseWithMetrics extends Release {
  windows: ReleaseWindowMetrics[];
  /** Convenience: hours since release. */
  hoursSinceRelease: number;
}

export async function loadReleaseMetrics(): Promise<ReleaseWithMetrics[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return RELEASES.map((release) => ({
      ...release,
      hoursSinceRelease: hoursBetween(new Date(release.releasedAt), new Date()),
      windows: RELEASE_WINDOWS.map((w) => ({
        windowId: w.id,
        windowLabel: w.label,
        hours: w.hours,
        inProgress: true,
        before: emptyMetrics(),
        after: emptyMetrics(),
      })),
    }));
  }

  const now = new Date();

  return Promise.all(
    RELEASES.map(async (release) => {
      const releasedAt = new Date(release.releasedAt);
      const hoursSinceRelease = hoursBetween(releasedAt, now);

      const windows = await Promise.all(
        RELEASE_WINDOWS.map(async (w) => {
          const beforeStart = addHours(releasedAt, -w.hours);
          const afterEnd = addHours(releasedAt, w.hours);
          // Cap "after" at now so an in-progress window doesn't include the
          // future. The flag `inProgress` tells the UI to mark the number as
          // not-yet-final.
          const cappedAfterEnd = afterEnd > now ? now : afterEnd;
          const inProgress = afterEnd > now;

          const [before, after] = await Promise.all([
            getMetricCounts(supabase, beforeStart, releasedAt),
            getMetricCounts(supabase, releasedAt, cappedAfterEnd),
          ]);

          return {
            windowId: w.id,
            windowLabel: w.label,
            hours: w.hours,
            inProgress,
            before,
            after,
          };
        })
      );

      return { ...release, windows, hoursSinceRelease };
    })
  );
}

async function getMetricCounts(
  supabase: NonNullable<ReturnType<typeof getSupabaseAdmin>>,
  since: Date,
  until: Date
): Promise<MetricCounts> {
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  const eventQuery = (eventName: string) => {
    let q = supabase
      .from("analytics_events")
      .select("*", COUNT_OPTS)
      .eq("event_name", eventName)
      .gte("created_at", sinceIso)
      .lt("created_at", untilIso)
      .neq("device_type", "bot");
    for (const pattern of BOT_UA_PATTERNS) {
      q = q.not("user_agent", "ilike", pattern);
    }
    return q;
  };

  const leadQuery = supabase
    .from("lead_submissions")
    .select("*", COUNT_OPTS)
    .gte("created_at", sinceIso)
    .lt("created_at", untilIso);

  const leadsWithGclidQuery = supabase
    .from("lead_submissions")
    .select("*", COUNT_OPTS)
    .not("gclid", "is", null)
    .gte("created_at", sinceIso)
    .lt("created_at", untilIso);

  const [pageViews, ctaClicks, phoneTaps, leads, leadsWithGclid] = await Promise.all([
    eventQuery("page_view"),
    eventQuery("quote_cta_click"),
    eventQuery("phone_tap"),
    leadQuery,
    leadsWithGclidQuery,
  ]);

  return {
    page_views: pageViews.count ?? 0,
    quote_cta_clicks: ctaClicks.count ?? 0,
    phone_taps: phoneTaps.count ?? 0,
    leads: leads.count ?? 0,
    leads_with_gclid: leadsWithGclid.count ?? 0,
  };
}

function emptyMetrics(): MetricCounts {
  return { page_views: 0, quote_cta_clicks: 0, phone_taps: 0, leads: 0, leads_with_gclid: 0 };
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function hoursBetween(a: Date, b: Date) {
  return (b.getTime() - a.getTime()) / (60 * 60 * 1000);
}
