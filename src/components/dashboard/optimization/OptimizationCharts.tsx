"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
    PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// MCB palette (terracotta + charcoal + sage) extended with neons for the
// optimization dashboard — needs more contrast against the dark theme.
export const OPT_PALETTE = {
    primary:   "#f97316", // electric terracotta
    primary2:  "#fb923c",
    success:   "#22d3ee", // cyan — citations / wins
    warning:   "#facc15", // amber — medium severity
    danger:    "#f43f5e", // rose — critical
    muted:     "#64748b",
    bg:        "#0b0f17",
    panel:     "#0f1623",
    panelEdge: "#1e293b",
    text:      "#e2e8f0",
    textMuted: "#94a3b8",
};

const tooltipStyle = {
    backgroundColor: OPT_PALETTE.panel,
    border: `1px solid ${OPT_PALETTE.panelEdge}`,
    borderRadius: 6,
    fontSize: 12,
    padding: "8px 12px",
    color: OPT_PALETTE.text,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};
const axisStyle = { fontSize: 11, fill: OPT_PALETTE.textMuted } as const;

// ============================================================================
// Animated composite score — radial gauge with smooth tween.
// ============================================================================
export function ScoreGauge({ score }: { score: number }) {
    const data = [{ name: "score", value: Math.min(100, Math.max(0, score)), fill: gaugeColour(score) }];
    return (
        <div className="relative h-[260px] w-full">
            <ResponsiveContainer>
                <RadialBarChart
                    innerRadius="72%" outerRadius="98%"
                    data={data} startAngle={210} endAngle={-30}
                    barSize={22}
                >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar dataKey="value" cornerRadius={11} background={{ fill: OPT_PALETTE.panelEdge }} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                    key={score}
                    initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 180, damping: 18 }}
                    className="font-mono text-5xl font-bold text-white"
                >
                    {score.toFixed(1)}
                </motion.div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Composite</div>
            </div>
        </div>
    );
}

function gaugeColour(score: number): string {
    if (score >= 80) return OPT_PALETTE.success;
    if (score >= 60) return OPT_PALETTE.primary;
    if (score >= 40) return OPT_PALETTE.warning;
    return OPT_PALETTE.danger;
}

