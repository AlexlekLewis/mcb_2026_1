import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { WovenQuestion } from "@/components/WovenQuestion";

export const metadata: Metadata = {
  title:
    "Are window furnishings included in a new build? | Modern Curtains and Blinds",
  description:
    "If you're building a new home in Melbourne, your builder contract probably doesn't include curtains, blinds or shutters. Here's what's standard, what to budget, and how to avoid paying premium prices for entry-tier product.",
  alternates: {
    canonical: "/guides/new-build-window-furnishings-not-included",
  },
  openGraph: {
    title: "Are window furnishings included in a new build?",
    description:
      "Honest answer for Melbourne new-build buyers. What's actually included, what to budget, and how to handle the builder's window-furnishings allowance.",
  },
};

// FAQPage JSON-LD lives invisibly in the structured-data layer so AI Overviews
// and Perplexity can extract the Q&A pairs even though the visible page reads
// as flowing prose. Per the woven content rule — no visible FAQ block on the page.
const faqItems = [
  {
    question: "Are blinds and window furnishings included in a new home package in Victoria?",
    answer:
      "No. The standard inclusions in a new-build contract from the major volume builders in Victoria (Metricon, Henley, Simonds, Carlisle, Burbank, Boutique, Mimosa, Stockland and others) do not include curtains, blinds or shutters. You'll either need to add a window-furnishings allowance to your contract or arrange your own supply and install before you move in.",
  },
  {
    question: "When during the build should I get a quote for window furnishings?",
    answer:
      "The right time is at lock-up stage — when the windows are installed and the plaster is done, but well before move-in. Lock-up gives us accurate measurements (the windows are in their final position), enough time to manufacture and install before you live in the home, and the option to coordinate with any electrical work for motorisation. Earlier than lock-up and the measurements aren't final; later and you're moving in with bare windows.",
  },
  {
    question: "Is the builder's window-furnishings allowance worth taking?",
    answer:
      "In our experience, no. Builder-supplied window furnishings are typically the cheapest budget product fitted at a premium price — because the inclusion is sold as a feature of the package, not measured against what the same money buys from a specialist. The smarter move is to negotiate the window-furnishings allowance out of your builder contract and get the same scope quoted independently. You'll usually end up with a far better product for similar money, with a real warranty, and a single point of contact you can ring if anything needs attention.",
  },
  {
    question: "What's the realistic budget for window furnishings on a new build in Melbourne?",
    answer:
      "For a three-bedroom single-storey new build, budget $1,200 to $1,800 for quality blockout roller blinds throughout. A four-bedroom double-storey usually runs $2,400 to $2,900. Layer sheer curtains over the rollers in the main bedrooms and living areas and you're adding around $3,000 to $4,000 for the curtains. Plantation shutters to the street-facing windows start at $100 to $1,000 per window depending on size and material. External roller shutters for security and afternoon sun are $500 to $1,200 per window. Each of those is indicative — your written quote after the in-home measure is the binding figure.",
  },
  {
    question: "Can I get the window furnishings installed before I move in?",
    answer:
      "Yes — and this is the timing most growth-corridor buyers ask for. Most standard curtain and blind orders are produced and installed within a few weeks of the order being confirmed. As long as you book the in-home measure once the home is at lock-up stage and there's a clear handover date, we can usually have the install complete before move-in or within the first week of occupancy.",
  },
];

