import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Element 13 Aluminium Plantation Shutters Melbourne | Modern Curtains and Blinds",
  description:
    "Element 13 aluminium plantation shutters for external alfresco, balconies and covenant-restricted facades. $100–$1,000 per window. Free Melbourne measure and quote.",
  alternates: { canonical: "/shutters/plantation-shutters/aluminium" },
};

const faqItems = [
  {
    question: "When is aluminium the right plantation shutter choice?",
    answer:
      "Three scenarios: external applications (alfresco shutters, balcony privacy), premium wet-area performance beyond what polymer offers, and estate covenants that restrict roller shutters but allow louvred aluminium treatments. For interior dry rooms, timber or Fusion+ polymer are the better fits.",
  },
  {
    question: "How much do aluminium plantation shutters cost per window?",
    answer:
      "$100 to $1,000 per window supplied and installed, with the average around $299 per square metre. Aluminium tracks with the timber and polymer ranges on per-window pricing — the real cost differences come in at larger scale (external alfresco bays, two-storey balcony surrounds).",
  },
  {
    question: "Are aluminium shutters good for security as well as privacy?",
    answer:
      "Aluminium plantation shutters provide a meaningful physical barrier when locked closed, but they're not certified security screens under AS 5039 — that's a separate product category. For dedicated security on external doors and windows, see our security door range. Aluminium plantation shutters are about sun control, privacy and a clean facade in one product.",
  },
];

export default function AluminiumPlantationShuttersPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Plantation shutters · Element 13 aluminium
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Element 13 aluminium plantation shutters, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Element 13 is what we fit when the shutter has to handle external conditions —
              alfresco surrounds, balcony privacy, covenant-restricted facades where roller
              shutters aren&apos;t allowed but an external louvred treatment is. Premium tier,
              priced like the rest of the range on a per-window basis.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When aluminium is the right choice
              </h2>
              <p className="mb-4 leading-relaxed">
                External alfresco shutters are the most common use we fit Element 13 for —
                louvred screens that close over the alfresco area for privacy and sun control,
                opening up for full daylight when you want it. They work where a zipscreen or
                folding-arm awning doesn&apos;t give you the louvred control you want.
              </p>
              <p className="leading-relaxed">
                The second case is covenant-restricted facades. Some growth-corridor estates
                restrict external roller shutters on the front elevation but allow louvred
                aluminium treatments. Element 13 reads as a clean white frame from the street
                and ticks the covenant box where a roller shutter would fail it.
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
                External installs (alfresco surrounds, balconies) typically run at the higher
                end of the range because of structural fixings and wind considerations.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing is indicative only and is not a quote. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We&apos;ll bring samples in standard powder-coat finishes and walk you through
                where Element 13 fits best in your home.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="element-13-shutters"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/shutters/plantation-shutters" className="underline">Plantation shutters overview</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/timber" className="underline">Timber shutters</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/polymer" className="underline">Fusion+ polymer shutters</Link>{" "}·{" "}
                <Link href="/awnings/zipscreens" className="underline">Zipscreens</Link>{" "}·{" "}
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
