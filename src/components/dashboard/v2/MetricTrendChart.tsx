"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  axisStyle,
  chartColors,
  gridStyle,
  tooltipStyle,
} from "@/lib/dashboard/v2/chartTheme";

/**
 * Time-series chart for the Leads page: leads (left axis) + visitors (right
 * axis) over the selected window, with vertical markers for every release.
 *
 * Designed so you can scrub the line and see exact daily counts plus what
 * site change (if any) shipped on that day.
 */

export interface MetricTrendPoint {
  /** ISO date `YYYY-MM-DD` (Australia/Melbourne wall date from the metric). */
  date: string;
  leads: number;
  visitors: number;
}

export interface ReleaseMarker {
  id: string;
  /** ISO-8601 UTC timestamp. */
  releasedAt: string;
  title: string;
}

interface MetricTrendChartProps {
  data: MetricTrendPoint[];
  releases?: ReleaseMarker[];
  height?: number;
}

export function MetricTrendChart({
  data,
  releases = [],
  height = 280,
}: MetricTrendChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex h-[280px] items-center justify-center rounded-lg bg-[var(--color-mcb-sand)] text-sm text-[var(--color-mcb-warm-grey)]"
        style={{ height }}
      >
        No daily metrics yet.
      </div>
    );
  }

  // Reduce X-axis tick density on long windows so labels don't collide.
  const xTickInterval = data.length > 120 ? 13 : data.length > 60 ? 6 : data.length > 28 ? 3 : 2;

  // Filter releases to those that fall inside the chart's date range, and
  // snap each to its `YYYY-MM-DD` (the X axis is a category scale, so we
  // need the release date to exactly match a tick).
  const firstDate = data[0].date;
  const lastDate = data[data.length - 1].date;
  const datesInWindow = new Set(data.map((d) => d.date));
  const markers = releases
    .map((r) => ({
      id: r.id,
      title: r.title,
      date: r.releasedAt.slice(0, 10),
    }))
    .filter((r) => r.date >= firstDate && r.date <= lastDate && datesInWindow.has(r.date));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 16, right: 24, bottom: 8, left: 8 }}>
          <CartesianGrid {...gridStyle} />
          <XAxis
            dataKey="date"
            {...axisStyle}
            interval={xTickInterval}
            tickFormatter={formatDateTick}
            minTickGap={16}
          />
          <YAxis
            yAxisId="leads"
            orientation="left"
            {...axisStyle}
            allowDecimals={false}
            width={36}
            tickFormatter={(v: number) => v.toLocaleString("en-AU")}
            label={{
              value: "Leads",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 11, fill: chartColors.primary, fontWeight: 600 },
              offset: 8,
            }}
          />
          <YAxis
            yAxisId="visitors"
            orientation="right"
            {...axisStyle}
            allowDecimals={false}
            width={48}
            tickFormatter={(v: number) => v.toLocaleString("en-AU")}
            label={{
              value: "Visitors",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 11, fill: chartColors.secondary, fontWeight: 600 },
              offset: 8,
            }}
          />
          <Tooltip
            {...tooltipStyle}
            labelFormatter={(label) =>
              typeof label === "string" ? formatTooltipLabel(label) : String(label ?? "")
            }
            formatter={(value, name) => [
              typeof value === "number" ? value.toLocaleString("en-AU") : String(value ?? ""),
              name === "leads" ? "Leads" : "Visitors",
            ]}
          />
          {markers.map((m) => (
            <ReferenceLine
              key={m.id}
              x={m.date}
              yAxisId="leads"
              stroke={chartColors.axis}
              strokeDasharray="2 3"
              strokeOpacity={0.7}
              label={{
                value: "•",
                position: "top",
                style: {
                  fontSize: 14,
                  fill: chartColors.primary,
                  fontWeight: 700,
                },
              }}
              ifOverflow="extendDomain"
            />
          ))}
          <Line
            yAxisId="visitors"
            type="monotone"
            dataKey="visitors"
            stroke={chartColors.secondary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line
            yAxisId="leads"
            type="monotone"
            dataKey="leads"
            stroke={chartColors.primary}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-[var(--color-mcb-warm-grey)]">
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: chartColors.primary }}
          />
          Leads (left axis)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: chartColors.secondary }}
          />
          Visitors (right axis)
        </span>
        {markers.length > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-px bg-[var(--color-mcb-warm-grey)]" />
            {markers.length} release{markers.length === 1 ? "" : "s"} in window
          </span>
        )}
      </div>

      {markers.length > 0 && (
        <details className="mt-3 text-[11px] text-[var(--color-mcb-warm-grey)]">
          <summary className="cursor-pointer select-none hover:text-[var(--color-mcb-charcoal)]">
            Release markers ({markers.length})
          </summary>
          <ul className="mt-2 space-y-1 pl-3">
            {markers.map((m) => (
              <li key={m.id} className="flex gap-2">
                <span className="tabular-nums text-[var(--color-mcb-warm-grey)]">
                  {formatDateTick(m.date)}
                </span>
                <span className="text-[var(--color-mcb-charcoal)]">{m.title}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function formatDateTick(iso: string): string {
  // `iso` is a `YYYY-MM-DD` wall date — render as `D MMM`.
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-AU", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
  });
}

function formatTooltipLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-AU", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
