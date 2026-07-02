import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Fraser Rise 3336",
  description:
    "Window furnishings for new-build homes in Fraser Rise 3336. Custom curtains, blinds and shutters across Taylors Run, Aspect and the Melton growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/fraser-rise" },
};

export default function FraserRisePage() {
  return (
    <WovenSuburbPage
      name="Fraser Rise"
      slug="fraser-rise"
      postcode="3336"
      latitude={-37.7215}
      longitude={144.663}
      corridor="west"
      lga="Melton"
      nearbyEstates={[
        "Taylors Run",
        "Aspect Fraser Rise",
        "Atherstone (adjacent)",
        "Plumpton Estate (adjacent)",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Fraser Rise 3336 is a newer growth pocket on the Calder side of the western
            corridor — quieter streets than Tarneit, with a mix of single-storey and
            double-storey homes across the recent releases. The neighbouring Taylors Hill
            and Plumpton areas provide some context for the street profile, though Fraser
            Rise itself is one of the more recent releases.
          </p>
          <p className="leading-relaxed">
            Like the rest of the western corridor, Fraser Rise takes strong westerly wind
            exposure, with very few mature trees to break the pattern. For internal
            treatments this barely matters; for external products (roller shutters,
            zipscreens, folding-arm awnings) the wind classification of your specific lot
            shapes what&apos;s actually fit for purpose. We&apos;ll talk through both the
            covenant and the wind exposure at the in-home measure.
          </p>
        </>
      }
      nearby={[
        { slug: "plumpton", label: "Plumpton" },
        { slug: "deanside", label: "Deanside" },
        { slug: "taylors-hill", label: "Taylors Hill" },
        { slug: "hillside", label: "Hillside" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Fraser Rise 3336?",
          answer:
            "Yes. We cover Fraser Rise 3336 and the surrounding Melton growth corridor — Plumpton, Deanside, Taylors Hill and Hillside. Free in-home measure and quote, no obligation. Fabric samples are brought to the measure so you can compare in your own light.",
        },
        {
          question: "What's the best blind for a west-facing room in Fraser Rise?",
          answer:
            "For the worst west-facing rooms — typically a master bedroom or upstairs living area — we'd recommend either external roller shutters (best thermal performance, dramatically cuts afternoon heat) or honeycomb blinds (next best, lower cost). For a softer look, plantation shutters fitted internally also handle the sun well. Which one depends on your covenant and your budget — we'll walk through it at the measure.",
        },
      ]}
    />
  );
}
