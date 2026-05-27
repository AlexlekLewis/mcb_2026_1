import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import {
  fetchLeadsHeroData,
  fetchFunnelRows,
  fetchRecentPhoneTaps,
  fetchRecentLeads,
  sumColumn,
  formatPercent,
  formatPercentPoints,
  formatDelta,
  deltaDirection,
  type RecentPhoneTap,
  type RecentLead,
} from "@/lib/dashboard/v2/data";
import { classifyValue, thresholds } from "@/lib/dashboard/v2/tokens";
import { MetricTrendChart } from "@/components/dashboard/v2/MetricTrendChart";
import { RELEASES } from "@/lib/dashboard/releases";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Leads · MCB Dashboard",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ window?: string }>;

const WINDOW_OPTIONS: ReadonlyArray<{ days: number; label: string }> = [
  { days: 28, label: "28d" },
  { days: 90, label: "90d" },
  { days: 180, label: "180d" },
];

function resolveWindowDays(raw: string | undefined): number {
  const found = WINDOW_OPTIONS.find((o) => o.label === raw);
  return found?.days ?? 28;
}

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const windowDays = resolveWindowDays(params.window);
  const windowLabel = WINDOW_OPTIONS.find((o) => o.days === windowDays)?.label ?? "28d";

  const [{ current, prior }, funnel, recentPhoneTaps, recentLeads] = await Promise.all([
    fetchLeadsHeroData(windowDays),
    fetchFunnelRows(),
    fetchRecentPhoneTaps(25),
    fetchRecentLeads(25),
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
  const sparkPhoneTaps = current.map((d) => d.phone_taps);

  const trendData = current.map((d) => ({
    date: d.metric_date,
    leads: d.leads ?? 0,
    visitors: d.visitors ?? 0,
  }));
  const releaseMarkers = RELEASES.map((r) => ({
    id: r.id,
    releasedAt: r.releasedAt,
    title: r.title,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leads &amp; conversion"
        subtitle={`The bottom of the funnel. Window: ${windowLabel}, with prior-${windowLabel} comparison.`}
        meta={`${windowLabel} window`}
      />

      <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
        <span className="font-semibold">Window</span>
        {WINDOW_OPTIONS.map((opt) => {
          const active = opt.days === windowDays;
          return (
            <Link
              key={opt.label}
              href={`/dashboard/leads?window=${opt.label}`}
              className={
                active
                  ? "rounded-full bg-[var(--color-mcb-terracotta-deep)] px-3 py-1 text-white"
                  : "rounded-full border border-[var(--color-mcb-sand-deep)] px-3 py-1 text-[var(--color-mcb-charcoal)] hover:bg-[var(--color-mcb-sand)]"
              }
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label={`Leads · ${windowLabel}`}
          value={leadsCurrent}
          state={leadsCurrent >= leadsPrior ? "good" : "attention"}
          deltaLabel={`${formatDelta(leadsCurrent - leadsPrior)} vs prior`}
          deltaDirection={deltaDirection(leadsCurrent, leadsPrior)}
          sparklineData={sparkLeads}
        />
        <KpiCard
          label={`Lead rate · ${windowLabel}`}
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
          label={`Quote submits · ${windowLabel}`}
          value={quoteSubmitsCurrent}
          footer="multi-step form completions"
          sparklineData={current.map((d) => d.quote_submits)}
        />
        <KpiCard
          label={`Phone taps · ${windowLabel}`}
          value={phoneTapsCurrent}
          sparklineData={sparkPhoneTaps}
          footer="tel: link clicks"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <header className="flex items-baseline justify-between gap-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
              Leads &amp; visitors · {windowLabel}
            </h3>
            <span className="text-[11px] text-[var(--color-mcb-warm-grey)]">
              hover the line for daily values · dashed lines mark releases
            </span>
          </header>
          <div className="mt-4">
            <MetricTrendChart data={trendData} releases={releaseMarkers} />
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
            Recent leads · last {recentLeads.length}
          </h3>
          <span className="text-[11px] text-[var(--color-mcb-warm-grey)]">
            quote-form submissions, newest first
          </span>
        </header>

        {recentLeads.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-mcb-warm-grey)]">
            No lead submissions yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
                  <th className="py-2 pr-4 font-medium">When (AEST)</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Contact</th>
                  <th className="py-2 pr-4 font-medium">Location</th>
                  <th className="py-2 pr-4 font-medium">Interest</th>
                  <th className="py-2 pr-4 font-medium">Channel</th>
                  <th className="py-2 pr-4 font-medium">Area</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mcb-sand)]">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="text-[var(--color-mcb-charcoal)] align-top">
                    <td className="py-2 pr-4 tabular-nums whitespace-nowrap">
                      {formatTapTime(lead.created_at)}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap font-medium">
                      {[lead.first_name, lead.last_name].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="text-[var(--color-mcb-terracotta-deep)] hover:underline tabular-nums"
                          >
                            {lead.phone}
                          </a>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-[12px] text-[var(--color-mcb-warm-grey)] hover:text-[var(--color-mcb-charcoal)] truncate max-w-[220px]"
                            title={lead.email}
                          >
                            {lead.email}
                          </a>
                        )}
                        {!lead.phone && !lead.email && "—"}
                      </div>
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {formatLeadLocation(lead)}
                    </td>
                    <td className="py-2 pr-4">
                      {formatInterests(lead)}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {formatLeadChannel(lead)}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {formatArea(lead.is_victoria)}
                    </td>
                    <td className="py-2 pr-4 whitespace-nowrap">
                      {formatStatus(lead.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

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

function formatLeadLocation(lead: RecentLead): ReactNode {
  const parts: string[] = [];
  if (lead.suburb) parts.push(lead.suburb);
  if (lead.postcode && !parts.join(" ").includes(lead.postcode)) parts.push(lead.postcode);
  return parts.length > 0 ? parts.join(" · ") : "—";
}

function formatInterests(lead: RecentLead): ReactNode {
  const interests = lead.product_interests ?? [];
  const visible = interests.filter(Boolean);
  if (visible.length === 0 && lead.needs_advice) {
    return <span className="italic text-[var(--color-mcb-warm-grey)]">needs advice</span>;
  }
  if (visible.length === 0) return "—";
  const display = visible.slice(0, 2).join(", ");
  const extra = visible.length - 2;
  return extra > 0 ? `${display} +${extra}` : display;
}

function formatLeadChannel(lead: RecentLead): string {
  if (lead.gclid) return "Google Ads";
  if (lead.referral) return lead.referral;
  if (lead.source) return lead.source;
  return "direct";
}

function formatArea(isVictoria: boolean | null): ReactNode {
  if (isVictoria === true) {
    return (
      <span className="inline-flex items-center rounded-full bg-[var(--color-mcb-state-good-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-mcb-sage-dark)]">
        VIC
      </span>
    );
  }
  if (isVictoria === false) {
    return (
      <span className="inline-flex items-center rounded-full bg-[var(--color-mcb-state-critical-bg)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-mcb-terracotta-red)]">
        Out
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--color-mcb-sand)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-mcb-warm-grey)]">
      ?
    </span>
  );
}

function formatStatus(status: string | null): ReactNode {
  const value = (status ?? "new").toLowerCase();
  const palette: Record<string, { bg: string; text: string }> = {
    new: {
      bg: "bg-[var(--color-mcb-state-attention-bg)]",
      text: "text-[var(--color-mcb-terracotta-deep)]",
    },
    contacted: {
      bg: "bg-[var(--color-mcb-sand)]",
      text: "text-[var(--color-mcb-charcoal)]",
    },
    booked: {
      bg: "bg-[var(--color-mcb-state-good-bg)]",
      text: "text-[var(--color-mcb-sage-dark)]",
    },
    won: {
      bg: "bg-[var(--color-mcb-state-good-bg)]",
      text: "text-[var(--color-mcb-sage-dark)]",
    },
    lost: {
      bg: "bg-[var(--color-mcb-state-critical-bg)]",
      text: "text-[var(--color-mcb-terracotta-red)]",
    },
  };
  const colour = palette[value] ?? palette.contacted;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${colour.bg} ${colour.text}`}
    >
      {value}
    </span>
  );
}
