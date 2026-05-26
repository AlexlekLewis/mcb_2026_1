import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Donnybrook 3064 | Modern Curtains and Blinds",
  description:
    "Window furnishings for new-build homes in Donnybrook 3064. Curtains, blinds, plantation shutters and roller shutters fitted across the Cloverton master-plan and the wider Whittlesea / Mitchell growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/donnybrook" },
};

export default function DonnybrookPage() {
  return (
    <WovenSuburbPage
      name="Donnybrook"
      slug="donnybrook"
      postcode="3064"
      latitude={-37.547657}
      longitude={144.966934}
      corridor="north"
      lga="Whittlesea / Mitchell"
      nearbyEstates={[
        "Cloverton (Kalkallo adjacent)",
        "Olivine",
        "Donnybrook Village",
        "Highlands Donnybrook",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Donnybrook 3064 is smaller and more recent than the neighbouring Wollert
            releases, and the area is closely linked to the Cloverton master-plan immediately
            to its north. Donnybrook Road is the spine of the suburb and most of the new
            releases sit either side. Some semi-rural blocks remain in the wider 3064
            postcode, but the active build zone is concentrated in the new estates running
            off the main road.
          </p>
          <p className="leading-relaxed">
            Because the estates are new and the area is largely unshaded — very few mature
            trees yet — west-facing summer afternoon sun is one of the biggest factors at the
            measure. We typically recommend external roller shutters on the worst upstairs
            bedrooms and either honeycomb blinds or plantation shutters on the main living
            west-facing windows.
          </p>
        </>
      }
      nearby={[
        { slug: "wollert", label: "Wollert" },
        { slug: "mickleham", label: "Mickleham" },
        { slug: "beveridge", label: "Beveridge" },
        { slug: "craigieburn", label: "Craigieburn" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Donnybrook 3064?",
          answer:
            "Yes. We cover Donnybrook 3064 — including the Cloverton-adjacent releases — and the surrounding Whittlesea and Mitchell growth corridor: Wollert, Mickleham, Beveridge, Craigieburn. Free in-home measure and quote, no obligation.",
        },
        {
          question: "Are the Cloverton-area estates strict on roller shutters?",
          answer:
            "The Cloverton master-plan publishes a comprehensive design manual that covers external window furnishings. Most external products require a colour-match to the facade and may need approval from the design review panel. Bring your covenant document to the in-home measure and we'll walk through what's allowed before quoting anything for the front face.",
        },
      ]}
    />
  );
}
