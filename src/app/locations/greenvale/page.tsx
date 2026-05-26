import type { Metadata } from "next";
import { WovenSuburbPage } from "@/components/WovenSuburbPage";

export const metadata: Metadata = {
  title: "Curtains & Blinds Greenvale 3059 | Modern Curtains and Blinds",
  description:
    "Window furnishings for new-build and established homes in Greenvale 3059. Curtains, blinds, plantation shutters and roller shutters across Greenvale Gardens, Providence and the Hume growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/greenvale" },
};

export default function GreenvalePage() {
  return (
    <WovenSuburbPage
      name="Greenvale"
      slug="greenvale"
      postcode="3059"
      latitude={-37.645489}
      longitude={144.884125}
      corridor="north"
      lga="Hume"
      nearbyEstates={[
        "Greenvale Gardens",
        "Providence Greenvale",
        "Greenvale Lakes",
        "Aspect Greenvale",
      ]}
      microNote={
        <>
          <p className="mb-4 leading-relaxed">
            Greenvale 3059 has a broader mix of housing stock than Mickleham or Wollert — the
            older established sections of the suburb (1990s through 2000s) have mature trees
            and softer afternoon sun, while the newer west-edge releases are exposed in the
            same way as the rest of the corridor. The fit-out we quote depends heavily on
            which side of Greenvale you&apos;re in. An established Greenvale home often only
            needs to upgrade existing window treatments; a brand-new release home needs a
            full-house fit-out from scratch.
          </p>
          <p className="leading-relaxed">
            Greenvale sits closer to Tullamarine and the airport than the other northern
            corridor suburbs, so there&apos;s a noise consideration for some of the west-edge
            lots that face the flight paths. Heavier-weight curtain fabrics and double-glazed
            window treatments aren&apos;t a perfect noise solution, but they do soften the
            edge — we&apos;ll discuss this at the measure if you raise it.
          </p>
        </>
      }
      nearby={[
        { slug: "roxburgh-park", label: "Roxburgh Park" },
        { slug: "craigieburn", label: "Craigieburn" },
        { slug: "mickleham", label: "Mickleham" },
        { slug: "attwood", label: "Attwood" },
      ]}
      suburbFaqs={[
        {
          question: "Do you fit window furnishings in Greenvale 3059?",
          answer:
            "Yes. We cover Greenvale 3059 and the surrounding Hume corridor — Roxburgh Park, Craigieburn, Mickleham and Attwood. Whether your home is in an older established Greenvale street or one of the newer west-edge releases, we'll bring fabric samples to the in-home measure and quote against your specific home. Free, no obligation.",
        },
        {
          question: "Do you do upgrades on older Greenvale homes, or just new builds?",
          answer:
            "Both. We fit just as many upgrades to established Greenvale homes — replacing aging vertical blinds, refitting curtain tracks, installing plantation shutters as a renovation upgrade — as we do new-build fit-outs. The measure-and-quote process is the same either way.",
        },
      ]}
    />
  );
}
