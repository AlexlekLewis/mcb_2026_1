"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const CHART_PALETTE = [
  "#b85a3e",
  "#d18b5b",
  "#e6b48c",
  "#3f4946",
  "#6f7a72",
  "#a4b0a3",
  "#c5cdc4",
  "#8a5a3b",
];

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #d6d3d1",
  borderRadius: "2px",
  fontSize: "12px",
  padding: "8px 10px",
  color: "#1c1917",
};

const axisStyle = { fontSize: 11, fill: "#78716c" } as const;

type TrendPoint = {
  label: string;
  page_views: number;
  visitors: number;
  leads: number;
};

type TrendBuckets = {
  daily: TrendPoint[];
  weekly: TrendPoint[];
  monthly: TrendPoint[];
};

type TrendRange = keyof TrendBuckets;

/**
 * An "Optimization checkpoint" — a marker pinned to a trend bucket so we can
 * eyeball whether a release moved the metric. The `label` must exactly match
 * the bucket label produced upstream for the given range (e.g. "Wk 13 May").
 */
export type TrendMarker = {
  label: string;
  title: string;
  releasedAt: string;
};

export type TrendMarkers = Record<TrendRange, TrendMarker[]>;

const RANGE_LABELS: Record<TrendRange, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const RANGE_CAPTIONS: Record<TrendRange, string> = {
  daily: "Today (per hour)",
  weekly: "Last 12 weeks",
  monthly: "Last 12 months",
};

