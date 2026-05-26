import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title:
    "Window furnishings — Northern growth corridor buyer's guide | Modern Curtains and Blinds",
  description:
    "Authoritative buyer's guide for window furnishings across Melbourne's northern growth corridor — Wollert, Donnybrook, Beveridge, Mickleham, Greenvale. Build profile, builder mix, pricing, covenants, multigenerational households, pooja room blackout, Aurora / Lyndarum / Cloverton estates.",
  alternates: {
    canonical: "/guides/window-furnishings-northern-growth-corridor",
  },
  openGraph: {
    title: "Window furnishings — Northern growth corridor buyer's guide",
    description:
      "Honest buyer's guide for Whittlesea, Hume and Mitchell new-build homes. What works, what costs, and how the corridor's multicultural community shapes the brief.",
  },
};

const faqItems = [
  {
    question: "What window furnishings work best for new-build homes in the northern growth corridor?",
    answer:
      "Sheer + blockout curtains layered through the main living and bedrooms — handles both daytime soft light and full nighttime privacy for parents' suites and prayer rooms. Blockout roller blinds in the secondary bedrooms. Plantation shutters or honeycomb blinds on the west-facing windows that take the worst afternoon sun. Motorisation where the home has tall stairwell glazing. The multicultural community across Wollert, Mickleham, Tarneit and the wider northern corridor often adds a pooja or prayer room blackout requirement to the brief.",
  },
  {
    question: "Are roller shutters allowed under the Aurora, Lyndarum or Cloverton covenants?",
    answer:
      "These large master-planned estates carry detailed external-treatment rules. Most allow internal treatments (plantation shutters, blockout rollers) without restriction. External products like roller shutters or folding-arm awnings often need approval or a colour-match to the facade — Cloverton publishes a comprehensive design manual that addresses external window furnishings as part of its broader facade-management requirements. Bring your covenant document to the in-home measure.",
  },
  {
    question: "Can you fit pooja or prayer room blackout in the northern growth corridor?",
    answer:
      "Yes. We fit pooja and prayer room blackout configurations across the northern corridor most weeks, especially through Wollert, Mickleham and the surrounding South Asian community. Triple-pass blockout curtains or sheer + blockout layered are the two patterns we recommend most. We'll walk through altar position, draft control, and fabric grade at the in-home measure.",
  },
  {
    question: "How much should we budget for window furnishings in the northern corridor?",
    answer:
      "For a typical 4-bedroom double-storey home: blockout rollers throughout $2,400–$2,900, sheer + blockout layered configurations $3,000–$4,000 across main living and bedrooms, plantation shutters on the west-facing windows $100–$1,000 per window, external roller shutters with motor and electrical $800–$1,200 per window. Indicative ranges only — the written quote after the in-home measure is the binding figure.",
  },
  {
    question: "Which builders dominate the northern growth corridor?",
    answer:
      "Metricon, Stockland, Henley, Mimosa, Boutique and Carlisle Homes are the largest volume builders across Wollert, Donnybrook, Beveridge, Mickleham and Greenvale. Lot sizes are typically larger than the south-east corridor, often with a downstairs guest or parents' retreat as part of the standard four-bedroom layout — which shapes the window furnishings brief.",
  },
];

