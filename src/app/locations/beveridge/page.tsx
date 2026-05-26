import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Beveridge 3753 | Modern Curtains and Blinds",
  description:
    "Window furnishings for new-build homes in Beveridge 3753. Custom curtains, blinds and shutters fitted across Mandalay, Mandalay Rises and the northern edge of the Melbourne growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/beveridge" },
};

export default function BeveridgePage() {
  return (
    <WovenSuburbPage
      name="Beveridge"
      slug="beveridge"
      postcode="3753"
      latitude={-37.482282}
      longitude={144.983213}
      corridor="north"
      lga="Mitchell"
      nearbyEstates={[
        "Mandalay",
        "Mandalay Rises",
        "The Reserve Beveridge",
        "Beveridge North",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Beveridge 3753 sits at the northern edge of the Melbourne growth corridor — the
            Hume Highway runs directly past, and the new releases here have only opened in the
            last few years. The area is a transition zone between rural-residential blocks and
            the fully built-out estates further south. Lot sizes vary widely depending on
            release: some of the Mandalay sub-releases run larger than the typical Wollert lot,
            others run tighter.
          </p>
          <p className="leading-relaxed">
            One thing worth noting at the in-home measure: Beveridge takes more wind than the
            sheltered pockets further south through the corridor. External outdoor blinds
            and folding-arm awnings need to be specified to the actual wind classification of
            the site, not just bought off the shelf. We&apos;ll talk through the wind exposure
            of your specific lot before quoting any external product.
          </p>
        </>
      }
      nearby={[
        { slug: "wallan", label: "Wallan" },
        { slug: "donnybrook", label: "Donnybrook" },
        { slug: "mickleham", label: "Mickleham" },
        { slug: "kilmore", label: "Kilmore" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Beveridge 3753?",
          answer:
            "Yes. We cover Beveridge 3753 and the surrounding Mitchell growth corridor — including Wallan, Donnybrook, Mickleham and Kilmore. Free in-home measure and quote, no obligation. Bring any covenant documentation from your estate and we'll factor it into the quote.",
        },
        {
          question: "What's the lead time from measure to install in Beveridge?",
          answer:
            "Most standard curtain and blind orders are produced and installed within a few weeks of order confirmation. Because Beveridge is at the northern edge of our regular weekly service area, we'll confirm a realistic arrival window for the install and combine appointments in the area on the same day where possible.",
        },
      ]}
    />
  );
}