export default function NewBuildInclusionsGuide() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              New-build buyer&apos;s guide
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Are window furnishings included in your new build? Almost certainly not — here&apos;s
              what to do about it.
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              If you&apos;re building in one of Melbourne&apos;s growth corridors — Clyde North,
              Officer, Wollert, Mickleham, Tarneit, anywhere through the south-east, north or
              west — there&apos;s a question that gets asked late in the build, usually around
              handover. <em>Did the builder include the blinds?</em> The honest answer is almost
              always no. This page walks through what&apos;s standard, what to budget, and how
              to avoid paying premium prices for entry-tier product.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <WovenQuestion questionId="q-builder-contracts-window-furnishings">
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The honest answer: builder contracts almost never include window furnishings
              </h2>
              <p className="mb-4 leading-relaxed">
                We fit window furnishings into new-build homes across Melbourne every day. The
                pattern is the same from one major volume builder to the next: the standard
                inclusion list for Metricon, Henley, Simonds, Carlisle, Burbank, Boutique,
                Mimosa, Stockland and the others does not cover curtains, blinds or shutters.
                You can usually <em>add</em> a window-furnishings allowance to your contract as
                an upgrade — and most buyers do, often without realising what they&apos;ve
                signed up for — but it&apos;s an extra line item, not a base inclusion.
              </p>
              <p className="leading-relaxed">
                If you&apos;ve been reading your inclusion list assuming the windows will be
                covered when you move in, you&apos;re not alone. It&apos;s one of the most
                common surprises in the final weeks of a build. The good news is there&apos;s
                enough time to do this properly if you start at the right stage.
              </p>
            </WovenQuestion>

            <WovenQuestion questionId="q-builder-allowance-what-it-buys">
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What a builder&apos;s &ldquo;window furnishings allowance&rdquo; actually buys you
              </h2>
              <p className="mb-4 leading-relaxed">
                When a builder offers an inclusion package with a window-furnishings allowance,
                it&apos;s usually a fixed-dollar amount handed to a third-party fitter the
                builder has a supply arrangement with. The dollar amount sounds generous on
                paper — but in our experience, the product you end up with reflects the supply
                arrangement, not the price tag. Builders have a tendency to fit the cheapest
                low-quality budget blinds at a premium cost compared to going to a proper
                recognised retailer that can guarantee you&apos;re getting what you pay for.
              </p>
              <p className="mb-4 leading-relaxed">
                The fitters working under these supply arrangements are paid lean per-window
                rates and run thin product margins. So the product specified is often the
                lowest-fabric-weight roller, the lightest-componentry bracket-and-tube, the
                hollow-PVC shutter rather than solid polymer. None of those choices are
                disclosed in the builder&apos;s allowance line item. You see &ldquo;blinds
                package $5,000&rdquo; in the contract and assume it&apos;s a fair-value tier
                of product.
              </p>
              <p className="leading-relaxed">
                The shortest version we can give you: we hear from buyers regularly whose
                builder-supplied window furnishings have started failing within the first year
                or two — clips snapping on Roman blinds, roller mechanisms sticking, cheap
                curtain tracks dropping at the brackets — and the supplier&apos;s warranty
                response has been slow or absent because the contract was with the builder,
                not with the homeowner. Then they need to replace the lot, and they&apos;ve
                effectively paid twice for the same windows.
              </p>
            </WovenQuestion>

            <WovenQuestion questionId="q-new-build-realistic-budget">
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What the realistic budget looks like
              </h2>
              <p className="mb-4 leading-relaxed">
                Here&apos;s an honest set of numbers for the most common new-build scopes in
                the Melbourne growth corridors. These are indicative — your written quote after
                an in-home measure is the figure that actually applies — but they&apos;re a
                useful budgeting anchor when you&apos;re deciding what to take on the builder
                contract and what to handle independently.
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Blockout roller blinds throughout a 3-bedroom single-storey home</strong>{" "}
                  — $1,200 to $1,800, supplied and installed.
                </li>
                <li>
                  <strong>Blockout roller blinds throughout a 4-bedroom double-storey home</strong>{" "}
                  — $2,400 to $2,900, supplied and installed.
                </li>
                <li>
                  <strong>Sheer curtains in the main living and bedroom windows</strong> of a
                  three-bedroom home — $3,000 to $4,000, supplied and installed.
                </li>
                <li>
                  <strong>Plantation shutters on the street-facing windows</strong> — $100 to
                  $1,000 per window depending on size, with the average per-square-metre rate
                  for quality plantation shutters sitting around $299.
                </li>
                <li>
                  <strong>External roller shutters</strong> for west-facing afternoon sun and
                  security — $500 to $1,000 per window base spec, or $800 to $1,200 per window
                  with motor and electrical install included.
                </li>
                <li>
                  <strong>Zipscreens / outdoor blinds</strong> on a standard alfresco opening
                  (3m × 2.5m) — $1,500 to $2,000 manual, $2,000 to $2,500 motorised.
                </li>
              </ul>
              <p className="mt-4 leading-relaxed">
                Put that together and a typical new-build fitout — quality roller blinds
                throughout, sheers in the main rooms, plantation shutters on the street face,
                roller shutters on the west-facing bedrooms — sits in the $7,000 to $12,000
                range depending on the size of the home and the specifications. Done once,
                installed properly, with a real warranty.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Pricing on this page is indicative only. See our{" "}
                <Link href="/pricing-policy" className="underline">pricing policy</Link>{" "}
                for what&apos;s included in each range and what can change the price.
              </p>
            </WovenQuestion>

            <WovenQuestion questionId="q-when-during-build-to-start">
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When during the build to start the conversation
              </h2>
              <p className="mb-4 leading-relaxed">
                The window furnishings conversation works best at <strong>lock-up stage</strong>.
                That&apos;s the point where your windows are installed in their final position,
                the plaster is done, and the home is structurally complete — but you haven&apos;t
                moved in yet. Booking the in-home measure at lock-up gives us accurate
                measurements (the windows are no longer going to shift), enough lead time to
                manufacture and install before you live there, and the option to coordinate any
                electrical work needed for motorisation while the home is still empty.
              </p>
              <p className="leading-relaxed">
                We try to discourage measuring earlier than lock-up. Even a millimetre of
                movement in a brick-veneer or double-storey window opening between frame stage
                and plaster will show up later as out-of-square fit. And we discourage waiting
                until after move-in for the obvious reason — bare windows at night, no privacy,
                and the install crew working around your furniture and kids.
              </p>
            </WovenQuestion>

            <WovenQuestion questionId="q-how-to-handle-builder-allowance">
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                How to handle the builder&apos;s allowance
              </h2>
              <p className="mb-4 leading-relaxed">
                If you&apos;re still in the contract stage, our honest recommendation is to
                negotiate the window-furnishings allowance <em>out</em> of the builder package
                and bring the same scope to us independently. The conversation is straightforward:
                ask the builder to remove the inclusion and reduce the contract value by the
                allowance amount. Most builders will do this — it&apos;s a margin item for them,
                not a cost item, so removing it costs them nothing.
              </p>
              <p className="mb-4 leading-relaxed">
                If you&apos;re too far along the contract to renegotiate, the next-best move is
                to bring the inclusion specification to us at the in-home measure. We&apos;ll
                quote against the same spec so you can compare like for like, and at least
                you&apos;ll know exactly what the builder&apos;s line item is buying you before
                you sign off on it.
              </p>
              <p className="leading-relaxed">
                Either way, you don&apos;t need to decide the full scope up front. You can take
                the builder&apos;s base inclusions, add nothing in the contract, and call us at
                lock-up. We&apos;ll measure, quote, and install — and you&apos;ll have a single
                point of contact for the life of the product instead of bouncing between the
                builder&apos;s supply chain and a fitter you&apos;ve never met.
              </p>
            </WovenQuestion>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What we do differently
              </h2>
              <p className="mb-4 leading-relaxed">
                MCB sits in the quality-at-fair-pricing tier of the market. We don&apos;t
                compete at the bottom — there&apos;s a flood of off-the-shelf and DIY-online
                product at that end and the math on those products doesn&apos;t survive an
                Australian summer. We don&apos;t quote unrealistic top-end pricing either. Our
                position is straightforward: top-quality custom roller blinds can last twenty
                years in a Melbourne home; good-quality mid-tier blinds typically run five to
                ten; and budget product starts showing wear inside the first three. We fit the
                upper bracket.
              </p>
              <p className="mb-4 leading-relaxed">
                The other thing we do is stand behind the install. Every measure is done by us,
                every install is done by our crew, and every warranty claim goes through one
                point of contact — the same person who quoted you in the first place. If
                something needs attention, you ring us. You don&apos;t chase a supplier on the
                other end of a builder&apos;s supply chain.
              </p>
              <p className="leading-relaxed">
                And we&apos;re honest about which rooms need which product. We don&apos;t
                upsell honeycomb where a well-fitted quality roller does the job. We don&apos;t
                push motorisation where a manual blind is fine. We give you the recommendation
                we&apos;d give a family member building in the same suburb.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Common questions buyers ask us about builder packages
              </h2>
              <p className="mb-4 leading-relaxed">
                The two we hear most often are timing and money. On timing — <em>how early
                should we book?</em> — the answer is to call once you have a confirmed lock-up
                date. Standard manufacturing and install runs a few weeks; if the home is at
                lock-up four to six weeks before handover, you&apos;re comfortably inside the
                window to have everything fitted before move-in.
              </p>
              <p className="mb-4 leading-relaxed">
                On money — <em>is the builder cheaper?</em> — almost never, once you factor in
                product quality. A $5,000 builder allowance commonly buys you entry-tier
                hollow-PVC or thin-fabric product that&apos;s typical of what fails inside the
                first two years. The same $5,000 spent through us, on quality custom roller
                blinds throughout a three-bedroom home plus sheers in the main rooms, buys a
                fitout you keep for the life of the home.
              </p>
              <p className="leading-relaxed">
                The other common question — <em>can the builder&apos;s supplier do what you do?</em>{" "}
                — depends on the builder and the supplier. Some volume-builder window-furnishings
                packages are decent; most are not. We&apos;re happy to look at the spec your
                builder has offered and tell you honestly what the equivalent quality scope would
                cost from us. Free of charge, no obligation.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                If you&apos;re at lock-up stage in a growth corridor home — Clyde North, Officer,
                Wollert, Mickleham, Tarneit, Donnybrook, Beveridge, Greenvale, Deanside, Fraser
                Rise, or anywhere else through the south-east, north or west of Melbourne — book
                a free in-home measure. We bring samples, we measure every opening, and we give
                you a written quote you can compare to whatever your builder has offered.
              </p>
              <PrimaryCTA
                location="inline"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related reading:{" "}
                <Link href="/locations/clyde-north" className="underline">
                  Window furnishings in Clyde North
                </Link>{" "}
                ·{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">
                  Blockout roller blinds
                </Link>{" "}
                ·{" "}
                <Link href="/curtains/sheer" className="underline">
                  Sheer curtains
                </Link>{" "}
                ·{" "}
                <Link href="/shutters/plantation-shutters" className="underline">
                  Plantation shutters
                </Link>{" "}
                ·{" "}
                <Link href="/pricing-policy" className="underline">
                  Pricing policy
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </article>
    </>
  );
}
