import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Blockout Curtains Melbourne | Modern Curtains and Blinds",
  description:
    "Custom blockout curtains supplied and installed across Melbourne. Triple-pass blockout, sheer + blockout layered, pricing $600–$2,000 per bedroom. Free in-home measure and quote.",
  alternates: { canonical: "/curtains/blockout" },
};

const faqItems = [
  {
    question: "How much do blockout curtains cost for a bedroom in Australia?",
    answer:
      "For a typical bedroom (around 3m wide × 2.7m high wall-to-wall), expect $600 to $1,000 for blockout only, or $1,500 to $2,000 for sheer + blockout layered on a dual track. Layering doubles the fabric and the track, but it's the configuration most growth-corridor buyers end up choosing for the combination of daytime privacy and full nighttime darkness.",
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
];

export default function BlockoutCurtainsPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Curtains · Blockout
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Blockout curtains, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Blockout curtains are what you fit when you want full darkness on demand and a
              soft fabric look in the same room — bedrooms, media rooms, pooja and prayer
              rooms, the parents&apos; or in-laws&apos; suite. We fit them across Melbourne
              homes every day, most often layered with a sheer for the daytime soft-light job.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What blockout curtains cost
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical bedroom (around 3m wide × 2.7m high wall-to-wall), the indicative
                ranges:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Blockout only</strong> — $600 to $1,000 supplied and installed.
                </li>
                <li>
                  <strong>Sheer + blockout layered</strong> on a dual track — $1,500 to $2,000
                  supplied and installed.
                </li>
              </ul>
              <p className="mt-4 leading-relaxed">
                Layered configurations double the fabric volume and the track work, but
                they&apos;re what most growth-corridor buyers end up choosing for the main
                bedroom and formal living — the sheer handles daytime privacy and softens the
                window; the blockout closes for full darkness at night or for pooja sessions.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Why quality matters in blockout
              </h2>
              <p className="mb-4 leading-relaxed">
                Cheap blockout curtains use a thin acrylic backing — under a single Melbourne
                summer of west-facing sun, that coating starts to go chalky, flake, and
                physically peel where the curtain meets the window ledge. Inside 12 months on
                a hot-sun room, you&apos;re left with a curtain that no longer blocks light
                and leaves white residue on your glass.
              </p>
              <p className="leading-relaxed">
                Quality blockout uses triple-pass coating bonded to a heavier base fabric,
                designed for a 10-plus-year residential life. Triple-pass means three layers
                of acrylic blockout coating in the fabric, which is what makes the difference
                between &ldquo;light filtering&rdquo; and genuine darkness on demand. Every
                blockout curtain MCB fits uses that triple-pass tier of fabric, and the track
                is rated for the actual fabric weight.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Pooja, prayer rooms, and the parents&apos; suite
              </h2>
              <p className="mb-4 leading-relaxed">
                Pooja rooms, mandir corners and prayer spaces have a quiet requirement that
                the rest of the home doesn&apos;t — proper darkness when the room is in use,
                soft filtered light the rest of the day, and a draft-free environment for a
                steady diya flame. Triple-pass blockout fabric, fitted ceiling-to-floor and
                wall-to-wall, is what handles this properly.
              </p>
              <p className="leading-relaxed">
                The same logic applies for the downstairs parents&apos; or in-laws&apos; suite
                that&apos;s common in growth-corridor multigenerational homes — a layered
                sheer + blockout configuration gives daytime soft light and full nighttime
                privacy in a single fit-out. See our{" "}
                <Link
                  href="/guides/pooja-prayer-room-blackout-curtains-australia"
                  className="underline"
                >
                  pooja and prayer-room blackout guide
                </Link>{" "}
                for the full pattern.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing on this page is indicative only and is not a quote. It assumes our
                standard baseline triple-pass fabric on a typical 3m × 2.7m wall-to-wall
                opening with standard installation within our Melbourne service area. Final
                pricing depends on actual measurements, fabric, configuration, and install
                conditions. <em>As at May 2026.</em>{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We bring fabric samples across a range of weights, colours, and pattern
                grades so you can compare them in your own light before choosing.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="blockout-curtains"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/curtains" className="underline">Curtains overview</Link>{" "}·{" "}
                <Link href="/curtains/sheer" className="underline">Sheer curtains</Link>{" "}·{" "}
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
