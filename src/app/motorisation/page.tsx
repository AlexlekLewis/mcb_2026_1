import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Motorised Blinds & Curtains Melbourne | Modern Curtains and Blinds",
  description:
    "Motorisation for blinds and curtains across Melbourne. Battery retrofit from $180–$280 per blind. Smart-home integration. Free measure and quote.",
  alternates: { canonical: "/motorisation" },
};

const faqItems = [
  {
    question: "Can you motorise existing roller blinds in Australia?",
    answer:
      "Yes. A battery / wireless retrofit motor sits at $180 to $280 per blind depending on motor specification. Hard-wired motorisation costs the retrofit fee plus an electrician's fee to install a GPO at each blind position — that's a separate trade we coordinate but you pay the sparky directly for their work.",
  },
  {
    question: "Are motorised blinds more thermally efficient than manual?",
    answer:
      "No. The thermal performance of a blind is determined by the fabric and the install, not by whether it's operated by hand or by motor. Motorisation is a convenience upgrade — for hard-to-reach windows (voids, stairwells), routine scheduling, accessibility, and smart-home integration. Don't let anyone sell you motorisation as an energy-saving feature; that's marketing, not physics.",
  },
  {
    question: "What's the best blind for a high-ceiling void or stairwell?",
    answer:
      "Motorised blockout rollers or honeycomb blinds are the most common fit for high-void glazing. The motor handles the reach issue, and the fabric choice depends on whether you want full darkness (blockout) or thermal performance (honeycomb). For double-storey homes in the growth corridors, void motorisation is built into most fit-outs we quote.",
  },
  {
    question: "Why did my motorised blind die the year my warranty ended?",
    answer:
      "Cheap unbranded import motors with no real lifecycle testing typically fail within the first 3-5 years. Quality motors carry a multi-year manufacturer warranty and an independently tested product life of 10+ years. We only fit motors we'd put in our own homes, with a warranty MCB will stand behind directly.",
  },
];

export default function MotorisationPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Motorisation
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Motorised blinds and curtains, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Motorisation is a convenience upgrade — for the high windows you can&apos;t
              reach, for the routine of opening and closing at sunrise and sunset, for the
              voids and stairwells of double-storey growth-corridor homes. We fit motorised
              blinds, curtains and shutters across Melbourne, either as part of a new fit-out
              or as a retrofit on existing manual blinds.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What motorisation costs
              </h2>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Battery / wireless retrofit on existing blinds</strong> — $180 to
                  $280 per blind depending on motor specification.
                </li>
                <li>
                  <strong>New-install motorised</strong> — built into the per-blind price on
                  the relevant product page.
                </li>
                <li>
                  <strong>Hard-wired motorisation</strong> — retrofit cost plus an
                  electrician&apos;s fee to install a GPO at each blind position (a separate
                  trade we coordinate but you pay the sparky directly).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The honest position on motorisation
              </h2>
              <p className="mb-4 leading-relaxed">
                We don&apos;t upsell motorisation. It&apos;s a convenience upgrade — not a
                thermal upgrade, not an energy-saving feature. The thermal performance of a
                blind is identical whether you open it by hand or by remote. Marketing that
                says otherwise is mythology that runs in the industry and we won&apos;t use it
                to push you toward a more expensive product.
              </p>
              <p className="leading-relaxed">
                Where motorisation genuinely earns its cost: voids, stairwells, and any window
                that&apos;s simply too high to reach without a ladder; smart-home integration
                where you actually use the scheduling; accessibility for buyers who can&apos;t
                operate manual blinds easily. For a normal bedroom window you can reach
                comfortably, manual operation works fine and saves you the premium.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Battery versus hard-wired
              </h2>
              <p className="leading-relaxed">
                Battery / wireless motors are the easiest retrofit — no electrician needed,
                charged via a USB cable every few months to a year depending on usage. Best
                for retrofits on existing blinds or for new builds where running power to each
                blind isn&apos;t worth the cost. Hard-wired motors are the cleanest long-term
                solution — no battery to charge, always-on integration with the home — but
                require a licensed electrician under AS/NZS 3000 to install the GPOs. New
                builds at lock-up stage are the easiest time to add hardwiring; retrofits
                later are more invasive.
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
                We&apos;ll walk through which windows in your home actually warrant
                motorisation, and which work fine on manual.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="motorisation"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">Blockout roller blinds</Link>{" "}·{" "}
                <Link href="/curtains/sheer" className="underline">Sheer curtains</Link>{" "}·{" "}
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
