import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Officer 3809",
  description:
    "Window furnishings for new-build homes in Officer 3809. Custom curtains, blinds, plantation shutters and roller shutters fitted across the Cardinia growth corridor — Arcadia, Timbertop, Kaduna Park, Orana. Free in-home measure and quote.",
  alternates: { canonical: "/locations/officer" },
};

export default function OfficerPage() {
  return (
    <WovenSuburbPage
      name="Officer"
      slug="officer"
      postcode="3809"
      latitude={-38.06112}
      longitude={145.415089}
      corridor="south-east"
      lga="Cardinia"
      nearbyEstates={[
        "Arcadia",
        "Timbertop",
        "Kaduna Park",
        "Orana",
        "Brompton",
        "Arbourwood",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Officer is one of Cardinia&apos;s most active growth pockets — the Princes Highway
            and the railway line shape the street grid, with most new estates running on a
            broadly east-west axis on the north side of the rail and a roughly perpendicular
            grid on the south. Large two-storey four-bedroom designs are the standard, and the
            front elevations are typically what you see when you drive through the corridor:
            consistent rendered facades, white-frame windows, double garages.
          </p>
          <p className="leading-relaxed">
            The combination most homes in Officer end up with is internal plantation shutters
            on the front-facing rooms (covenant-friendly across most of the local estates),
            blockout rollers in the bedrooms with a layer of sheer in the master and formal
            living, and external roller shutters on the upstairs west-facing rooms — these
            face the worst afternoon sun and benefit most from a thermal shutter rather than
            internal blockout alone.
          </p>
        </>
      }
      nearby={[
        { slug: "officer-south", label: "Officer South" },
        { slug: "beaconsfield", label: "Beaconsfield" },
        { slug: "berwick", label: "Berwick" },
        { slug: "pakenham", label: "Pakenham" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Officer 3809?",
          answer:
            "Yes. We cover Officer 3809, Officer South 3809, and the surrounding Cardinia growth corridor — including Beaconsfield, Berwick and Pakenham. We bring fabric samples to the in-home measure so you can compare textures, colours and opacity levels against your home's light before deciding. Free, no obligation.",
        },
        {
          question: "Which estates in Officer do you typically fit window furnishings in?",
          answer:
            "We've fitted across Arcadia, Timbertop, Kaduna Park, Orana, Brompton and Arbourwood, plus smaller releases through the corridor. The fit-out approach is broadly the same across these estates, but the covenant rules vary — bring the covenant document to the measure and we'll walk through what's allowed and what isn't on your specific lot.",
        },
      ]}
    />
  );
}
