import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Folding-Arm Awnings Melbourne | Modern Curtains and Blinds",
  description:
    "Quality folding-arm awnings supplied and installed across Melbourne. Built for Australian conditions with proper wind ratings. $2,500–$4,000 per opening. Free measure and quote.",
  alternates: { canonical: "/awnings" },
};

const faqItems = [
  {
    question: "How much do folding-arm awnings cost in Melbourne?",
    answer:
      "Quality folding-arm awnings supplied and installed typically sit at $2,500 to $4,000 per opening, depending on width, arm count, fabric grade, and whether motorised. Larger spans (5m or 6m) and motorised configurations push to the upper end. Indicative only; the written quote after the in-home measure is binding.",
  },
  {
    question: "We got quotes up to $4,000 and off-the-shelf for $200 — what's going on?",
    answer:
      "$4,000 is a reasonable price for a quality, brand-name folding-arm awning built to last in Australian conditions. $200 off-the-shelf hardware-store products carry no quality guarantee — in our experience they don't hold up to Australian conditions. The frames are light, the fabric stretches, the arms sag, and most fail in their first winter wind season. You get what you pay for in this category more than almost any other.",
  },
  {
    question: "Do folding-arm awnings need a wind sensor?",
    answer:
      "Strongly recommended for motorised installs — a wind sensor retracts the awning automatically when wind picks up beyond a safe threshold. Without one, a sudden gust can over-extend the arms and cause damage. We fit Somfy or equivalent wind sensors as a standard option on our motorised folding-arm awnings.",
  },
];

export default function AwningsPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Awnings · Folding-arm
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Folding-arm awnings, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Folding-arm awnings extend out from the wall to cover a paved area, courtyard
              or window run — usually retracting flat against the house when not in use.
              We fit them across Melbourne for buyers who want shaded outdoor space without
              committing to a full pergola or fixed roof.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What folding-arm awnings cost
              </h2>
              <p className="mb-4 leading-relaxed">
                Quality folding-arm awnings supplied and installed sit at <strong>$2,500 to $4,000</strong>{" "}
                per opening, depending on:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>Awning width (3m, 4m, 5m, 6m — larger spans push to upper end)</li>
                <li>Manual crank vs motorised</li>
                <li>Wind / sun sensor integration</li>
                <li>Fabric grade (acrylic vs woven)</li>
                <li>Custom colour matching</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Why a $200 off-the-shelf awning isn&apos;t the same product
              </h2>
              <p className="mb-4 leading-relaxed">
                A $200 hardware-store folding-arm awning and a $4,000 quality folding-arm
                awning are not comparable products. In our experience fitting outdoor products
                across Melbourne, off-the-shelf folding-arm awnings do not hold up to
                Australian conditions — arms sag within months, fasteners pull out of the
                masonry, fabric stretches and tears, and the products typically fail in their
                first winter wind season.
              </p>
              <p className="leading-relaxed">
                A $4,000 quality folding-arm awning is built around a substantial extruded
                aluminium frame, wind-rated fabric, a quality motor with a multi-year warranty,
                and structural fixings that hold under load. You buy it once and keep it for
                the life of the outdoor area. We don&apos;t carry the cheap tier because
                we&apos;d be replacing the product before its first replacement cycle.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Folding-arm versus zipscreen versus aluminium
              </h2>
              <p className="leading-relaxed">
                Three outdoor-shade products with different strengths. <strong>Folding-arm
                awnings</strong> extend out and cover wide paved areas — best where you want
                shade on demand and the option to retract completely. <strong>
                <Link href="/awnings/zipscreens" className="underline">Zipscreens</Link></strong>{" "}
                run vertically in side channels and enclose an alfresco like a wall — best for
                wind protection and privacy. <strong>
                <Link href="/shutters/plantation-shutters/aluminium" className="underline">Aluminium plantation shutters</Link></strong>{" "}
                give louvred control on a fixed frame — best for fixed alfresco surrounds
                where you want adjustability without retraction.
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
                We&apos;ll measure your outdoor area, check the wind exposure and fixing
                substrate, and quote in writing.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="awnings"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/awnings/zipscreens" className="underline">Zipscreens</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/aluminium" className="underline">Aluminium shutters</Link>{" "}·{" "}
                <Link href="/shutters/roller-shutters" className="underline">Roller shutters</Link>{" "}·{" "}
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
