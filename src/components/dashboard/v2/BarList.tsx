import type { ReactNode } from "react";

export interface BarListItem {
  label: string;
  value: number;
  /** Small muted note shown after the value (e.g. avg time / scroll). */
  hint?: ReactNode;
  href?: string;
}

interface BarListProps {
  items: BarListItem[];
  formatValue?: (n: number) => string;
  /** CSS colour for the bar fill. */
  accent?: string;
  emptyLabel?: string;
}

/**
 * Ranked horizontal-bar list — top pages, top locations, any label→value set.
 * Bars are scaled to the largest value in the set. v2-native (tokens palette);
 * do not use the orphaned legacy HorizontalBarChart.
 */
export function BarList({
  items,
  formatValue = (n) => n.toLocaleString("en-AU"),
  accent = "var(--color-mcb-terracotta-deep)",
  emptyLabel = "No data yet",
}: BarListProps) {
  if (!items.length) {
    return <p className="text-sm text-[var(--color-mcb-warm-grey)]">{emptyLabel}</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((it) => {
        const w = Math.max((it.value / max) * 100, it.value > 0 ? 2 : 0);
        const row = (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm text-[var(--color-mcb-charcoal)]">{it.label}</span>
              <span className="shrink-0 tabular-nums text-sm text-[var(--color-mcb-charcoal)]">
                {formatValue(it.value)}
                {it.hint != null && (
                  <span className="ml-2 text-xs font-normal text-[var(--color-mcb-warm-grey)]">{it.hint}</span>
                )}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-mcb-sand)]">
              <div className="h-1.5 rounded-full" style={{ width: `${w}%`, backgroundColor: accent }} />
            </div>
          </>
        );
        return (
          <li key={it.label}>
            {it.href ? (
              <a href={it.href} className="block rounded transition-opacity hover:opacity-80">
                {row}
              </a>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}
