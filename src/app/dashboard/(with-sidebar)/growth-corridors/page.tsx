import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import {
  loadGrowthCorridorDashboard,
  type CorridorPageRow,
  type CorridorScrollDepthRow,
  type CorridorQuestionEngagementRow,
  type CorridorAiCitationRow,
  type CorridorAiCitationCell,
} from "@/lib/dashboard/growth-corridor-metrics";
import { formatCorridor } from "@/lib/growth-corridors";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Growth Corridors · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function GrowthCorridorsDashboardPage() {
  const data = await loadGrowthCorridorDashboard();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Growth Corridors"
        subtitle="Performance of the 18 URLs targeting Melbourne's south-east, north and west growth corridors. Cohort metrics are isolated from the rest of the site so weekly optimisation can focus where the new-build buyer is."
        meta={`${data.cohortUrls.length} URLs · 28-day window`}
      />

      {/* Panel 1 — Corridor KPI strip */}
      <section aria-labelledby="kpi-heading" className="space-y-3">
        <h2
          id="kpi-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mcb-warm-grey)]"
        >
          Corridor KPI strip — last 28 days
        </h2>
        {data.kpi.unavailable ? (
          <UnavailableNotice />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Humans (corridor)"
              value={data.kpi.cohort.humans.toLocaleString()}
              deltaLabel={formatBlockDelta(data.kpi.cohort.humans, data.kpi.cohortPrior.humans)}
              deltaDirection={
                deltaDirection(data.kpi.cohort.humans, data.kpi.cohortPrior.humans)
              }
              state={
                deltaState(data.kpi.cohort.humans, data.kpi.cohortPrior.humans)
              }
              footer={`Rest of site: ${data.kpi.restOfSite.humans.toLocaleString()}`}
            />
            <KpiCard
              label="Leads (corridor)"
              value={data.kpi.cohort.leads.toLocaleString()}
              deltaLabel={formatBlockDelta(data.kpi.cohort.leads, data.kpi.cohortPrior.leads)}
              deltaDirection={
                deltaDirection(data.kpi.cohort.leads, data.kpi.cohortPrior.leads)
              }
              state={deltaState(data.kpi.cohort.leads, data.kpi.cohortPrior.leads)}
              footer={`Rest of site: ${data.kpi.restOfSite.leads.toLocaleString()}`}
            />
            <KpiCard
              label="Lead rate"
              value={formatPct(data.kpi.cohort.leadRatePct)}
              footer={`Rest of site: ${formatPct(data.kpi.restOfSite.leadRatePct)}`}
            />
            <KpiCard
              label="Quote CTA CTR"
              value={formatPct(data.kpi.cohort.quoteCtaCtrPct)}
              footer={`Rest of site: ${formatPct(data.kpi.restOfSite.quoteCtaCtrPct)}`}
            />
          </div>
        )}
      </section>

      {/* Panel 2 — Per-page table */}
      <section aria-labelledby="pages-heading" className="space-y-3">
        <h2
          id="pages-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mcb-warm-grey)]"
        >
          Per-page — 28-day humans · 7-day Δ
        </h2>
        <CorridorPageTable rows={data.pages} />
      </section>

      {/* Panel 3 — Question-level engagement */}
      <section aria-labelledby="question-heading" className="space-y-3">
        <h2
          id="question-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mcb-warm-grey)]"
        >
          Question-level engagement — 28-day woven sections
        </h2>
        <CorridorQuestionTable rows={data.questionEngagement} />
      </section>

      {/* Panel 4 — Scroll-depth heatmap */}
      <section aria-labelledby="scroll-heading" className="space-y-3">
        <h2
          id="scroll-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mcb-warm-grey)]"
        >
          Scroll-depth heatmap — % of humans reaching each threshold (28d)
        </h2>
        <CorridorScrollDepthTable rows={data.scrollDepth} />
      </section>

      {/* Panel 5 — AI citation tracker */}
      <section aria-labelledby="ai-citations-heading" className="space-y-3">
        <h2
          id="ai-citations-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mcb-warm-grey)]"
        >
          AI citation tracker — latest quarterly sweep
        </h2>
        {data.aiCitationsTableMissing ? (
          <div className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
            <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">ai_citation_log</code>{" "}
            table not found. Apply{" "}
            <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">supabase/migrations/20260526_ai_citation_log.sql</code>{" "}
            via the Supabase SQL editor to enable this panel.
          </div>
        ) : data.aiCitations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
            No AI citation sweeps logged yet. Run a quarterly sweep by querying each tracked question on ChatGPT, Perplexity, Gemini and Google AI Overview, then insert rows into <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">public.ai_citation_log</code> via the Supabase SQL editor (columns: question_id, source, cited, notes, checked_at).
          </div>
        ) : (
          <CorridorAiCitationsTable rows={data.aiCitations} />
        )}
      </section>

      {/* Panel 6 — Release impact (corridor-filtered) */}
      <section aria-labelledby="releases-heading" className="space-y-3">
        <h2
          id="releases-heading"
          className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mcb-warm-grey)]"
        >
          Recent releases affecting growth corridors
        </h2>
        {data.releases.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
            No corridor-tagged releases yet. Mark a release with{" "}
            <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">
              affectsGrowthCorridor: true
            </code>{" "}
            in <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">src/lib/dashboard/releases.ts</code> for it to appear here.
          </div>
        ) : (
          <ol className="space-y-3">
            {data.releases.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-serif text-base text-[var(--color-mcb-charcoal)]">
                    {r.title}
                  </h3>
                  <span className="text-[11px] tabular-nums text-[var(--color-mcb-warm-grey)]">
                    {formatHoursSince(r.hoursSinceRelease)} ago
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-mcb-warm-grey)]">
                  {r.summary}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        <p>
          Panel 3 populates once <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">question_scrolled_into_view</code>{" "}
          and <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">question_section_dwell</code>{" "}
          events have been firing for a few days from the WovenQuestion components on the corridor pages.
          Panel 5 reads from the <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">ai_citation_log</code> table — log a quarterly sweep there to populate.
        </p>
        <p className="mt-2">
          Last updated{" "}
          {new Date(data.lastUpdatedIso).toLocaleString("en-AU", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          .
        </p>
      </aside>
    </div>
  );
}

