import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Tarneit 3029",
  description:
    "Window furnishings for new-build homes in Tarneit 3029. Custom curtains, blinds, plantation shutters and outdoor blinds across Riverdale, Habitat, Newgate and the wider Wyndham growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/tarneit" },
};

export default function TarneitPage() {
  return (
    <WovenSuburbPage
      name="Tarneit"
      slug="tarneit"
      postcode="3029"
      latitude={-37.809168}
      longitude={144.667208}
      corridor="west"
      lga="Wyndham"
      nearbyEstates={[
        "Riverdale",
        "Habitat Tarneit",
        "Newgate",
        "Newhaven Tarneit",
        "The Range Tarneit",
        "Westbrook",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Tarneit 3029 is one of Australia&apos;s most multicultural growth corridor
            suburbs, with a very high Indian-Australian population centre, a growing Sri
            Lankan and Filipino community, and a fast-expanding Sub-Saharan African
            community. The train line runs east-west through the area and most of the major
            estates branch off either side. The tight 12.5m frontages are standard, which
            means two-storey street faces sit close to the kerb — privacy treatments on the
            front-facing windows matter more here than in suburbs with wider lots.
          </p>
          <p className="leading-relaxed">
            The configuration we install most often through Tarneit is double roller blinds
            throughout (sunscreen + blockout on the same bracket — the most useful single
            fit-out for these homes); plantation shutters to the street-facing windows for
            two-storey privacy; and blockout curtains layered on the main bedroom. For the
            many homes with a pooja or prayer room, triple-pass blockout or sheer + blockout
            layered is what we recommend.
          </p>
        </>
      }
      nearby={[
        { slug: "truganina", label: "Truganina" },
        { slug: "hoppers-crossing", label: "Hoppers Crossing" },
        { slug: "werribee", label: "Werribee" },
        { slug: "wyndham-vale", label: "Wyndham Vale" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Tarneit 3029?",
          answer:
            "Yes. We cover Tarneit 3029 and the surrounding Wyndham growth corridor — including Truganina, Hoppers Crossing, Werribee and Wyndham Vale. Free in-home measure and quote, no obligation. We bring fabric samples in a wide range of textures and colours so you can compare them in your own home before deciding.",
        },
        {
          question: "Can you fit pooja or prayer room blackout in Tarneit?",
          answer:
            "Yes. Tarneit is one of the corridors where we fit pooja and prayer room blackout most often. Triple-pass blockout curtains or sheer + blockout layered configurations are the two patterns we recommend most. We'll walk through altar position, fabric grade and draft control at the in-home measure. See our prayer-room blackout guide for more.",
        },
      ]}
    />
  );
}
