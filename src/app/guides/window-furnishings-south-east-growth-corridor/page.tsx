import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title:
    "Window furnishings — South-East growth corridor buyer's guide | Modern Curtains and Blinds",
  description:
    "Authoritative buyer's guide for window furnishings across Melbourne's south-east growth corridor — Clyde, Clyde North, Officer, Officer South. Build profile, builder mix, pricing, covenants, and what gets fitted in Smiths Lane, Five Farms, Arcadia, Timbertop, Kaduna Park.",
  alternates: {
    canonical: "/guides/window-furnishings-south-east-growth-corridor",
  },
  openGraph: {
    title: "Window furnishings — South-East growth corridor buyer's guide",
    description:
      "Honest buyer's guide for Casey and Cardinia new-build homes. What works, what costs, and what to ask for at the in-home measure.",
  },
};

const faqItems = [
  {
    question: "What window furnishings work best for new-build homes in the south-east growth corridor?",
    answer:
      "Plantation shutters to the street-facing front rooms (covenant-friendly across most local estates, consistent across the facade); blockout roller blinds throughout the bedrooms; sheer curtains layered over rollers in the main bedroom and formal living; external roller shutters on the upstairs west-facing bedrooms where afternoon sun is worst; motorisation on void or stairwell glazing. This combination handles privacy, sun control, and thermal performance in roughly that order across the 4-bedroom double-storey designs that dominate the corridor.",
  },
  {
    question: "Which builders dominate the Clyde / Officer corridor?",
    answer:
      "Metricon, Henley, Simonds, Carlisle Homes, Burbank and Boutique Homes are the largest volume builders across Clyde, Clyde North, Officer and Officer South. The homes share a recognisable profile: double-storey 4-bedroom designs on 350–500 sqm lots with two-tone facades, small front porches, and stacker doors opening onto rear courtyards.",
  },
  {
    question: "Are roller shutters allowed under the south-east corridor estate covenants?",
    answer:
      "It varies by estate. Smiths Lane and Five Farms run the strictest design guidelines — external roller shutters on the front elevation typically need specific approval from the design review panel. Several other estates allow them on the rear or side elevations without issue. Internal alternatives (plantation shutters fitted internally behind the front-facing window line, blockout roller blinds with side channels) are almost always allowed. Bring your covenant document to the in-home measure.",
  },
  {
    question: "How much should we budget for a full window furnishings fitout in the south-east corridor?",
    answer:
      "For a typical 4-bedroom double-storey home in Clyde, Clyde North, Officer or Officer South: blockout roller blinds throughout $2,400–$2,900, sheer curtains in the main living and bedrooms $3,000–$4,000, plantation shutters on the street-facing windows $100–$1,000 per window, external roller shutters with motor and electrical $800–$1,200 per window. Total typical full fitout sits in the $7,000–$12,000 range, supplied and installed by us.",
  },
  {
    question: "When during the build should we book the in-home measure?",
    answer:
      "Lock-up stage — when the windows are installed in their final position and the plaster is complete. Most of the south-east corridor homes we've fitted have been measured four to six weeks before handover, which gives us enough time to manufacture and install before move-in.",
  },
];