function CorridorPageTable({ rows }: { rows: CorridorPageRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[var(--color-mcb-sand-deep)] bg-[var(--color-mcb-paper)]">
          <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-mcb-warm-grey)]">
            <th scope="col" className="px-4 py-3 font-semibold">Page</th>
            <th scope="col" className="px-4 py-3 font-semibold">Corridor</th>
            <th scope="col" className="px-4 py-3 font-semibold">Type</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">Humans 28d</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">CTA CTR</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">Leads 28d</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">7d Δ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
          {rows.map((r) => (
            <tr key={r.url} className="hover:bg-[var(--color-mcb-paper)]/50">
              <td className="px-4 py-3">
                <Link href={r.url} className="text-[var(--color-mcb-charcoal)] hover:underline">
                  {r.label}
                </Link>
                <div className="mt-0.5 font-mono text-[10px] text-[var(--color-mcb-warm-grey)]">
                  {r.url}
                </div>
              </td>
              <td className="px-4 py-3 text-[var(--color-mcb-charcoal)]">
                {formatCorridor(r.corridor)}
              </td>
              <td className="px-4 py-3 text-[var(--color-mcb-warm-grey)]">
                {categoryLabel(r.category)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">
                {r.humans28d}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">
                {formatPct(r.quoteCtaCtrPct)}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">
                {r.leads28d}
              </td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatDelta(r.humans7dDelta)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnavailableNotice() {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
      Live metrics unavailable — Supabase env vars not configured in this environment.
      The dashboard scaffold is in place; numbers will populate once{" "}
      <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">SUPABASE_URL</code>{" "}
      and{" "}
      <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
      are set in Vercel.
    </div>
  );
}

function formatPct(v: number | null): string {
  if (v === null) return "—";
  return `${v.toFixed(1)}%`;
}

function formatBlockDelta(now: number, prior: number): string | undefined {
  if (prior === 0 && now === 0) return undefined;
  if (prior === 0) return "new";
  const ratio = now / prior - 1;
  const sign = ratio >= 0 ? "+" : "";
  return `${sign}${(ratio * 100).toFixed(0)}% vs prior`;
}

function deltaDirection(
  now: number,
  prior: number
): "up" | "down" | "flat" | undefined {
  if (prior === 0 && now === 0) return undefined;
  if (prior === 0) return "up";
  const ratio = now / prior - 1;
  if (Math.abs(ratio) < 0.05) return "flat";
  return ratio > 0 ? "up" : "down";
}

function deltaState(
  now: number,
  prior: number
): "neutral" | "good" | "attention" | "critical" {
  if (prior === 0 && now === 0) return "neutral";
  if (prior === 0) return "good";
  const ratio = now / prior - 1;
  if (ratio >= 0.1) return "good";
  if (ratio <= -0.2) return "critical";
  if (ratio <= -0.05) return "attention";
  return "neutral";
}

function formatDelta(ratio: number | null): string {
  if (ratio === null) return "—";
  const pct = ratio * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(0)}%`;
}

function categoryLabel(c: CorridorPageRow["category"]): string {
  if (c === "answer-gap") return "Answer-gap";
  if (c === "pillar") return "Pillar";
  return "Suburb";
}

function formatHoursSince(hours: number): string {
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 14) return `${days}d`;
  const weeks = Math.round(days / 7);
  return `${weeks}w`;
}

// --- Panel 3: question-level engagement ---

function CorridorQuestionTable({ rows }: { rows: CorridorQuestionEngagementRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        No question-level engagement events recorded in the last 28 days. The{" "}
        <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">WovenQuestion</code> component fires{" "}
        <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">question_scrolled_into_view</code>{" "}
        when a tagged section enters the viewport and{" "}
        <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">question_section_dwell</code>{" "}
        on exit. Once growth-corridor pages have been live with these events for a few days, this panel populates.
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[var(--color-mcb-sand-deep)] bg-[var(--color-mcb-paper)]">
          <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-mcb-warm-grey)]">
            <th scope="col" className="px-4 py-3 font-semibold">Page</th>
            <th scope="col" className="px-4 py-3 font-semibold">Question</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">Scroll-ins 28d</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">Median dwell</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
          {rows.map((r) => (
            <tr key={`${r.pageUrl}::${r.questionId}`} className="hover:bg-[var(--color-mcb-paper)]/50">
              <td className="px-4 py-3 text-[var(--color-mcb-charcoal)]">{r.pageLabel}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-[var(--color-mcb-warm-grey)]">{r.questionId}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">{r.scrollIns28d}</td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">
                {r.medianDwellSec === null ? "—" : `${r.medianDwellSec.toFixed(0)}s`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Panel 4: scroll-depth heatmap ---

function CorridorScrollDepthTable({ rows }: { rows: CorridorScrollDepthRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[var(--color-mcb-sand-deep)] bg-[var(--color-mcb-paper)]">
          <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-mcb-warm-grey)]">
            <th scope="col" className="px-4 py-3 font-semibold">Page</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">Views 28d</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">25%</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">50%</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">75%</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold tabular-nums">100%</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
          {rows.map((r) => (
            <tr key={r.url} className="hover:bg-[var(--color-mcb-paper)]/50">
              <td className="px-4 py-3">
                <div className="text-[var(--color-mcb-charcoal)]">{r.label}</div>
                <div className="mt-0.5 font-mono text-[10px] text-[var(--color-mcb-warm-grey)]">{r.url}</div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-charcoal)]">{r.pageViews}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatScrollPct(r.pct25)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatScrollPct(r.pct50)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatScrollPct(r.pct75)}</td>
              <td className="px-4 py-3 text-right tabular-nums">{formatScrollPct(r.pct100)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatScrollPct(v: number | null): string {
  if (v === null) return "—";
  return `${v.toFixed(0)}%`;
}

// --- Panel 5: AI citation tracker ---

function CorridorAiCitationsTable({ rows }: { rows: CorridorAiCitationRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white">
      <table className="min-w-full text-sm">
        <thead className="border-b border-[var(--color-mcb-sand-deep)] bg-[var(--color-mcb-paper)]">
          <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--color-mcb-warm-grey)]">
            <th scope="col" className="px-4 py-3 font-semibold">Question ID</th>
            <th scope="col" className="px-4 py-3 font-semibold">ChatGPT</th>
            <th scope="col" className="px-4 py-3 font-semibold">Perplexity</th>
            <th scope="col" className="px-4 py-3 font-semibold">Gemini</th>
            <th scope="col" className="px-4 py-3 font-semibold">Google AI Overview</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
          {rows.map((r) => (
            <tr key={r.questionId} className="hover:bg-[var(--color-mcb-paper)]/50">
              <td className="px-4 py-3 font-mono text-[11px] text-[var(--color-mcb-warm-grey)]">{r.questionId}</td>
              <td className="px-4 py-3">{formatCitationCell(r.chatgpt)}</td>
              <td className="px-4 py-3">{formatCitationCell(r.perplexity)}</td>
              <td className="px-4 py-3">{formatCitationCell(r.gemini)}</td>
              <td className="px-4 py-3">{formatCitationCell(r.googleAiOverview)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatCitationCell(cell: CorridorAiCitationCell | null) {
  if (!cell) {
    return <span className="text-[var(--color-mcb-warm-grey)]">—</span>;
  }
  if (cell.cited === true) {
    return (
      <span title={`cited as at ${cell.checkedAtIso}${cell.notes ? ` — ${cell.notes}` : ""}`} className="font-semibold text-[var(--color-mcb-sage-dark)]">
        ✓
      </span>
    );
  }
  if (cell.cited === false) {
    return (
      <span title={`not cited as at ${cell.checkedAtIso}`} className="text-[var(--color-mcb-terracotta-red)]">
        ✗
      </span>
    );
  }
  return <span className="text-[var(--color-mcb-warm-grey)]">–</span>;
}
