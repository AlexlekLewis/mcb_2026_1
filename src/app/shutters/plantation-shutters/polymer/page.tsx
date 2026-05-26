import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Fusion+ Polymer Plantation Shutters Melbourne | Modern Curtains and Blinds",
  description:
    "Fusion+ polymer plantation shutters for bathrooms, west-facing windows and covenant-restricted facades. $100–$1,000 per window. Free Melbourne measure and quote.",
  alternates: { canonical: "/shutters/plantation-shutters/polymer" },
};

const faqItems = [
  {
    question: "Why choose polymer plantation shutters over timber?",
    answer:
      "Two main reasons. First, wet areas — polymer doesn't warp or move with humidity the way timber can, so bathrooms, kitchens and laundries are the natural fit. Second, sun exposure — quality UV-stabilised polymer resists yellowing under the worst west-facing Australian sun, which makes it the right call for unshaded growth-corridor homes where timber would gradually shift colour.",
  },
  {
    question: "Will polymer plantation shutters yellow in the Australian sun?",
    answer:
      "Quality polymer shutters use UV-stabilised material — typically with 4-6% titanium-dioxide stabiliser in the formulation — and do not yellow. Cheap hollow-PVC shutters skip the stabiliser to cut cost and start yellowing inside the first Australian summer. Our Fusion+ range carries a multi-year warranty on the panel against yellowing for exactly this reason.",
  },
  {
    question: "How much do Fusion+ polymer shutters cost per window?",
    answer:
      "$100 to $1,000 per window supplied and installed, with the average around $299 per square metre. Smaller bathroom or laundry shutters at the low end; large bay or stacker-door at the high end. Indicative only; written quote after the in-home measure is binding.",
  },
];

export default function PolymerPlantationShuttersPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Plantation shutters · Fusion+ polymer
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Fusion+ polymer plantation shutters, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Fusion+ polymer shutters are what we fit in two specific scenarios: wet areas
              where timber would move with humidity, and unshaded west-facing windows where
              the UV-stabilised material resists yellowing where cheap PVC alternatives
              don&apos;t.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Why polymer, not timber
              </h2>
              <p className="mb-4 leading-relaxed">
                Timber is the premium look — warm, natural, a real-wood finish. But timber
                moves with humidity over time, so bathrooms, ensuites, kitchens and laundries
                aren&apos;t the right room for it. Polymer was developed to give you the same
                louvred-shutter look in the rooms where timber would gradually shift.
              </p>
              <p className="leading-relaxed">
                The second case for polymer is sun exposure. Quality UV-stabilised polymer
                resists yellowing across years of Melbourne summer sun. Cheap hollow-PVC
                shutters skip the UV stabiliser to cut cost — they yellow inside the first
                summer and the panels can warp and drop under heat. Our Fusion+ range uses
                solid polymer with the proper UV formulation and carries a multi-year warranty
                on the panel for this exact failure mode.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Indicative pricing
              </h2>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Per window</strong> — $100 to $1,000 supplied and installed.</li>
                <li><strong>Per-square-metre average</strong> — around $299/sqm for a quality finish.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                What moves the price: window size, custom colour matching, motorisation, and
                non-standard install conditions (two-storey, bay windows, arched openings,
                oversized openings).
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing is indicative only and is not a quote. Final pricing depends on actual
                measurements and configuration. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We bring polymer samples in a range of whites and stained finishes — easier
                to compare in your own light than from a screen.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="fusion-plus-shutters"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/shutters/plantation-shutters" className="underline">Plantation shutters overview</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/timber" className="underline">Timber shutters</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/aluminium" className="underline">Aluminium shutters</Link>{" "}·{" "}
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
