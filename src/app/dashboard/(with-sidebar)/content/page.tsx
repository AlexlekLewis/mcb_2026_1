import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { BacklogTable } from "@/components/dashboard/v2/BacklogTable";
import { fetchStaleContent, fetchBacklog } from "@/lib/dashboard/v2/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function ContentPage() {
  const [stale, backlog] = await Promise.all([fetchStaleContent(15), fetchBacklog("new", 30)]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Content"
        subtitle="The content engine — what to refresh, what to write next, what's been queued for review."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Refresh queue"
          value={stale.length}
          footer="cornerstone pages tracked in content_freshness"
        />
        <KpiCard
          label="New backlog items"
          value={backlog.length}
          footer="discovered by weekly cron, awaiting your call"
        />
        <KpiCard
          label="Briefs ready"
          value={0}
          footer="template-based generator wired in PR 3.5"
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
          Refresh queue
        </h2>
        <p className="text-sm text-[var(--color-mcb-warm-grey)]">
          Cornerstone pages ranked by{" "}
          <code className="font-mono text-xs">days_stale × ai_citations_30d</code>.
          Cache refreshed weekly by the freshness-sweep cron.
        </p>
        <div className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          {stale.length === 0 ? (
            <p className="text-sm text-[var(--color-mcb-warm-grey)]">
              No cornerstone pages registered yet. Seed{" "}
              <code className="font-mono text-xs">content_freshness</code> with the URLs
              you want tracked (PR 3.5 adds a UI for this).
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)] border-b border-[var(--color-mcb-sand-deep)]">
                  <th className="py-2 font-semibold">Page</th>
                  <th className="py-2 font-semibold text-right w-24">Stale</th>
                  <th className="py-2 font-semibold text-right w-32">AI cites · 30d</th>
                  <th className="py-2 font-semibold text-right w-32">Visits · 30d</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
                {stale.map((s) => (
                  <tr key={s.url} className="hover:bg-[var(--color-mcb-sand)]">
                    <td className="py-3 font-mono text-xs text-[var(--color-mcb-charcoal)]">
                      {s.url}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {s.days_stale === null ? "—" : `${s.days_stale}d`}
                    </td>
                    <td className="py-3 text-right tabular-nums">{s.ai_citations_30d}</td>
                    <td className="py-3 text-right tabular-nums">{s.visits_30d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-xl font-medium text-[var(--color-mcb-charcoal)]">
          Backlog · awaiting decision
        </h2>
        <p className="text-sm text-[var(--color-mcb-warm-grey)]">
          Questions surfaced by the weekly discovery cron. Approve to queue for
          a brief; reject to suppress.
        </p>
        <div className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <BacklogTable rows={backlog} />
        </div>
      </section>
    </div>
  );
}
