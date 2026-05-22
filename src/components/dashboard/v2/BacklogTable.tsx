"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { approveBacklogItem, rejectBacklogItem } from "@/lib/dashboard/v2/actions";
import type { BacklogRow } from "@/lib/dashboard/v2/data";

interface Props {
  rows: BacklogRow[];
}

export function BacklogTable({ rows }: Props) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const [localRows, setLocalRows] = useState<BacklogRow[]>(rows);

  function handleAction(id: number, action: "approve" | "reject") {
    setPendingId(id);
    startTransition(async () => {
      const fn = action === "approve" ? approveBacklogItem : rejectBacklogItem;
      const result = await fn(id);
      if (result.ok) {
        setLocalRows((prev) => prev.filter((r) => r.id !== id));
      }
      setPendingId(null);
    });
  }

  if (localRows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] bg-white/40 p-5 text-sm text-[var(--color-mcb-warm-grey)]">
        Backlog is empty. The weekly question-discovery cron (Mondays 23:00 UTC)
        scrapes PAA, Reddit and Whirlpool for new questions and queues them
        here for review.
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-[var(--color-mcb-warm-grey)] border-b border-[var(--color-mcb-sand-deep)]">
          <th className="py-2 font-semibold">Question</th>
          <th className="py-2 font-semibold w-20">Source</th>
          <th className="py-2 font-semibold text-right w-20">Score</th>
          <th className="py-2 font-semibold text-right w-40">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[var(--color-mcb-sand-deep)]">
        {localRows.map((r) => (
          <tr key={r.id} className="hover:bg-[var(--color-mcb-sand)]">
            <td className="py-3 pr-3 text-[var(--color-mcb-charcoal)]">
              {r.question}
              {r.source_url && (
                <a
                  href={r.source_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ml-2 inline-block text-[11px] text-[var(--color-mcb-warm-grey)] hover:text-[var(--color-mcb-terracotta-deep)]"
                >
                  source →
                </a>
              )}
            </td>
            <td className="py-3">
              <span className="rounded-full bg-[var(--color-mcb-sand)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-mcb-charcoal)]">
                {r.source}
              </span>
            </td>
            <td className="py-3 text-right tabular-nums">{r.total_score}</td>
            <td className="py-3">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleAction(r.id, "approve")}
                  disabled={pendingId === r.id}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--color-mcb-sage-dark)]/30 px-2.5 py-1 text-xs font-medium text-[var(--color-mcb-sage-dark)] hover:bg-[var(--color-mcb-state-good-bg)] transition-colors disabled:opacity-50"
                >
                  {pendingId === r.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Check size={12} strokeWidth={2.5} />
                  )}
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(r.id, "reject")}
                  disabled={pendingId === r.id}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--color-mcb-sand-deep)] px-2.5 py-1 text-xs font-medium text-[var(--color-mcb-warm-grey)] hover:bg-[var(--color-mcb-sand)] transition-colors disabled:opacity-50"
                >
                  <X size={12} strokeWidth={2.5} />
                  Reject
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
