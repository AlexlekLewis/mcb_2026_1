import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title:
    "Estate covenant rules for roller shutters, zipscreens and awnings in Melbourne | Modern Curtains and Blinds",
  description:
    "Which Melbourne growth-corridor estates restrict external roller shutters, zipscreens and awnings — and what's allowed instead. A walkthrough for buyers in Smiths Lane, Aurora, Riverdale, Cloverton and the rest of the south-east, north and west corridors.",
  alternates: {
    canonical: "/guides/estate-covenant-roller-shutters-zipscreens-melbourne",
  },
  openGraph: {
    title: "Estate covenant rules for window furnishings — Melbourne growth corridors",
    description:
      "What estate covenants do and don't allow for external window furnishings across the Casey, Hume, Whittlesea, Wyndham and Melton growth corridors.",
  },
};

const faqItems = [
  {
    question: "Are roller shutters allowed under most Melbourne estate covenants?",
    answer:
      "It varies by estate, and the rules sit in the covenant document the developer registers on title. Some growth-corridor estates allow external roller shutters with no special approval; some require a specific colour or finish to match the facade; some restrict them to the rear of the property only; and a small number prohibit them on the front elevation altogether. Always check your covenant before quoting — the document either came with your land contract or sits on the estate developer's website.",
  },
  {
    question: "Which estates are strictest on external treatments?",
    answer:
      "Across the south-east growth corridor, Smiths Lane and Five Farms typically run the strictest design guidelines. Across the north, the larger master-planned estates (Aurora, Lyndarum, Cloverton) carry detailed external-treatment rules. Across the west, Riverdale and Atherstone publish design guidelines that cover external window furnishings as part of the broader facade-management rules. The pattern is that newer, larger, master-planned estates carry stricter rules than older, smaller releases.",
  },
  {
    question: "If roller shutters aren't allowed, what works instead?",
    answer:
      "Two strong alternatives. First, plantation shutters fitted internally to the street-facing windows — they read very cleanly from outside, are nearly always allowed under covenants because they're an internal treatment, and they handle the privacy and sun-control job that buyers usually want from external shutters. Second, blockout roller blinds with side channels behind the existing window line — same internal-treatment exemption, similar performance on heat and privacy. We fit both configurations across the corridor regularly.",
  },
  {
    question: "Do estate covenants apply forever, or just at handover?",
    answer:
      "The covenant typically applies for a fixed period from when the estate was created — often 5 to 10 years — and may apply to any modification you make in that window. After the covenant period ends, the standard council building rules apply but the developer's design controls do not. Read your covenant for the specific term. The practical effect is that even if you bought in the first release, anything you fit during the covenant period still has to comply.",
  },
  {
    question: "Can MCB help us read our covenant before quoting?",
    answer:
      "Yes. Bring the covenant document to the in-home measure and we'll walk through the relevant sections together. We've worked across most of the major growth-corridor estates and we recognise the language. If your covenant requires a specific colour, profile, or approval from the estate's design review panel, we'll factor that into the quote so you know exactly what's involved before you sign off.",
  },
];

