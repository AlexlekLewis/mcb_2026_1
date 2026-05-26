import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "External Roller Shutters Melbourne | Modern Curtains and Blinds",
  description:
    "External roller shutters for security, thermal performance and afternoon sun control. $500–$1,200 per window with motor. Free Melbourne measure and quote.",
  alternates: { canonical: "/shutters/roller-shutters" },
};

const faqItems = [
  {
    question: "How much do external roller shutters cost per window in Melbourne?",
    answer:
      "$500 to $1,000 per window base spec (manual operation, standard slat profile). With motorisation and electrical install included, $800 to $1,200 per window. Indicative only; the written quote after the in-home measure is the binding figure.",
  },
  {
    question: "What's the true cost of roller shutters with motor and electrical?",
    answer:
      "For motorised roller shutters with electrical install included, expect $800 to $1,200 per window. Anything significantly above that range, get a second written quote. The motor adds materials and labour cost; the electrical adds a licensed electrician's fee to run the GPO and the wiring under AS/NZS 3000.",
  },
  {
    question: "Are roller shutters worth it for the thermal performance alone?",
    answer:
      "On the worst west-facing rooms of an unshaded growth-corridor home — typically a master bedroom or upstairs living area — yes, they earn their cost back fast on cooling bills. The thermal differential between a closed roller shutter and a bare single-glazed window in mid-summer is significant. On rooms that don't take direct afternoon sun, the case is weaker.",
  },
  {
    question: "Are roller shutters allowed under our estate covenant?",
    answer:
      "It varies by estate. Some growth-corridor estates allow roller shutters with no restriction, some require a specific colour or finish, some restrict them to the rear of the property, and a small number prohibit them on the front elevation entirely. Bring your covenant document to the in-home measure and we'll walk through what's allowed before quoting. See our estate covenant guide for the corridor-by-corridor breakdown.",
  },
];

export default function RollerShuttersPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Shutters · External roller
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              External roller shutters, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              External roller shutters are the strongest single product for thermal control,
              security, and afternoon sun on west-facing rooms. We fit them most often on
              upstairs west-facing bedrooms and main living rooms in unshaded growth-corridor
              homes — the rooms where internal blockout alone can&apos;t handle the heat.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What roller shutters actually cost
              </h2>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Manual / base spec</strong> — $500 to $1,000 per window supplied and
                  installed.
                </li>
                <li>
                  <strong>Motorised with electrical install</strong> — $800 to $1,200 per
                  window all-in.
                </li>
              </ul>
              <p className="mt-4 leading-relaxed">
                What moves the price: window size (per-square-metre rates climb sharply on
                oversized openings), aluminium slat profile (premium extruded vs lower-cost
                roll-formed), motor brand (quality motors carry a multi-year warranty;
                unbranded import motors are the cheapest line item but typically fail well
                inside the first decade), and the wind classification of your site under
                AS 4055 — exposed Melbourne facades need a higher-rated slat.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When roller shutters are worth the spend
              </h2>
              <p className="mb-4 leading-relaxed">
                The strongest case is the worst west-facing room in an unshaded home. The
                thermal differential between a closed roller shutter and a bare single-glazed
                window in mid-summer is real — buyers feel the difference inside a week of
                fitting them. Combined with the security benefit (a closed roller shutter is a
                physical barrier) and the noise reduction on busy roads, the per-window cost
                earns out over a few summer seasons.
              </p>
              <p className="leading-relaxed">
                On rooms that don&apos;t take direct afternoon sun — south-facing bedrooms,
                east-facing living — internal blockout rollers or plantation shutters usually
                handle the job for less money. We&apos;ll be honest about which rooms in your
                home actually need an external roller shutter at the measure.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Covenants and wind ratings
              </h2>
              <p className="leading-relaxed">
                Two things to check before specifying roller shutters in a growth-corridor
                home: your estate covenant (some restrict external treatments on the front
                elevation) and the wind classification of your site (AS 4055 N2 / N3 / etc. —
                exposed estates need a higher-rated slat than sheltered ones). We&apos;ll walk
                through both at the in-home measure. See our{" "}
                <Link
                  href="/guides/estate-covenant-roller-shutters-zipscreens-melbourne"
                  className="underline"
                >
                  estate covenant guide
                </Link>{" "}
                for the corridor-by-corridor rules.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing on this page is indicative only. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We&apos;ll walk through which windows actually warrant an external roller
                shutter, check your covenant and wind exposure, and quote properly.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="roller-shutters"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/shutters" className="underline">Shutters overview</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters" className="underline">Plantation shutters</Link>{" "}·{" "}
                <Link href="/awnings/zipscreens" className="underline">Zipscreens</Link>{" "}·{" "}
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
