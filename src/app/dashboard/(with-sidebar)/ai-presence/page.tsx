import type { Metadata } from "next";
import { Check, Minus, X } from "lucide-react";
import { PageHeader } from "@/components/dashboard/v2/PageHeader";
import { KpiCard } from "@/components/dashboard/v2/KpiCard";
import { CitationEntryForm } from "@/components/dashboard/v2/CitationEntryForm";
import {
  fetchBotCrawlSummary,
  fetchAiCitationSummary,
  fetchTrackedQuestions,
  fetchLatestCitationsByQuestion,
  formatPercent,
} from "@/lib/dashboard/v2/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Presence · MCB Dashboard",
  robots: { index: false, follow: false },
};

const ENGINES = ["chatgpt", "perplexity", "google_ai_mode"] as const;
const ENGINE_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  google_ai_mode: "Google AI",
  copilot: "Copilot",
  gemini: "Gemini",
};

export default async function AiPresencePage() {
  const [botSummary, citationSummary, questions, latestByQuestion] = await Promise.all([
    fetchBotCrawlSummary(),
    fetchAiCitationSummary(),
    fetchTrackedQuestions(),
    fetchLatestCitationsByQuestion(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI presence"
        subtitle="How AI search engines see MCB. Log a 10-minute weekly probe — paid Otterly Lite auto-probe can be enabled later with one env var."
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
              ? "no probes yet — use the form below"
              : `${citationSummary.mcb_cited_count_7d} of ${citationSummary.total_probes_7d} probes`
          }
        />
        <KpiCard
          label="Bot crawls · 7d"
          value={botSummary.total7d.toLocaleString("en-AU")}
          footer={
            botSummary.byBot.length === 0
              ? "no hits yet — middleware logs from PR 1"
              : `${botSummary.byBot.length} distinct bots`
          }
        />
        <KpiCard
          label="Tracked questions"
          value={questions.length}
          footer="seed via scripts/seed-tracked-questions.ts"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <article className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
              Latest probe status · {questions.length} questions × 3 engines
            </h2>
            {questions.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--color-mcb-warm-grey)]">
                No tracked questions yet. Run{" "}
                <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">
                  npx tsx scripts/seed-tracked-questions.ts
                </code>{" "}
                to seed the 30 from the research memo.
              </p>
            ) : (
              <div className="mt-4 max-h-[600px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
                      <th className="py-2 font-semibold">Question</th>
                      {ENGINES.map((e) => (
                        <th key={e} className="py-2 font-semibold text-center w-20">
                          {ENGINE_LABELS[e]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
                    {questions.map((q) => {
                      const inner = latestByQuestion.get(q.id);
                      return (
                        <tr key={q.id} className="hover:bg-[var(--color-mcb-sand)]">
                          <td className="py-2 pr-3 text-[var(--color-mcb-charcoal)] text-sm">
                            {q.question}
                          </td>
                          {ENGINES.map((e) => {
                            const row = inner?.get(e);
                            return (
                              <td key={e} className="py-2 text-center">
                                <CitationIcon status={statusOf(row)} />
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>

        <div className="xl:col-span-2">
          <CitationEntryForm questions={questions} />
        </div>
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
    </div>
  );
}

type ProbeStatus = "cited" | "competitor_only" | "nobody" | "unknown";

function statusOf(row: { mcb_cited: boolean; competitor_brands: string[] } | undefined): ProbeStatus {
  if (!row) return "unknown";
  if (row.mcb_cited) return "cited";
  if (row.competitor_brands && row.competitor_brands.length > 0) return "competitor_only";
  return "nobody";
}

function CitationIcon({ status }: { status: ProbeStatus }) {
  switch (status) {
    case "cited":
      return (
        <Check
          size={16}
          strokeWidth={2.5}
          className="inline-block text-[var(--color-mcb-sage-dark)]"
          aria-label="MCB cited"
        />
      );
    case "competitor_only":
      return (
        <Minus
          size={16}
          strokeWidth={2.5}
          className="inline-block text-[var(--color-mcb-clay)]"
          aria-label="Competitor cited, MCB not"
        />
      );
    case "nobody":
      return (
        <X
          size={16}
          strokeWidth={2.5}
          className="inline-block text-[var(--color-mcb-terracotta-red)]"
          aria-label="Nobody cited"
        />
      );
    case "unknown":
    default:
      return (
        <span
          className="inline-block text-[var(--color-mcb-warm-grey)] text-xs"
          aria-label="No probe yet"
        >
          ·
        </span>
      );
  }
}
