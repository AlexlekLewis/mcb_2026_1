"use client";

import { useState, useTransition } from "react";
import { recordCitation } from "@/lib/dashboard/v2/actions";
import type { TrackedQuestion } from "@/lib/dashboard/v2/data";
import { Check, ChevronDown, Loader2, X } from "lucide-react";

interface Props {
  questions: TrackedQuestion[];
}

const ENGINES = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "perplexity", label: "Perplexity" },
  { value: "google_ai_mode", label: "Google AI Mode" },
  { value: "copilot", label: "Copilot" },
  { value: "gemini", label: "Gemini" },
] as const;

type EngineValue = (typeof ENGINES)[number]["value"];

/**
 * Manual citation entry form for the weekly probe ritual.
 *
 * Flow:
 *   1. Pick a tracked question
 *   2. Pick an engine
 *   3. Tick "MCB cited" yes/no
 *   4. Optionally paste the cited URL and competitor brand names
 *   5. Submit — row inserted into ai_citations via server action
 *
 * The form is a single screen for fast repeated entry — minimal friction.
 */
export function CitationEntryForm({ questions }: Props) {
  const [questionId, setQuestionId] = useState<number | "">("");
  const [engine, setEngine] = useState<EngineValue>("chatgpt");
  const [mcbCited, setMcbCited] = useState<boolean>(false);
  const [citedUrl, setCitedUrl] = useState("");
  const [competitorsText, setCompetitorsText] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function reset() {
    setMcbCited(false);
    setCitedUrl("");
    setCompetitorsText("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!questionId) {
      setFeedback({ ok: false, message: "Pick a question first" });
      return;
    }
    const competitorBrands = competitorsText
      .split(/[,;\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      const result = await recordCitation({
        questionId: questionId as number,
        engine,
        mcbCited,
        mcbCitedUrl: citedUrl.trim() || undefined,
        competitorBrands,
      });
      if (result.ok) {
        setFeedback({ ok: true, message: "Recorded — pick the next engine/question" });
        reset();
      } else {
        setFeedback({ ok: false, message: result.error });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-5"
    >
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
        Log a probe
      </h3>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1.5">
            Question
          </span>
          <div className="relative">
            <select
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value ? Number(e.target.value) : "")}
              className="w-full appearance-none rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 pr-8 text-sm text-[var(--color-mcb-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
              required
            >
              <option value="">— pick one —</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.question}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-mcb-warm-grey)]"
            />
          </div>
        </label>

        <label className="block">
          <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1.5">
            Engine
          </span>
          <div className="flex flex-wrap gap-2">
            {ENGINES.map((e) => (
              <button
                key={e.value}
                type="button"
                onClick={() => setEngine(e.value)}
                className={[
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  engine === e.value
                    ? "border-[var(--color-mcb-terracotta-deep)] bg-[var(--color-mcb-state-attention-bg)] text-[var(--color-mcb-terracotta-deep)]"
                    : "border-[var(--color-mcb-sand-deep)] bg-white text-[var(--color-mcb-charcoal)] hover:bg-[var(--color-mcb-sand)]",
                ].join(" ")}
              >
                {e.label}
              </button>
            ))}
          </div>
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-medium text-[var(--color-mcb-charcoal)] mb-2">
          Was MCB cited?
        </legend>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMcbCited(true)}
            className={[
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              mcbCited
                ? "border-[var(--color-mcb-sage-dark)] bg-[var(--color-mcb-state-good-bg)] text-[var(--color-mcb-sage-dark)]"
                : "border-[var(--color-mcb-sand-deep)] bg-white text-[var(--color-mcb-warm-grey)] hover:bg-[var(--color-mcb-sand)]",
            ].join(" ")}
          >
            <Check size={14} strokeWidth={2.5} />
            Yes, cited
          </button>
          <button
            type="button"
            onClick={() => setMcbCited(false)}
            className={[
              "inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
              !mcbCited
                ? "border-[var(--color-mcb-terracotta-red)] bg-[var(--color-mcb-state-critical-bg)] text-[var(--color-mcb-terracotta-red)]"
                : "border-[var(--color-mcb-sand-deep)] bg-white text-[var(--color-mcb-warm-grey)] hover:bg-[var(--color-mcb-sand)]",
            ].join(" ")}
          >
            <X size={14} strokeWidth={2.5} />
            Not cited
          </button>
        </div>
      </fieldset>

      {mcbCited && (
        <label className="mt-4 block">
          <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1.5">
            URL that was cited <span className="text-[var(--color-mcb-warm-grey)] font-normal">(optional)</span>
          </span>
          <input
            type="url"
            value={citedUrl}
            onChange={(e) => setCitedUrl(e.target.value)}
            placeholder="https://moderncurtainsandblinds.com.au/..."
            className="w-full rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 text-sm font-mono text-[var(--color-mcb-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
          />
        </label>
      )}

      <label className="mt-4 block">
        <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1.5">
          Competitor brands cited
          <span className="text-[var(--color-mcb-warm-grey)] font-normal"> (comma- or line-separated)</span>
        </span>
        <textarea
          value={competitorsText}
          onChange={(e) => setCompetitorsText(e.target.value)}
          rows={2}
          placeholder="Luxaflex, DIY Blinds, Spotlight, ..."
          className="w-full rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 text-sm text-[var(--color-mcb-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
        />
      </label>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !questionId}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-mcb-terracotta-deep)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#6F4218] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
          {pending ? "Saving…" : "Record probe"}
        </button>
        {feedback && (
          <span
            className={`text-xs ${feedback.ok ? "text-[var(--color-mcb-sage-dark)]" : "text-[var(--color-mcb-terracotta-red)]"}`}
          >
            {feedback.message}
          </span>
        )}
      </div>
    </form>
  );
}
