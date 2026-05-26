import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Timber Plantation Shutters Melbourne | Modern Curtains and Blinds",
  description:
    "Custom timber plantation shutters, supplied and installed across Melbourne. $100–$1,000 per window, ~$299/sqm average. Free in-home measure and quote.",
  alternates: { canonical: "/shutters/plantation-shutters/timber" },
};

const faqItems = [
  {
    question: "How much do timber plantation shutters cost per window in Melbourne?",
    answer:
      "Pricing varies widely with window size and material. Indicative range $100 to $1,000 per window, with the average sitting around $299 per square metre supplied and installed for a quality timber product. Small bathroom shutters sit at the low end; large bay or stacker-door installations push to the high end.",
  },
  {
    question: "Is $299 per square metre a fair deal for plantation shutters?",
    answer:
      "Yes — $299/sqm is around the Melbourne average for a quality plantation shutter. Below that range, expect compromises on material grade, blade thickness, or fixings. Above that range, you're usually paying for an upgrade — premium timber, custom colour matching, motorisation, or unusually large openings.",
  },
  {
    question: "Is $4,500 for a single window plantation shutter normal?",
    answer:
      "No — that's well above what a typical window should cost. The only reasons a single window would price that high are an unusually large opening, a premium hardwood timber, or a motorised configuration. Always get a second written quote.",
  },
  {
    question: "Are timber plantation shutters suitable for west-facing rooms?",
    answer:
      "Yes — solid timber shutters handle Melbourne afternoon sun well and provide a noticeable thermal layer over single-glazed windows. For wet areas (bathrooms, ensuites, laundries) we'd recommend our Fusion+ polymer range instead, since timber can move with humidity over time.",
  },
];

export default function TimberPlantationShuttersPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Plantation shutters · Timber
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Timber plantation shutters, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Timber plantation shutters are what most Melbourne homeowners picture when they
              think of shutters — the warmth of real wood, adjustable louvres, and a clean
              white-frame street face that handles privacy and afternoon sun in one product.
              We fit them across the city every week, most often on the front-facing rooms of
              new builds and the formal living areas of established homes.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What timber plantation shutters cost
              </h2>
              <p className="mb-4 leading-relaxed">
                Pricing varies widely with the size of the window and the timber. As a guide:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Per-window range</strong> — $100 to $1,000 supplied and installed.</li>
                <li><strong>Per-square-metre average</strong> — around $299/sqm for a quality mid-spec timber product.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                What moves the price: window size (small bathrooms low, large bays and stacker
                doors high), timber species (basswood vs hardwood vs eco-wood), custom colour
                matching, motorisation, and any non-standard install conditions like
                two-storey access, bay windows, arched openings or openings beyond the
                standard 90cm panel width.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Price-sanity check
              </h2>
              <p className="mb-4 leading-relaxed">
                We see two patterns in quotes from elsewhere that buyers ask us about. The
                first is the $299/sqm question — &ldquo;is that a fair deal?&rdquo; — and yes,
                it is, that&apos;s around the Melbourne average for a quality finish.
              </p>
              <p className="leading-relaxed">
                The second is the high-end shock quote — buyers being told $4,500 for a single
                window. That&apos;s well outside fair, unless the window is unusually large,
                the timber is a premium hardwood, or the configuration is motorised. If
                you&apos;re staring at a quote in that range for a standard window, get a
                second written quote.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Timber vs polymer vs aluminium
              </h2>
              <p className="leading-relaxed">
                We carry three plantation shutter ranges. <strong>Timber</strong> is what
                you&apos;re reading about — the warmth of real wood, premium look, best for
                dry rooms. <strong><Link href="/shutters/plantation-shutters/polymer" className="underline">Fusion+ polymer</Link></strong>{" "}
                is what we fit in bathrooms and kitchens where humidity would move timber over
                time, and on the west-facing windows of unshaded growth-corridor estates
                because the UV-stabilised material resists yellowing.{" "}
                <strong><Link href="/shutters/plantation-shutters/aluminium" className="underline">Element 13 aluminium</Link></strong>{" "}
                is the premium tier for external applications or covenant-restricted facades.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing on this page is indicative only and is not a quote. Final pricing
                depends on actual measurements, timber, configuration, and install conditions.
                Your written quote after the free in-home measure is the binding figure.
                Reviewed quarterly. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We bring timber samples in a range of stains and paint finishes so you can
                compare them against your home&apos;s existing palette before deciding.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="plantation-shutters-timber"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/shutters/plantation-shutters" className="underline">Plantation shutters overview</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/polymer" className="underline">Fusion+ polymer shutters</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters/aluminium" className="underline">Element 13 aluminium shutters</Link>{" "}·{" "}
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
