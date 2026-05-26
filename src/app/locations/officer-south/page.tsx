import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Officer South 3809 | Modern Curtains and Blinds",
  description:
    "Window furnishings for new-build homes in Officer South 3809. Curtains, blinds, plantation shutters and roller shutters fitted across Arcadia, Kaduna Park and the newer Cardinia releases. Free in-home measure and quote.",
  alternates: { canonical: "/locations/officer-south" },
};

export default function OfficerSouthPage() {
  return (
    <WovenSuburbPage
      name="Officer South"
      slug="officer-south"
      postcode="3809"
      latitude={-38.100396}
      longitude={145.413247}
      corridor="south-east"
      lga="Cardinia"
      nearbyEstates={[
        "Arcadia (south)",
        "Kaduna Park",
        "Timbertop",
        "Brompton",
        "Officer South Village",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Officer South 3809 is the newer release area south of the Princes Highway rail
            line, separated geographically from Officer proper but sharing the same postcode
            and the same builder mix. The streets are wider on average, the lots in some
            releases are slightly larger than in Officer north of the rail, and the homes are
            among the most recent in the Cardinia corridor — most of the homes we fit here
            are first-time owner-occupiers moving in within their first few months.
          </p>
          <p className="leading-relaxed">
            Because the area is so new, very few homes have mature trees out front, and west-
            facing windows take the full afternoon sun without any natural shading. This makes
            external roller shutters on the worst upstairs west-facing bedrooms a more common
            recommendation than in the more established Officer streets — they earn their
            cost back quickly in those rooms.
          </p>
        </>
      }
      nearby={[
        { slug: "officer", label: "Officer" },
        { slug: "pakenham", label: "Pakenham" },
        { slug: "berwick", label: "Berwick" },
        { slug: "beaconsfield", label: "Beaconsfield" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Officer South 3809?",
          answer:
            "Yes. We cover Officer South 3809 and the surrounding Cardinia growth corridor — Officer, Pakenham, Berwick and Beaconsfield. Free in-home measure and quote, no obligation. We bring fabric samples so you can compare them in your own home's light.",
        },
        {
          question: "Are the Officer South estates strict on external treatments?",
          answer:
            "Some of the Officer South releases run design guidelines that restrict roller shutters or external awnings on the front elevation. Internal treatments — plantation shutters, blockout rollers with side channels — are almost always allowed. Bring your covenant document to the measure and we'll walk through what your specific estate permits.",
        },
      ]}
    />
  );
}
