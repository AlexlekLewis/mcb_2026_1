import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Wollert 3750 | Modern Curtains and Blinds",
  description:
    "Window furnishings for new-build homes in Wollert 3750. Custom curtains, blinds, plantation shutters and roller shutters across Aurora, Lyndarum, Olivine and the wider Whittlesea growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/wollert" },
};

export default function WollertPage() {
  return (
    <WovenSuburbPage
      name="Wollert"
      slug="wollert"
      postcode="3750"
      latitude={-37.589189}
      longitude={144.99423}
      corridor="north"
      lga="Whittlesea"
      nearbyEstates={[
        "Aurora",
        "Lyndarum",
        "Lyndarum North",
        "Olivine",
        "Annadale",
        "Aspect Wollert",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Wollert 3750 is among Australia&apos;s fastest-growing suburbs and one of the most
            multicultural pockets of the northern growth corridor. A high share of the homes
            we fit here are multigenerational households, which means the brief usually
            includes a downstairs guest or parents&apos; suite that needs full visual
            separation from the rest of the home, plus considered window treatments for the
            pooja or prayer room where applicable. Edgars Road and Epping Road are the spine
            of the area and most of the major estates fan out either side.
          </p>
          <p className="leading-relaxed">
            The configuration we install most often through Wollert is sheer + blockout
            curtains layered through the main living and bedrooms — handles both daytime
            soft light and full nighttime privacy for parents&apos; suites and prayer rooms —
            with blockout roller blinds throughout the secondary bedrooms, and plantation
            shutters on the worst west-facing windows.
          </p>
        </>
      }
      nearby={[
        { slug: "epping", label: "Epping" },
        { slug: "donnybrook", label: "Donnybrook" },
        { slug: "mernda", label: "Mernda" },
        { slug: "south-morang", label: "South Morang" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Wollert 3750?",
          answer:
            "Yes. We cover Wollert 3750 and the surrounding Whittlesea growth corridor — including Donnybrook, Epping, Mernda and South Morang. Free in-home measure and quote. We bring fabric samples in a range of colours and weights, so you can compare them in your own light before deciding.",
        },
        {
          question: "Can you fit pooja or prayer room blackout in Wollert?",
          answer:
            "Yes. Triple-pass blockout or sheer + blockout layered are the two configurations we fit most often for pooja and prayer rooms in Wollert and the surrounding corridor. We'll talk through the altar position, draft considerations, and fabric grade at the in-home measure. See our prayer-room blackout guide for the full pattern.",
        },
      ]}
    />
  );
}
