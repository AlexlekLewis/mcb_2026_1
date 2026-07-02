import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Clyde 3978",
  description:
    "Window furnishings for new-build and established homes in Clyde 3978. Custom curtains, blinds, plantation shutters and roller shutters fitted across the Casey growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/clyde" },
};

export default function ClydePage() {
  return (
    <WovenSuburbPage
      name="Clyde"
      slug="clyde"
      postcode="3978"
      latitude={-38.132}
      longitude={145.327}
      corridor="south-east"
      lga="Casey"
      nearbyEstates={[
        "Eve Estate",
        "Selandra Rise",
        "Brompton",
        "Five Farms",
        "Smiths Lane",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Clyde 3978 sits at the transition between the established Cranbourne area to the
            west and the brand-new releases through Clyde North to the north. The mix you get
            here is broader than the surrounding suburbs — some legacy rural blocks alongside
            recent infill developments, plus the larger growth-corridor estates spilling over
            from the Clyde North side. Street orientations vary, so the right product for each
            window depends on which release you&apos;re in.
          </p>
          <p className="leading-relaxed">
            What this means at the in-home measure: we don&apos;t assume one product mix for
            every home in Clyde. A late-2000s home on the Cranbourne side typically asks for a
            different solution than a 2024 two-storey on the Clyde North side. We&apos;ll walk
            through both your floor plan and the orientation of the worst-facing windows before
            we recommend anything.
          </p>
        </>
      }
      nearby={[
        { slug: "clyde-north", label: "Clyde North" },
        { slug: "cranbourne-east", label: "Cranbourne East" },
        { slug: "cranbourne-south", label: "Cranbourne South" },
        { slug: "tooradin", label: "Tooradin" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Clyde 3978?",
          answer:
            "Yes. We measure, supply and install curtains, blinds, plantation shutters, roller shutters, security doors, fly screens and outdoor blinds across Clyde 3978 and the surrounding Casey growth corridor — including Clyde North, Cranbourne East, Cranbourne South and Tooradin. Free in-home measure and quote, no obligation.",
        },
        {
          question: "How long from measure to install in Clyde?",
          answer:
            "Most standard curtain and blind orders are produced and installed within a few weeks of order confirmation. We work backwards from your handover or move-in date to make sure everything is fitted before you need it.",
        },
      ]}
    />
  );
}
