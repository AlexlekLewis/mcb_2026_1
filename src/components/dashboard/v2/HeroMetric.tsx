import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Sparkline } from "./Sparkline";
import { ChipState } from "./ChipState";
import type { State } from "@/lib/dashboard/v2/tokens";

interface HeroMetricProps {
  label: string;
  value: number | string;
  sparklineData: ReadonlyArray<number>;
  deltaLabel?: string;
  deltaDirection?: "up" | "down" | "flat";
  state?: State;
  footer?: ReactNode;
  cta?: { label: string; href: string };
}

/**
 * The single hero number on Home: leads (28d) + sparkline + delta vs prior.
 *
 * Big number, big sparkline, no axes — at MCB's volume axes lie. Trend
 * shape carries the message, the delta chip carries the direction.
 */
export function HeroMetric({
  label,
  value,
  sparklineData,
  deltaLabel,
  deltaDirection,
  state = "neutral",
  footer,
  cta,
}: HeroMetricProps) {
  const sparklineColor =
    state === "good"
      ? "var(--color-mcb-sage-dark)"
      : state === "critical"
      ? "var(--color-mcb-terracotta-red)"
      : "var(--color-mcb-terracotta-deep)";

  return (
    <article className="rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
            {label}
          </h2>
          <div className="mt-3 flex items-baseline gap-4">
            <span className="font-serif text-5xl leading-[1.1] font-medium tabular-nums text-[var(--color-mcb-charcoal)]">
              {value}
            </span>
            {deltaLabel && (
              <ChipState state={state}>
                {deltaDirection === "up" && <ArrowUp size={12} strokeWidth={3} aria-label="up" />}
                {deltaDirection === "down" && <ArrowDown size={12} strokeWidth={3} aria-label="down" />}
                {deltaDirection === "flat" && <Minus size={12} strokeWidth={3} aria-label="flat" />}
                {deltaLabel}
              </ChipState>
            )}
          </div>
        </div>
        {cta && (
          <a
            href={cta.href}
            className="shrink-0 text-xs font-medium text-[var(--color-mcb-terracotta-deep)] hover:text-[#6F4218] transition-colors"
          >
            {cta.label} →
          </a>
        )}
      </div>

      <div className="mt-5">
        <Sparkline
          data={sparklineData}
          color={sparklineColor}
          height={64}
          strokeWidth={2}
          ariaLabel={`${label} sparkline`}
        />
      </div>

      {footer && (
        <p className="mt-3 text-xs text-[var(--color-mcb-warm-grey)]">{footer}</p>
      )}
    </article>
  );
}
