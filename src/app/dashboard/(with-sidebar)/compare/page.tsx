import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { CompareControls } from "@/components/dashboard/v2/CompareControls";
import { ChipState } from "@/components/dashboard/v2/ChipState";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { computePeriod, fmtDuration, pctDelta } from "@/lib/dashboard/v2/report-metrics";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Compare periods · MCB Dashboard",
  robots: { index: false, follow: false },
};

type SP = Promise<{ aFrom?: string; aTo?: string; bFrom?: string; bTo?: string }>;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
function dAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return isoDay(d);
}
// Interpret a YYYY-MM-DD as a Melbourne-local day boundary (AEST +10; a 1h DST
// slip at the edge is immaterial to multi-day aggregates).
const toStart = (d: string) => new Date(`${d}T00:00:00+10:00`).toISOString();
const toEnd = (d: string) => new Date(`${d}T23:59:59.999+10:00`).toISOString();
const spanDays = (f: string, t: string) =>
  Math.max(1, Math.round((new Date(toEnd(t)).getTime() - new Date(toStart(f)).getTime()) / 86_400_000));
const rangeLabel = (f: string, t: string) => {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", timeZone: "UTC" };
  return `${new Date(f + "T00:00:00Z").toLocaleDateString("en-AU", opts)} – ${new Date(t + "T00:00:00Z").toLocaleDateString("en-AU", { ...opts, year: "numeric" })}`;
};

export default async function ComparePage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const aFrom = sp.aFrom ?? dAgo(30);
  const aTo = sp.aTo ?? isoDay(new Date());
  const bFrom = sp.bFrom ?? dAgo(60);
  const bTo = sp.bTo ?? dAgo(30);

  const [A, B] = await Promise.all([
    computePeriod(toStart(aFrom), toEnd(aTo)),
    computePeriod(toStart(bFrom), toEnd(bTo)),
  ]);

  const aDays = spanDays(aFrom, aTo);
  const bDays = spanDays(bFrom, bTo);
  const unequal = Math.abs(aDays - bDays) > 1;

  interface RowDef {
    label: string;
    a: number;
    b: number;
    fmt: (n: number) => string;
    pp?: boolean;
  }
  const num = (n: number) => n.toLocaleString("en-AU");
  const rows: RowDef[] = [
    { label: "Real visitors", a: A.visitors, b: B.visitors, fmt: num },
    { label: "Page views", a: A.pageViews, b: B.pageViews, fmt: num },
    { label: "Sessions", a: A.sessions, b: B.sessions, fmt: num },
    { label: "Verified leads", a: A.leads, b: B.leads, fmt: num },
    { label: "Lead rate", a: A.leadRatePct, b: B.leadRatePct, fmt: (n) => `${n.toFixed(1)}%`, pp: true },
    { label: "Phone taps", a: A.phoneTaps, b: B.phoneTaps, fmt: num },
    { label: "Avg active time", a: A.avgActiveSec, b: B.avgActiveSec, fmt: fmtDuration },
    { label: "Organic leads", a: A.organicLeads, b: B.organicLeads, fmt: num },
    { label: "Google Ads leads", a: A.adsLeads, b: B.adsLeads, fmt: num },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compare periods"
        subtitle="Pick any two date ranges and compare them side by side. Bot-filtered, Melbourne time."
      />

      <CompareControls aFrom={aFrom} aTo={aTo} bFrom={bFrom} bTo={bTo} />

      {unequal && (
        <p className="rounded-lg bg-[var(--color-mcb-state-attention-bg)] px-4 py-2 text-xs text-[var(--color-mcb-terracotta-deep)]">
          Heads up — Period A is {aDays} days and Period B is {bDays} days. Comparing unequal spans can mislead;
          use a preset for a like-for-like read.
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-mcb-sand-deep)] text-left">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">Metric</th>
              <th className="px-4 py-3 text-right">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-terracotta-deep)]">Period A</span>
                <span className="block text-[11px] font-normal text-[var(--color-mcb-warm-grey)]">{rangeLabel(aFrom, aTo)} · {aDays}d</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="block text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-sage-dark)]">Period B</span>
                <span className="block text-[11px] font-normal text-[var(--color-mcb-warm-grey)]">{rangeLabel(bFrom, bTo)} · {bDays}d</span>
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">Change (A vs B)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-[var(--color-mcb-sand-deep)] last:border-0">
                <td className="px-4 py-3 text-[var(--color-mcb-charcoal)]">{r.label}</td>
                <td className="px-4 py-3 text-right font-medium tabular-nums text-[var(--color-mcb-charcoal)]">{r.fmt(r.a)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[var(--color-mcb-warm-grey)]">{r.fmt(r.b)}</td>
                <td className="px-4 py-3 text-right"><ChangeCell a={r.a} b={r.b} pp={r.pp} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-[var(--color-mcb-warm-grey)]">
        &ldquo;Change&rdquo; compares Period A against Period B. Lead rate shows the difference in percentage points (pp);
        every other row shows the percentage change. Green = A is higher, amber = A is lower.
      </p>
    </div>
  );
}

function ChangeCell({ a, b, pp }: { a: number; b: number; pp?: boolean }) {
  const dir: "up" | "down" | "flat" = a > b ? "up" : a < b ? "down" : "flat";
  const state = dir === "up" ? "good" : dir === "down" ? "attention" : "neutral";
  let label: string;
  if (pp) {
    const d = a - b;
    label = `${d > 0 ? "+" : ""}${d.toFixed(1)}pp`;
  } else {
    const p = pctDelta(a, b);
    label = p === null ? "new" : `${p > 0 ? "+" : ""}${Math.round(p)}%`;
  }
  return (
    <ChipState state={state} size="sm">
      {dir === "up" && <ArrowUp size={10} strokeWidth={3} aria-label="up" />}
      {dir === "down" && <ArrowDown size={10} strokeWidth={3} aria-label="down" />}
      {dir === "flat" && <Minus size={10} strokeWidth={3} aria-label="flat" />}
      {label}
    </ChipState>
  );
}
