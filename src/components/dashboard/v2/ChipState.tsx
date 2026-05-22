import type { ReactNode } from "react";
import { Check, AlertTriangle, AlertCircle, Minus } from "lucide-react";
import type { State } from "@/lib/dashboard/v2/tokens";

interface ChipStateProps {
  state: State;
  children: ReactNode;
  size?: "sm" | "md";
}

const ICONS: Record<State, typeof Check> = {
  good: Check,
  attention: AlertTriangle,
  critical: AlertCircle,
  neutral: Minus,
};

const CLASSES: Record<State, { bg: string; text: string }> = {
  good: {
    bg: "bg-[var(--color-mcb-state-good-bg)]",
    text: "text-[var(--color-mcb-sage-dark)]",
  },
  attention: {
    bg: "bg-[var(--color-mcb-state-attention-bg)]",
    text: "text-[var(--color-mcb-terracotta-deep)]",
  },
  critical: {
    bg: "bg-[var(--color-mcb-state-critical-bg)]",
    text: "text-[var(--color-mcb-terracotta-red)]",
  },
  neutral: {
    bg: "bg-[var(--color-mcb-sand)]",
    text: "text-[var(--color-mcb-charcoal)]",
  },
};

/**
 * Coloured state chip. Always pairs colour with an icon — never colour alone,
 * for colourblind users + screen readers.
 */
export function ChipState({ state, children, size = "md" }: ChipStateProps) {
  const Icon = ICONS[state];
  const { bg, text } = CLASSES[state];
  const sizing =
    size === "sm"
      ? "px-2 py-0.5 text-[10px] gap-1"
      : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium tabular-nums ${bg} ${text} ${sizing}`}
      role="status"
    >
      <Icon size={size === "sm" ? 10 : 12} strokeWidth={2.5} aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
