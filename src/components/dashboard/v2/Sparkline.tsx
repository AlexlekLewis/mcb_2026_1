"use client";

import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { chartColors } from "@/lib/dashboard/v2/chartTheme";

interface SparklineProps {
  data: ReadonlyArray<number | { value: number }>;
  color?: string;
  height?: number;
  strokeWidth?: number;
  ariaLabel?: string;
}

/**
 * Minimal Recharts sparkline. No axes, no grid, no dots. One line, one purpose:
 * convey trend shape inside a KPI card.
 *
 * Accessibility: every sparkline must take an `ariaLabel` describing the metric.
 */
export function Sparkline({
  data,
  color = chartColors.primary,
  height = 36,
  strokeWidth = 1.5,
  ariaLabel,
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div
        role="img"
        aria-label={ariaLabel ? `${ariaLabel}: no data` : "Sparkline: no data"}
        className="h-9 w-full rounded bg-[var(--color-mcb-sand)]"
      />
    );
  }

  const points = data.map((d, i) =>
    typeof d === "number" ? { i, value: d } : { i, value: d.value },
  );

  return (
    <div role="img" aria-label={ariaLabel ?? "Sparkline"} className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
