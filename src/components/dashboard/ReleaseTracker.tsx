import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, ExternalLink, Minus, Rocket } from "lucide-react";
import type { ReleaseWithMetrics, ReleaseWindowMetrics } from "@/lib/dashboard/release-metrics";

interface Props {
  releases: ReleaseWithMetrics[];
}

/**
 * Renders a "what we shipped + did it work?" panel for the dashboard.
 *
 * For each release entry, shows the items shipped and a 3-column comparison
 * (24h / 48h / 7d) of headline metrics before vs after the release went live.
 */
export function ReleaseTracker({ releases }: Props) {
  if (releases.length === 0) {
    return (
      <section className="rounded-sm border border-stone-300 bg-white p-4 shadow-sm">
        <Header />
        <p className="rounded-sm bg-stone-50 p-4 text-sm text-stone-500">
          No releases logged yet. Add an entry to <code>src/lib/dashboard/releases.ts</code> when you ship something worth measuring.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-sm border border-stone-300 bg-white p-4 shadow-sm">
      <Header />
      <div className="space-y-6">
        {releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-stone-200 pb-3">
      <span className="text-mcb-terracotta [&_svg]:h-5 [&_svg]:w-5">
        <Rocket />
      </span>
      <h2 className="font-serif text-2xl text-mcb-charcoal">Releases &amp; Results</h2>
    </div>
  );
}

function ReleaseCard({ release }: { release: ReleaseWithMetrics }) {
  const releaseDate = new Date(release.releasedAt);
  const ageLabel = formatAge(release.hoursSinceRelease);

  return (
    <article className="rounded-sm border border-stone-200 bg-stone-50 p-4">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-mcb-charcoal">{release.title}</h3>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            Shipped {formatDateTime(releaseDate)} · {ageLabel}
          </p>
        </div>
        {release.commitUrl ? (
          <a
            href={release.commitUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-mcb-terracotta hover:text-mcb-charcoal"
          >
            Commit <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </header>

      <p className="mb-3 text-sm leading-relaxed text-stone-600">{release.summary}</p>

      <details className="mb-4">
        <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-mcb-terracotta">
          What shipped ({release.items.length})
        </summary>
        <ul className="mt-2 list-disc pl-5 text-sm text-stone-600">
          {release.items.map((item) => (
            <li key={item} className="mb-1">{item}</li>
          ))}
        </ul>
      </details>

      <div className="grid gap-3 md:grid-cols-3">
        {release.windows.map((window) => (
          <WindowComparison key={window.windowId} window={window} />
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-stone-500">
        Each column compares the {release.windows[0]?.windowLabel ?? "window"}-length period after the release to the same length immediately before. Bots are excluded; lead submissions are raw form completions.
      </p>
    </article>
  );
}

function WindowComparison({ window }: { window: ReleaseWindowMetrics }) {
  const rows: { label: string; key: keyof typeof window.before }[] = [
    { label: "Page views", key: "page_views" },
    { label: "CTA clicks", key: "quote_cta_clicks" },
    { label: "Phone taps", key: "phone_taps" },
    { label: "Leads", key: "leads" },
    { label: "Leads w/ gclid", key: "leads_with_gclid" },
  ];

  return (
    <div className="rounded-sm border border-stone-200 bg-white p-3">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold uppercase tracking-wide text-mcb-charcoal">{window.windowLabel}</span>
        {window.inProgress ? (
          <span className="rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
            In progress
          </span>
        ) : null}
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[11px] uppercase tracking-wider text-stone-500">
            <th className="pb-1 text-left font-bold">Metric</th>
            <th className="pb-1 text-right font-bold">Before</th>
            <th className="pb-1 text-right font-bold">After</th>
            <th className="pb-1 text-right font-bold">Δ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const before = window.before[row.key];
            const after = window.after[row.key];
            return (
              <tr key={row.label} className="border-t border-stone-100">
                <td className="py-1.5 text-stone-700">{row.label}</td>
                <td className="py-1.5 text-right font-mono text-xs text-stone-500">{before.toLocaleString()}</td>
                <td className="py-1.5 text-right font-mono text-xs text-stone-700">{after.toLocaleString()}</td>
                <td className="py-1.5 text-right font-mono text-xs">
                  <DeltaCell before={before} after={after} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DeltaCell({ before, after }: { before: number; after: number }) {
  if (before === 0 && after === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-stone-400">
        <Minus className="h-3 w-3" /> —
      </span>
    );
  }
  if (before === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-700">
        <ArrowUpRight className="h-3 w-3" /> new
      </span>
    );
  }
  const delta = after - before;
  const pct = Math.round((delta / before) * 100);
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-stone-500">
        <Minus className="h-3 w-3" /> 0%
      </span>
    );
  }
  const positive = delta > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${
        positive ? "text-emerald-700" : "text-rose-700"
      }`}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {positive ? "+" : ""}{pct}%
    </span>
  );
}

function formatAge(hours: number): ReactNode {
  if (hours < 1) return `${Math.round(hours * 60)} min ago`;
  if (hours < 48) return `${Math.round(hours)} hours ago`;
  return `${Math.round(hours / 24)} days ago`;
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Melbourne",
  }).format(date);
}
