import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { fetchStaleContent } from "@/lib/dashboard/v2/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function ContentPage() {
  const stale = await fetchStaleContent(10);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Content"
        subtitle="The content engine — what to write next, what to refresh, what's working. Full surface wires up in PR 3."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Stale pages tracked"
          value={stale.length}
          footer={stale.length === 0 ? "none yet — cron seeds this in PR 3" : "in content_freshness"}
        />
        <KpiCard
          label="Backlog items"
          value={0}
          footer="weekly question discovery cron lands in PR 3"
        />
        <KpiCard
          label="Briefs ready to publish"
          value={0}
          footer="template-based brief generator in PR 3"
        />
      </section>

      {stale.length > 0 && (
        <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Refresh queue
          </h2>
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
                <th className="py-2 font-semibold">Page</th>
                <th className="py-2 font-semibold text-right">Stale</th>
                <th className="py-2 font-semibold text-right">AI cites · 30d</th>
                <th className="py-2 font-semibold text-right">Visits · 30d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
              {stale.map((s) => (
                <tr key={s.url} className="hover:bg-[var(--color-mcb-sand)]">
                  <td className="py-3 font-mono text-xs text-[var(--color-mcb-charcoal)]">{s.url}</td>
                  <td className="py-3 text-right tabular-nums">{s.days_stale ?? "—"}d</td>
                  <td className="py-3 text-right tabular-nums">{s.ai_citations_30d}</td>
                  <td className="py-3 text-right tabular-nums">{s.visits_30d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        <p>
          <strong>Coming in PR 3:</strong>{" "}
          full Refresh / Backlog / Briefs / Performance / Suburb-audit tabs,
          template-based brief generator (creates a starter brief from the
          tracked-question + recommended H2 structure + sources to cite),
          weekly PAA/Reddit/Whirlpool question-discovery cron.
        </p>
      </aside>
    </div>
  );
}
