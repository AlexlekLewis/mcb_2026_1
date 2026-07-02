import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema, LocalBusinessSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { PageViewTracker } from "@/components/PageViewTracker";

/**
 * Pilot rewrite of /locations/clyde-north in the woven content style.
 *
 * Static segment wins over the dynamic /locations/[suburb] route, so this
 * file serves this URL exclusively. The other 10 growth-corridor suburbs
 * continue to use the dynamic /[suburb] template until each gets its own
 * woven rewrite. This is intentional — Clyde North is the first template,
 * and the 7-day data on this page determines whether we replicate to the
 * other 10 (per CLAUDE.md kill-or-keep discipline).
 */

const SUBURB = {
  name: "Clyde North",
  slug: "clyde-north",
  postcode: "3978",
  latitude: -38.106283,
  longitude: 145.348426,
};

export const metadata: Metadata = {
  title: "Curtains & Blinds Clyde North 3978",
  description:
    "Window furnishings for new-build homes in Clyde North 3978. Curtains, blinds, plantation shutters and roller shutters fitted across Smiths Lane, Eliston, Five Farms and the wider Casey growth corridor. Free in-home measure and quote.",
  alternates: { canonical: "/locations/clyde-north" },
  openGraph: {
    title: "Window furnishings — Clyde North 3978",
    description:
      "Curtains, blinds, shutters and security screens for new-build homes in Clyde North and the Casey growth corridor.",
  },
};

const faqItems = [
  {
    question: "Do you cover Clyde North?",
    answer:
      "Yes. We measure, supply and install curtains, blinds, plantation shutters, roller shutters, security doors, fly screens and outdoor blinds across Clyde North 3978 and the surrounding Casey growth corridor — including Clyde, Officer, Officer South, Berwick and Cranbourne East. Free in-home measure and quote, no obligation.",
  },
  {
    question: "When in our Metricon/Henley/Simonds build should we book the measure?",
    answer:
      "Lock-up stage. The windows are in their final position and the plaster is done, so the measurements are accurate, and you've got enough time to manufacture and install before move-in. Earlier than lock-up and the measurements aren't final; later and you're moving in with bare windows.",
  },
  {
    question: "What window furnishings work best for west-facing courtyards in Smiths Lane and Five Farms?",
    answer:
      "West-facing courtyards in the Clyde North estates take heavy afternoon sun, especially on the two-storey designs that look over them. Plantation shutters and external roller shutters both work well — shutters give you a cleaner front-of-house look and stay covenant-friendly, roller shutters give you the strongest thermal performance. For the rooms facing the courtyard, a double-roller (sunscreen + blockout on the same bracket) handles the glare during the day and full darkness at night.",
  },
  {
    question: "Will the estate covenant let us fit roller shutters or outdoor blinds?",
    answer:
      "Some Casey estates restrict external treatments. The covenant rules vary by estate — we've fitted across Smiths Lane, Eliston, Five Farms, Arcadia, Timbertop, Orana, Kaduna Park and Arbourwood, and we know which estates allow what. Bring your covenant document to the measure and we'll walk through what's allowed and what isn't before we quote.",
  },
  {
    question: "How much should we budget for window furnishings on a new build in Clyde North?",
    answer:
      "A typical 4-bedroom double-storey home in Clyde North fitted with quality blockout roller blinds throughout sits at $2,400 to $2,900 supplied and installed. Add sheer curtains in the main living and bedroom windows for $3,000 to $4,000. Plantation shutters on the street-facing windows start at $100 to $1,000 per window. External roller shutters run $500 to $1,200 per window. Each is indicative; the written quote after the in-home measure is binding.",
  },
];

