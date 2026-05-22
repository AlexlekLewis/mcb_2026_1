import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import OptimizationLive from "@/components/dashboard/optimization/OptimizationLive";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
    title: "Site Intelligence",
    description: "Live optimization scoring + AI citation tracking for Modern Curtains and Blinds.",
    robots: { index: false, follow: false },
};

interface Snapshot {
    current: unknown;
    recentRuns: unknown[];
    openIssues: unknown[];
    citationsByEngine: unknown[];
    botTraffic: unknown[];
    learning: unknown[];
}

const EMPTY: Snapshot = { current: null, recentRuns: [], openIssues: [], citationsByEngine: [], botTraffic: [], learning: [] };

export default async function OptimizationDashboardPage() {
    if (!hasSupabaseAdminConfig()) {
        return <NotConfigured />;
    }

    const initial = await loadSnapshot();
    return <OptimizationLive initial={initial as Parameters<typeof OptimizationLive>[0]["initial"]} />;
}

async function loadSnapshot(): Promise<Snapshot> {
    try {
        const hdrs = await headers();
        const host = hdrs.get("host") ?? "localhost:3000";
        const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
        const res = await fetch(`${proto}://${host}/api/optimization/snapshot`, {
            cache: "no-store",
            headers: { cookie: hdrs.get("cookie") ?? "" },
        });
        if (!res.ok) return EMPTY;
        return await res.json();
    } catch {
        return EMPTY;
    }
}

function NotConfigured() {
    return (
        <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-200">
            <div className="mx-auto max-w-2xl rounded-xl border border-slate-800 bg-slate-900/60 p-8">
                <h1 className="font-serif text-3xl text-white">Optimization engine not configured</h1>
                <p className="mt-3 text-slate-400">
                    Run the SQL migration at <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs text-orange-300">repo/migrations/2026_05_12_optimization_system.sql</code> against the MCB Supabase project, set <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">SUPABASE_URL</code>, <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>, and <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">CRON_SECRET</code> in Vercel, then redeploy.
                </p>
            </div>
        </div>
    );
}
