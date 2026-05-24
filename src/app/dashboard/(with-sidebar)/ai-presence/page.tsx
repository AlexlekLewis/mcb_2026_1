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
  fetchAnswerPerformance,
  fetchLatestSkillRun,
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
  const [
    botSummary,
    citationSummary,
    questions,
    latestByQuestion,
    answerPerformance,
    latestSkillRun,
  ] = await Promise.all([
    fetchBotCrawlSummary(),
    fetchAiCitationSummary(),
    fetchTrackedQuestions(),
    fetchLatestCitationsByQuestion(),
    fetchAnswerPerformance(),
    fetchLatestSkillRun(),
  ]);
  const answeredQuestionIds = new Set(answerPerformance.map((r) => r.question_id));

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
                      <th className="py-2 font-semibold text-center w-20">Answered</th>
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
                      const answered = answeredQuestionIds.has(q.id);
                      return (
                        <tr key={q.id} className="hover:bg-[var(--color-mcb-sand)]">
                          <td className="py-2 pr-3 text-[var(--color-mcb-charcoal)] text-sm">
                            {q.question}
                          </td>
                          <td className="py-2 text-center">
                            {answered ? (
                              <Check
                                size={16}
                                strokeWidth={2.5}
                                className="inline-block text-[var(--color-mcb-sage-dark)]"
                                aria-label="Answer published"
                              />
                            ) : (
                              <span
                                className="inline-block text-[var(--color-mcb-warm-grey)] text-xs"
                                aria-label="No answer yet"
                              >
                                ·
                              </span>
                            )}
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

      {/* Content performance — reads from answer_performance view */}
      <section className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            Content performance · per published answer
          </h2>
          {latestSkillRun ? (
            <span className="text-xs text-[var(--color-mcb-warm-grey)]">
              Last run: {new Date(latestSkillRun.started_at).toLocaleDateString("en-AU")}
              {" · "}
              {latestSkillRun.pieces_published} published
              {" · "}
              status {latestSkillRun.status}
            </span>
          ) : (
            <span className="text-xs text-[var(--color-mcb-warm-grey)]">
              No skill runs yet
            </span>
          )}
        </div>
        {answerPerformance.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-mcb-warm-grey)]">
            No published answers yet. First weekly run of the AI Content Engine
            will populate this table. See{" "}
            <code className="font-mono text-xs text-[var(--color-mcb-charcoal)]">
              .claude/skills/ai-content-engine
            </code>
            .
          </p>
        ) : (
          <div className="mt-4 max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
                  <th className="py-2 font-semibold">Question</th>
                  <th className="py-2 font-semibold">Anchor</th>
                  <th className="py-2 font-semibold text-right w-16">Age</th>
                  <th className="py-2 font-semibold text-right w-20">
                    AI bots
                    <br />
                    <span className="font-normal normal-case text-[10px]">7d / 30d</span>
                  </th>
                  <th className="py-2 font-semibold text-right w-20">
                    Views
                    <br />
                    <span className="font-normal normal-case text-[10px]">7d / 30d</span>
                  </th>
                  <th className="py-2 font-semibold text-right w-20">
                    Leads
                    <br />
                    <span className="font-normal normal-case text-[10px]">30d</span>
                  </th>
                  <th className="py-2 font-semibold text-center w-16">Cited?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
                {answerPerformance.map((row) => (
                  <tr key={row.registry_id} className="hover:bg-[var(--color-mcb-sand)]">
                    <td className="py-2 pr-3 text-[var(--color-mcb-charcoal)] text-sm align-top">
                      {row.question_text}
                    </td>
                    <td className="py-2 pr-3 align-top">
                      <a
                        href={row.full_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-[var(--color-mcb-terracotta)] hover:underline"
                      >
                        {row.full_url}
                      </a>
                    </td>
                    <td className="py-2 text-right tabular-nums text-xs text-[var(--color-mcb-warm-grey)] align-top">
                      {row.days_since_publish}d
                    </td>
                    <td className="py-2 text-right tabular-nums text-sm align-top">
                      <span className="text-[var(--color-mcb-charcoal)]">
                        {row.ai_bot_hits_7d.toLocaleString("en-AU")}
                      </span>
                      <span className="text-[var(--color-mcb-warm-grey)]">
                        {" / "}
                        {row.ai_bot_hits_30d.toLocaleString("en-AU")}
                      </span>
                    </td>
                    <td className="py-2 text-right tabular-nums text-sm align-top">
                      <span className="text-[var(--color-mcb-charcoal)]">
                        {row.page_views_7d.toLocaleString("en-AU")}
                      </span>
                      <span className="text-[var(--color-mcb-warm-grey)]">
                        {" / "}
                        {row.page_views_30d.toLocaleString("en-AU")}
                      </span>
                    </td>
                    <td className="py-2 text-right tabular-nums text-sm align-top">
                      <span
                        className={
                          row.leads_attributed_30d > 0
                            ? "font-medium text-[var(--color-mcb-sage-dark)]"
                            : "text-[var(--color-mcb-warm-grey)]"
                        }
                      >
                        {row.leads_attributed_30d}
                      </span>
                    </td>
                    <td className="py-2 text-center align-top">
                      {row.latest_cited === true ? (
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className="inline-block text-[var(--color-mcb-sage-dark)]"
                          aria-label="Cited"
                        />
                      ) : row.latest_cited === false ? (
                        <X
                          size={16}
                          strokeWidth={2.5}
                          className="inline-block text-[var(--color-mcb-terracotta-red)]"
                          aria-label="Not cited"
                        />
                      ) : (
                        <span className="text-[var(--color-mcb-warm-grey)] text-xs">·</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {latestSkillRun?.hypothesis ? (
          <p className="mt-4 text-xs text-[var(--color-mcb-warm-grey)] italic">
            Hypothesis this cycle: {latestSkillRun.hypothesis}
          </p>
        ) : null}
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
