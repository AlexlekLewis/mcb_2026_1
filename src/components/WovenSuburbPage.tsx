import Link from "next/link";
import type { ReactNode } from "react";
import { FaqPageSchema, LocalBusinessSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { PageViewTracker } from "@/components/PageViewTracker";
import type { GrowthCorridor } from "@/lib/growth-corridors";

/**
 * Woven Suburb Page — shared composition for the growth-corridor suburb
 * rewrites. Each suburb's page file provides corridor + suburb-specific data
 * (estates near that suburb, a 2-paragraph micro-note unique to the suburb,
 * neighbour suburbs for related-reading links). This component composes that
 * with corridor-level shared prose for the parts of the page where the
 * substance genuinely doesn't differ by suburb (pricing, when-to-book,
 * covenant framing, CTA).
 *
 * The thin-content guardrail: every page composed by this component has at
 * minimum the suburb name + postcode + 2 paragraphs of suburb-genuinely-
 * unique copy + a unique nearby-estates list + LocalBusinessSchema + FAQPage
 * schema with at least one suburb-named question. The rest is corridor
 * framing, which is fine to repeat because it IS shared substance.
 */

interface NearbyLink {
  slug: string;
  label: string;
}

interface WovenSuburbPageProps {
  /** Suburb display name */
  name: string;
  /** URL slug, no leading slash */
  slug: string;
  /** Postcode */
  postcode: string;
  /** Latitude (for LocalBusinessSchema) */
  latitude: number;
  /** Longitude */
  longitude: number;
  /** Which growth corridor this suburb belongs to (regional corridors only — not cross-corridor) */
  corridor: Exclude<GrowthCorridor, "cross-corridor">;
  /** LGA name (Casey, Whittlesea, Wyndham etc.) */
  lga: string;
  /**
   * 4-8 specific estate names near or in this suburb. These appear in the
   * prose and supply the LLM-citation entity-density payload that
   * differentiates this page from the corridor template.
   */
  nearbyEstates: string[];
  /**
   * 2-paragraph micro-note unique to this suburb — what's specific about
   * the build profile, the demographic, the orientation, the typical street
   * setup in this exact suburb. The single biggest factor keeping each
   * suburb page from being thin content. Aim for 100-200 words of
   * genuinely-suburb-specific prose.
   */
  microNote: ReactNode;
  /** 3-5 nearby suburb links for the related-reading footer */
  nearby: NearbyLink[];
  /**
   * Two extra FAQ items unique to this suburb. The component adds 3 corridor-
   * shared items automatically. Suburb-named questions are encouraged for
   * AI-search entity matching.
   */
  suburbFaqs: Array<{ question: string; answer: string }>;
}

const CORRIDOR_LABEL: Record<GrowthCorridor, string> = {
  "south-east": "South-East",
  north: "Northern",
  west: "Western",
  "cross-corridor": "",
};

type RegionalCorridor = Exclude<GrowthCorridor, "cross-corridor">;

const CORRIDOR_BUILDERS: Record<RegionalCorridor, string> = {
  "south-east":
    "Metricon, Henley, Simonds, Carlisle, Burbank and Boutique Homes",
  north:
    "Metricon, Stockland, Henley, Mimosa, Boutique and Carlisle Homes",
  west:
    "Simonds, Henley, Metricon, Burbank, Boutique and Hotondo Homes",
};

const CORRIDOR_BUILD_PROFILE: Record<RegionalCorridor, string> = {
  "south-east":
    "Most are double-storey four-bedroom designs on 350-500 sqm lots, with two-tone facades, a small front porch, and stacker doors opening onto a courtyard at the rear. The block orientation runs roughly east-west on most streets, which means the courtyards take heavy afternoon sun and the front-facing upstairs bedrooms heat up fast through summer.",
  north:
    "Larger lots than the south-east, often with a downstairs guest or parents' retreat as part of the standard four-bedroom layout. Streets run on a wider grid and the area is largely unshaded — there are very few mature trees, so summer afternoon sun hits the western face of every home for several hours.",
  west:
    "Tight 12.5m frontage lots are standard, with two-storey street faces and wide stacker doors onto small private courtyards. The corridor takes serious westerly wind exposure — there are very few mature trees yet, so the wind pattern moves across the estates without much break, and external products need a documented wind rating to survive.",
};

const CORRIDOR_PRODUCT_MIX: Record<RegionalCorridor, string> = {
  "south-east":
    "Plantation shutters to the street-facing front rooms (covenant-friendly, consistent across the facade, blocks the afternoon sun); blockout roller blinds throughout the bedrooms with sheer curtains layered over them in the main bedroom and formal living; double rollers on the rooms facing the rear courtyard; motorisation on the void or stairwell glazing where reach is the problem.",
  north:
    "Sheer + blockout curtains layered through the main living and bedrooms (handles both daytime soft light and full nighttime privacy for parents' suites and prayer rooms); blockout roller blinds in the secondary bedrooms; plantation shutters or honeycomb blinds for the west-facing windows that take the worst afternoon sun; motorisation where the home has tall stairwell glazing.",
  west:
    "Double roller blinds throughout (sunscreen + blockout on the same bracket — the most useful single fit-out for these homes); plantation shutters to the street-facing windows for two-storey privacy; blockout curtains layered on the main bedroom; zipscreens or wind-rated outdoor blinds on the alfresco for the worst westerly days.",
};

const CORRIDOR_COVENANT_NOTE: Record<RegionalCorridor, string> = {
  "south-east":
    "Several of the south-east growth corridor estates have covenant rules that restrict what external treatments can sit on the front of the house. Smiths Lane and Five Farms are the strictest; other estates allow more flexibility. We've fitted across all of them, so bring your covenant document to the in-home measure and we'll walk through what's allowed.",
  north:
    "The larger master-planned estates in the northern growth corridor — Aurora, Lyndarum, Cloverton — carry detailed external-treatment rules. Most allow internal treatments (plantation shutters, blockout rollers) without restriction, but external products like roller shutters or folding-arm awnings often need approval or a colour-match to the facade. Bring your covenant to the in-home measure.",
  west:
    "The western growth corridor estates — Riverdale, Atherstone in particular — publish design guidelines that include external-treatment rules. Beyond the covenant itself, the western wind exposure means external products need to be specified to the wind classification of the site. Bring your covenant document so we can quote against both constraints.",
};

const CORRIDOR_DRIVE_NOTE: Record<RegionalCorridor, string> = {
  "south-east":
    "We work the south-east growth corridor on a regular weekly run. Most weeks we're in the area for measures and installs, and the drive time from Preston means we'll always give you a realistic arrival window and combine appointments in the same pocket on the same day where possible.",
  north:
    "We're in the northern growth corridor most weeks for measures and installs. Drive time from Preston is comfortable through the corridor — we'll always confirm a realistic arrival window with you the day before.",
  west:
    "We work the western growth corridor on a regular weekly run, combining measures and installs through Wyndham and Melton on the same day where possible. We'll confirm your arrival window the day before the appointment.",
};

const SHARED_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "When in our new build should we book the in-home measure?",
    answer:
      "Lock-up stage. The windows are in their final position, the plaster is done, and the measurements are accurate. Booking at lock-up gives us enough time to manufacture and install before move-in. Most of the corridor homes we fit are measured four to six weeks before handover.",
  },
  {
    question: "How much should we budget for window furnishings on a new build?",
    answer:
      "A typical 3-bedroom single-storey home with quality blockout roller blinds throughout is $1,200 to $1,800 supplied and installed. A 4-bedroom double-storey is $2,400 to $2,900. Sheer curtains in the main living and bedroom windows add $3,000 to $4,000. Plantation shutters on the street-facing windows start at $100 to $1,000 per window. External roller shutters run $500 to $1,200 per window with motor and electrical. Indicative ranges only — your written quote after the in-home measure is the binding figure.",
  },
  {
    question: "Is the builder's window-furnishings allowance worth taking?",
    answer:
      "In our experience, no. Builder-supplied window furnishings are typically the cheapest budget product fitted at a premium price. The smarter move is to negotiate the allowance out of your builder contract and have us measure and quote the same scope independently. See our new-build inclusions guide for the full pattern.",
  },
];

