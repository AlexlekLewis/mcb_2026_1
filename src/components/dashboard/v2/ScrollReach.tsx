interface ScrollReachProps {
  /** One entry per threshold (25/50/75/100), pct = % of sessions reaching it. */
  reach: { threshold: number; pct: number }[];
}

/**
 * Scroll-reach meters — what share of sessions scrolled past each depth.
 * Reads from max(scroll_percent) per session in the bot-filtered stream.
 */
export function ScrollReach({ reach }: ScrollReachProps) {
  if (!reach.length) {
    return <p className="text-sm text-[var(--color-mcb-warm-grey)]">No scroll data yet</p>;
  }
  return (
    <div className="space-y-2.5">
      {reach.map((r) => (
        <div key={r.threshold}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-[var(--color-mcb-warm-grey)]">Scrolled ≥ {r.threshold}%</span>
            <span className="tabular-nums text-[var(--color-mcb-charcoal)]">{r.pct}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--color-mcb-sand)]">
            <div
              className="h-1.5 rounded-full bg-[var(--color-mcb-sage-dark)]"
              style={{ width: `${r.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