// ============================================================================
// Sub-score quad — four mini bars side by side.
// ============================================================================
export function SubScoreQuad({ subScores }: { subScores: Record<string, number> }) {
    const data = [
        { name: "Discoverability", value: subScores.discoverability ?? 0, fill: OPT_PALETTE.success },
        { name: "Crawlability",   value: subScores.crawlability   ?? 0, fill: OPT_PALETTE.warning },
        { name: "Engagement",     value: subScores.engagement     ?? 0, fill: OPT_PALETTE.primary },
        { name: "Conversion",     value: subScores.conversion     ?? 0, fill: OPT_PALETTE.primary2 },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {data.map((d) => (
                <motion.div
                    key={d.name}
                    layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900/60 p-4"
                >
                    <div className="text-[10px] uppercase tracking-widest text-slate-400">{d.name}</div>
                    <div className="mt-1 font-mono text-3xl font-bold text-white">{d.value.toFixed(0)}<span className="text-base text-slate-500">/100</span></div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                            initial={{ width: 0 }} animate={{ width: `${d.value}%` }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            style={{ background: d.fill }} className="h-full"
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// ============================================================================
// Score trend — sparkline of last 48 runs.
// ============================================================================
type TrendPoint = { t: string; score: number };

export function ScoreTrend({ points }: { points: TrendPoint[] }) {
    if (!points.length) return <ChartEmpty>No runs yet — first cron tick will populate.</ChartEmpty>;
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer>
                <AreaChart data={points}>
                    <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={OPT_PALETTE.primary} stopOpacity={0.5} />
                            <stop offset="100%" stopColor={OPT_PALETTE.primary} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke={OPT_PALETTE.panelEdge} vertical={false} />
                    <XAxis dataKey="t" tick={axisStyle} tickLine={false} axisLine={{ stroke: OPT_PALETTE.panelEdge }} minTickGap={32} />
                    <YAxis tick={axisStyle} tickLine={false} axisLine={false} width={32} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: OPT_PALETTE.muted }} />
                    <Area type="monotone" dataKey="score" stroke={OPT_PALETTE.primary} strokeWidth={2} fill="url(#scoreGrad)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

// ============================================================================
// Citation engine breakdown.
// ============================================================================
type CitationRow = { engine: string; probes: number; cites: number; cite_rate_pct: number | null };

export function CitationByEngine({ rows }: { rows: CitationRow[] }) {
    if (!rows.length) return <ChartEmpty>No probes yet — set PERPLEXITY_API_KEY to enable.</ChartEmpty>;
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer>
                <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 24, bottom: 0, left: 24 }}>
                    <CartesianGrid stroke={OPT_PALETTE.panelEdge} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="engine" tick={axisStyle} axisLine={false} tickLine={false} width={90} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="cite_rate_pct" radius={[0, 4, 4, 0]}>
                        {rows.map((r, i) => (
                            <Cell key={i} fill={(r.cite_rate_pct ?? 0) >= 35 ? OPT_PALETTE.success : OPT_PALETTE.primary} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// ============================================================================
// Bot traffic — donut of last 7 days.
// ============================================================================
type BotRow = { bot_id: string; hits: number };

export function BotDonut({ rows }: { rows: BotRow[] }) {
    if (!rows.length) return <ChartEmpty>No AI bot traffic in the last 7 days.</ChartEmpty>;
    const palette = [OPT_PALETTE.primary, OPT_PALETTE.success, OPT_PALETTE.warning, OPT_PALETTE.primary2, OPT_PALETTE.danger, "#a78bfa", "#34d399", "#fb7185"];
    return (
        <div className="h-[220px] w-full">
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={rows} dataKey="hits" nameKey="bot_id" cx="50%" cy="50%" innerRadius={50} outerRadius={86} paddingAngle={2} strokeWidth={0}>
                        {rows.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ fontSize: 11, color: OPT_PALETTE.textMuted, paddingTop: 8 }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// ============================================================================
// Learning loop — weight evolution.
// ============================================================================
type LearningRow = { signal_key: string; measured_at: string; measured_lift_pct: number; weight_before: number; weight_after: number };

export function LearningStream({ rows }: { rows: LearningRow[] }) {
    if (!rows.length) {
        return <ChartEmpty>Learning loop will start after 14 days of issue closures.</ChartEmpty>;
    }
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer>
                <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                    <CartesianGrid stroke={OPT_PALETTE.panelEdge} />
                    <XAxis dataKey="measured_at" tick={axisStyle} tickLine={false} axisLine={false} tickFormatter={(v) => new Date(v).toLocaleDateString("en-AU", { day: "2-digit", month: "short" })} />
                    <YAxis tick={axisStyle} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="measured_lift_pct" stroke={OPT_PALETTE.success} strokeWidth={2} dot={{ r: 3, fill: OPT_PALETTE.success }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// ============================================================================
// Live event ticker.
// ============================================================================
export type LiveEvent = {
    id: string;
    kind: "run" | "lead" | "probe" | "heartbeat";
    label: string;
    detail: string;
    ts: string;
};

export function LiveTicker({ events }: { events: LiveEvent[] }) {
    return (
        <div className="h-[260px] overflow-hidden">
            <AnimatePresence initial={false}>
                {events.slice(0, 8).map((e) => (
                    <motion.div
                        key={e.id}
                        layout
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className="mb-2 flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2"
                    >
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${pulseColour(e.kind)}`}>
                            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${pulseColour(e.kind)}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-xs text-slate-200">
                                <span className="mr-2 font-semibold uppercase tracking-wider text-slate-400">{e.kind}</span>
                                {e.label}
                            </div>
                            <div className="truncate text-[11px] text-slate-500">{e.detail}</div>
                        </div>
                        <div className="text-[10px] tabular-nums text-slate-500">{formatRelative(e.ts)}</div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

function pulseColour(kind: LiveEvent["kind"]): string {
    if (kind === "run") return "bg-orange-400";
    if (kind === "lead") return "bg-cyan-300";
    if (kind === "probe") return "bg-violet-400";
    return "bg-slate-500";
}

function formatRelative(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.round(diff)}s ago`;
    if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
    return new Date(iso).toLocaleDateString();
}

// ============================================================================
// Issue card.
// ============================================================================
export function IssueCard({
    title, detail, recommendedFix, severity, expectedLift, signalKey, urlPath,
}: {
    title: string; detail: string; recommendedFix: string; severity: string;
    expectedLift: number; signalKey: string; urlPath?: string | null;
}) {
    const sev = severityStyle(severity);
    return (
        <motion.div
            layout
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70 p-4"
        >
            <div className={`absolute left-0 top-0 h-full w-1 ${sev.bar}`} />
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                        <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${sev.chip}`}>{severity}</span>
                        <span className="font-mono text-[10px] text-slate-500">{signalKey}</span>
                        {urlPath ? <span className="truncate font-mono text-[10px] text-slate-500">{urlPath}</span> : null}
                    </div>
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{detail}</p>
                    <div className="mt-2 rounded-sm border border-slate-800 bg-slate-950/50 p-2">
                        <p className="text-[11px] uppercase tracking-wider text-slate-500">Recommended fix</p>
                        <p className="mt-0.5 font-mono text-[11px] leading-relaxed text-slate-300">{recommendedFix}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500">Lift</div>
                    <div className="font-mono text-xl font-bold text-emerald-300">+{expectedLift.toFixed(1)}</div>
                </div>
            </div>
        </motion.div>
    );
}

function severityStyle(severity: string) {
    if (severity === "critical") return { bar: "bg-rose-500", chip: "bg-rose-950/70 text-rose-300" };
    if (severity === "high")     return { bar: "bg-orange-500", chip: "bg-orange-950/70 text-orange-300" };
    if (severity === "medium")   return { bar: "bg-amber-400", chip: "bg-amber-950/60 text-amber-300" };
    return { bar: "bg-slate-600", chip: "bg-slate-800 text-slate-400" };
}

function ChartEmpty({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full min-h-[160px] items-center justify-center rounded-lg border border-dashed border-slate-800 p-6 text-center text-xs text-slate-500">{children}</div>;
}
