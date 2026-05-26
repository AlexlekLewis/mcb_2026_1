"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChipState } from "./ChipState";
import type { State } from "@/lib/dashboard/v2/tokens";

interface HeroSeriesPoint {
  /** ISO date or any sortable string used as the x-axis tick. */
  date: string;
  value: number;
}

interface HeroMetricProps {
  label: string;
  value: number | string;
  /**
   * Either the dated series (preferred — gives readable x-axis + tooltip)
   * or a bare numeric array for backwards compatibility. When you pass
   * numbers we render the chart without calendar context.
   */
  series: ReadonlyArray<HeroSeriesPoint | number>;
  deltaLabel?: string;
  deltaDirection?: "up" | "down" | "flat";
  state?: State;
  footer?: ReactNode;
  cta?: { label: string; href: string };
}

/**
 * Headline metric on Home: big number + readable line chart with axes, dots
 * and a hover/tap tooltip.
 *
 * Prior to 2026-05-26 this used the axis-less Sparkline ("at MCB's volume
 * axes lie"). Real-world feedback: that meant the chart couldn't be read
 * at all — no day labels, no value scale, no point markers. Now upgraded
 * to a compact-but-readable chart so Alex can point at any day and know
 * what value it shows. Min tick gap keeps the x-axis labels uncluttered
 * on narrow phones.
 */
export function HeroMetric({
  label,
  value,
  series,
  deltaLabel,
  deltaDirection,
  state = "neutral",
  footer,
  cta,
}: HeroMetricProps) {
  const lineColor =
    state === "good"
      ? "var(--color-mcb-sage-dark)"
      : state === "critical"
      ? "var(--color-mcb-terracotta-red)"
      : "var(--color-mcb-terracotta-deep)";

  // Normalise series into { date, value } regardless of input shape.
  const points = series.map((p, i) =>
    typeof p === "number"
      ? { date: `t-${series.length - i - 1}`, value: p }
      : p,
  );

  const hasData = points.length > 0 && points.some((p) => p.value > 0);
  const maxValue = points.reduce((m, p) => Math.max(m, p.value), 0);
  // For 28-day series, target ~5-6 visible ticks on desktop, fewer on mobile.
  // minTickGap handles the squeeze automatically.

  return (
    <article className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            {label}
          </h2>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="font-serif text-5xl leading-[1.1] font-medium tabular-nums text-[var(--color-mcb-charcoal)]">
              {value}
            </span>
            {deltaLabel && (
              <ChipState state={state}>
                {deltaDirection === "up" && <ArrowUp size={12} strokeWidth={3} aria-label="up" />}
                {deltaDirection === "down" && <ArrowDown size={12} strokeWidth={3} aria-label="down" />}
                {deltaDirection === "flat" && <Minus size={12} strokeWidth={3} aria-label="flat" />}
                {deltaLabel}
              </ChipState>
            )}
          </div>
        </div>
        {cta && (
          <a
            href={cta.href}
            className="shrink-0 text-xs font-medium text-[var(--color-mcb-terracotta-deep)] hover:text-[#6F4218] transition-colors"
          >
            {cta.label} →
          </a>
        )}
      </div>

      <div className="mt-5" role="img" aria-label={`${label} trend`}>
        {!hasData ? (
          <div
            aria-label="No data yet"
            className="flex h-[120px] w-full items-center justify-center rounded bg-[var(--color-mcb-sand)] text-xs text-[var(--color-mcb-warm-grey)]"
          >
            no data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <LineChart
              data={points}
              margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
            >
              <CartesianGrid
                stroke="var(--color-mcb-sand-deep)"
                strokeDasharray="2 4"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--color-mcb-warm-grey)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-mcb-sand-deep)" }}
                minTickGap={20}
                tickFormatter={formatDateTick}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--color-mcb-warm-grey)" }}
                tickLine={false}
                axisLine={false}
                width={28}
                allowDecimals={false}
                domain={[0, Math.max(1, maxValue)]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid var(--color-mcb-sand-deep)",
                  borderRadius: "4px",
                  fontSize: "12px",
                  padding: "6px 9px",
                  color: "var(--color-mcb-charcoal)",
                }}
                cursor={{ stroke: "var(--color-mcb-sand-deep)", strokeWidth: 1 }}
                labelFormatter={(v) => formatDateTooltip(String(v ?? ""))}
                formatter={(val) => [
                  Number(val).toLocaleString("en-AU"),
                  label,
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 2.5, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {footer && (
        <p className="mt-3 text-xs text-[var(--color-mcb-warm-grey)]">{footer}</p>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------
// Date helpers — accept ISO YYYY-MM-DD, fall back to raw string.
// ---------------------------------------------------------------------

function formatDateTick(value: string): string {
  // YYYY-MM-DD only — month + day.
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
    }
  }
  return value;
}

function formatDateTooltip(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }
  return value;
}
