import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { fetchBotCrawlSummary, fetchAiCitationSummary, formatPercent } from "@/lib/dashboard/v2/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Presence · MCB Dashboard",
  robots: { index: false, follow: false },
};

export default async function AiPresencePage() {
  const [botSummary, citationSummary] = await Promise.all([
    fetchBotCrawlSummary(),
    fetchAiCitationSummary(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI presence"
        subtitle="How AI search engines see MCB — citations, bots, competitors. Full surface wires up in PR 3."
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Citation SoV · 7d"
          value={
            citationSummary.total_probes_7d === 0
              ? "—"
              : formatPercent(citationSummary.share_of_voice_7d)
          }
          footer={
            citationSummary.total_probes_7d === 0
              ? "no probes yet — manual entry UI in PR 3"
              : `${citationSummary.mcb_cited_count_7d} of ${citationSummary.total_probes_7d} probes`
          }
        />
        <KpiCard
          label="Bot crawls · 7d"
          value={botSummary.total7d.toLocaleString("en-AU")}
          footer={
            botSummary.byBot.length === 0
              ? "no hits yet — middleware logs from PR 1 deploy"
              : `${botSummary.byBot.length} distinct bots`
          }
        />
        <KpiCard
          label="Tracked questions"
          value={30}
          footer="seeded by scripts/seed-tracked-questions.ts"
        />
      </section>

      {botSummary.byBot.length > 0 && (
        <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            AI bots seen · last 7 days
          </h2>
          <ul className="mt-4 divide-y divide-[var(--color-mcb-sand-deep)]">
            {botSummary.byBot.map((b) => (
              <li key={b.bot_id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-mono text-xs text-[var(--color-mcb-charcoal)]">{b.bot_id}</span>
                <span className="tabular-nums font-medium">{b.hits_7d.toLocaleString("en-AU")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <aside className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        <p>
          <strong>Coming in PR 3:</strong>{" "}
          per-engine SoV trend chart, question × engine citation grid, manual
          citation entry UI (10 min/week to record what ChatGPT, Perplexity and
          Google AI cited for the 30 tracked questions — paid Otterly Lite
          auto-probe can be flipped on later with one env var), competitor
          citation frequency.
        </p>
      </aside>
    </div>
  );
}