export default function EstateCovenantGuide() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Growth-corridor buyer&apos;s guide
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Estate covenant rules for roller shutters, zipscreens and awnings in Melbourne
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              If you&apos;re building or recently moved into a Melbourne growth-corridor estate
              — anywhere from Smiths Lane down south, through Aurora and Cloverton up north, out
              to Riverdale and Atherstone in the west — your estate covenant will have something
              to say about external window furnishings. The rules vary widely, and most buyers
              find out the hard way after they&apos;ve already chosen a product. This page walks
              through what to look for in your covenant, which products work where, and what
              the good alternatives are when the covenant says no.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What an estate covenant actually controls
              </h2>
              <p className="mb-4 leading-relaxed">
                An estate covenant is a document registered on the title of your land by the
                developer when the estate was created. It sits alongside the standard council
                planning rules and applies for a fixed period — typically five to ten years —
                from the date the estate was created. During that period, anything you do to
                the visible exterior of the property has to comply with what&apos;s written in
                the covenant. After the period expires, you&apos;re back to council rules and
                the developer&apos;s controls fall away.
              </p>
              <p className="leading-relaxed">
                For window furnishings, the covenant usually only cares about <em>external</em>{" "}
                treatments — roller shutters, folding-arm awnings, zipscreens, outdoor blinds,
                aluminium plantation shutters fitted externally. Internal treatments — curtains,
                blockout rollers, internal plantation shutters, honeycomb blinds — are almost
                never covered by the covenant because they&apos;re not visible from the street.
                That distinction matters when you&apos;re working out what&apos;s actually
                possible on your build.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                South-east growth corridor — Casey and Cardinia
              </h2>
              <p className="mb-4 leading-relaxed">
                The south-east growth corridor covers Clyde, Clyde North, Officer and Officer
                South. The major estates here include Smiths Lane, Eliston, Five Farms, Arcadia,
                Timbertop, Orana, Kaduna Park and Arbourwood. Smiths Lane and Five Farms run the
                strictest design guidelines — both estates have detailed rules on facade
                consistency, and external roller shutters on the front elevation typically need
                specific approval from the design review panel. Several allow them on the rear
                or sides without issue.
              </p>
              <p className="leading-relaxed">
                For the front-of-house treatments in Smiths Lane, Five Farms and the stricter
                releases, we fit internal plantation shutters as the covenant-friendly
                alternative — they read very cleanly from outside, hold the white-frame
                consistency the design guidelines usually require, and do the privacy and
                sun-control job. Roller shutters get fitted to the upstairs west-facing
                bedrooms where the covenant allows side-elevation installs.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Northern growth corridor — Whittlesea, Hume and Mitchell
              </h2>
              <p className="mb-4 leading-relaxed">
                The northern corridor covers Wollert, Donnybrook, Beveridge, Mickleham and
                Greenvale. The major estates include Aurora and Lyndarum, Olivine, Allura,
                Mickleham Rises, Annadale, Greenvale Gardens and Cloverton (in Kalkallo).
                Aurora and Lyndarum are large master-planned estates with detailed external-
                treatment rules. Cloverton publishes a comprehensive design manual that
                addresses external window furnishings as part of the broader facade-management
                requirements.
              </p>
              <p className="leading-relaxed">
                The general pattern is that roller shutters are allowed but constrained — the
                colour and profile usually need to match the home&apos;s facade scheme, and
                approval from the estate&apos;s design panel may be required for prominent
                installs. Zipscreens and outdoor blinds on alfresco areas are typically allowed
                without prominent restrictions because they&apos;re fitted to the rear of the
                home rather than the street face. Folding-arm awnings to the rear are usually
                fine; to the front, less common because of facade-consistency requirements.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Western growth corridor — Wyndham and Melton
              </h2>
              <p className="mb-4 leading-relaxed">
                The western corridor covers Tarneit, Deanside and Fraser Rise, with the
                broader Wyndham service area extending through Truganina, Point Cook and
                Wyndham Vale. The major estates include Riverdale, Habitat, Newgate, Newhaven,
                Atherstone, Bloomdale, Taylors Run, Westbrook and Aspect. Riverdale and
                Atherstone publish design guidelines that include external-treatment
                requirements.
              </p>
              <p className="leading-relaxed">
                The west has its own complication beyond just covenant rules — strong
                westerly wind exposure on tight 12.5m frontage lots. Zipscreens and folding-arm
                awnings need to be specified for the wind load on this side of Melbourne, and
                cheap off-the-shelf outdoor blinds don&apos;t survive the first big wind season.
                We specify external products with documented wind ratings appropriate to the
                site for this reason. Internal treatments — plantation shutters on the street
                face, blockout rollers throughout the bedrooms — handle the day-to-day job
                while sidestepping both the covenant and the wind exposure.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                The pattern: when external isn&apos;t allowed, internal usually is
              </h2>
              <p className="mb-4 leading-relaxed">
                Almost without exception, internal treatments are permitted where external
                treatments are restricted. The covenant cares about what the street sees. A
                plantation shutter fitted internally behind your front-facing window reads as a
                clean white line from the street and gives you the privacy and sun-control job
                that external products would have done — minus the covenant friction.
              </p>
              <p className="leading-relaxed">
                For homes where external sun-control is genuinely needed on a covenant-
                restricted facade — a fully west-facing two-storey with no shade — the workable
                combinations we install most often are: plantation shutters on the street face
                (covenant-friendly); blockout roller blinds with side channels on the
                upstairs west-facing bedrooms (full internal blackout, no external profile);
                and external roller shutters on the rear or side elevations where the covenant
                doesn&apos;t apply.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Bring the covenant to the in-home measure
              </h2>
              <p className="mb-4 leading-relaxed">
                If you&apos;re booking with us, bring the covenant document along to the
                in-home measure — paper copy or PDF, either works. We&apos;ll walk through the
                relevant sections together. If approval from the estate&apos;s design review
                panel is needed for a specific install, we&apos;ll factor that into the quote
                and lead time. If your covenant has expired (some of the older releases through
                the corridor are now past their covenant term), we&apos;ll tell you and the
                whole conversation simplifies.
              </p>
              <p className="leading-relaxed">
                We&apos;d rather discover the covenant constraint at the measure than at the
                install. Most of the surprises in this category — the buyer who&apos;s ordered
                a product that turns out to be non-compliant — happen because no one read the
                document up front. It&apos;s a fifteen-minute job at the measure and it saves a
                lot of late-stage friction.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                Bring your covenant document. We&apos;ll walk through the rules with you, recommend
                covenant-compliant products that achieve the same outcome you wanted, and quote
                in writing.
              </p>
              <PrimaryCTA
                location="inline"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related reading:{" "}
                <Link href="/shutters/plantation-shutters" className="underline">
                  Plantation shutters
                </Link>{" "}·{" "}
                <Link href="/shutters/roller-shutters" className="underline">
                  Roller shutters
                </Link>{" "}·{" "}
                <Link href="/awnings/zipscreens" className="underline">
                  Zipscreens
                </Link>{" "}·{" "}
                <Link href="/awnings" className="underline">
                  Awnings
                </Link>{" "}·{" "}
                <Link href="/guides/new-build-window-furnishings-not-included" className="underline">
                  New-build inclusions guide
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