export default function SouthEastCorridorPillar() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Growth-corridor buyer&apos;s guide · South-East
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Window furnishings for the south-east growth corridor
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              If you&apos;re building or moving into a new home through the south-east of
              Melbourne — Clyde, Clyde North, Officer, Officer South, or anywhere through
              the Casey and Cardinia growth corridor — this is the buyer&apos;s guide we
              wish you&apos;d read before you signed the builder contract. It covers what
              the typical homes here actually need, what the realistic budget looks like,
              what the covenants restrict, and how to handle the builder&apos;s window-
              furnishings allowance.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The shape of the corridor
              </h2>
              <p className="mb-4 leading-relaxed">
                The south-east growth corridor runs from Clyde and Cranbourne East at its
                outer south-west edge through Clyde North, into Officer and Officer South to
                the east, with neighbouring older suburbs like Berwick, Beaconsfield and
                Pakenham bordering it. The local government areas are Casey (for Clyde and
                Clyde North) and Cardinia (for Officer and Officer South). The Princes
                Highway and the railway shape the street grid through Officer, with new
                releases fanning out either side. Down through Clyde and Clyde North, the
                main estates branch off Berwick-Cranbourne Road and Thompson Road.
              </p>
              <p className="leading-relaxed">
                The corridor is one of Melbourne&apos;s most active build zones — large
                volumes of new home completions every month, dominated by the major volume
                builders. Most homes we fit here are first-time owner-occupiers moving in
                within their first six months. The brief is almost always full-house from
                scratch.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Who builds here and what they build
              </h2>
              <p className="mb-4 leading-relaxed">
                Metricon, Henley, Simonds, Carlisle Homes, Burbank and Boutique Homes account
                for most of the new home completions through the corridor. The homes share a
                recognisable profile: double-storey 4-bedroom designs on 350–500 sqm lots,
                two-tone facades with rendered upper storeys, small front porches, double
                garages, and stacker doors opening onto a courtyard at the rear.
              </p>
              <p className="leading-relaxed">
                Block orientation runs roughly east-west on most streets, which means the
                courtyards take heavy afternoon sun and the front-facing upstairs bedrooms
                heat up fast through summer. The window reveals from the volume builders are
                predictable but shallow — we measure carefully for inside-mount versus
                face-fit on each opening because the standard reveal depths sit at the lower
                end of what inside-mount rollers need. Two-storey voids and stairwells with
                full-height glazing are common, which usually means motorisation for safety
                and convenience.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The estates by name
              </h2>
              <p className="mb-4 leading-relaxed">
                We&apos;ve fitted across all the major south-east corridor estates. The
                significant ones to know about:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Smiths Lane (Clyde North)</strong> — large master-planned estate with strict design guidelines; covenant restricts external treatments on the front elevation.</li>
                <li><strong>Five Farms (Clyde North)</strong> — similar covenant profile to Smiths Lane; high-quality streetscape; internal plantation shutters are the standard front-facing treatment.</li>
                <li><strong>Eliston (Clyde North / Clyde border)</strong> — large estate spanning both sides; mix of single and double-storey releases.</li>
                <li><strong>Arcadia (Officer / Officer South)</strong> — long-running release with multiple stages on both sides of the rail line.</li>
                <li><strong>Timbertop (Officer)</strong> — established release with a mature streetscape compared to the newest Cardinia growth pockets.</li>
                <li><strong>Orana (Clyde North)</strong> — recent release with a more open street grid.</li>
                <li><strong>Kaduna Park (Officer South)</strong> — south-of-rail Cardinia release with tighter covenant rules on external treatments.</li>
                <li><strong>Brompton (Officer)</strong> — wide lot sizes in some sub-stages.</li>
                <li><strong>Arbourwood (Officer)</strong> — more recent release; consistent contemporary facades.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                For suburb-specific detail (the estates IN your specific suburb plus the
                build profile of that pocket), see the suburb pages:{" "}
                <Link href="/locations/clyde-north" className="underline">Clyde North</Link>{" "}·{" "}
                <Link href="/locations/clyde" className="underline">Clyde</Link>{" "}·{" "}
                <Link href="/locations/officer" className="underline">Officer</Link>{" "}·{" "}
                <Link href="/locations/officer-south" className="underline">Officer South</Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What gets fitted most often
              </h2>
              <p className="mb-4 leading-relaxed">
                The configuration we install most often through the south-east corridor:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Plantation shutters</strong> to the street-facing front rooms.
                  Covenant-friendly across most local estates, consistent across the facade,
                  blocks the afternoon sun. Timber for the main living, polymer for any wet
                  areas (bathrooms, ensuites).
                </li>
                <li>
                  <strong>Blockout roller blinds</strong> throughout the bedrooms — heavier-
                  weight fabric (not the lightweight ready-made tier you get at hardware
                  stores), rated for daily up-and-down cycling.
                </li>
                <li>
                  <strong>Sheer + blockout layered</strong> on the main bedroom and the
                  formal living. Sheer drawn during the day for soft light; blockout closes
                  for full darkness at night.
                </li>
                <li>
                  <strong>Double roller blinds</strong> on the rooms facing the rear
                  courtyard — sunscreen for the western glare during the day, blockout for
                  full darkness at night, both on the same bracket.
                </li>
                <li>
                  <strong>External roller shutters</strong> on the upstairs west-facing
                  bedrooms. These take the worst afternoon sun and the thermal stack effect
                  on a two-storey home, and a roller shutter earns its cost back fast in
                  cooling bills.
                </li>
                <li>
                  <strong>Motorisation</strong> on void or stairwell glazing, and on
                  hard-to-reach windows. Convenience upgrade, not a thermal one — we
                  don&apos;t upsell motorisation where a manual blind works fine.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Pricing depth — what to budget
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical 4-bedroom double-storey home in the south-east corridor:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Blockout rollers throughout</strong> — $2,400–$2,900 supplied and installed.</li>
                <li><strong>Sheer curtains in main living and bedrooms</strong> — $3,000–$4,000.</li>
                <li><strong>Plantation shutters on street-facing windows</strong> — $100–$1,000 per window, ~$299/sqm average.</li>
                <li><strong>External roller shutters with motor + electrical</strong> — $800–$1,200 per window.</li>
                <li><strong>Motorisation retrofit</strong> — $180–$280 per blind for battery; hardwired needs an electrician for GPO install.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                A typical full-house fitout — plantation shutters on the street face, rollers
                throughout, sheers in the main rooms, roller shutters on the worst-facing
                windows — lands in the $7,000–$12,000 range, done once, installed properly,
                warranted by us. Indicative ranges only; the written quote after the in-home
                measure is the binding figure. See our{" "}
                <Link href="/pricing-policy" className="underline">pricing policy</Link>{" "}
                for what&apos;s included and what can change the price.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Covenants
              </h2>
              <p className="mb-4 leading-relaxed">
                Several of the south-east corridor estates run design guidelines that
                restrict external treatments on the front elevation. Smiths Lane and Five
                Farms are the strictest; other estates allow more flexibility. The pattern
                is that internal treatments (plantation shutters fitted internally, blockout
                rollers with side channels) are almost always allowed, while external
                treatments (front-facing roller shutters, folding-arm awnings on the front)
                require approval or aren&apos;t permitted at all.
              </p>
              <p className="leading-relaxed">
                We&apos;ve fitted across all the major corridor estates and we recognise the
                covenant language. Bring your covenant document to the in-home measure and
                we&apos;ll walk through what&apos;s allowed before we quote anything for the
                front face of the home. See our{" "}
                <Link
                  href="/guides/estate-covenant-roller-shutters-zipscreens-melbourne"
                  className="underline"
                >
                  estate covenant guide
                </Link>{" "}
                for the corridor-by-corridor breakdown.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The builder&apos;s window-furnishings allowance
              </h2>
              <p className="leading-relaxed">
                If your builder has offered a window-furnishings allowance as part of your
                contract — almost every volume builder does — read the spec carefully before
                accepting it. In our experience, builder-supplied window furnishings are
                typically the cheapest budget product fitted at a premium price, because the
                supply arrangement runs on thin margins and the fitter is paid lean per-
                window rates. The smarter move is to negotiate the allowance out of the
                contract and bring the same scope to us independently. We hear from buyers
                regularly whose builder-supplied window furnishings have started failing
                within the first year or two. See our{" "}
                <Link
                  href="/guides/new-build-window-furnishings-not-included"
                  className="underline"
                >
                  new-build inclusions guide
                </Link>{" "}
                for the full pattern.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                If you&apos;re at lock-up stage anywhere through the south-east growth
                corridor — Clyde, Clyde North, Officer, Officer South, or the neighbouring
                Berwick, Beaconsfield, Pakenham — book a free in-home measure. We bring
                samples, walk through your covenant, and quote in writing.
              </p>
              <PrimaryCTA location="inline" label="Book free in-home measure" />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Corridor suburbs:{" "}
                <Link href="/locations/clyde-north" className="underline">Clyde North</Link>{" "}·{" "}
                <Link href="/locations/clyde" className="underline">Clyde</Link>{" "}·{" "}
                <Link href="/locations/officer" className="underline">Officer</Link>{" "}·{" "}
                <Link href="/locations/officer-south" className="underline">Officer South</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Other growth corridors:{" "}
                <Link href="/guides/window-furnishings-northern-growth-corridor" className="underline">Northern corridor guide</Link>{" "}·{" "}
                <Link href="/guides/window-furnishings-western-growth-corridor" className="underline">Western corridor guide</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Related guides:{" "}
                <Link href="/guides/new-build-window-furnishings-not-included" className="underline">New-build inclusions</Link>{" "}·{" "}
                <Link href="/guides/estate-covenant-roller-shutters-zipscreens-melbourne" className="underline">Estate covenants</Link>{" "}·{" "}
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
