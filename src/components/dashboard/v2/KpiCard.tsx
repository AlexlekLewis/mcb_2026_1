import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { ChipState } from "./ChipState";
import { Sparkline } from "./Sparkline";
import type { State } from "@/lib/dashboard/v2/tokens";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  state?: State;
  deltaLabel?: string;
  deltaDirection?: "up" | "down" | "flat";
  sparklineData?: ReadonlyArray<number>;
  footer?: ReactNode;
  href?: string;
}

/**
 * Standard KPI tile used in the 4-up secondary row on Home and elsewhere.
 *
 * Threshold ring (2px inside-left) reflects the `state` — sage / clay / red
 * within MCB's warm palette. Always pairs colour with the icon in the delta
 * chip — never colour alone.
 */
export function KpiCard({
  label,
  value,
  state = "neutral",
  deltaLabel,
  deltaDirection,
  sparklineData,
  footer,
  href,
}: KpiCardProps) {
  const ringColor =
    state === "good"
      ? "before:bg-[var(--color-mcb-sage-dark)]"
      : state === "attention"
      ? "before:bg-[var(--color-mcb-terracotta)]"
      : state === "critical"
      ? "before:bg-[var(--color-mcb-terracotta-red)]"
      : "before:bg-transparent";

  const inner = (
    <article
      className={[
        "relative h-full overflow-hidden rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white p-5",
        "before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-r-full",
        ringColor,
        href
          ? "transition-shadow duration-150 hover:shadow-[0_1px_3px_rgba(45,45,45,0.04)] cursor-pointer"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]">
          {label}
        </h3>
      </div>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-2xl font-semibold tabular-nums leading-none text-[var(--color-mcb-charcoal)]">
          {value}
        </span>
        {deltaLabel && (
          <ChipState state={state} size="sm">
            <DeltaIcon direction={deltaDirection} />
            {deltaLabel}
          </ChipState>
        )}
      </div>

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3">
          <Sparkline
            data={sparklineData}
            color={
              state === "good"
                ? "var(--color-mcb-sage-dark)"
                : state === "critical"
                ? "var(--color-mcb-terracotta-red)"
                : "var(--color-mcb-terracotta-deep)"
            }
            ariaLabel={`${label} trend`}
            height={32}
          />
        </div>
      )}

      {footer && (
        <p className="mt-3 text-[11px] text-[var(--color-mcb-warm-grey)]">{footer}</p>
      )}
    </article>
  );

  if (href) {
    return (
      <a href={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-mcb-terracotta-deep)] focus-visible:ring-offset-2 rounded-xl">
        {inner}
      </a>
    );
  }
  return inner;
}

function DeltaIcon({ direction }: { direction?: "up" | "down" | "flat" }) {
  if (direction === "up") return <ArrowUp size={10} strokeWidth={3} aria-label="up" />;
  if (direction === "down") return <ArrowDown size={10} strokeWidth={3} aria-label="down" />;
  if (direction === "flat") return <Minus size={10} strokeWidth={3} aria-label="flat" />;
  return null;
}
