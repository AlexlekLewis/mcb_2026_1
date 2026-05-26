import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Deanside 3336 | Modern Curtains and Blinds",
  description:
    "Window furnishings for new-build homes in Deanside 3336. Custom curtains, blinds, plantation shutters and outdoor blinds across Bloomdale, Westbrook and the Melton growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/deanside" },
};

export default function DeansidePage() {
  return (
    <WovenSuburbPage
      name="Deanside"
      slug="deanside"
      postcode="3336"
      latitude={-37.7215}
      longitude={144.663}
      corridor="west"
      lga="Melton"
      nearbyEstates={[
        "Bloomdale Deanside",
        "Westbrook",
        "Aspect Deanside",
        "Habitat (Caroline Springs adjacent)",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Deanside 3336 is a newer release area adjacent to Caroline Springs, on the Melton
            side of the western growth corridor. It&apos;s less established than Tarneit —
            most homes here are first-time owner-occupiers who&apos;ve moved in within the
            last few years, and the area has grown rapidly since 2020. Streets run on a wider
            grid than the tighter Tarneit estates, and lot sizes in some Deanside releases
            are slightly larger.
          </p>
          <p className="leading-relaxed">
            The wind exposure here is real — west of the Western Freeway, with very few
            mature trees to break the prevailing wind pattern. Any external product needs to
            be specified to the wind classification of the site, not bought off the shelf.
            Internal treatments (plantation shutters, blockout rollers, layered sheer +
            blockout) sidestep that constraint entirely and are what we end up fitting most
            often in the area.
          </p>
        </>
      }
      nearby={[
        { slug: "caroline-springs", label: "Caroline Springs" },
        { slug: "rockbank", label: "Rockbank" },
        { slug: "plumpton", label: "Plumpton" },
        { slug: "fraser-rise", label: "Fraser Rise" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Deanside 3336?",
          answer:
            "Yes. We cover Deanside 3336 and the surrounding Melton growth corridor — Caroline Springs, Rockbank, Plumpton and Fraser Rise. Free in-home measure and quote, no obligation. We combine measures and installs through the area on the same day where possible.",
        },
        {
          question: "What's the recommended outdoor blind for a windy Deanside alfresco?",
          answer:
            "Zipscreen-style outdoor blinds with side channels and a documented wind rating, properly fitted, are what we recommend. Cheap off-the-shelf retractable awnings don't survive the wind exposure here — the cables fail and the fabric stretches inside the first year. We specify external products built and rated for the conditions at your specific site.",
        },
      ]}
    />
  );
}
