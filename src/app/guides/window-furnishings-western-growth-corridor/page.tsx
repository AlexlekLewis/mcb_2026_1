import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title:
    "Window furnishings — Western growth corridor buyer's guide | Modern Curtains and Blinds",
  description:
    "Authoritative buyer's guide for window furnishings across Melbourne's western growth corridor — Tarneit, Deanside, Fraser Rise. Build profile, builder mix, pricing, covenants, Riverdale / Habitat / Atherstone estates, wind exposure, multicultural community framing.",
  alternates: {
    canonical: "/guides/window-furnishings-western-growth-corridor",
  },
  openGraph: {
    title: "Window furnishings — Western growth corridor buyer's guide",
    description:
      "Honest buyer's guide for Wyndham and Melton new-build homes. What works for tight 12.5m frontages, westerly wind, and the corridor's multicultural community.",
  },
};

const faqItems = [
  {
    question: "What window furnishings work best for new-build homes in the western growth corridor?",
    answer:
      "Double roller blinds throughout (sunscreen + blockout on the same bracket — the most useful single fit-out for these tight-frontage homes); plantation shutters to the street-facing windows for two-storey privacy; blockout curtains layered on the main bedroom; zipscreens or wind-rated outdoor blinds on the alfresco for the worst westerly days. For pooja and prayer rooms, triple-pass blockout or sheer + blockout layered is what we recommend.",
  },
  {
    question: "Do outdoor blinds and awnings need wind ratings in the western corridor?",
    answer:
      "Yes. The western corridor takes serious westerly wind exposure with very few mature trees to break the prevailing pattern. Any external product needs to be specified to the wind classification of the site under AS 4055 — off-the-shelf retractable outdoor blinds with no documented wind rating typically fail in the first big wind season. We specify external products built for the conditions at your specific lot.",
  },
  {
    question: "Are roller shutters allowed under Riverdale or Atherstone covenants?",
    answer:
      "Both estates publish design guidelines that include external-treatment rules. The pattern is that internal treatments (plantation shutters, blockout rollers, sheer + blockout layered) are allowed without restriction; external roller shutters and folding-arm awnings on the front elevation often need approval or a colour-match to the facade. Bring your covenant document to the in-home measure.",
  },
  {
    question: "How much should we budget for window furnishings in the western corridor?",
    answer:
      "For a typical 4-bedroom double-storey home in Tarneit, Deanside or Fraser Rise: double rollers throughout $2,400–$2,900 supplied and installed, sheer curtains in the main living and bedrooms $3,000–$4,000, plantation shutters on the street-facing windows $100–$1,000 per window, motorised zipscreens on the alfresco $2,000–$2,500. Indicative ranges only — the written quote after the in-home measure is the binding figure.",
  },
  {
    question: "Which builders dominate the western growth corridor?",
    answer:
      "Simonds, Henley, Metricon, Burbank, Boutique and Hotondo Homes are the largest volume builders across Tarneit, Truganina, Deanside and Fraser Rise. Tight 12.5m frontage lots are standard, with two-storey street faces and wide stacker doors onto small private courtyards — which shapes the privacy and sun-control brief.",
  },
];

