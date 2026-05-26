import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title: "Blockout Roller Blinds Melbourne | Modern Curtains and Blinds",
  description:
    "Quality blockout roller blinds measured and installed across Melbourne. Indicative pricing $1,200–$2,900 whole-house, custom fit for new-build and renovated homes. Free in-home measure and quote.",
  alternates: { canonical: "/blinds/roller-blinds/blockout" },
};

const faqItems = [
  {
    question: "How much do blockout blinds cost for a 3-bedroom home in Melbourne?",
    answer:
      "Indicative range: $1,200 to $1,800 for quality blockout roller blinds throughout a 3-bedroom single-storey home, supplied and installed. A 4-bedroom double-storey is $2,400 to $2,900. A single larger window like a 1865 × 2100 mm bedroom glazing is $300 to $500. Your written quote after the in-home measure is the binding figure.",
  },
  {
    question: "How long should a quality blockout roller blind last?",
    answer:
      "Top-quality custom roller blinds can last up to twenty years in a Melbourne home on normal residential use. Good-quality mid-tier blinds typically run five to ten years. Off-the-shelf and DIY-online product usually starts showing wear — fabric edge curl, plastic backing peel, sloppy chain mechanism — inside the first twelve to thirty-six months.",
  },
  {
    question: "Why do cheap roller blinds curl at the edges after a couple of years?",
    answer:
      "Three reasons. The fabric is too thin to hold its shape over a daily up-and-down cycle (quality fabric runs heavier and resists curl). The componentry — brackets, tube, bottom rail — is too cheap to stay true, which pulls the fabric out of shape. And new-build windows are rarely perfectly square, so a poorly tensioned cheap blind in an out-of-square frame pulls itself apart over time.",
  },
  {
    question: "Should I get sheer + blockout layered or a double roller?",
    answer:
      "Both work; they solve the same problem slightly differently. A double roller (sunscreen + blockout on the same bracket) is the cleaner, more discreet option — great for media rooms and bedrooms where you want full darkness and a tidy installation. Sheer curtains layered over a blockout roller is softer visually and lets you keep the curtain look in the main bedroom and formal living. We fit both across the Melbourne growth corridors. The right choice usually comes down to whether you want curtains in that room at all.",
  },
  {
    question: "Is it worth buying quality once instead of replacing cheap blinds every few years?",
    answer:
      "Yes, almost always. A quality whole-house fitout at $2,400 to $2,900 done once outlasts three or four replacement cycles of cheap product at $800 to $1,500 each. Beyond the dollars, replacing window furnishings every few years means re-measuring, re-organising tradespeople, and living with whatever's failing in between. Buying quality once is cheaper and less hassle than buying cheap repeatedly.",
  },
];

