import type { Metadata } from "next";
import type { ReactNode } from "react";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { FunnelBars } from "@/components/dashboard/v2/FunnelBars";
import { BarList, type BarListItem } from "@/components/dashboard/v2/BarList";
import { ScrollReach } from "@/components/dashboard/v2/ScrollReach";
import { MonthlyBars, type MonthlyDatum } from "@/components/dashboard/v2/MonthlyBars";
import { ReleaseTicker } from "@/components/dashboard/v2/ReleaseTicker";
import { loadReportData, fmtDuration, pctDelta, type MonthRow } from "@/lib/dashboard/v2/report-metrics";
import { formatDelta, deltaDirection, relativeDaysAgo } from "@/lib/dashboard/v2/data";
import { classifyValue, thresholds } from "@/lib/dashboard/v2/tokens";
import { RELEASES } from "@/lib/dashboard/releases";

// Corrected numbers are computed from the bot-filtered stream at request time,
// then cached for 30 min (paginated reads are heavier than a single view read).
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Performance · MCB",
  description: "MCB owner + marketing performance report.",
  robots: { index: false, follow: false },
};

export default async function DashboardHome() {
  const data = await loadReportData();
  const { current: cur, prior } = data.kpis;

  if (data.unavailable) {
    return (
      <div className="space-y-8">
        <PageHeader title="Performance" subtitle="Last 30 days · Melbourne time" />
        <p className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6 text-sm text-[var(--color-mcb-warm-grey)]">
          Analytics data source isn&rsquo;t configured in this environment.
        </p>
      </div>
    );
  }

  // ---------- headline delta helpers (rolling 30d vs previous 30d) ----------
  const moreIsBetter = (c: number, p: number): "good" | "attention" => (c >= p ? "good" : "attention");
  const deltaLabel = (c: number, p: number) =>
    p === 0 ? (c > 0 ? "new" : "flat") : `${formatDelta(c - p)} vs prev 30d`;

  const leadRateFrac = cur.leadRatePct / 100;
  const leadRatePp = cur.leadRatePct - prior.leadRatePct;

  // ---------- calendar month-on-month ----------
  const months = data.months.slice(-4);
  const leadsMonthly: MonthlyDatum[] = months.map((m) => ({
    label: m.label,
    total: m.leads,
    partial: m.partial,
    segments: [
      { value: m.organicLeads, kind: "organic" },
      { value: m.adsLeads, kind: "ads" },
    ],
  }));
  const visitorsMonthly: MonthlyDatum[] = months.map((m) => ({
    label: m.label,
    total: m.visitors,
    partial: m.partial,
  }));

  // ---------- traffic & engagement ----------
  const topPages: BarListItem[] = data.topPages.slice(0, 8).map((p) => ({
    label: p.path,
    value: p.views,
    href: p.path,
    hint:
      p.avgEngagedSec != null || p.avgScrollPct != null
        ? [p.avgEngagedSec != null ? fmtDuration(p.avgEngagedSec) : null, p.avgScrollPct != null ? `${p.avgScrollPct}% scroll` : null]
            .filter(Boolean)
            .join(" · ")
        : undefined,
  }));
  const deviceItems: BarListItem[] = data.devices.map((d) => ({
    label: titleCase(d.label),
    value: d.value,
  }));

  // ---------- locations ----------
  const loc = data.locations;
  const locItems: BarListItem[] = loc.top.map((l) => ({ label: l.label, value: l.visitors }));

  // ---------- funnel ----------
  const funnelStages = data.funnel.current.map((s) => ({ label: s.label, count: s.count }));
  const biggestDrop = findBiggestDrop(data.funnel.current);

  // ---------- plain-english callout ----------
  const leadsPct = pctDelta(cur.leads, prior.leads);
  const visitorsPct = pctDelta(cur.visitors, prior.visitors);
  const topArea = loc.top[0];
  const lastRelease = RELEASES[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Performance"
        subtitle="Last 30 days vs the previous 30 days · real visitors only (bots filtered), Melbourne time."
        meta={new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
        actions={
          <a
            href="/dashboard/compare"
            className="rounded-lg border border-[var(--color-mcb-charcoal)] px-3 py-1.5 text-xs font-medium text-[var(--color-mcb-charcoal)] transition-colors hover:bg-[var(--color-mcb-sand)]"
          >
            Compare custom periods →
          </a>
        }
      />

      {/* Headline KPIs — rolling 30d vs prior 30d */}
      <section aria-label="Headline metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Real visitors · 30d"
            value={cur.visitors.toLocaleString("en-AU")}
            state={moreIsBetter(cur.visitors, prior.visitors)}
            deltaLabel={deltaLabel(cur.visitors, prior.visitors)}
            deltaDirection={deltaDirection(cur.visitors, prior.visitors)}
            sparklineData={data.visitorsDaily.map((d) => d.value)}
            footer={`${cur.pageViews.toLocaleString("en-AU")} page views · ${cur.sessions.toLocaleString("en-AU")} sessions`}
          />
          <KpiCard
            label="Verified leads · 30d"
            value={cur.leads.toLocaleString("en-AU")}
            state={moreIsBetter(cur.leads, prior.leads)}
            deltaLabel={deltaLabel(cur.leads, prior.leads)}
            deltaDirection={deltaDirection(cur.leads, prior.leads)}
            sparklineData={data.leadsDaily.map((d) => d.value)}
            footer={`vs ${prior.leads} in the prior 30 days`}
            href="/dashboard/leads"
          />
          <KpiCard
            label="Lead rate · 30d"
            value={`${cur.leadRatePct.toFixed(1)}%`}
            state={classifyValue(leadRateFrac, thresholds.leadRate)}
            deltaLabel={Math.abs(leadRatePp) < 0.05 ? "flat" : `${leadRatePp > 0 ? "+" : ""}${leadRatePp.toFixed(1)}pp`}
            deltaDirection={leadRatePp > 0.05 ? "up" : leadRatePp < -0.05 ? "down" : "flat"}
            footer="leads ÷ real visitors"
            href="/dashboard/leads"
          />
          <KpiCard
            label="Phone taps · 30d"
            value={cur.phoneTaps.toLocaleString("en-AU")}
            state={moreIsBetter(cur.phoneTaps, prior.phoneTaps)}
            deltaLabel={deltaLabel(cur.phoneTaps, prior.phoneTaps)}
            deltaDirection={deltaDirection(cur.phoneTaps, prior.phoneTaps)}
            footer="tap-to-call actions"
            href="/dashboard/leads"
          />
        </div>
      </section>

      {/* Plain-English summary */}
      <section
        aria-label="Summary"
        className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-[var(--color-mcb-sand)] p-6"
      >
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
          What&rsquo;s happening
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-mcb-charcoal)]">
          Over the last 30 days the site drew <strong>{cur.visitors.toLocaleString("en-AU")}</strong> real
          visitors{describeChange(visitorsPct)} and produced <strong>{cur.leads}</strong>{" "}
          verified {cur.leads === 1 ? "lead" : "leads"}{describeChange(leadsPct)}, a{" "}
          <strong>{cur.leadRatePct.toFixed(1)}%</strong> lead rate.{" "}
          {topArea && (
            <>
              <strong>{topArea.label}</strong> is your top area ({topArea.visitors} visitors), and visitors
              spend a median <strong>{fmtDuration(data.engagement.medianSec)}</strong> actively on the site.
            </>
          )}
        </p>
      </section>

      {/* Calendar month-on-month */}
      <Section title="Month on month" subtitle="Calendar months, Melbourne time. The current month is dashed — it's still in progress.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Leads by month" hint="Google Ads vs organic & direct">
            <MonthlyBars data={leadsMonthly} showLegend />
          </Card>
          <Card title="Real visitors by month">
            <MonthlyBars data={visitorsMonthly} />
          </Card>
        </div>
        <div className="mt-6">
          <MonthTable months={months} />
        </div>
      </Section>

      {/* Traffic & engagement */}
      <Section title="Traffic & engagement" subtitle="Last 30 days — where attention goes and how deep it runs.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card title="Most-visited pages" className="lg:col-span-2">
            <BarList items={topPages} />
          </Card>
          <div className="space-y-6">
            <Card title="Active time on site">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl font-medium tabular-nums text-[var(--color-mcb-charcoal)]">
                  {fmtDuration(data.engagement.avgSec)}
                </span>
                <span className="text-xs text-[var(--color-mcb-warm-grey)]">avg</span>
              </div>
              <p className="mt-1 text-xs text-[var(--color-mcb-warm-grey)]">
                median {fmtDuration(data.engagement.medianSec)} · {data.engagement.sessions.toLocaleString("en-AU")} sessions
              </p>
            </Card>
            <Card title="Scroll depth">
              <ScrollReach reach={data.scrollReach} />
            </Card>
            <Card title="Device">
              <BarList items={deviceItems} accent="var(--color-mcb-clay)" />
            </Card>
          </div>
        </div>
      </Section>

      {/* Locations */}
      <Section title="Key locations" subtitle="Last 30 days, by real visitors.">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Top areas">
            <BarList items={locItems} />
          </Card>
          <Card title="Reach by region">
            <div className="space-y-3">
              <RegionRow label="Melbourne / VIC" value={loc.melbourneVisitors} total={loc.totalVisitors} accent="var(--color-mcb-sage-dark)" />
              <RegionRow label="Rest of Australia" value={loc.otherAuVisitors} total={loc.totalVisitors} accent="var(--color-mcb-terracotta-deep)" />
              <RegionRow label="International / unknown" value={loc.intlOrUnknownVisitors} total={loc.totalVisitors} accent="var(--color-mcb-warm-grey-light)" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[var(--color-mcb-warm-grey)]">
              MCB serves Melbourne. International/unknown is mostly residual datacenter traffic the bot filter
              can&rsquo;t fully catch — treat it as noise, not customers.
            </p>
          </Card>
        </div>
      </Section>

      {/* Quote funnel */}
      <Section title="Quote form funnel" subtitle="Last 30 days — where people drop between clicking a quote button and a saved lead.">
        <Card>
          <FunnelBars
            stages={funnelStages}
            note={
              biggestDrop ? (
                <>
                  Biggest leak: <strong>{biggestDrop.from}</strong> → <strong>{biggestDrop.to}</strong> loses{" "}
                  {biggestDrop.pct.toFixed(0)}% ({biggestDrop.lost}). Once people start the form, most finish —
                  the largest opportunity is getting more CTA-clickers to begin.
                </>
              ) : undefined
            }
          />
        </Card>
      </Section>

      <ReleaseTicker
        lastReleaseTitle={lastRelease?.title}
        lastReleaseAgoLabel={lastRelease ? relativeDaysAgo(lastRelease.releasedAt) : undefined}
      />

      <p className="text-[11px] text-[var(--color-mcb-warm-grey)]">
        Bot-filtered, Melbourne time. Numbers differ from the old dashboard, which counted bots as visitors.
        Updated {relativeDaysAgo(data.generatedAt)}.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-serif text-[22px] font-medium leading-tight text-[var(--color-mcb-charcoal)]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--color-mcb-warm-grey)]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Card({
  title,
  hint,
  className = "",
  children,
}: {
  title?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6 ${className}`}>
      {title && (
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">{title}</h3>
          {hint && <span className="text-[11px] text-[var(--color-mcb-warm-grey)]">{hint}</span>}
        </div>
      )}
      {children}
    </article>
  );
}

function RegionRow({ label, value, total, accent }: { label: string; value: number; total: number; accent: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-[var(--color-mcb-charcoal)]">{label}</span>
        <span className="tabular-nums text-[var(--color-mcb-charcoal)]">
          {value.toLocaleString("en-AU")}
          <span className="ml-2 text-xs text-[var(--color-mcb-warm-grey)]">{pct}%</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-mcb-sand)]">
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: accent }} />
      </div>
    </div>
  );
}

function MonthTable({ months }: { months: MonthRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-mcb-sand-deep)] text-left text-[11px] uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            <th className="px-4 py-3 font-semibold">Month</th>
            <th className="px-4 py-3 text-right font-semibold">Visitors</th>
            <th className="px-4 py-3 text-right font-semibold">Leads</th>
            <th className="px-4 py-3 text-right font-semibold">Lead rate</th>
            <th className="px-4 py-3 text-right font-semibold">Phone taps</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m) => (
            <tr key={m.month} className="border-b border-[var(--color-mcb-sand-deep)] last:border-0">
              <td className="px-4 py-3 text-[var(--color-mcb-charcoal)]">
                {m.label}
                {m.partial && <span className="ml-2 text-[11px] text-[var(--color-mcb-warm-grey)]">so far</span>}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">{m.visitors.toLocaleString("en-AU")}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">{m.leads}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">{m.leadRatePct.toFixed(1)}%</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">{m.phoneTaps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function describeChange(pct: number | null): ReactNode {
  if (pct === null) return "";
  if (Math.abs(pct) < 1) return " (flat vs the prior 30 days)";
  const dir = pct > 0 ? "up" : "down";
  return ` (${dir} ${Math.abs(Math.round(pct))}% vs the prior 30 days)`;
}

function findBiggestDrop(stages: { label: string; count: number }[]) {
  let worst: { from: string; to: string; pct: number; lost: number } | null = null;
  for (let i = 1; i < stages.length; i++) {
    const prev = stages[i - 1].count;
    const curr = stages[i].count;
    if (prev <= 0) continue;
    const pct = ((prev - curr) / prev) * 100;
    if (!worst || pct > worst.pct) worst = { from: stages[i - 1].label, to: stages[i].label, pct, lost: prev - curr };
  }
  return worst;
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