export default function NorthernCorridorPillar() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Growth-corridor buyer&apos;s guide · Northern
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Window furnishings for the northern growth corridor
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              If you&apos;re building or moving into a new home through the northern growth
              corridor — Wollert, Donnybrook, Beveridge, Mickleham, Greenvale — this is the
              buyer&apos;s guide we&apos;d hand you at the in-home measure. It covers what
              the homes here actually need, what the realistic budget looks like, how the
              corridor&apos;s multicultural community shapes the brief, and what the major
              estate covenants restrict.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The shape of the corridor
              </h2>
              <p className="mb-4 leading-relaxed">
                The northern growth corridor spans three local government areas — Whittlesea
                (Wollert, Donnybrook), Hume (Mickleham, Greenvale) and Mitchell (Beveridge) —
                and runs along the Hume Highway corridor between the established northern
                Melbourne suburbs and the rural-residential pockets further north. Edgars
                Road, Epping Road, Donnybrook Road and Mickleham Road form the spine of the
                area. The Cloverton master-plan (in Kalkallo, immediately north of Donnybrook)
                is the largest single development project anchoring the corridor.
              </p>
              <p className="leading-relaxed">
                The corridor includes some of Australia&apos;s fastest-growing suburbs.
                Wollert in particular has seen huge population growth in recent years, with
                an exceptionally multicultural community — high South Asian (Indian, Sri
                Lankan, Punjabi) presence, growing African and Middle-Eastern communities, and
                large extended-family households. This demographic shapes the window
                furnishings brief in specific ways we&apos;ll walk through below.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Who builds here and what they build
              </h2>
              <p className="mb-4 leading-relaxed">
                Metricon, Stockland, Henley, Mimosa, Boutique and Carlisle Homes account for
                most of the new home completions through the northern corridor. Compared to
                the south-east, the homes here often sit on larger lots — wider front
                setbacks, longer side fence runs — and the standard four-bedroom layouts
                often include a downstairs guest suite or parents&apos; retreat.
              </p>
              <p className="leading-relaxed">
                The area is largely unshaded. Very few mature trees exist yet across the
                newer releases, so summer afternoon sun hits the western face of every home
                for several hours without any natural break. This makes thermal performance
                a more pressing concern in the corridor than in the more sheltered pockets
                of older Melbourne — external roller shutters and honeycomb blinds on the
                worst-facing rooms are common in the fit-outs we quote.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The estates by name
              </h2>
              <p className="mb-4 leading-relaxed">
                The major northern corridor estates we&apos;ve fitted in:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Aurora (Wollert)</strong> — large established master-planned estate; detailed design guidelines on external treatments.</li>
                <li><strong>Lyndarum (Wollert) and Lyndarum North</strong> — major Whittlesea-side releases; consistent contemporary facades.</li>
                <li><strong>Olivine (Donnybrook)</strong> — recent release on the Donnybrook side; tighter lot sizes than Aurora.</li>
                <li><strong>Cloverton (Kalkallo, adjacent to Donnybrook)</strong> — largest single development in the corridor; comprehensive design manual addressing external treatments and facade consistency.</li>
                <li><strong>Annadale (Wollert / Mickleham)</strong> — spans both suburbs in different stages.</li>
                <li><strong>Mickleham Rises (Mickleham)</strong> — major Hume-side release.</li>
                <li><strong>Highlands Mickleham / Highlands Donnybrook</strong> — adjacent releases along Mickleham Road.</li>
                <li><strong>Mandalay, Mandalay Rises (Beveridge)</strong> — northern-edge releases at the Mitchell-shire boundary.</li>
                <li><strong>Greenvale Gardens, Providence Greenvale</strong> — Hume releases between the established Greenvale and the newer west-edge.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                For suburb-specific detail, see the suburb pages:{" "}
                <Link href="/locations/wollert" className="underline">Wollert</Link>{" "}·{" "}
                <Link href="/locations/donnybrook" className="underline">Donnybrook</Link>{" "}·{" "}
                <Link href="/locations/beveridge" className="underline">Beveridge</Link>{" "}·{" "}
                <Link href="/locations/mickleham" className="underline">Mickleham</Link>{" "}·{" "}
                <Link href="/locations/greenvale" className="underline">Greenvale</Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What gets fitted most often
              </h2>
              <p className="mb-4 leading-relaxed">
                The northern corridor brief shapes a different fit-out mix than the
                south-east. The configuration we install most often:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Sheer + blockout curtains layered</strong> through the main living
                  and bedrooms. Handles daytime soft light and full nighttime privacy in a
                  single configuration — the workhorse fit-out for the corridor.
                </li>
                <li>
                  <strong>Blockout roller blinds</strong> in the secondary bedrooms — quality
                  fabric and componentry, rated for daily residential cycling.
                </li>
                <li>
                  <strong>Plantation shutters</strong> on the worst west-facing windows where
                  thermal performance and a clean facade both matter.
                </li>
                <li>
                  <strong>Honeycomb / cellular blinds</strong> on west-facing rooms where
                  thermal performance is the priority and a cleaner internal look is wanted.
                </li>
                <li>
                  <strong>Triple-pass blockout or sheer + blockout layered</strong> for pooja
                  and prayer rooms — full darkness on demand, soft daytime light, draft
                  control for steady diya flame.
                </li>
                <li>
                  <strong>Motorisation</strong> on stairwell glazing and tall windows.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Multigenerational households and the parents&apos; suite
              </h2>
              <p className="mb-4 leading-relaxed">
                A high share of homes through the northern corridor are multigenerational —
                parents living with adult children, or a family with grandparents in the
                downstairs guest suite. Many recent floor plans through the corridor reflect
                this: the standard four-bedroom layout often includes a self-contained
                downstairs bedroom + ensuite arrangement, sometimes with a private sitting
                area.
              </p>
              <p className="leading-relaxed">
                The window furnishings brief for the parents&apos; suite is usually: soft
                light during the day, full privacy at night, and a clear visual separation
                from the rest of the home. The fit-out we recommend most often is sheer +
                blockout layered on the bedroom window, plus a privacy panel or curtain on
                the suite doorway where the floor plan opens directly into shared living.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Pooja, prayer rooms, and cultural framing
              </h2>
              <p className="mb-4 leading-relaxed">
                Pooja rooms, mandir corners and prayer spaces have a quiet requirement that
                the rest of a home doesn&apos;t — proper darkness when the room is in use,
                soft filtered light the rest of the day, and a draft-free environment for a
                steady diya flame. Triple-pass blockout fabric, fitted ceiling-to-floor and
                wall-to-wall, is what handles this properly. For mandir corners (where the
                shrine sits in a nook rather than a dedicated room), a slim ceiling-mounted
                track running across the nook lets you draw a fabric screen across when the
                mandir is in use.
              </p>
              <p className="leading-relaxed">
                See our dedicated{" "}
                <Link
                  href="/guides/pooja-prayer-room-blackout-curtains-australia"
                  className="underline"
                >
                  pooja and prayer room blackout guide
                </Link>{" "}
                for the full pattern.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Pricing depth — what to budget
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical 4-bedroom double-storey home in the northern corridor:
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li><strong>Blockout rollers throughout</strong> — $2,400–$2,900 supplied and installed.</li>
                <li><strong>Sheer + blockout layered across main living and bedrooms</strong> — $3,000–$4,000.</li>
                <li><strong>Plantation shutters on west-facing windows</strong> — $100–$1,000 per window, ~$299/sqm average.</li>
                <li><strong>Honeycomb blinds on west-facing rooms</strong> — confirm at measure.</li>
                <li><strong>External roller shutters with motor + electrical</strong> — $800–$1,200 per window.</li>
                <li><strong>Motorisation retrofit</strong> — $180–$280 per blind for battery.</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                A typical full-house fitout — including a pooja room layered configuration
                if relevant — lands in the $7,000–$12,000 range. Indicative only; see our{" "}
                <Link href="/pricing-policy" className="underline">pricing policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Covenants
              </h2>
              <p className="leading-relaxed">
                Aurora, Lyndarum and Cloverton run the most detailed design controls. Most
                allow internal treatments freely; external products (roller shutters,
                folding-arm awnings) often need approval or a colour-match to the facade.
                See our{" "}
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
                Builder allowances are common across the corridor — and as elsewhere, our
                honest recommendation is to read the spec carefully. In our experience,
                builder-supplied window furnishings are typically cheapest budget product at
                a premium price. See our{" "}
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
                Across Wollert, Donnybrook, Beveridge, Mickleham, Greenvale and the wider
                Whittlesea, Hume and Mitchell corridor. We bring fabric samples, walk through
                your covenant, and quote in writing.
              </p>
              <PrimaryCTA location="inline" label="Book free in-home measure" />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Corridor suburbs:{" "}
                <Link href="/locations/wollert" className="underline">Wollert</Link>{" "}·{" "}
                <Link href="/locations/donnybrook" className="underline">Donnybrook</Link>{" "}·{" "}
                <Link href="/locations/beveridge" className="underline">Beveridge</Link>{" "}·{" "}
                <Link href="/locations/mickleham" className="underline">Mickleham</Link>{" "}·{" "}
                <Link href="/locations/greenvale" className="underline">Greenvale</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Other growth corridors:{" "}
                <Link href="/guides/window-furnishings-south-east-growth-corridor" className="underline">South-East corridor guide</Link>{" "}·{" "}
                <Link href="/guides/window-furnishings-western-growth-corridor" className="underline">Western corridor guide</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Related:{" "}
                <Link href="/guides/pooja-prayer-room-blackout-curtains-australia" className="underline">Pooja & prayer room blackout</Link>{" "}·{" "}
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