export default function BlockoutRollerBlindsPage() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Roller blinds · Blockout
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Blockout roller blinds, Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Blockout roller blinds are the workhorse of an Australian home. Bedrooms, media
              rooms, west-facing living rooms — the spaces where you want full darkness on
              demand and clean privacy at night. We fit them across Melbourne every day, and
              most of what you&apos;re reading below comes from doing exactly that.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What a fair price actually looks like
              </h2>
              <p className="mb-4 leading-relaxed">
                For a three-bedroom single-storey home we fit blockout rollers throughout for
                <strong> $1,200 to $1,800</strong>, supplied and installed. A four-bedroom
                double-storey usually lands at <strong>$2,400 to $2,900</strong> — more glazing,
                often a void or stairwell to deal with. For a single larger window — say a
                1865 × 2100 mm bedroom or living-room glazing — expect <strong>$300 to $500</strong>{" "}
                for a quality fit.
              </p>
              <p className="mb-4 leading-relaxed">
                We&apos;ve seen quotes well over $1,000 for the same single window. That&apos;s
                outside fair. If you&apos;re staring at one of those, get a second written quote.
              </p>
              <p className="leading-relaxed">
                What moves the price within these ranges is straightforward: how many windows,
                the fabric grade, whether you go spring/chain or motorised, recess versus face
                fit (your builder&apos;s window reveal sometimes forces the decision), and
                whether you want side channels for genuine edge-to-edge blackout.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Why some roller blinds last twenty years and some don&apos;t survive three
              </h2>
              <p className="mb-4 leading-relaxed">
                A quality custom roller blind in a Melbourne home should last fifteen to twenty
                years on normal residential use. A good-quality mid-tier blind sits at five to
                ten. Hardware-store and DIY-online product typically starts showing wear inside
                the first twelve to thirty-six months — fabric edges curl, plastic backing flakes,
                chain mechanism gets sloppy.
              </p>
              <p className="mb-4 leading-relaxed">
                We hear from buyers all the time who&apos;ve had this happen. The reasons are
                always the same three things: the fabric is too lightweight to hold its shape
                over a daily up-and-down cycle, the bracket-and-tube componentry is too cheap to
                stay true, or the install was done by someone working off a tape measure for the
                first time in a window that isn&apos;t square. New-build windows are almost never
                perfectly square — and a poorly tensioned blind in an out-of-square frame pulls
                itself apart over a few years.
              </p>
              <p className="leading-relaxed">
                Off-the-shelf rollers have their place — rentals, garages, short-term fit-outs.
                But for a new build you&apos;re going to live in, the cost difference between a
                cheap blind and a quality blind disappears the second you have to replace the
                cheap one. Run the math on a four-bedroom house: $800 to $1,500 for a cheap
                whole-house fit-out, replaced three to five times across fifteen years, is
                $3,200 to $6,000 plus the hassle each time. Our quality fit at $2,400 to $2,900
                is done once and stays done.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What we actually fit
              </h2>
              <p className="mb-4 leading-relaxed">
                Every roller we install uses heavier-weight fabric — you can feel the difference
                in the showroom; the cheap-end fabrics are noticeably thin to the touch. We use
                componentry rated for daily residential cycling, not the once-a-week light-use
                componentry that fails in dense-use rooms like the master bedroom.
              </p>
              <p className="leading-relaxed">
                The blind is installed to a tolerance the fabric can hold over its full life,
                and if anything goes wrong inside that life, you ring us — not a faceless online
                warranty desk. That&apos;s the difference between buying a custom blind from an
                installer and buying a box off a shelf.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When to choose blockout, when to layer with sheer
              </h2>
              <p className="mb-4 leading-relaxed">
                If a room only needs daytime privacy with no need for full darkness, a sunscreen
                roller does the job and lets you see out. If you need full darkness only some of
                the time and clean daylight the rest, a{" "}
                <Link href="/blinds/double-roller-blinds" className="underline">double roller</Link>{" "}
                (sunscreen on top, blockout below) gives you both on a single bracket.
              </p>
              <p className="leading-relaxed">
                If you want the soft drape of curtains plus the clean privacy of a roller, layer
                a{" "}
                <Link href="/curtains/sheer" className="underline">sheer curtain</Link>{" "}
                over a blockout roller — that combination is what most of our growth-corridor
                customers end up with in their main bedrooms. The roller does the darkness; the
                sheer softens the look.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Builder packages and new-build buyers
              </h2>
              <p className="mb-4 leading-relaxed">
                If you&apos;re building in one of Melbourne&apos;s growth corridors and your
                builder has offered a window-furnishings allowance, read the spec carefully
                before accepting it. In our experience, builder-supplied window furnishings tend
                to be the cheapest budget product fitted at a premium price — and they&apos;re
                the most common source of the &ldquo;blinds failed within two years&rdquo; complaint.
              </p>
              <p className="leading-relaxed">
                We&apos;ve written a longer piece on this:{" "}
                <Link
                  href="/guides/new-build-window-furnishings-not-included"
                  className="underline"
                >
                  Are window furnishings included in your new build?
                </Link>{" "}
                It covers what to budget, how to handle the builder&apos;s allowance, and when
                to book the in-home measure.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                About these indicative prices
              </h3>
              <p className="text-sm leading-relaxed text-stone-600">
                Pricing on this page is indicative only and is not a quote. It assumes our
                standard baseline configuration on a typical residential opening with standard
                installation within our Melbourne service area. Final pricing depends on the
                actual measurements, fabric, configuration, and install conditions at your home.
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
                We bring samples, measure every opening, and give you a written quote that&apos;s
                yours for thirty days. Most installs run within a few weeks of order confirmation.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="blockout-roller-blinds"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related:{" "}
                <Link href="/blinds/roller-blinds" className="underline">Roller blinds overview</Link>{" "}·{" "}
                <Link href="/blinds/roller-blinds/sunscreen" className="underline">Sunscreen rollers</Link>{" "}·{" "}
                <Link href="/blinds/double-roller-blinds" className="underline">Double rollers</Link>{" "}·{" "}
                <Link href="/curtains/blockout" className="underline">Blockout curtains</Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters" className="underline">Plantation shutters</Link>{" "}·{" "}
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