export function TrendChart({ data, markers }: { data: TrendBuckets; markers?: TrendMarkers }) {
  const [range, setRange] = useState<TrendRange>("daily");
  const series = data[range];
  const activeMarkers = (markers?.[range] || []).filter((m) =>
    series.some((point) => point.label === m.label)
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex overflow-hidden rounded-sm border border-stone-300 bg-stone-50 text-xs font-bold uppercase tracking-wide">
          {(Object.keys(RANGE_LABELS) as TrendRange[]).map((key) => {
            const active = key === range;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-mcb-terracotta text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {RANGE_LABELS[key]}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-stone-500">{RANGE_CAPTIONS[range]}</span>
      </div>

      {series.length === 0 ? (
        <ChartEmpty>No {RANGE_LABELS[range].toLowerCase()} activity stored yet.</ChartEmpty>
      ) : (
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
              <XAxis
                dataKey="label"
                tick={axisStyle}
                tickLine={false}
                axisLine={{ stroke: "#d6d3d1" }}
                minTickGap={16}
              />
              <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={40} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#d6d3d1" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Line
                type="monotone"
                dataKey="page_views"
                name="Page views"
                stroke="#b85a3e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                name="Visitors"
                stroke="#3f4946"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="leads"
                name="Leads"
                stroke="#0f766e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              {activeMarkers.map((marker) => (
                <ReferenceLine
                  key={`${marker.releasedAt}-${marker.label}`}
                  x={marker.label}
                  stroke="#b85a3e"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  ifOverflow="extendDomain"
                  label={{
                    value: `◆ ${marker.title}`,
                    position: "insideTopLeft",
                    fill: "#b85a3e",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {activeMarkers.length > 0 ? (
        <p className="mt-2 text-[11px] text-stone-500">
          <span className="font-bold text-mcb-terracotta">◆ Optimization checkpoint</span>
          {" — vertical dashes mark when a release shipped. Compare the metric before and after to judge impact."}
        </p>
      ) : null}
    </div>
  );
}

export function HorizontalBarChart({
  data,
  valueKey = "value",
  labelKey = "label",
  height = 260,
  color = CHART_PALETTE[0],
}: {
  data: Array<Record<string, string | number>>;
  valueKey?: string;
  labelKey?: string;
  height?: number;
  color?: string;
}) {
  if (data.length === 0) return <ChartEmpty>No data yet.</ChartEmpty>;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 6, right: 16, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
          <XAxis type="number" tick={axisStyle} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey={labelKey}
            tick={axisStyle}
            tickLine={false}
            axisLine={false}
            width={140}
          />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#fafaf9" }} />
          <Bar dataKey={valueKey} fill={color} radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatHour12(hour: number): string {
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`;
}

function formatHour12Range(hour: number): string {
  const start = formatHour12(hour);
  // Closing minute of the same hour, e.g. 9am window -> "9am – 9:59am"
  const suffix = hour < 12 ? "am" : "pm";
  const minuteHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${start} – ${minuteHour}:59${suffix}`;
}

export function HourlyActivityChart({ data }: { data: Array<{ hour: number; sessions: number }> }) {
  if (data.length === 0) return <ChartEmpty>No hourly data yet.</ChartEmpty>;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={axisStyle}
            tickLine={false}
            axisLine={{ stroke: "#d6d3d1" }}
            tickFormatter={(value: number) => formatHour12(value)}
          />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={30} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "#fafaf9" }}
            labelFormatter={(value) => `${formatHour12Range(Number(value))} (Melbourne)`}
          />
          <Bar dataKey="sessions" fill="#b85a3e" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({
  data,
  valueKey = "value",
  labelKey = "label",
  height = 240,
}: {
  data: Array<Record<string, string | number>>;
  valueKey?: string;
  labelKey?: string;
  height?: number;
}) {
  if (data.length === 0) return <ChartEmpty>No data yet.</ChartEmpty>;

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={labelKey}
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={1.5}
            stroke="#fafaf9"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={CHART_PALETTE[index % CHART_PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingLeft: 12 }}
            layout="vertical"
            align="right"
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Plain-English explanations for each funnel stage. Keyed by lowercased stage
 * name so we tolerate label casing drift in the view definition. If a stage
 * has no entry we just show the name without a hint.
 */
const FUNNEL_STAGE_HELP: Record<string, string> = {
  "page views": "All page-view events. The very top of the funnel — every session contributes.",
  "quote cta clicks": "Clicks on any 'Book / Get a quote' button across the site.",
  "quote form starts": "Of those clickers, who actually started typing into the form.",
  "quote submits": "Of those who started, who pressed the final Submit button.",
  "quote successes": "Of those who submitted, whose submission was accepted by the API (no validation / server error).",
  "stored leads": "Of those successes, who actually landed as a row in the database. The bottom of the funnel — these are the leads you can follow up on.",
};

export function FunnelChart({
  data,
}: {
  data: Array<{ stage: string; total: number }>;
}) {
  if (data.length === 0) return <ChartEmpty>No funnel events yet.</ChartEmpty>;
  const max = Math.max(...data.map((row) => row.total), 1);

  return (
    <div>
      <p className="mb-4 text-xs leading-relaxed text-stone-500">
        Step-by-step view of how many people make it from &ldquo;saw a quote button&rdquo; through to
        &ldquo;we stored their lead&rdquo;. Each bar is what survived from the row above. Hover any row
        for a plain-English definition.
      </p>
      <div className="space-y-3">
        {data.map((row, index) => {
          const widthPercent = Math.max((row.total / max) * 100, row.total > 0 ? 4 : 0);
          const previous = data[index - 1]?.total;
          const dropoff =
            previous && previous > 0
              ? `${Math.round((row.total / previous) * 100)}% from previous`
              : "Start";
          const help = FUNNEL_STAGE_HELP[row.stage.toLowerCase().trim()];

          return (
            <div key={row.stage}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span
                  className="font-semibold text-stone-700"
                  title={help || row.stage}
                >
                  {row.stage}
                  {help ? (
                    <span
                      aria-hidden
                      className="ml-1.5 cursor-help text-xs text-stone-400"
                      title={help}
                    >
                      ⓘ
                    </span>
                  ) : null}
                </span>
                <span className="text-stone-500">{row.total.toLocaleString()}</span>
              </div>
              <div className="h-8 overflow-hidden rounded-sm bg-stone-100">
                <div
                  className="flex h-full items-center bg-mcb-terracotta px-3 text-xs font-bold text-white transition-[width]"
                  style={{ width: `${widthPercent}%` }}
                >
                  {dropoff}
                </div>
              </div>
              {help ? (
                <p className="mt-1 text-[11px] leading-snug text-stone-500">{help}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-sm bg-stone-50 text-sm text-stone-500">
      {children}
    </div>
  );
}
