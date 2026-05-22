"use client";

import { useState, useTransition } from "react";
import { Star, Check, Loader2 } from "lucide-react";
import { markReviewPosted, dismissReview, addManualReview } from "@/lib/dashboard/v2/actions";

export interface ReviewRow {
  id: number;
  reviewer_name: string | null;
  rating: number | null;
  review_text: string | null;
  review_created_at: string | null;
}

interface Props {
  rows: ReviewRow[];
}

export function ReviewInbox({ rows }: Props) {
  const [localRows, setLocalRows] = useState<ReviewRow[]>(rows);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState("");
  const [, startTransition] = useTransition();

  function handlePost(id: number) {
    if (!responseText.trim()) return;
    setPendingId(id);
    startTransition(async () => {
      const result = await markReviewPosted({ id, postedResponse: responseText });
      if (result.ok) {
        setLocalRows((prev) => prev.filter((r) => r.id !== id));
        setOpenId(null);
        setResponseText("");
      }
      setPendingId(null);
    });
  }

  function handleDismiss(id: number) {
    setPendingId(id);
    startTransition(async () => {
      const result = await dismissReview(id);
      if (result.ok) {
        setLocalRows((prev) => prev.filter((r) => r.id !== id));
      }
      setPendingId(null);
    });
  }

  if (localRows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        No reviews pending response. Use the form below to log one manually.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {localRows.map((r) => (
        <li key={r.id} className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-[var(--color-mcb-charcoal)]">
                  {r.reviewer_name ?? "Anonymous"}
                </span>
                {r.rating && (
                  <span className="inline-flex items-center gap-0.5 text-[var(--color-mcb-clay)]">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                )}
                {r.review_created_at && (
                  <span className="text-xs text-[var(--color-mcb-warm-grey)]">
                    · {new Date(r.review_created_at).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              {r.review_text && (
                <p className="mt-2 text-sm text-[var(--color-mcb-charcoal)] leading-relaxed">
                  {r.review_text}
                </p>
              )}
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setOpenId(openId === r.id ? null : r.id);
                  setResponseText("");
                }}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-mcb-terracotta-deep)]/30 px-2.5 py-1 text-xs font-medium text-[var(--color-mcb-terracotta-deep)] hover:bg-[var(--color-mcb-state-attention-bg)]"
              >
                {openId === r.id ? "Close" : "Respond"}
              </button>
              <button
                type="button"
                onClick={() => handleDismiss(r.id)}
                disabled={pendingId === r.id}
                className="inline-flex items-center gap-1 text-[10px] text-[var(--color-mcb-warm-grey)] hover:text-[var(--color-mcb-terracotta-red)] disabled:opacity-50"
              >
                Dismiss
              </button>
            </div>
          </div>

          {openId === r.id && (
            <div className="mt-4 border-t border-[var(--color-mcb-sand-deep)] pt-4">
              <label className="block">
                <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1.5">
                  Your response (paste after posting to GBP)
                </span>
                <textarea
                  rows={3}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
                  placeholder="Thanks, Sarah — really glad the install went smoothly..."
                />
              </label>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => handlePost(r.id)}
                  disabled={pendingId === r.id || !responseText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-mcb-terracotta-deep)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#6F4218] disabled:opacity-50"
                >
                  {pendingId === r.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Check size={12} strokeWidth={2.5} />
                  )}
                  Mark as posted
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function AddManualReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    startTransition(async () => {
      const result = await addManualReview({
        reviewerName: name.trim(),
        rating,
        reviewText: text.trim(),
      });
      if (result.ok) {
        setFeedback("Logged");
        setName("");
        setText("");
        setRating(5);
      } else {
        setFeedback(result.error ?? "Failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
        Log a review manually
      </h3>
      <p className="mt-1 text-xs text-[var(--color-mcb-warm-grey)]">
        Until the GBP API pull cron is wired (needs OAuth setup), log new
        reviews here so they appear in the pending queue.
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1">Reviewer name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1">Rating</span>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 block">
        <span className="block text-xs font-medium text-[var(--color-mcb-charcoal)] mb-1">Review text</span>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full rounded-md border border-[var(--color-mcb-sand-deep)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-mcb-terracotta-deep)]"
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !name.trim() || !text.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-mcb-terracotta-deep)] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#6F4218] disabled:opacity-50"
        >
          {pending && <Loader2 size={12} className="animate-spin" />}
          {pending ? "Saving…" : "Add to queue"}
        </button>
        {feedback && <span className="text-xs text-[var(--color-mcb-warm-grey)]">{feedback}</span>}
      </div>
    </form>
  );
}
