"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { trackEvent, trackImpression } from "@/lib/analytics";
import { quoteHref } from "@/lib/site";
import { useImpression } from "@/lib/hooks/useImpression";
import { cn } from "@/lib/utils";

/**
 * Shared quote CTA. All "Book Free Measure & Quote" buttons across the site
 * should funnel through this so we get consistent tracking, copy, and styling.
 *
 * Tracking emitted:
 *   cta_impression  fired ONCE per session (location + variant) when ≥50% visible
 *   quote_cta_click fired on click, with the same { location, variant, product_context }
 *
 * Variants control styling. Copy comes from the `label` prop (defaulted).
 */

export type CtaVariant =
  | "hero"
  | "section"
  | "sticky-mobile"
  | "sticky-desktop"
  | "inline"
  | "navbar"
  | "decision-card"
  | "mobile-menu";

export type CtaLocation = CtaVariant | (string & {});

type Props = {
  /**
   * Required. Where on the site this CTA appears. Used as the analytics `location`.
   * Use the standard variant strings unless you have a strong reason not to.
   */
  location: CtaLocation;
  /**
   * Optional experiment variant string. Pass the result of getVariant() if this
   * CTA is part of an A/B test.
   */
  experimentVariant?: string;
  /**
   * Pre-fill the quote form with a product context. Lands as ?product=... in URL.
   */
  productContext?: string;
  /**
   * Override the button label. Defaults to "Book Free Measure & Quote".
   */
  label?: ReactNode;
  /**
   * Style preset. Falls through to `location` if not set.
   */
  variant?: "primary" | "light" | "ghost" | "dark" | "link";
  /**
   * Hide the trailing arrow icon.
   */
  hideIcon?: boolean;
  /**
   * Tailwind class overrides.
   */
  className?: string;
  /**
   * Render the CTA with no impression-tracking ref (e.g. when nested in another
   * tracked container). Default false.
   */
  skipImpression?: boolean;
  /**
   * Extra payload merged into both the impression and click events.
   */
  extraPayload?: Record<string, string | number | boolean | undefined>;
  /**
   * Optional side-effect to run on click (e.g. closing a mobile menu).
   * Runs AFTER the analytics event fires.
   */
  onClick?: () => void;
};

const STYLES: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "inline-flex items-center gap-2 rounded-sm bg-mcb-terracotta-deep px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-stone-800",
  light:
    "inline-flex items-center gap-3 rounded-sm bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-mcb-charcoal transition-all duration-300 hover:bg-mcb-terracotta hover:text-white",
  ghost:
    "inline-flex items-center gap-2 rounded-sm border border-mcb-terracotta px-5 py-3 text-sm font-bold uppercase tracking-widest text-mcb-terracotta transition-colors hover:bg-mcb-terracotta hover:text-white",
  dark:
    "inline-flex items-center gap-2 rounded-sm bg-mcb-charcoal px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-colors hover:bg-mcb-terracotta",
  link:
    "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mcb-terracotta transition-colors hover:text-mcb-charcoal",
};

function variantPresetFor(location: CtaLocation): NonNullable<Props["variant"]> {
  switch (location) {
    case "hero":
      return "light";
    case "navbar":
    case "sticky-mobile":
    case "sticky-desktop":
    case "section":
    case "decision-card":
    case "mobile-menu":
      return "primary";
    case "inline":
      return "ghost";
    default:
      return "primary";
  }
}

export function PrimaryCTA({
  location,
  experimentVariant,
  productContext,
  label = "Book Free Measure & Quote",
  variant,
  hideIcon = false,
  className,
  skipImpression = false,
  extraPayload,
  onClick,
}: Props) {
  const styleKey = variant || variantPresetFor(location);

  const ref = useImpression<HTMLAnchorElement>(() => {
    trackImpression({
      location,
      variant: experimentVariant,
      product_context: productContext,
      ...extraPayload,
    });
  });

  const handleClick = () => {
    trackEvent("quote_cta_click", {
      location,
      variant: experimentVariant,
      product_context: productContext,
      source_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      has_product_context: Boolean(productContext),
      ...extraPayload,
    });
    onClick?.();
  };

  return (
    <Link
      ref={skipImpression ? undefined : ref}
      href={quoteHref(productContext)}
      onClick={handleClick}
      data-cta-location={location}
      data-cta-variant={experimentVariant}
      className={cn(STYLES[styleKey], className)}
    >
      {label}
      {hideIcon ? null : <ArrowRight size={18} />}
    </Link>
  );
}
