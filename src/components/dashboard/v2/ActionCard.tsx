import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  priority: number;
  title: string;
  reason: ReactNode;
  estimate?: string;
  cta: { label: string; href: string };
}

/**
 * Item in the "This week" auto-prioritised action queue on Home.
 *
 * One card per action. Single CTA. Time estimate visible so Alex can
 * pick something that fits the window he has.
 */
export function ActionCard({ priority, title, reason, estimate, cta }: ActionCardProps) {
  return (
    <article className="flex items-start gap-4 rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-4">
      <span
        aria-hidden="true"
        className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-mcb-sand)] text-xs font-semibold tabular-nums text-[var(--color-mcb-charcoal)]"
      >
        {priority}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium leading-snug text-[var(--color-mcb-charcoal)]">
          {title}
        </h3>
        <p className="mt-1 text-xs text-[var(--color-mcb-warm-grey)]">{reason}</p>
        {estimate && (
          <p className="mt-1 text-[11px] text-[var(--color-mcb-warm-grey)]">
            est. {estimate}
          </p>
        )}
      </div>
      <a
        href={cta.href}
        className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[var(--color-mcb-charcoal)]/15 px-3 py-1.5 text-xs font-medium text-[var(--color-mcb-charcoal)] hover:bg-[var(--color-mcb-sand)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-mcb-terracotta-deep)] focus-visible:ring-offset-2"
      >
        {cta.label}
        <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
      </a>
    </article>
  );
}
