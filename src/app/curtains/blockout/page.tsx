import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blockout Curtains Melbourne | Modern Curtains and Blinds",
  description:
    "Custom blockout curtains supplied and installed across Melbourne. Triple-pass blockout, sheer + blockout layered, indicative pricing $600–$2,000 per bedroom. Free in-home measure and quote.",
  alternates: { canonical: "/curtains/blockout" },
};

export default function BlockoutCurtainsPage() {
  return (
    <ProductTemplate
      nearbyLocations={getNearbyLocations("curtains", 8)}
      title="Blockout Curtains Melbourne"
      subtitle="Full darkness on demand, with a soft fabric look."
      heroImage="/images/product-unique/mcb-blockout-curtains-bedroom-hero.webp"
      description="Blockout curtains are what you fit when you want full darkness on demand and a soft fabric look in the same room — bedrooms, media rooms, pooja and prayer rooms, or the parents' and in-laws' suite. Most Melbourne homes layer them with a sheer for the daytime soft-light job."
      intentLabel="Full darkness and better sleep"
      features={[
        {
          title: "Triple-Pass Fabric",
          description:
            "Three bonded layers of acrylic blockout coating deliver genuine darkness on demand — not just 'light filtering' — on a heavier base fabric built for a 10-plus-year life.",
        },
        {
          title: "Won't Go Chalky",
          description:
            "Cheap thin-coated blockouts flake and peel after one Melbourne summer of west sun, leaving white residue on your glass. Our triple-pass fabric is rated for the real heat and UV of a hot-facing room.",
        },
        {
          title: "Thermal Layer",
          description:
            "Fitted wall-to-wall and ceiling-to-floor, a heavier blockout adds a measurable thermal barrier on west-facing rooms through summer afternoons.",
        },
      ]}
      decisionGuide={[
        {
          title: "Bedrooms & nurseries",
          description:
            "Best for genuine darkness for sleep and shift workers, with a soft fabric finish rather than a hard blind edge.",
        },
        {
          title: "Pooja & prayer rooms",
          description:
            "Triple-pass darkness when the room is in use, soft filtered light the rest of the day, and a draft-free space for a steady diya flame.",
        },
        {
          title: "Sheer + blockout layered",
          description:
            "The layered dual-track setup most growth-corridor buyers choose — daytime softness and full nighttime darkness in a single fit-out.",
        },
      ]}
      comparisonRows={[
        {
          label: "Blockout only",
          bestFor: "Full nighttime darkness",
          notes: "Triple-pass fabric on a single track — the simplest path to a genuinely dark room.",
        },
        {
          label: "Sheer + blockout layered",
          bestFor: "Day softness + night darkness",
          notes: "A sheer front layer and blockout back layer on a dual track for independent control.",
        },
        {
          label: "Triple-pass fabric",
          bestFor: "Longevity & true blackout",
          notes: "Bonded coating that holds up under west-facing Melbourne sun instead of going chalky.",
        },
      ]}
      types={[
        {
          title: "Triple-Pass Blockout",
          description:
            "Three bonded blockout layers on a heavier base fabric for genuine darkness on demand and a 10-plus-year residential life.",
          image: "/images/blockout-curtain-detail.webp",
        },
        {
          title: "Sheer + Blockout Layered",
          description:
            "A sheer front layer for daytime softness and privacy, with a blockout back layer that closes for full nighttime darkness.",
          image: "/images/product-unique/mcb-double-curtains-hero.webp",
          href: "/curtains/double-curtains",
        },
        {
          title: "Pooja & Prayer-Room Darkness",
          description:
            "Ceiling-to-floor, wall-to-wall triple-pass blockout that gives proper darkness in use and a draft-free space for a steady flame.",
          image: "/images/product-unique/mcb-blockout-curtains-dark-bedroom.webp",
          href: "/guides/pooja-prayer-room-blackout-curtains-australia",
        },
      ]}
      internalLinks={{
        title: "Related curtains & blockout options",
        links: [
          { label: "Curtains overview", href: "/curtains" },
          { label: "Sheer curtains", href: "/curtains/sheer" },
          { label: "Blockout roller blinds", href: "/blinds/roller-blinds/blockout" },
          { label: "Pooja & prayer-room blackout", href: "/guides/pooja-prayer-room-blackout-curtains-australia" },
          { label: "Pricing policy", href: "/pricing-policy" },
        ],
      }}
      faq={[
        {
          question: "How much do blockout curtains cost for a bedroom in Australia?",
          answer:
            "For a typical bedroom (around 3m wide × 2.7m high wall-to-wall), expect $600 to $1,000 for blockout only, or $1,500 to $2,000 for sheer + blockout layered on a dual track. These figures are indicative only, based on our standard baseline triple-pass fabric and standard installation as at 2026 — your written quote after the free in-home measure is the binding figure. Layering doubles the fabric and the track, but it's the configuration most growth-corridor buyers end up choosing for daytime privacy plus full nighttime darkness.",
        },
        {
          question: "What's the best blackout curtain for a pooja or prayer room?",
          answer:
            "A triple-pass blockout curtain or a sheer + blockout layered combination. Triple-pass blockout uses three layers of acrylic-coated fabric bonded together so no light passes through, even mid-morning. Sheer + blockout layered gives the same nighttime darkness with a softer daytime look. Both work; the choice comes down to whether you want the curtain look during the day. See our prayer-room blackout guide for the full pattern.",
        },
        {
          question: "Why do cheap blockout curtains go chalky after one summer?",
          answer:
            "Cheap blockout curtains use a thin acrylic coating on the back of the fabric. Under a single Melbourne summer of west-facing sun, that coating starts to go chalky, flake, and physically peel — most visibly where the curtain touches the window ledge. Inside 12 months on a hot-sun room, you're left with a curtain that no longer blocks light and leaves white residue on your glass. Quality blockout curtains use a triple-pass coating bonded to a heavier base fabric designed to hold up across a 10-plus-year life.",
        },
        {
          question: "Do blockout curtains help with heat or cold?",
          answer:
            "Yes — heavier-weight blockout curtains (with a triple-pass coating and a thicker base fabric) add a measurable thermal layer, especially when fitted wall-to-wall and ceiling-to-floor. They won't replace double-glazed windows or external roller shutters for hard thermal performance, but they noticeably reduce heat transfer through the glass on west-facing rooms during summer afternoons.",
        },
      ]}
    />
  );
}
