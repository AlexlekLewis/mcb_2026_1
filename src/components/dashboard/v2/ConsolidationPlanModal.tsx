"use client";

import { useState } from "react";
import { Copy, X, FileText, Check } from "lucide-react";

interface Props {
  planMarkdown: string;
}

/**
 * Inline "View plan" panel that holds the generated consolidation
 * markdown. One-click copy to clipboard. Renders inline (not a modal) to
 * keep keyboard-nav simple.
 */
export function ConsolidationPlanPanel({ planMarkdown }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(planMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-mcb-terracotta-deep)] px-4 py-2 text-sm font-medium text-white hover:bg-[#6F4218] transition-colors"
      >
        <FileText size={14} strokeWidth={2} aria-hidden="true" />
        View consolidation plan
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--color-mcb-sand-deep)] px-5 py-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
          Consolidation plan
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-mcb-charcoal)]/15 px-2.5 py-1 text-xs font-medium text-[var(--color-mcb-charcoal)] hover:bg-[var(--color-mcb-sand)] transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} strokeWidth={2.5} className="text-[var(--color-mcb-sage-dark)]" />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} strokeWidth={2} />
                Copy markdown
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close plan"
            className="rounded-md p-1 text-[var(--color-mcb-warm-grey)] hover:bg-[var(--color-mcb-sand)] transition-colors"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
      <pre className="max-h-[600px] overflow-auto bg-[var(--color-mcb-paper)] p-5 text-xs leading-relaxed font-mono text-[var(--color-mcb-charcoal)]">
{planMarkdown}
      </pre>
    </div>
  );
}