export function WovenSuburbPage(props: WovenSuburbPageProps) {
  const {
    name,
    slug,
    postcode,
    latitude,
    longitude,
    corridor,
    lga,
    nearbyEstates,
    microNote,
    nearby,
    suburbFaqs,
  } = props;

  const faqItems = [...suburbFaqs, ...SHARED_FAQS];

  const corridorLabel = CORRIDOR_LABEL[corridor];

  return (
    <>
      <PageViewTracker
        event="view_location"
        payload={{
          page_type: "location",
          page_variant: "woven_pilot",
          suburb_slug: slug,
          suburb_name: name,
          suburb_postcode: postcode,
          growth_corridor: corridor,
        }}
      />
      <LocalBusinessSchema
        suburb={{ name, slug, postcode, latitude, longitude }}
      />
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              {name} {postcode} · {lga}
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Window furnishings for new-build homes in {name}
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              We fit curtains, blinds and shutters across the {corridorLabel.toLowerCase()}{" "}
              growth corridor every week, including the new releases through {name} and the
              surrounding {lga} estates. Most of what you&apos;re reading below comes from
              doing exactly that, in the same builds you&apos;re moving into.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What we know about {name} homes
              </h2>
              <p className="mb-4 leading-relaxed">
                {name}&apos;s growth corridor is built largely by the major volume builders —{" "}
                {CORRIDOR_BUILDERS[corridor]} — and the homes share a recognisable profile.{" "}
                {CORRIDOR_BUILD_PROFILE[corridor]}
              </p>
              {microNote}
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What gets fitted most often in this part of the corridor
              </h2>
              <p className="leading-relaxed">
                The configuration we install most often through {name} and the surrounding
                estates is roughly: {CORRIDOR_PRODUCT_MIX[corridor]}
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What a realistic {name} budget looks like
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical new-build home in {name}, here&apos;s the indicative range we quote
                at the in-home measure. These figures are guides, not a quote — your written
                quote after the measure is the binding figure.
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Blockout roller blinds throughout a 3-bedroom single-storey home</strong>{" "}
                  — $1,200 to $1,800 supplied and installed.
                </li>
                <li>
                  <strong>Blockout roller blinds throughout a 4-bedroom double-storey home</strong>{" "}
                  — $2,400 to $2,900 supplied and installed.
                </li>
                <li>
                  <strong>Sheer curtains in the main living and bedroom windows</strong> —
                  $3,000 to $4,000 supplied and installed.
                </li>
                <li>
                  <strong>Plantation shutters on the street-facing windows</strong> — $100 to
                  $1,000 per window, with the average sitting around $299 per square metre for
                  a quality finish.
                </li>
                <li>
                  <strong>External roller shutters</strong> on the worst-facing windows — $500
                  to $1,000 per window base spec, or $800 to $1,200 per window with motor and
                  electrical install included.
                </li>
                <li>
                  <strong>Motorisation</strong> on void or stairwell glazing — built into the
                  per-blind price on those openings, or $180 to $280 to retrofit an existing
                  blind with a battery motor.
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Pricing on this page is indicative.{" "}
                <Link href="/pricing-policy" className="underline">
                  Full pricing policy →
                </Link>
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Estates near {name}
              </h2>
              <p className="leading-relaxed">
                Specific estates near {name} that we&apos;ve fitted homes in include{" "}
                {formatList(nearbyEstates)}. The fit-out is broadly the same across these
                releases, but the covenant rules and the orientation of the streets matter at
                the suburb level — both of which we&apos;ll walk through at the in-home measure.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                When to book the in-home measure
              </h2>
              <p className="leading-relaxed">
                Lock-up stage is the right time to ring us. The windows are in their final
                position, the plaster is done, and we measure to the millimetre. Most of the
                corridor homes we&apos;ve fitted have been measured four to six weeks before
                handover — comfortable for manufacture and install, with everything ready for
                the day you get the keys. {CORRIDOR_DRIVE_NOTE[corridor]}
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Covenants and estate rules
              </h2>
              <p className="leading-relaxed">
                {CORRIDOR_COVENANT_NOTE[corridor]} See our{" "}
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
                On the builder&apos;s window-furnishings allowance
              </h2>
              <p className="leading-relaxed">
                If your builder has offered a window-furnishings allowance, read the spec
                carefully before accepting it. In our experience, builder-supplied window
                furnishings are typically the cheapest budget product fitted at a premium
                price. The cleanest move is to negotiate the allowance out of the contract and
                bring the same scope to us independently. See our{" "}
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
                If you&apos;re building or recently moved into {name} {postcode} or anywhere
                through the {lga} growth corridor, book a free in-home measure. We bring
                samples, we measure every opening, and we give you a written quote that&apos;s
                yours for thirty days.
              </p>
              <PrimaryCTA location="inline" label="Book free in-home measure" />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Nearby suburbs we cover:{" "}
                {nearby.map((n, i) => (
                  <span key={n.slug}>
                    <Link href={`/locations/${n.slug}`} className="underline">
                      {n.label}
                    </Link>
                    {i < nearby.length - 1 ? " · " : ""}
                  </span>
                ))}
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Related reading:{" "}
                <Link
                  href="/guides/new-build-window-furnishings-not-included"
                  className="underline"
                >
                  New-build inclusions guide
                </Link>{" "}
                ·{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">
                  Blockout roller blinds
                </Link>{" "}
                ·{" "}
                <Link href="/shutters/plantation-shutters" className="underline">
                  Plantation shutters
                </Link>{" "}
                ·{" "}
                <Link href="/curtains/sheer" className="underline">
                  Sheer curtains
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

function formatList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
