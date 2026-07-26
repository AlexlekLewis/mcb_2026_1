import type { ReactNode } from "react";

export interface FunnelStageDatum {
  label: string;
  count: number;
}

interface FunnelBarsProps {
  stages: FunnelStageDatum[];
  note?: ReactNode;
}

/**
 * Quote-funnel visual: one horizontal bar per stage, width proportional to the
 * first stage, with conversion-from-top % and drop-off-from-previous-stage %.
 * Models the inline funnel on the Leads page as a reusable v2 primitive.
 */
export function FunnelBars({ stages, note }: FunnelBarsProps) {
  const top = stages.length ? Math.max(stages[0].count, 1) : 1;
  return (
    <div>
      <ol className="space-y-3">
        {stages.map((s, i) => {
          const prev = i > 0 ? stages[i - 1].count : null;
          const dropPct = prev && prev > 0 ? ((prev - s.count) / prev) * 100 : null;
          const widthPct = Math.max((s.count / top) * 100, s.count > 0 ? 3 : 0);
          const convPct = top > 0 ? (s.count / top) * 100 : 0;
          return (
            <li key={s.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--color-mcb-charcoal)]">{s.label}</span>
                <span className="shrink-0 tabular-nums text-[var(--color-mcb-charcoal)]">
                  {s.count.toLocaleString("en-AU")}
                  <span className="ml-2 text-xs text-[var(--color-mcb-warm-grey)]">{convPct.toFixed(0)}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full rounded-full bg-[var(--color-mcb-sand)]">
                <div
                  className="h-2.5 rounded-full bg-[var(--color-mcb-terracotta-deep)]"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              {dropPct !== null && dropPct > 0.5 && (
                <p className="mt-1 text-[11px] text-[var(--color-mcb-warm-grey)]">
                  −{dropPct.toFixed(0)}% from previous stage
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {note && <p className="mt-4 text-xs leading-relaxed text-[var(--color-mcb-warm-grey)]">{note}</p>}
    </div>
  );
}
