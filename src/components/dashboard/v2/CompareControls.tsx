"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Range {
  aFrom: string;
  aTo: string;
  bFrom: string;
  bTo: string;
}

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return ymd(d);
}

/**
 * Editable period-comparison controls. Pick Period A vs Period B by date, or
 * use a preset. Pushes the choice into the URL search params; the server
 * component recomputes both periods from the bot-filtered data.
 */
export function CompareControls(init: Range) {
  const router = useRouter();
  const [a1, setA1] = useState(init.aFrom);
  const [a2, setA2] = useState(init.aTo);
  const [b1, setB1] = useState(init.bFrom);
  const [b2, setB2] = useState(init.bTo);

  const apply = (r: Range) =>
    router.push(`/dashboard/compare?aFrom=${r.aFrom}&aTo=${r.aTo}&bFrom=${r.bFrom}&bTo=${r.bTo}`);

  const applyLocal = () => apply({ aFrom: a1, aTo: a2, bFrom: b1, bTo: b2 });

  const presetRolling = (len: number) => {
    const r = { aFrom: daysAgo(len), aTo: ymd(new Date()), bFrom: daysAgo(len * 2), bTo: daysAgo(len) };
    setA1(r.aFrom); setA2(r.aTo); setB1(r.bFrom); setB2(r.bTo);
    apply(r);
  };
  const presetMonths = () => {
    const now = new Date();
    const thisFrom = ymd(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
    const lastFrom = ymd(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));
    const r = { aFrom: thisFrom, aTo: ymd(now), bFrom: lastFrom, bTo: thisFrom };
    setA1(r.aFrom); setA2(r.aTo); setB1(r.bFrom); setB2(r.bTo);
    apply(r);
  };

  const presetBtn =
    "rounded-full border border-[var(--color-mcb-sand-deep)] px-3 py-1 text-xs text-[var(--color-mcb-charcoal)] hover:bg-[var(--color-mcb-sand)] transition-colors";
  const dateInput =
    "rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-2 py-1 text-sm text-[var(--color-mcb-charcoal)] tabular-nums";

  return (
    <div className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
          Quick compare
        </span>
        <button className={presetBtn} onClick={() => presetRolling(30)}>Last 30d vs prev 30d</button>
        <button className={presetBtn} onClick={() => presetRolling(90)}>Last 90d vs prev 90d</button>
        <button className={presetBtn} onClick={presetMonths}>This month vs last</button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset className="rounded-lg bg-[var(--color-mcb-sand)] p-3">
          <legend className="px-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-terracotta-deep)]">
            Period A
          </legend>
          <div className="flex items-center gap-2">
            <input type="date" className={dateInput} value={a1} max={a2} onChange={(e) => setA1(e.target.value)} aria-label="Period A from" />
            <span className="text-xs text-[var(--color-mcb-warm-grey)]">to</span>
            <input type="date" className={dateInput} value={a2} min={a1} onChange={(e) => setA2(e.target.value)} aria-label="Period A to" />
          </div>
        </fieldset>
        <fieldset className="rounded-lg bg-[var(--color-mcb-sand)] p-3">
          <legend className="px-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-sage-dark)]">
            Period B
          </legend>
          <div className="flex items-center gap-2">
            <input type="date" className={dateInput} value={b1} max={b2} onChange={(e) => setB1(e.target.value)} aria-label="Period B from" />
            <span className="text-xs text-[var(--color-mcb-warm-grey)]">to</span>
            <input type="date" className={dateInput} value={b2} min={b1} onChange={(e) => setB2(e.target.value)} aria-label="Period B to" />
          </div>
        </fieldset>
      </div>

      <div className="mt-4">
        <button
          onClick={applyLocal}
          className="rounded-lg bg-[var(--color-mcb-terracotta-deep)] px-4 py-2 text-sm font-medium text-white hover:bg-[#6F4218] transition-colors"
        >
          Compare these periods
        </button>
      </div>
    </div>
  );
}
