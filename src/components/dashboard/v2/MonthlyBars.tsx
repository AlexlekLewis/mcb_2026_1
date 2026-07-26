export interface MonthlyDatum {
  label: string; // "Jun 2026"
  total: number;
  /** true for the in-progress current month (rendered dashed + "so far"). */
  partial?: boolean;
  /** optional 2-part stack, e.g. organic vs ads. Sum should equal total. */
  segments?: { value: number; kind: "ads" | "organic" }[];
}

interface MonthlyBarsProps {
  data: MonthlyDatum[];
  formatValue?: (n: number) => string;
  showLegend?: boolean;
  height?: number;
}

/**
 * Calendar month-on-month vertical bars. Optional 2-segment stack (ads /
 * organic). The current month is drawn dashed and labelled "so far" so a
 * partial month never reads as a real drop. CSS bars — v2 palette, no Recharts.
 */
export function MonthlyBars({
  data,
  formatValue = (n) => n.toLocaleString("en-AU"),
  showLegend = false,
  height = 150,
}: MonthlyBarsProps) {
  const max = Math.max(...data.map((d) => d.total), 1);
  const barArea = height - 22;
  return (
    <div>
      <div className="flex items-end justify-around gap-3" style={{ height }}>
        {data.map((d) => {
          const h = Math.max(Math.round((d.total / max) * barArea), d.total > 0 ? 4 : 1);
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-xs font-semibold tabular-nums text-[var(--color-mcb-charcoal)]">
                {formatValue(d.total)}
              </span>
              <div
                className={`w-full max-w-[64px] overflow-hidden rounded-t-md ${
                  d.partial ? "opacity-75 outline-dashed outline-1 outline-offset-[-1px] outline-[var(--color-mcb-terracotta-deep)]" : ""
                }`}
                style={{ height: h }}
                title={d.partial ? "Current month — in progress" : undefined}
              >
                {d.segments && d.segments.length > 0 ? (
                  <div className="flex h-full w-full flex-col-reverse">
                    {d.segments.map((s, i) => (
                      <div
                        key={i}
                        style={{
                          height: `${(s.value / Math.max(d.total, 1)) * 100}%`,
                          backgroundColor:
                            s.kind === "ads"
                              ? "var(--color-mcb-terracotta-deep)"
                              : "var(--color-mcb-sage-dark)",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full bg-[var(--color-mcb-terracotta-deep)]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-around gap-3">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center text-[11px] text-[var(--color-mcb-warm-grey)]">
            {d.label}
            {d.partial && <span className="block text-[10px]">so far</span>}
          </span>
        ))}
      </div>
      {showLegend && (
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[var(--color-mcb-warm-grey)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-mcb-sage-dark)]" />
            Organic &amp; direct
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-mcb-terracotta-deep)]" />
            Google Ads
          </span>
        </div>
      )}
    </div>
  );
}
