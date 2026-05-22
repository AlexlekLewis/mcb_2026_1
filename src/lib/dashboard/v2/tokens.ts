/**
 * Dashboard v2 design tokens.
 *
 * Single source of truth for the redesigned admin dashboard's visual system.
 * Mirrors the design memo. Pull from here rather than hard-coding hex values
 * or Tailwind classes that duplicate these values.
 *
 * MCB brand tokens (clay, sage, sand, terracotta, charcoal, paper) come from
 * src/app/globals.css; the values here either reference those or derive new
 * neutrals that live inside the warm palette.
 */

// ---------------------------------------------------------------------
// Colour roles
// ---------------------------------------------------------------------

export const colors = {
  // Surfaces
  pageBg: "var(--color-mcb-paper)",            // #F9F8F6
  sidebarBg: "var(--color-mcb-charcoal)",      // #2D2D2D
  cardBg: "#FFFFFF",
  rowHoverBg: "var(--color-mcb-sand)",         // #F3EFE6

  // Borders / dividers (derived — see globals.css additions)
  border: "var(--color-mcb-sand-deep)",        // #E8E2D7
  borderStrong: "#D6CFC0",

  // Text
  text: "var(--color-mcb-charcoal)",           // #2D2D2D
  textMuted: "var(--color-mcb-warm-grey)",     // #6B6457
  textDisabled: "var(--color-mcb-warm-grey-light)", // #A39E92
  textOnDark: "#F3EFE6",

  // State (red/amber/green within warm palette)
  stateGood: "var(--color-mcb-sage-dark)",     // #748B69 — passes AA on white
  stateGoodBg: "#EAEFE5",                       // sage tint for chip bg
  stateAttention: "var(--color-mcb-terracotta)", // #B26E2D
  stateAttentionBg: "#F4E6D7",                  // clay tint for chip bg
  stateCritical: "var(--color-mcb-terracotta-red)", // #B23A2D — derived
  stateCriticalBg: "#F5DDD8",

  // Actions
  primaryAction: "var(--color-mcb-terracotta-deep)", // #8E5520
  primaryActionHover: "#6F4218",
  secondaryActionBorder: "var(--color-mcb-charcoal)",
} as const;

// ---------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------

export const type = {
  display: "font-serif text-5xl leading-[1.1] font-medium tracking-tight tabular-nums",
  h1: "font-serif text-3xl leading-tight font-medium",
  h2: "font-serif text-[22px] leading-tight font-medium",
  h3: "font-sans text-sm font-semibold uppercase tracking-wide text-[var(--color-mcb-warm-grey)]",
  body: "font-sans text-sm leading-[1.55] text-[var(--color-mcb-charcoal)]",
  bodyLg: "font-sans text-base leading-[1.55] text-[var(--color-mcb-charcoal)]",
  meta: "font-sans text-xs leading-tight font-medium text-[var(--color-mcb-warm-grey)]",
  metricSm: "font-sans text-2xl font-semibold tabular-nums leading-none",
  metricMd: "font-sans text-4xl font-medium tabular-nums leading-none",
  mono: "font-mono text-xs tabular-nums",
} as const;

// ---------------------------------------------------------------------
// Spacing scale (Tailwind-aligned)
// ---------------------------------------------------------------------

export const space = {
  iconGap: "gap-1",        // 4px
  tight: "gap-2",          // 8px
  cardRhythm: "space-y-3", // 12px
  default: "gap-4",        // 16px
  cardPadding: "p-6",      // 24px
  kpiPadding: "p-5",       // 20px
  betweenCards: "gap-6",   // 24px
  sectionRhythm: "space-y-8", // 32px
  pageTop: "pt-12",        // 48px
} as const;

// ---------------------------------------------------------------------
// Radii / shadows
// ---------------------------------------------------------------------

export const radii = {
  card: "rounded-xl",         // 12px
  chip: "rounded-full",
  button: "rounded-lg",       // 8px
  input: "rounded-md",        // 6px
} as const;

export const shadows = {
  cardHover: "shadow-[0_1px_3px_rgba(45,45,45,0.04)]",
  popover: "shadow-[0_4px_16px_rgba(45,45,45,0.08)]",
  none: "shadow-none",
} as const;

// ---------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------

export const motion = {
  hover: "transition-colors duration-150 ease-out",
  cardMount: { fade: 200, slide: 4, stagger: 40 }, // ms / px / ms
  pageEnter: 200,
} as const;

// ---------------------------------------------------------------------
// State threshold helpers
// ---------------------------------------------------------------------

export type State = "good" | "attention" | "critical" | "neutral";

export interface Threshold {
  good?: (v: number) => boolean;
  attention?: (v: number) => boolean;
  critical?: (v: number) => boolean;
}

export function classifyValue(value: number, t: Threshold): State {
  if (t.critical?.(value)) return "critical";
  if (t.attention?.(value)) return "attention";
  if (t.good?.(value)) return "good";
  return "neutral";
}

// Threshold presets for known KPIs
export const thresholds = {
  leadRate: {
    critical: (v: number) => v < 0.03,
    attention: (v: number) => v >= 0.03 && v < 0.05,
    good: (v: number) => v >= 0.05,
  },
  aiCitationSov: {
    critical: (v: number) => v < 0.08,
    attention: (v: number) => v >= 0.08 && v < 0.15,
    good: (v: number) => v >= 0.15,
  },
  // Bot crawl is binary: zero crawls from a known bot = critical
  botCrawlPresence: {
    critical: (v: number) => v === 0,
    good: (v: number) => v > 0,
  },
} as const;

// Map state → chip background + text colour pair for inline use.
export function stateChipClasses(state: State): { bg: string; text: string; ring: string } {
  switch (state) {
    case "good":
      return {
        bg: "bg-[var(--color-mcb-state-good-bg)]",
        text: "text-[var(--color-mcb-sage-dark)]",
        ring: "ring-[var(--color-mcb-sage-dark)]",
      };
    case "attention":
      return {
        bg: "bg-[var(--color-mcb-state-attention-bg)]",
        text: "text-[var(--color-mcb-terracotta-deep)]",
        ring: "ring-[var(--color-mcb-terracotta)]",
      };
    case "critical":
      return {
        bg: "bg-[var(--color-mcb-state-critical-bg)]",
        text: "text-[var(--color-mcb-terracotta-red)]",
        ring: "ring-[var(--color-mcb-terracotta-red)]",
      };
    case "neutral":
    default:
      return {
        bg: "bg-[var(--color-mcb-sand)]",
        text: "text-[var(--color-mcb-charcoal)]",
        ring: "ring-[var(--color-mcb-sand-deep)]",
      };
  }
}