export default function WesternCorridorPillar() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Growth-corridor buyer&apos;s guide · Western
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Window furnishings for the western growth corridor
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              If you&apos;re building or moving into a new home through the western growth
              corridor — Tarneit, Deanside, Fraser Rise, or the wider Wyndham and Melton
              corridor — this is the buyer&apos;s guide we&apos;d hand you at the in-home
              measure. It covers what the tight-frontage homes here actually need, how the
              westerly wind exposure shapes the external-product decisions, and how the
              corridor&apos;s multicultural community shapes the brief.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The shape of the corridor
              </h2>
              <p className="mb-4 leading-relaxed">
                The western growth corridor spans Wyndham (Tarneit, Truganina, Wyndham Vale,
                Werribee, Point Cook adjacent) and Melton (Deanside, Fraser Rise, Plumpton,
                Caroline Springs adjacent). The Wyndham side runs east-west along the train
                line that connects Tarneit through to Werribee, with most estates branching
                off either side. The Melton side sits west of the Western Freeway, with
                Deanside immediately adjacent to the established Caroline Springs and Fraser
                Rise running along the Calder side.
              </p>
              <p className="leading-relaxed">
                Tarneit in particular is one of Australia&apos;s most multicultural growth
                corridor suburbs — a major Indian-Australian population centre with a fast-
                growing Sri Lankan, Filipino, and Sub-Saharan African community. The
                corridor&apos;s demographic shapes the window furnishings brief in specific
                ways we&apos;ll walk through below.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Who builds here and what they build
              </h2>
              <p className="mb-4 leading-relaxed">
                Simonds, Henley, Metricon, Burbank, Boutique and Hotondo Homes account for
                most new completions through the corridor. The build profile is distinct
                from the south-east: tight 12.5m frontage lots are standard, with two-storey
                street faces sitting close to the kerb, and wide stacker doors opening onto
                small private courtyards at the rear.
              </p>
              <p className="leading-relaxed">
                The corridor takes serious westerly wind exposure. There are very few mature
                trees yet across the newer releases, so the wind pattern moves across the
                estates without much break. This matters for any external product —
                folding-arm awnings, zipscreens, roller shutters — and is why we specify
                wind-rated tiers as standard for outdoor blinds in the corridor.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The estates by name
              </h2>
              <p className="mb-4 leading-relaxed">
                The major western corridor estates we&apos;ve fitted in:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Riverdale (Tarneit)</strong> — one of the largest single estates in the corridor; detailed design guidelines on external treatments and facade consistency.</li>
                <li><strong>Habitat Tarneit</strong> — major Tarneit release; consistent contemporary facades.</li>
                <li><strong>Newgate (Tarneit)</strong> — recent release with a tight street grid.</li>
                <li><strong>Newhaven Tarneit</strong> — established release with mature streetscape compared to the newest stages.</li>
                <li><strong>The Range Tarneit</strong> — Tarneit-side release with mixed lot sizes.</li>
                <li><strong>Westbrook (Tarneit / Deanside)</strong> — spans both suburbs in different stages.</li>
                <li><strong>Bloomdale (Deanside)</strong> — major Melton-side release adjacent to Caroline Springs.</li>
                <li><strong>Atherstone (Melton South area, Fraser Rise adjacent)</strong> — publishes detailed design guidelines.</li>
                <li><strong>Taylors Run (Fraser Rise)</strong> — Calder-side release with quieter streets.</li>
                <li><strong>Aspect (Deanside / Fraser Rise)</strong> — recent release across both.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                For suburb-specific detail, see the suburb pages:{" "}
                <Link href="/locations/tarneit" className="underline">Tarneit</Link>{" "}·{" "}
                <Link href="/locations/deanside" className="underline">Deanside</Link>{" "}·{" "}
                <Link href="/locations/fraser-rise" className="underline">Fraser Rise</Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What gets fitted most often
              </h2>
              <p className="mb-4 leading-relaxed">
                The western corridor brief is distinct again from the other two corridors.
                The configuration we install most often:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Double roller blinds throughout</strong> — sunscreen + blockout on
                  the same bracket. The most useful single fit-out for these tight-frontage
                  homes: sunscreen handles privacy during the day with view through to the
                  small courtyard, blockout closes for full darkness at night.
                </li>
                <li>
                  <strong>Plantation shutters</strong> on the street-facing two-storey
                  windows — privacy from the close kerb-line, consistent facade reading, and
                  covenant-friendly across most estates.
                </li>
                <li>
                  <strong>Blockout curtains layered with sheer</strong> on the main bedroom
                  and any pooja or prayer room.
                </li>
                <li>
                  <strong>Zipscreens or wind-rated outdoor blinds</strong> on the alfresco —
                  not the cheap off-the-shelf retractable awnings (those fail in the first
                  wind season).
                </li>
                <li>
                  <strong>Triple-pass blockout</strong> for the pooja or prayer rooms common
                  in many Tarneit and Truganina homes.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The wind exposure problem
              </h2>
              <p className="mb-4 leading-relaxed">
                The western corridor takes the worst westerly wind exposure of any of
                Melbourne&apos;s growth corridors. There&apos;s almost no natural
                wind-break — no mature trees, no significant terrain, just the open lots and
                the wind running off the western paddocks. Any external product has to be
                specified to the wind classification of your specific site under AS 4055.
              </p>
              <p className="leading-relaxed">
                Off-the-shelf retractable outdoor blinds from hardware stores don&apos;t
                survive this. The cables snap, the fabric stretches, the springs fail. We
                won&apos;t fit cheap outdoor product through this corridor because we&apos;d
                be replacing it inside the first year. The right answer is properly-specified
                zipscreens with side channels and a documented wind rating, or covenant-
                friendly internal alternatives where external isn&apos;t allowed.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Cultural framing — Tarneit and the South Asian community
              </h2>
              <p className="mb-4 leading-relaxed">
                Tarneit is the corridor&apos;s largest Indian-Australian community centre.
                For many homes in the corridor, the in-home measure brief includes a pooja
                or prayer room blackout requirement, multigenerational household privacy
                (a downstairs guest or parents&apos; suite that needs full visual separation
                from the rest of the home), and a formal living room that&apos;s reserved
                for entertaining and needs a more refined fabric finish.
              </p>
              <p className="leading-relaxed">
                The configurations we fit most often to address these are triple-pass
                blockout (or sheer + blockout layered) on the pooja room, layered sheer +
                blockout on the parents&apos; bedroom window, and a curtain heading that
                reads softer in the formal room (S-fold or pinch pleat depending on the
                ceiling style). See our{" "}
                <Link
                  href="/guides/pooja-prayer-room-blackout-curtains-australia"
                  className="underline"
                >
                  pooja and prayer-room blackout guide
                </Link>{" "}
                for the full pattern.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Pricing depth — what to budget
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical 4-bedroom double-storey home in the western corridor:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Double rollers throughout</strong> — $2,400–$2,900 supplied and installed.</li>
                <li><strong>Sheer + blockout layered on main bedroom and living</strong> — $3,000–$4,000.</li>
                <li><strong>Plantation shutters on street-facing windows</strong> — $100–$1,000 per window, ~$299/sqm.</li>
                <li><strong>Motorised zipscreens on alfresco (3m × 2.5m)</strong> — $2,000–$2,500.</li>
                <li><strong>External roller shutters with motor</strong> — $800–$1,200 per window.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                Indicative only; see our{" "}
                <Link href="/pricing-policy" className="underline">pricing policy</Link>{" "}
                for what&apos;s included.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Covenants
              </h2>
              <p className="leading-relaxed">
                Riverdale and Atherstone publish detailed external-treatment rules. Most
                internal treatments (plantation shutters, blockout rollers, sheer + blockout)
                are allowed without restriction. External products often need approval. See
                our{" "}
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
                As elsewhere, our honest recommendation is to read the spec carefully and
                consider negotiating the allowance out of the contract. See our{" "}
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
                Across Tarneit, Deanside, Fraser Rise and the wider Wyndham and Melton
                corridor. We bring fabric samples, check the wind exposure of your specific
                lot, walk through your covenant, and quote in writing.
              </p>
              <PrimaryCTA location="inline" label="Book free in-home measure" />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Corridor suburbs:{" "}
                <Link href="/locations/tarneit" className="underline">Tarneit</Link>{" "}·{" "}
                <Link href="/locations/deanside" className="underline">Deanside</Link>{" "}·{" "}
                <Link href="/locations/fraser-rise" className="underline">Fraser Rise</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Other growth corridors:{" "}
                <Link href="/guides/window-furnishings-south-east-growth-corridor" className="underline">South-East corridor guide</Link>{" "}·{" "}
                <Link href="/guides/window-furnishings-northern-growth-corridor" className="underline">Northern corridor guide</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Related:{" "}
                <Link href="/guides/pooja-prayer-room-blackout-curtains-australia" className="underline">Pooja & prayer-room blackout</Link>{" "}·{" "}
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
