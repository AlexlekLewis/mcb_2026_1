/**
 * Recharts theme for dashboard v2.
 *
 * Import these into any Recharts component to get the warm-palette MCB look
 * without sprinkling hex values across components. Designed for sparse,
 * confident charts — not Tableau-style dashboards.
 */

// Resolve CSS variables to hex at module load. Recharts wants concrete hex
// values for things like gradient stops, so we duplicate the canonical values
// here. If globals.css is the source of truth and we ever change a brand
// token, update this file too.
export const chartColors = {
  primary: "#8E5520",        // mcb-terracotta-deep
  secondary: "#748B69",      // mcb-sage-dark
  tertiary: "#C69C85",       // mcb-clay
  axis: "#6B6457",           // mcb-warm-grey
  grid: "#E8E2D7",           // mcb-sand-deep
  tooltipBg: "#FFFFFF",
  tooltipBorder: "#E8E2D7",
  text: "#2D2D2D",           // mcb-charcoal
} as const;

// Per-engine colours for the 3-engine citation breakdown.
export const engineColors = {
  chatgpt: chartColors.primary,
  perplexity: chartColors.secondary,
  google_ai_mode: chartColors.tertiary,
  copilot: "#5F7A8E",   // muted blue-grey, used sparingly only when 4th line is needed
  gemini: "#A98AB2",    // muted plum, same
} as const;

// Heatmap gradient — sand → terracotta-deep.
export const heatmapGradient = [
  { stop: 0,    color: "#F3EFE6" },
  { stop: 0.25, color: "#DBC4B5" },
  { stop: 0.5,  color: "#C69C85" },
  { stop: 0.75, color: "#B26E2D" },
  { stop: 1,    color: "#8E5520" },
] as const;

// Common Recharts props
export const axisStyle = {
  stroke: chartColors.axis,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const gridStyle = {
  stroke: chartColors.grid,
  strokeDasharray: "3 3",
  vertical: false,
} as const;

export const tooltipStyle = {
  contentStyle: {
    backgroundColor: chartColors.tooltipBg,
    border: `1px solid ${chartColors.tooltipBorder}`,
    borderRadius: 12,
    padding: 12,
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: 12,
    color: chartColors.text,
    boxShadow: "0 4px 16px rgba(45,45,45,0.08)",
  },
  cursor: { stroke: chartColors.grid, strokeWidth: 1 },
} as const;

// Pick the right colours for an N-series chart. 1 → primary; 2 → primary +
// secondary; 3 → all three. >3 throws to force a small-multiples decision.
export function seriesColors(n: number): readonly string[] {
  switch (n) {
    case 1: return [chartColors.primary];
    case 2: return [chartColors.primary, chartColors.secondary];
    case 3: return [chartColors.primary, chartColors.secondary, chartColors.tertiary];
    default:
      throw new Error(
        `chartTheme.seriesColors: ${n} series exceeds the 3-colour rule. Use small multiples or per-series facets instead.`,
      );
  }
}