export default function ClydeNorthPage() {
  return (
    <>
      <PageViewTracker
        event="view_location"
        payload={{
          page_type: "location",
          page_variant: "woven_pilot",
          suburb_slug: SUBURB.slug,
          suburb_name: SUBURB.name,
          suburb_postcode: SUBURB.postcode,
          growth_corridor: "south-east",
        }}
      />
      <LocalBusinessSchema suburb={SUBURB} />
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Clyde North 3978 · Casey
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Window furnishings for new-build homes in Clyde North
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              We fit curtains, blinds and shutters across the Clyde North growth corridor every
              week — from the new releases at Smiths Lane and Eliston through Five Farms, Arcadia,
              Timbertop, Orana, Kaduna Park and Arbourwood. Most of what we&apos;re going to tell
              you below comes from doing exactly that, in the same builds you&apos;re moving
              into.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What we know about Clyde North homes
              </h2>
              <p className="mb-4 leading-relaxed">
                Clyde North&apos;s growth corridor is built almost entirely by the major volume
                builders — Metricon, Henley, Simonds, Carlisle Homes, Burbank, Boutique Homes —
                and the homes share a recognisable profile. Most are double-storey four-bedroom
                designs on 350–500 sqm lots, with two-tone facades, a small front porch, and
                stacker doors opening onto a courtyard at the rear. The block orientation runs
                roughly east-west on most streets, which means the courtyards take serious
                afternoon sun and the front-facing upstairs bedrooms heat up fast through the
                summer.
              </p>
              <p className="mb-4 leading-relaxed">
                A handful of things matter for window furnishings in these homes that don&apos;t
                matter as much elsewhere. The estates have deep covenants — Smiths Lane and Five
                Farms in particular restrict what external treatments can sit on the front of
                the house. The window reveals from the volume builders are predictable but
                shallow, so we measure carefully for inside-mount versus face-fit on each
                opening. Two-storey voids and stairwells with full-height glazing are common,
                which usually means motorisation for safety and convenience. And the front-room
                two-storey street-face needs privacy treatments that look as good from the
                street as from inside — that&apos;s where plantation shutters earn their place
                in this corridor.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What gets fitted most often in this part of the corridor
              </h2>
              <p className="mb-4 leading-relaxed">
                The configuration we install most often through Clyde North is roughly:
                plantation shutters to the street-facing front rooms (covenant-friendly,
                consistent across the facade, blocks the afternoon sun); blockout roller blinds
                throughout the bedrooms with sheer curtains layered over them in the main
                bedroom and the formal living; double rollers (sunscreen plus blockout) on the
                rooms facing the rear courtyard; and motorisation on the void or stairwell
                glazing where reach is the problem.
              </p>
              <p className="leading-relaxed">
                External roller shutters get fitted to the west-facing upstairs bedrooms on
                most of the homes we visit — they earn their cost back fast in those rooms
                because the thermal stack effect on a two-storey west-facing room is severe.
                And we fit security doors at the front and the alfresco access point on most
                jobs. The whole-house fitout is usually done in two or three install visits
                over a couple of weeks once the order is confirmed.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What a realistic Clyde North budget looks like
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical 4-bedroom double-storey home in one of the Clyde North estates,
                here&apos;s the indicative range we quote at the in-home measure. These figures
                are guides, not a quote — your written quote after the measure is the binding
                figure.
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Quality blockout roller blinds throughout</strong> (all bedrooms, media
                  room, secondary living) — $2,400 to $2,900 supplied and installed.
                </li>
                <li>
                  <strong>Sheer curtains in the main bedrooms and formal living</strong> —
                  $3,000 to $4,000.
                </li>
                <li>
                  <strong>Plantation shutters on the street-facing windows</strong> — $100 to
                  $1,000 per window depending on size and material, with the average per-square-metre
                  rate sitting around $299 for a quality finish.
                </li>
                <li>
                  <strong>External roller shutters</strong> on the west-facing upstairs
                  bedrooms — $500 to $1,000 per window base spec, or $800 to $1,200 per window
                  with motor and electrical install included.
                </li>
                <li>
                  <strong>Motorisation</strong> on void / stairwell glazing — built into the
                  per-blind price on those openings, or $180 to $280 to retrofit an existing
                  blind with a battery-operated motor.
                </li>
              </ul>
              <p className="mt-4 leading-relaxed">
                Put together, a typical full Clyde North fitout — plantation shutters on the
                street face, rollers throughout, sheers in the main rooms, roller shutters on
                the worst-facing windows — lands in the $7,000 to $12,000 range. Done once,
                installed properly, warranted by us for the life of the product.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Pricing on this page is indicative. See our{" "}
                <Link href="/pricing-policy" className="underline">pricing policy</Link>{" "}
                for what&apos;s included and what can change the price.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When to book the in-home measure
              </h2>
              <p className="mb-4 leading-relaxed">
                Lock-up stage. That&apos;s the right time to ring us. The windows are in their
                final position, the plaster is done, and we can measure to the millimetre.
                Most of the Clyde North homes we&apos;ve fitted have been measured four to six
                weeks before handover — that&apos;s a comfortable window for manufacture and
                install, with everything sitting ready for the day you get the keys.
              </p>
              <p className="leading-relaxed">
                If you&apos;re building with Metricon, Henley, Simonds, Carlisle or Burbank
                through one of the corridor estates, bring any window-furnishings inclusion
                spec your builder has offered to the measure. We&apos;ll quote against the
                same scope so you can compare like for like before you sign off on the
                builder&apos;s allowance.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Covenants and estate rules
              </h2>
              <p className="mb-4 leading-relaxed">
                Several of the Clyde North estates have covenant rules that restrict what
                external treatments can sit on the front of the house. Smiths Lane and Five
                Farms are the strictest; other estates allow more flexibility. We&apos;ve
                fitted across all of them and we&apos;ll walk through what your covenant says
                before we quote anything for the front face of the home. If roller shutters or
                folding-arm awnings are restricted, we&apos;ll put forward covenant-friendly
                alternatives — plantation shutters on the front, internal blockout for the
                upstairs bedrooms — that achieve the same outcome.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                A note on the builder&apos;s window-furnishings allowance
              </h2>
              <p className="mb-4 leading-relaxed">
                If your builder has offered a window-furnishings allowance as part of your
                contract, our honest recommendation is to read the spec carefully before
                accepting it. In our experience, builder-supplied window furnishings tend to be
                the cheapest budget product fitted at a premium price — because the supply
                arrangement runs on thin margins and the fitter is paid lean per-window rates.
                The product you end up with reflects the supply arrangement, not the contract
                dollar figure.
              </p>
              <p className="leading-relaxed">
                The cleanest move is to negotiate the allowance out of the contract and bring
                the same scope to us independently. If you&apos;re too far along for that, ring
                us anyway — we&apos;ll quote against the builder&apos;s spec so you know what
                their allowance is actually buying you. Free, no obligation. See our{" "}
                <Link
                  href="/guides/new-build-window-furnishings-not-included"
                  className="underline"
                >
                  new-build inclusions guide
                </Link>{" "}
                for the full pattern.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Common questions from Clyde North homeowners
              </h2>
              <p className="mb-4 leading-relaxed">
                The questions we hear most often, in plain prose:
              </p>
              <p className="mb-4 leading-relaxed">
                <em>Will the covenant let us put up roller shutters?</em> Depends on the estate
                — bring the document, we&apos;ll walk through it.{" "}
                <em>How long from measure to install?</em> A few weeks once the order is
                confirmed; we work backwards from your handover date.{" "}
                <em>What blocks the western afternoon sun best?</em> External roller shutters on
                the worst-facing bedrooms, plantation shutters or double rollers everywhere else.{" "}
                <em>Can the motorisation be added later?</em> Yes — retrofit motors run $180 to
                $280 per blind for battery-operated, with hardwired needing a sparky to install
                a GPO at each blind position.{" "}
                <em>Do you do the front security door at the same time?</em> Yes — we measure
                and quote curtains, blinds, shutters and security screens during the same
                appointment.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                If you&apos;re building or recently moved into Clyde North, Clyde, Officer or
                anywhere through the Casey growth corridor, book a free in-home measure. We bring
                samples, we measure every opening, and we give you a written quote that&apos;s
                yours for 30 days.
              </p>
              <PrimaryCTA
                location="inline"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Nearby suburbs we cover:{" "}
                <Link href="/locations/clyde" className="underline">Clyde</Link>{" "}·{" "}
                <Link href="/locations/officer" className="underline">Officer</Link>{" "}·{" "}
                <Link href="/locations/officer-south" className="underline">Officer South</Link>{" "}·{" "}
                <Link href="/locations/berwick" className="underline">Berwick</Link>{" "}·{" "}
                <Link href="/locations/cranbourne-east" className="underline">Cranbourne East</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Related reading:{" "}
                <Link href="/guides/new-build-window-furnishings-not-included" className="underline">
                  New-build inclusions guide
                </Link>{" "}·{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">
                  Blockout roller blinds
                </Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters" className="underline">
                  Plantation shutters
                </Link>{" "}·{" "}
                <Link href="/curtains/sheer" className="underline">
                  Sheer curtains
                </Link>{" "}·{" "}
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

