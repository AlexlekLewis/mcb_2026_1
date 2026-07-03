import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sheer Curtains Melbourne | Modern Curtains and Blinds",
  description:
    "Custom sheer curtains supplied and installed across Melbourne. S-fold and wave-fold sheer curtains, indicative pricing $3,000–$4,000 whole-house. Free in-home measure and quote.",
  alternates: { canonical: "/curtains/sheer" },
};

export default function SheerCurtainsPage() {
  return (
    <ProductTemplate
      nearbyLocations={getNearbyLocations("curtains", 8)}
      title="Sheer Curtains Melbourne"
      subtitle="Soft, filtered daylight and daytime privacy."
      heroImage="/images/product-unique/mcb-sheer-curtains-soft-light-hero.webp"
      description="Sheer curtains are what you fit when you want soft, filtered daylight, daytime privacy from the street, and the look of fabric softening a window. We fit them every day in main bedrooms, formal living rooms, and the front-facing rooms of growth-corridor new builds."
      intentLabel="Soft daytime light and privacy"
      features={[
        {
          title: "S-Fold & Wave-Fold",
          description:
            "The modern heading — even, soft, ceiling-mounted folds that hang straight to the floor. We confirm whether your ceiling suits an S-fold track or needs a pelmet at the measure.",
        },
        {
          title: "Daytime Privacy",
          description:
            "Filtered light through the day with effective privacy from the street, without closing the room off or losing the view to hard blinds.",
        },
        {
          title: "Layers Beautifully",
          description:
            "Sheers pair with a blockout roller or blockout curtain for full nighttime darkness — a softer look than a double-roller bracket.",
        },
      ]}
      decisionGuide={[
        {
          title: "Sheers on their own",
          description:
            "Best for formal lounges and front-facing rooms that only need daytime softness and privacy.",
        },
        {
          title: "S-fold vs pinch pleat",
          description:
            "S-fold and wave-fold read modern but need a square-set ceiling or pelmet; pinch pleat suits almost any cornice ceiling without modification.",
        },
        {
          title: "Layer for darkness",
          description:
            "For bedrooms, media rooms and pooja rooms, layer sheers over a blockout roller or curtain for full nighttime darkness.",
        },
      ]}
      comparisonRows={[
        {
          label: "S-fold / wave-fold",
          bestFor: "Modern new-build look",
          notes: "Even ceiling-mounted folds. Needs a square-set ceiling or a custom pelmet.",
        },
        {
          label: "Pinch pleat",
          bestFor: "Traditional ceilings",
          notes: "Gathered heading behind a cornice — works on almost any ceiling without modification.",
        },
        {
          label: "Sheer + blockout layered",
          bestFor: "Day light + night darkness",
          notes: "Sheer drawn by day, blockout closed at night — softer than a double-roller bracket.",
        },
      ]}
      types={[
        {
          title: "S-Fold Sheers",
          description:
            "Soft, even S-shaped folds from a ceiling-mounted track — the modern look most new-build buyers want, on a square-set ceiling or pelmet.",
          image: "/images/product-unique/mcb-s-fold-curtain-wave-heading-detail.webp",
          href: "/curtains/s-fold-curtains",
        },
        {
          title: "Wave-Fold Sheers",
          description:
            "A continuous, consistent wave heading that suits large floor-to-ceiling windows and clean architectural spans.",
          image: "/images/product-unique/mcb-wavefold-curtains-track-heading-detail.webp",
        },
        {
          title: "Sheer + Blockout Layered",
          description:
            "A sheer front layer for daytime softness with a blockout back layer that closes for full nighttime privacy and darkness.",
          image: "/images/product-unique/mcb-double-curtains-sheer-layer-detail.webp",
          href: "/curtains/double-curtains",
        },
      ]}
      internalLinks={{
        title: "Related curtains & layering options",
        links: [
          { label: "Curtains overview", href: "/curtains" },
          { label: "Blockout curtains", href: "/curtains/blockout" },
          { label: "Blockout roller blinds", href: "/blinds/roller-blinds/blockout" },
          { label: "Pooja & prayer-room blackout", href: "/guides/pooja-prayer-room-blackout-curtains-australia" },
          { label: "Pricing policy", href: "/pricing-policy" },
        ],
      }}
      faq={[
        {
          question: "How much do sheer curtains cost for a 3-bedroom home in Melbourne?",
          answer:
            "For a typical three-bedroom home, sheer curtains supplied and installed sit at $3,000 to $4,000 — S-fold or wave-fold, standard fabric, standard installation across the main living and bedroom windows. This is indicative only, based on our standard baseline configuration as at 2026; your written quote after the free in-home measure is the binding figure.",
        },
        {
          question: "Can I layer sheer curtains over a blockout roller blind?",
          answer:
            "Yes. Sheer + blockout layered is one of the most common configurations we fit in Melbourne homes, especially in the main bedroom and formal living room. The sheer is drawn during the day for soft light and privacy; the blockout closes for full nighttime darkness. It's the softer alternative to a double-roller bracket.",
        },
        {
          question: "How private are sheer curtains at night?",
          answer:
            "With the lights on at night, sheer curtains show silhouettes from outside — not detail — but on tight-frontage growth-corridor lots that's not enough on its own. Layer sheers over a blockout roller or blockout curtain for full nighttime privacy. For daytime use, sheers maintain effective privacy from the street while letting filtered light through.",
        },
        {
          question: "What's the difference between S-fold and pinch pleat sheer curtains?",
          answer:
            "S-fold curtains hang from a ceiling-mounted track in soft, even S-shape folds, which is the modern look most new-build buyers want — but S-fold tracks need either a square-set ceiling or a custom pelmet to sit properly. Pinch pleat is the traditional heading and works on most cornice ceilings without modification. We'll recommend which suits your home at the in-home measure.",
        },
      ]}
    />
  );
}
