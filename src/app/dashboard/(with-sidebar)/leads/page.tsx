import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import {
  fetchLeadsHeroData,
  fetchFunnelRows,
  fetchRecentPhoneTaps,
  sumColumn,
  formatPercent,
  formatPercentPoints,
  formatDelta,
  deltaDirection,
  type RecentPhoneTap,
} from "@/lib/dashboard/v2/data";
import { classifyValue, thresholds } from "@/lib/dashboard/v2/tokens";
import { Sparkline } from "@/components/dashboard/v2/Sparkline";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function LeadsPage() {
  const [{ current, prior }, funnel, recentPhoneTaps] = await Promise.all([
    fetchLeadsHeroData(),
    fetchFunnelRows(),
    fetchRecentPhoneTaps(25),
  ]);

  const leadsCurrent = sumColumn(current, "leads");
  const leadsPrior = sumColumn(prior, "leads");
  const visitorsCurrent = sumColumn(current, "visitors");
  const visitorsPrior = sumColumn(prior, "visitors");
  const phoneTapsCurrent = sumColumn(current, "phone_taps");
  const quoteSubmitsCurrent = sumColumn(current, "quote_submits");

  const leadRate = visitorsCurrent > 0 ? leadsCurrent / visitorsCurrent : 0;
  const leadRatePrior = visitorsPrior > 0 ? leadsPrior / visitorsPrior : 0;
  const leadRateState = classifyValue(leadRate, thresholds.leadRate);

  const sparkLeads = current.map((d) => d.leads);
  const sparkVisitors = current.map((d) => d.visitors);
  const sparkPhoneTaps = current.map((d) => d.phone_taps);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leads &amp; conversion"
        subtitle="The bottom of the funnel. Default window: 28 days, with prior-28d comparison."
        meta="28d window"
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Leads · 28d"
          value={leadsCurrent}
          state={leadsCurrent >= leadsPrior ? "good" : "attention"}
          deltaLabel={`${formatDelta(leadsCurrent - leadsPrior)} vs prior`}
          deltaDirection={deltaDirection(leadsCurrent, leadsPrior)}
          sparklineData={sparkLeads}
        />
        <KpiCard
          label="Lead rate · 28d"
          value={formatPercent(leadRate)}
          state={leadRateState}
          deltaLabel={
            leadRate === leadRatePrior
              ? "flat"
              : formatPercentPoints(leadRate - leadRatePrior)
          }
          deltaDirection={
            leadRate > leadRatePrior ? "up" : leadRate < leadRatePrior ? "down" : "flat"
          }
          footer="leads ÷ visitors"
        />
        <KpiCard
          label="Quote submits · 28d"
          value={quoteSubmitsCurrent}
          footer="multi-step form completions"
          sparklineData={current.map((d) => d.quote_submits)}
        />
        <KpiCard
          label="Phone taps · 28d"
          value={phoneTapsCurrent}
          sparklineData={sparkPhoneTaps}
          footer="tel: link clicks"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Leads &amp; visitors · 28d
          </h3>
          <div className="mt-4 space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[var(--color-mcb-charcoal)]">Leads</span>
                <span className="text-2xl font-semibold tabular-nums text-[var(--color-mcb-terracotta-deep)]">
                  {leadsCurrent}
                </span>
              </div>
              <Sparkline
                data={sparkLeads}
                color="var(--color-mcb-terracotta-deep)"
                ariaLabel="Leads daily, 28 days"
                height={48}
                strokeWidth={2}
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-[var(--color-mcb-charcoal)]">Visitors</span>
                <span className="text-2xl font-semibold tabular-nums text-[var(--color-mcb-sage-dark)]">
                  {visitorsCurrent.toLocaleString("en-AU")}
                </span>
              </div>
              <Sparkline
                data={sparkVisitors}
                color="var(--color-mcb-sage-dark)"
                ariaLabel="Visitors daily, 28 days"
                height={48}
                strokeWidth={2}
              />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Conversion funnel · 30d
          </h3>
          {funnel.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-mcb-warm-grey)]">
              No funnel data available.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {funnel.map((row, i) => {
                const prev = i > 0 ? funnel[i - 1].total : null;
                const drop = prev && prev > 0 ? (1 - row.total / prev) * 100 : null;
                const max = funnel[0]?.total || 1;
                const widthPct = (row.total / max) * 100;
                return (
                  <li key={row.stage}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-[var(--color-mcb-charcoal)]">{row.stage}</span>
                      <span className="tabular-nums font-medium">{row.total.toLocaleString("en-AU")}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--color-mcb-sand)]">
                      <div
                        style={{ width: `${widthPct}%` }}
                        className="h-full rounded-full bg-[var(--color-mcb-terracotta-deep)]"
                      />
                    </div>
                    {drop !== null && (
                      <p className="mt-1 text-[11px] text-[var(--color-mcb-warm-grey)]">
                        −{drop.toFixed(1)}% from previous stage
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </article>
      </section>

      <article className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
        <header className="flex items-baseline justify-between gap-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Call taps · last {recentPhoneTaps.length}
          </h3>
          <span className="text-[11px] text-[var(--color-mcb-warm-grey)]">
            tap on <code>tel:</code> link — call duration not captured
          </span>
        </header>

        {recentPhoneTaps.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-mcb-warm-grey)]">
            No phone taps recorded yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
                  <th className="py-2 pr-4 font-medium">When (AEST)</th>
                  <th className="py-2 pr-4 font-medium">Channel</th>
                  <th className="py-2 pr-4 font-medium">Location</th>
                  <th className="py-2 pr-4 font-medium">Tapped from</th>
                  <th className="py-2 pr-4 font-medium">Landed on</th>
                  <th className="py-2 pr-4 font-medium">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mcb-sand)]">
                {recentPhoneTaps.map((tap, i) => (
                  <tr key={`${tap.created_at}-${i}`} className="text-[var(--color-mcb-charcoal)]">
                    <td className="py-2 pr-4 tabular-nums whitespace-nowrap">
                      {formatTapTime(tap.created_at)}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {formatChannel(tap)}
                    </td>
                    <td className="py-2 pr-4">
                      {formatLocation(tap.city, tap.region, tap.country)}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[12px]">
                      {tap.source_path ?? "—"}
                    </td>
                    <td className="py-2 pr-4 font-mono text-[12px]">
                      {tap.landing_path ?? "—"}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {[tap.device_type, tap.browser].filter(Boolean).join(" · ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </div>
  );
}

function formatTapTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

function formatLocation(
  city: string | null,
  region: string | null,
  country: string | null,
): string {
  const parts = [city, region, country].filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(", ") : "—";
}

function formatChannel(tap: RecentPhoneTap): string {
  if (tap.gclid) {
    return tap.utm_campaign ? `Google Ads · ${tap.utm_campaign}` : "Google Ads";
  }
  if (tap.fbclid) return "Meta";
  if (tap.utm_source) {
    return tap.utm_campaign ? `${tap.utm_source} · ${tap.utm_campaign}` : tap.utm_source;
  }
  if (tap.referrer_url) {
    try {
      const host = new URL(tap.referrer_url).hostname.replace(/^www\./, "");
      return host || "direct";
    } catch {
      return "direct";
    }
  }
  return "direct";
}
