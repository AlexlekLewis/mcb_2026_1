import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Zipscreen Outdoor Blinds Melbourne | Modern Curtains and Blinds",
  description:
    "Zipscreen outdoor blinds for alfresco areas. Manual $1,500–$2,000, motorised $2,000–$2,500 per opening. Free Melbourne measure and quote.",
  alternates: { canonical: "/awnings/zipscreens" },
};

const faqItems = [
  {
    question: "How much do Zipscreen outdoor blinds cost in Melbourne?",
    answer:
      "Based on a standard alfresco opening of approximately 3m wide × 2.5m high: manual zipscreen $1,500 to $2,000 supplied and installed; motorised zipscreen $2,000 to $2,500 supplied and installed. Larger or multi-bay alfresco fronts cost more. Indicative only; written quote after the in-home measure is binding.",
  },
  {
    question: "What's the difference between Ziptrak and Zipscreen?",
    answer:
      "They're both zip-track outdoor blind systems with similar functionality — fabric runs in side channels with a zip mechanism, fully wind-rated when properly specified. The naming differs by manufacturer/system. We fit zip-track outdoor blinds as a category; the right product for your home depends on opening size, fabric grade, and wind exposure at your site.",
  },
  {
    question: "Why did my outdoor blinds lock up after a year?",
    answer:
      "Three reasons in order of frequency: quality (cheap outdoor blinds use light-gauge channels, low-spec motors, and unsealed mechanisms — the first year of Melbourne weather seizes them up); maintenance (even quality outdoor blinds need silicon spray in the side channels at least annually); and installation (out-of-square fixing or insufficient clearance causes the blind to bind in the track).",
  },
  {
    question: "Do I need a wind rating for outdoor blinds in Melbourne?",
    answer:
      "Yes — especially for the western growth corridor (Tarneit, Deanside, Fraser Rise, Wyndham Vale) where prevailing westerly wind exposure is severe. External products need to be specified to the wind classification of your site under AS 4055. Off-the-shelf retractable outdoor blinds with no documented wind rating typically fail in the first big wind season.",
  },
];

export default function ZipscreensPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Outdoor blinds · Zipscreens
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Zipscreen outdoor blinds, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Zipscreen-style outdoor blinds are what we fit on most growth-corridor alfresco
              areas — fabric running in side channels with a zip mechanism, fully wind-rated
              when properly specified, with the option to motorise for the wind- or
              sun-sensor automation many new builds end up wanting.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What zipscreens actually cost
              </h2>
              <p className="mb-4 leading-relaxed">
                For a standard alfresco opening of about 3m wide × 2.5m high:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Manual zipscreen</strong> — $1,500 to $2,000 supplied and installed.
                </li>
                <li>
                  <strong>Motorised zipscreen</strong> — $2,000 to $2,500 supplied and
                  installed.
                </li>
              </ul>
              <p className="mt-4 leading-relaxed">
                Larger alfresco fronts, multi-bay setups, premium mesh openness, smart-home
                integration, and the wind classification of your site all move the price.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Off-the-shelf outdoor blinds — why they don&apos;t survive
              </h2>
              <p className="leading-relaxed">
                Off-the-shelf retractable outdoor blinds from hardware stores can come in
                meaningfully cheaper than what we&apos;ll quote. In our experience fitting
                outdoor products across Melbourne, the cheap mechanisms lock up inside a year
                — the lighter-gauge side channels jam, the lower-spec motors burn out, the
                fabric stretches and sags in wind. By the second winter you&apos;re back at
                the hardware store buying another one. We don&apos;t carry that tier because
                we&apos;d be replacing the product before the warranty ran out.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Wind ratings and the western corridor
              </h2>
              <p className="leading-relaxed">
                The western growth corridor (Tarneit, Deanside, Fraser Rise, Wyndham Vale)
                takes serious westerly wind. External products must be specified to the wind
                classification of your site under AS 4055 — there&apos;s no way around it
                without the product failing. We&apos;ll check the classification at the
                in-home measure and recommend the right tier of product for your specific
                location. See our{" "}
                <Link
                  href="/guides/estate-covenant-roller-shutters-zipscreens-melbourne"
                  className="underline"
                >
                  estate covenant guide
                </Link>{" "}
                for context on both covenants and wind across the corridors.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing on this page is indicative only and assumes a standard 3m × 2.5m
                alfresco opening. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We&apos;ll measure your alfresco, check the wind exposure of your site, and
                quote against the right tier of product.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="zipscreens"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/awnings" className="underline">Awnings & folding-arm</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/aluminium" className="underline">Aluminium plantation shutters</Link>{" "}·{" "}
                <Link href="/shutters/roller-shutters" className="underline">Roller shutters</Link>{" "}·{" "}
                <Link href="/guides/estate-covenant-roller-shutters-zipscreens-melbourne" className="underline">Estate covenant guide</Link>{" "}·{" "}
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
