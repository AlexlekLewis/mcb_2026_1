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

const RANGE_LABELS: Record<TrendRange, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

const RANGE_CAPTIONS: Record<TrendRange, string> = {
  daily: "Last 30 days",
  weekly: "Last 12 weeks",
  monthly: "Last 12 months",
};

export function TrendChart({ data }: { data: TrendBuckets }) {
  const [range, setRange] = useState<TrendRange>("daily");
  const series = data[range];

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
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
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
            tickFormatter={(value: number) => `${value}h`}
          />
          <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={30} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: "#fafaf9" }}
            labelFormatter={(value) => `${value}:00 – ${value}:59 (Melbourne)`}
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

export function FunnelChart({
  data,
}: {
  data: Array<{ stage: string; total: number }>;
}) {
  if (data.length === 0) return <ChartEmpty>No funnel events yet.</ChartEmpty>;
  const max = Math.max(...data.map((row) => row.total), 1);

  return (
    <div className="space-y-3">
      {data.map((row, index) => {
        const widthPercent = Math.max((row.total / max) * 100, row.total > 0 ? 4 : 0);
        const previous = data[index - 1]?.total;
        const dropoff =
          previous && previous > 0
            ? `${Math.round((row.total / previous) * 100)}% from previous`
            : "Start";

        return (
          <div key={row.stage}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-stone-700">{row.stage}</span>
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
          </div>
        );
      })}
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
