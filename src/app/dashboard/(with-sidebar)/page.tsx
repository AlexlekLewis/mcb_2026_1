import type { Metadata } from "next";
import { HeroMetric } from "@/components/dashboard/v2/HeroMetric";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { ActionCard } from "@/components/dashboard/v2/ActionCard";
import { AttentionStrip, type AttentionItem } from "@/components/dashboard/v2/AttentionStrip";
import { ReleaseTicker } from "@/components/dashboard/v2/ReleaseTicker";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import {
  fetchLeadsHeroData,
  fetchBotCrawlSummary,
  fetchAiCitationSummary,
  fetchStaleContent,
  fetchPendingReviews,
  sumColumn,
  formatPercent,
  formatPercentPoints,
  formatDelta,
  deltaDirection,
  relativeDaysAgo,
} from "@/lib/dashboard/v2/data";
import { classifyValue, thresholds } from "@/lib/dashboard/v2/tokens";
import { RELEASES } from "@/lib/dashboard/releases";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard · MCB",
  description: "MCB owner dashboard.",
  robots: { index: false, follow: false },
};

export default async function DashboardHome() {
  const [{ current, prior }, botSummary, citationSummary, staleContent, pendingReviews] =
    await Promise.all([
      fetchLeadsHeroData(),
      fetchBotCrawlSummary(),
      fetchAiCitationSummary(),
      fetchStaleContent(3),
      fetchPendingReviews(3),
    ]);

  // ---------- Hero: Leads 28d ----------
  const leadsCurrent = sumColumn(current, "leads");
  const leadsPrior = sumColumn(prior, "leads");
  const leadsDelta = leadsCurrent - leadsPrior;
  const leadsSeries = current.map((d) => ({
    date: d.metric_date,
    value: d.leads,
  }));

  // ---------- Secondary KPIs ----------
  const visitorsCurrent = sumColumn(current, "visitors");
  const visitorsPrior = sumColumn(prior, "visitors");
  const leadRateCurrent = visitorsCurrent > 0 ? leadsCurrent / visitorsCurrent : 0;
  const leadRatePrior = visitorsPrior > 0 ? leadsPrior / visitorsPrior : 0;
  const leadRateDelta = leadRateCurrent - leadRatePrior;
  const leadRateState = classifyValue(leadRateCurrent, thresholds.leadRate);

  const aiSovState = classifyValue(citationSummary.share_of_voice_7d, thresholds.aiCitationSov);

  const botCrawlState = botSummary.total7d === 0 ? "critical" : "neutral";
  const botCrawlDeltaDir = deltaDirection(botSummary.total7d, botSummary.prior7d);

  // ---------- Attention strip ----------
  const attention: AttentionItem[] = [];
  for (const r of pendingReviews) {
    const ago = r.review_created_at
      ? relativeDaysAgo(r.review_created_at)
      : "recently";
    attention.push({
      id: `review-${r.id}`,
      message: (
        <>
          GBP review from <strong>{r.reviewer_name ?? "anonymous"}</strong>
          {r.rating ? ` (${r.rating}★)` : ""} pending response · {ago}
        </>
      ),
      href: "/dashboard/reputation",
    });
  }
  for (const s of staleContent.filter((c) => (c.days_stale ?? 0) > 90)) {
    attention.push({
      id: `stale-${s.url}`,
      message: (
        <>
          Stale: <code className="font-mono text-xs">{s.url}</code> · {s.days_stale}d ·{" "}
          {s.ai_citations_30d} AI citations / 30d
        </>
      ),
      href: "/dashboard/content",
    });
  }
  for (const b of botSummary.byBot.filter((b) => b.hits_7d === 0)) {
    attention.push({
      id: `bot-${b.bot_id}`,
      message: <>{b.bot_id} 0 hits in 7 days</>,
      href: "/dashboard/ai-presence",
    });
  }

  // ---------- This week panel ----------
  // Built from the same data sources for now — once PR 3 ships content_backlog
  // ranking and brief generation, the queue will be ranked from a richer
  // priority function. For now: stale-content refresh and pending reviews.
  const weeklyActions = buildWeeklyActions(staleContent, pendingReviews);

  // ---------- Release ticker ----------
  const lastRelease = RELEASES[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Home"
        subtitle="The state of the business in one screen. Defaults: 28-day window for leads, 7-day for AI signals."
        meta={new Date().toLocaleDateString("en-AU", {
          weekday: "short",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />

      {/* Hero row: Leads + This Week */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <HeroMetric
            label="Leads · 28 days"
            value={leadsCurrent}
            series={leadsSeries}
            deltaLabel={`${formatDelta(leadsDelta)} vs prior 28d`}
            deltaDirection={deltaDirection(leadsCurrent, leadsPrior)}
            state={leadsCurrent >= leadsPrior ? "good" : "attention"}
            cta={{ label: "View funnel", href: "/dashboard/leads" }}
            footer={`vs ${leadsPrior} in prior 28d · ${visitorsCurrent.toLocaleString("en-AU")} visitors`}
          />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
              This week · {weeklyActions.length} {weeklyActions.length === 1 ? "action" : "actions"}
            </h2>
            <a
              href="/dashboard/content"
              className="text-xs font-medium text-[var(--color-mcb-terracotta-deep)] hover:text-[#6F4218]"
            >
              See queue →
            </a>
          </div>
          <div className="mt-4 space-y-3">
            {weeklyActions.length === 0 ? (
              <p className="text-sm text-[var(--color-mcb-warm-grey)]">
                Nothing in the queue. Once content_freshness, gbp_reviews and
                content_backlog start filling (PR 3 wires the crons), this
                panel will rank actions by impact × ease.
              </p>
            ) : (
              weeklyActions.map((a, i) => (
                <ActionCard
                  key={a.id}
                  priority={i + 1}
                  title={a.title}
                  reason={a.reason}
                  estimate={a.estimate}
                  cta={a.cta}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <section aria-labelledby="secondary-kpi-heading">
        <h2 id="secondary-kpi-heading" className="sr-only">
          Secondary KPIs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Lead rate · 28d"
            value={formatPercent(leadRateCurrent)}
            state={leadRateState}
            deltaLabel={leadRateDelta === 0 ? "flat" : formatPercentPoints(leadRateDelta)}
            deltaDirection={leadRateDelta > 0 ? "up" : leadRateDelta < 0 ? "down" : "flat"}
            footer="leads ÷ visitors"
            href="/dashboard/leads"
          />
          <KpiCard
            label="AI citation SoV · 7d"
            value={
              citationSummary.total_probes_7d === 0
                ? "—"
                : formatPercent(citationSummary.share_of_voice_7d)
            }
            state={citationSummary.total_probes_7d === 0 ? "neutral" : aiSovState}
            footer={
              citationSummary.total_probes_7d === 0
                ? "no probes logged yet"
                : `${citationSummary.mcb_cited_count_7d} of ${citationSummary.total_probes_7d} probes`
            }
            href="/dashboard/ai-presence"
          />
          <KpiCard
            label="AI bot crawls · 7d"
            value={botSummary.total7d.toLocaleString("en-AU")}
            state={botCrawlState}
            deltaLabel={
              botSummary.prior7d === 0
                ? botSummary.total7d > 0
                  ? "new"
                  : undefined
                : formatDelta(botSummary.total7d - botSummary.prior7d)
            }
            deltaDirection={botCrawlDeltaDir}
            footer={
              botSummary.byBot.length === 0
                ? "no bot hits yet — middleware logs from PR 1 deploy"
                : `${botSummary.byBot.length} distinct bots`
            }
            href="/dashboard/ai-presence"
          />
          <KpiCard
            label="Brand search · 28d"
            value="—"
            state="neutral"
            footer="awaiting GSC sync (see audits/SEARCH_CONSOLE_SETUP.md)"
            href="/dashboard/reputation"
          />
        </div>
      </section>

      {/* Attention strip */}
      <AttentionStrip items={attention} />

      {/* Release ticker */}
      <ReleaseTicker
        lastReleaseTitle={lastRelease?.title}
        lastReleaseAgoLabel={lastRelease ? relativeDaysAgo(lastRelease.releasedAt) : undefined}
      />
    </div>
  );
}

interface WeeklyAction {
  id: string;
  title: string;
  reason: string;
  estimate: string;
  cta: { label: string; href: string };
}

function buildWeeklyActions(
  staleContent: Awaited<ReturnType<typeof fetchStaleContent>>,
  pendingReviews: Awaited<ReturnType<typeof fetchPendingReviews>>,
): WeeklyAction[] {
  const actions: WeeklyAction[] = [];

  for (const s of staleContent.filter((c) => (c.days_stale ?? 0) > 90)) {
    actions.push({
      id: `refresh-${s.url}`,
      title: `Refresh ${s.title ?? s.url}`,
      reason: `Stale ${s.days_stale}d · ${s.ai_citations_30d} AI cites · ${s.visits_30d} visits/30d`,
      estimate: "45 min",
      cta: { label: "Open", href: "/dashboard/content" },
    });
  }

  for (const r of pendingReviews) {
    actions.push({
      id: `review-${r.id}`,
      title: `Respond to GBP review from ${r.reviewer_name ?? "anonymous"}${r.rating ? ` (${r.rating}★)` : ""}`,
      reason: r.review_created_at
        ? `Pending ${relativeDaysAgo(r.review_created_at)}`
        : "Pending response",
      estimate: "5 min",
      cta: { label: "Review", href: "/dashboard/reputation" },
    });
  }

  return actions.slice(0, 5);
}
