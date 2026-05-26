import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Sheer Curtains Melbourne | Modern Curtains and Blinds",
  description:
    "Custom sheer curtains supplied and installed across Melbourne. S-fold and wave-fold sheer curtains, indicative pricing $3,000–$4,000 whole-house. Free in-home measure and quote.",
  alternates: { canonical: "/curtains/sheer" },
};

const faqItems = [
  {
    question: "How much do sheer curtains cost for a 3-bedroom home in Melbourne?",
    answer:
      "For a typical three-bedroom home, sheer curtains supplied and installed sit at $3,000 to $4,000 — S-fold or wave-fold, standard fabric, standard installation across the main living and bedroom windows. Your written quote after the free in-home measure is the binding figure.",
  },
  {
    question: "Can I layer sheer curtains over a blockout roller blind?",
    answer:
      "Yes. Sheer + blockout layered is one of the most common configurations we fit in Melbourne homes, especially in the main bedroom and formal living room. The sheer is drawn during the day for soft light and privacy; the blockout closes for full nighttime darkness. It's the softer alternative to a double-roller bracket.",
  },
  {
    question: "How private are sheer curtains at night?",
    answer:
      "With the lights on at night, sheer curtains show silhouettes from outside — not detail — but on tight-frontage growth-corridor lots that's not enough on its own. Layer sheers over a blockout roller or blockout curtain for full nighttime privacy. For daytime use, sheers maintain effective privacy from the street while letting filtered light through.",
  },
  {
    question: "What's the difference between S-fold and pinch pleat sheer curtains?",
    answer:
      "S-fold curtains hang from a ceiling-mounted track in soft, even S-shape folds, which is the modern look most new-build buyers want — but S-fold tracks need either a square-set ceiling or a custom pelmet to sit properly. Pinch pleat is the traditional heading and works on most cornice ceilings without modification. We'll recommend which suits your home at the in-home measure.",
  },
];

export default function SheerCurtainsPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Curtains · Sheer
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Sheer curtains, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Sheer curtains are what you fit when you want soft, filtered daylight, daytime
              privacy from the street, and the look of fabric softening a window. We fit them
              across Melbourne every day in main bedrooms, formal living rooms, and the front-
              facing rooms of growth-corridor new builds.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What sheers actually cost
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical three-bedroom Melbourne home — sheers in the main living, the
                master bedroom and the secondary bedrooms — expect <strong>$3,000 to $4,000</strong>{" "}
                supplied and installed, with S-fold or wave-fold tracks and a standard fabric
                grade. Smaller scopes (sheers only on the master and the front living, say)
                run at the lower end. Premium imported fabrics, motorised tracks or two-storey
                openings push you to the upper end.
              </p>
              <p className="leading-relaxed">
                What moves the price within that range: the ceiling style (square-set ceilings
                play nicely with S-fold tracks; cornice ceilings often need a pelmet for the
                same look); the track type (motorised vs manual); the fabric grade (entry vs
                premium European blends); and whether the curtains run ceiling-to-floor and
                wall-to-wall or only window-width.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When to use sheers alone, and when to layer
              </h2>
              <p className="mb-4 leading-relaxed">
                If a room only needs daytime privacy and soft light, sheers do the job on their
                own. They&apos;re the right choice for formal lounges, front-facing rooms that
                you want to look soft from the street, and any space where the goal is the
                look of fabric rather than a hard light-blocking layer.
              </p>
              <p className="leading-relaxed">
                For rooms where you also want full darkness on demand — main bedrooms, media
                rooms, pooja or prayer rooms — layer the sheer over a{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">blockout roller</Link>{" "}
                or a{" "}
                <Link href="/curtains/blockout" className="underline">blockout curtain</Link>.
                The sheer is drawn during the day, the blockout closes at night, and the
                combined look is softer than a blockout layer on its own.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                S-fold, wave-fold and pinch pleat — which heading
              </h2>
              <p className="mb-4 leading-relaxed">
                The heading is the style of fold at the top of the curtain, and it determines
                a lot about how the finished curtain looks. <strong>S-fold</strong> and{" "}
                <strong>wave-fold</strong> are the modern look — even, soft, ceiling-mounted
                folds that hang straight to the floor. They need either a square-set ceiling
                or a custom pelmet to sit properly, because the track is visible by design.
              </p>
              <p className="leading-relaxed">
                <strong>Pinch pleat</strong> is the traditional heading — gathered folds at the
                top, fixed to a more substantial track that sits behind a cornice. It works on
                almost any ceiling without modification, and reads as a softer, more classic
                curtain. Both are fine choices — we&apos;ll recommend the one that suits your
                home at the in-home measure.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing on this page is indicative only and is not a quote. It assumes our
                standard baseline configuration on a typical residential opening with standard
                installation within our Melbourne service area. Final pricing depends on
                actual measurements, fabric, configuration, and install conditions. Your
                written quote after the free in-home measure is the binding figure. Reviewed
                quarterly. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We bring fabric samples in a range of weights and colours so you can compare
                them in your own home before choosing.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="sheer-curtains"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/curtains" className="underline">Curtains overview</Link>{" "}·{" "}
                <Link href="/curtains/blockout" className="underline">Blockout curtains</Link>{" "}·{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">Blockout roller blinds</Link>{" "}·{" "}
                <Link href="/guides/pooja-prayer-room-blackout-curtains-australia" className="underline">Pooja & prayer-room blackout</Link>{" "}·{" "}
                <Link href="/pricing-policy" className="underline">Pricing policy</Link>
                .
              </p>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
