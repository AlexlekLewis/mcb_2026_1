import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Mickleham 3064",
  description:
    "Window furnishings for new-build homes in Mickleham 3064. Custom curtains, blinds, plantation shutters and roller shutters across Mickleham Rises, Annadale and the Hume growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/mickleham" },
};

export default function MicklehamPage() {
  return (
    <WovenSuburbPage
      name="Mickleham"
      slug="mickleham"
      postcode="3064"
      latitude={-37.562}
      longitude={144.874}
      corridor="north"
      lga="Hume"
      nearbyEstates={[
        "Mickleham Rises",
        "Annadale",
        "Highlands Mickleham",
        "Mt Ridley Estate",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Mickleham 3064 sits along Mickleham Road on the Hume side of the northern growth
            corridor. Lot sizes in some of the recent releases are slightly larger than the
            typical Wollert lot, which gives a different feel to the streetscape — more
            spacing between homes, more visible side fence runs. The community here has a
            strong and growing South Asian presence, and like Wollert the brief at the
            in-home measure often includes a pooja or prayer room, plus a parents&apos; or
            guest suite that needs proper visual separation from the rest of the home.
          </p>
          <p className="leading-relaxed">
            Mickleham gets the same unshaded afternoon sun pattern as the rest of the
            corridor — most homes have no mature trees out front yet, and the west-facing
            faces of the home take the worst of the summer heat. External roller shutters or
            honeycomb blinds on the worst-facing bedrooms are part of most fit-outs we quote
            here.
          </p>
        </>
      }
      nearby={[
        { slug: "greenvale", label: "Greenvale" },
        { slug: "craigieburn", label: "Craigieburn" },
        { slug: "donnybrook", label: "Donnybrook" },
        { slug: "wollert", label: "Wollert" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Mickleham 3064?",
          answer:
            "Yes. We cover Mickleham 3064 and the surrounding Hume growth corridor — Greenvale, Craigieburn, Donnybrook and Wollert. Free in-home measure and quote. We bring fabric samples so you can compare textures and colours against your home's light before deciding.",
        },
        {
          question: "Can you fit pooja or prayer room blackout in Mickleham?",
          answer:
            "Yes. Triple-pass blockout curtains or sheer + blockout layered configurations are the two we fit most often for pooja and prayer rooms in Mickleham. We'll walk through altar position, draft control, and fabric choice at the in-home measure. See our prayer-room blackout guide for the full pattern.",
        },
      ]}
    />
  );
}
