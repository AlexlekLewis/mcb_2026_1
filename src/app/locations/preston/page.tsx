import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema, LocalBusinessSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { PageViewTracker } from "@/components/PageViewTracker";

/**
 * Established-suburb rewrite of /locations/preston.
 *
 * First page in the "established suburb" content style — the counterpart to the
 * woven growth-corridor pages (Clyde North etc.). Those pages are built around
 * new-build vocabulary: estates, volume builders, covenants. That vocabulary
 * does not fit Preston, which is an established inner-north suburb of period
 * homes, renovations and newer medium-density infill. So this page is built on
 * genuinely-true Preston substance instead: MCB's home base, the local housing
 * stock, heritage-overlay streets, the west-facing-extension problem, and the
 * body-corporate rules on the newer apartments — none of it templated.
 *
 * Static segment wins over the dynamic /locations/[suburb] route, so "preston"
 * is excluded from that route's generateStaticParams via hasDedicatedSuburbPage
 * in @/lib/locations. Kept indexable via ESTABLISHED_SUBURB_SLUGS.
 */

const SUBURB = {
  name: "Preston",
  slug: "preston",
  postcode: "3072",
  latitude: -37.739936,
  longitude: 145.010759,
};

export const metadata: Metadata = {
  // Brand suffix is appended by the root layout title template
  // ("%s | Modern Curtains and Blinds") — do NOT repeat it here or it doubles.
  title: "Curtains, Blinds & Shutters Preston 3072",
  description:
    "Curtains, blinds, plantation shutters and security screens in Preston 3072 — our home suburb. Period cottages, Californian bungalows, renovations and new apartments, all measured and fitted by a local team based in Preston. Free in-home measure and quote.",
  alternates: { canonical: "/locations/preston" },
  openGraph: {
    title: "Curtains, Blinds & Shutters — Preston 3072",
    description:
      "Preston is our home ground. Curtains, blinds, shutters and security screens measured and fitted across Preston's period homes, renovations and new apartments.",
  },
};

const faqItems = [
  {
    question: "Do you cover Preston?",
    answer:
      "Yes — Preston 3072 is our home suburb. We're based here, so we measure, supply and install curtains, blinds, plantation shutters, roller shutters, security doors, fly screens and outdoor blinds right across Preston and the surrounding inner-north, usually within a day or two of your enquiry. Free in-home measure and quote, no obligation.",
  },
  {
    question: "Can you match window furnishings to a period home in Preston?",
    answer:
      "Yes. A lot of Preston's homes are Victorian and Edwardian cottages and Californian bungalows with original tall double-hung sashes, and the reveals are rarely square. We measure each opening individually rather than assuming a standard size, and we'll talk through options that suit the period look — sheer and blockout curtains layered together, Roman blinds, or plantation shutters on the street-facing rooms.",
  },
  {
    question: "What's the best way to handle the western sun on a Preston rear extension?",
    answer:
      "The classic Preston renovation is a modern open-plan extension with big west-facing glazing on the back of an older cottage, and that afternoon sun is the single most common thing we're asked to fix. Honeycomb (cellular) blinds and quality blockout roller blinds both handle it well from the inside; for the worst rooms, external roller shutters or an outdoor blind stop the heat at the glass before it gets in.",
  },
  {
    question: "We're in a new Preston apartment with body-corporate rules — can you still help?",
    answer:
      "Yes, and it's common around the High Street, Bell Street and Preston Market pockets where a lot of the newer apartments and townhouses are. Owners' corporations often set rules on what window coverings can be seen from outside — usually a uniform backing colour or sightline. We work within those; bring any owners'-corporation guidelines to the measure and we'll quote to what's allowed.",
  },
  {
    question: "Can you quote curtains, blinds and a security door in one visit?",
    answer:
      "Yes. One in-home appointment covers the lot — curtains, blinds, plantation shutters, roller shutters, security doors, fly screens and outdoor blinds. We bring samples so you can compare fabrics and finishes in your own light, measure every opening, and leave you with a written quote that's yours for 30 days.",
  },
];

export default function PrestonPage() {
  return (
    <>
      <PageViewTracker
        event="view_location"
        payload={{
          page_type: "location",
          page_variant: "established_pilot",
          suburb_slug: SUBURB.slug,
          suburb_name: SUBURB.name,
          suburb_postcode: SUBURB.postcode,
        }}
      />
      <LocalBusinessSchema suburb={SUBURB} />
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Preston 3072 · Darebin
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Curtains, Blinds &amp; Shutters in Preston
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Preston is our home ground. Modern Curtains and Blinds is based right here in 3072,
              so this is the one suburb where we don&apos;t have to drive across town to know the
              houses — we know them because they&apos;re our own streets. Most of what&apos;s
              below comes from measuring and fitting windows in the same cottages, bungalows and
              new apartments you&apos;ll recognise from a walk down High Street.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Preston is our home suburb
              </h2>
              <p className="mb-4 leading-relaxed">
                We&apos;re a local business in the truest sense — our base is in Preston, and the
                inner-north is the part of Melbourne we cover first and know best. That means
                short lead times to your door, and a team that already understands how the homes
                around here are built before we&apos;ve measured a single window. When we say
                we&apos;re local to Preston, we mean the address, not the marketing.
              </p>
              <p className="leading-relaxed">
                It also means we&apos;re around. If something needs adjusting after install, or
                you want to add a room down the track, we&apos;re not a company that fitted your
                blinds once and vanished — we&apos;re a few minutes away.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What we know about Preston homes
              </h2>
              <p className="mb-4 leading-relaxed">
                Preston is a genuine mix, and the window furnishings that suit it change street to
                street. There are Victorian and Edwardian cottages and single-fronts with tall
                double-hung sashes and the occasional leadlight; a big spread of Californian
                bungalows and interwar brick homes; solid post-war brick veneers further out
                toward Reservoir; and a growing wave of new townhouses and apartments around the
                High Street, Bell Street, Preston Market and station precincts. Each of those asks
                a different question of a blind or a curtain.
              </p>
              <p className="mb-4 leading-relaxed">
                A few things matter here that don&apos;t matter as much in a brand-new estate. The
                period reveals are rarely square, so we measure every opening on its own rather
                than working to a standard size. Original sashes and leadlight are worth keeping,
                so we&apos;ll usually recommend treatments that frame them rather than hide them.
                And the single most common job we&apos;re called for is the classic inner-north
                renovation — a modern open-plan extension with large west-facing glazing bolted
                onto the back of an older home. That afternoon sun is what most Preston customers
                actually want solved.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What gets fitted most often in Preston
              </h2>
              <p className="mb-4 leading-relaxed">
                The combination we install most often through Preston is roughly: sheer and
                blockout curtains layered together in the period front rooms — keeping the
                street-facing heritage look soft while giving you full privacy and darkness at
                night; honeycomb (cellular) blinds or quality blockout roller blinds through the
                renovated rear rooms, where the west sun and the temperature swing on big glass do
                the most damage; and plantation shutters on the street-facing windows of the
                bungalows and cottages, where they hold the character of the facade and give you
                fine control over light and privacy.
              </p>
              <p className="leading-relaxed">
                For the newer apartments and townhouses, it&apos;s usually roller blinds and
                sheers specified to sit within the owners&apos;-corporation rules. Wherever the
                budget is tight, our honest advice is to spend it on the fabric and the fit rather
                than the fanciest system — a well-made blind measured and hung properly outlasts a
                cheap one several times over, and a poorly-fitted bargain blind is the thing we get
                called back to replace most.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Heritage streets — and what you can change
              </h2>
              <p className="leading-relaxed">
                Some of Preston&apos;s older pockets sit under Darebin heritage-overlay controls.
                In practice that mostly affects changes visible from the street — it rarely touches
                the internal window furnishings that make up the bulk of what we fit, so curtains,
                blinds and internal shutters are almost always fine. If you&apos;re considering
                anything external and street-facing, like roller shutters on the front of a period
                home, we&apos;ll flag it at the measure and suggest a treatment that gets you the
                same result without the friction — usually internal blockout or plantation shutters
                that read correctly from the footpath.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                New apartments and townhouses — the body corporate
              </h2>
              <p className="leading-relaxed">
                A lot of Preston&apos;s newer stock is medium-density: apartments and townhouses
                around the station, High Street and the Market. These almost always come with an
                owners&apos; corporation, and owners&apos; corporations commonly set rules on what
                your windows can look like from outside — a consistent backing colour, or a
                sightline everyone has to hold to. It&apos;s not a problem, it just needs to be
                designed in from the start. Bring any owners&apos;-corporation guidelines to the
                in-home measure and we&apos;ll make sure the quote sits inside them.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                What a realistic Preston budget looks like
              </h2>
              <p className="mb-4 leading-relaxed">
                For a typical Preston home, here&apos;s the indicative range we quote at the
                in-home measure. These are guides to help you plan, not a quote — every Preston
                home is a different shape, and the written quote after the measure is the binding
                figure.
              </p>
              <ul className="ml-5 list-disc space-y-2 leading-relaxed">
                <li>
                  <strong>Quality blockout roller blinds through a 2–3 bedroom home</strong> —
                  $1,200 to $1,800 supplied and installed.
                </li>
                <li>
                  <strong>Honeycomb (cellular) blinds for the west-facing rear rooms</strong> —
                  typically a small premium over rollers per window, for the extra thermal
                  performance on the worst glass.
                </li>
                <li>
                  <strong>Sheer and blockout curtains layered in the main living and bedroom</strong>{" "}
                  — $3,000 to $4,000 supplied and installed.
                </li>
                <li>
                  <strong>Plantation shutters on the street-facing period windows</strong> — $100
                  to $1,000 per window depending on size and material, with a quality finish
                  averaging around $299 per square metre.
                </li>
                <li>
                  <strong>Security doors and fly screens</strong> — quoted in the same visit,
                  fitted to the front and rear access points on most jobs.
                </li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Indicative pricing only, as at July 2026. Ranges assume standard-sized openings
                and a quality baseline fabric; heritage reveals, oversized or hard-to-access
                windows and premium fabrics can change the figure. Every job is priced from an
                on-site measure — see our{" "}
                <Link href="/pricing-policy" className="underline">
                  pricing policy
                </Link>{" "}
                for what&apos;s included and what can move the price.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                How we work in Preston
              </h2>
              <p className="leading-relaxed">
                Because Preston&apos;s our home base, we can usually get to you quickly and work
                around your schedule — mornings, after work, whatever suits. One appointment
                covers everything: we bring samples so you can compare fabrics, colours and mesh
                in your own light, measure every opening, and leave you with a written quote
                that&apos;s yours for 30 days. Curtains, blinds, shutters, security screens and
                outdoor blinds all get quoted together, so you&apos;re not booking three separate
                visits.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Common questions from Preston homeowners
              </h2>
              <p className="leading-relaxed">
                The questions we hear most often, in plain prose:{" "}
                <em>Do you actually cover Preston?</em> It&apos;s our home suburb — yes, and
                usually within a day or two.{" "}
                <em>Can you keep the period look?</em> That&apos;s most of what we do here — sheers,
                Romans and plantation shutters that suit an older home.{" "}
                <em>What stops the western afternoon sun?</em> Honeycomb or blockout rollers
                inside, external roller shutters or outdoor blinds for the worst rooms.{" "}
                <em>We&apos;re in an apartment with body-corp rules — is that a problem?</em> No,
                bring the guidelines and we&apos;ll quote inside them.{" "}
                <em>Can you do the security door at the same time?</em> Yes — one visit covers
                curtains, blinds, shutters and security screens together.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                If you&apos;re in Preston 3072 — a period cottage, a renovation, a bungalow or a
                new apartment — book a free in-home measure with the team that&apos;s based right
                here. We bring samples, measure every opening, and give you a written quote
                that&apos;s yours for 30 days.
              </p>
              <PrimaryCTA location="inline" label="Book free in-home measure" />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Nearby suburbs we cover:{" "}
                <Link href="/locations/thornbury" className="underline">Thornbury</Link>{" "}·{" "}
                <Link href="/locations/northcote" className="underline">Northcote</Link>{" "}·{" "}
                <Link href="/locations/reservoir" className="underline">Reservoir</Link>{" "}·{" "}
                <Link href="/locations/coburg" className="underline">Coburg</Link>
                .
              </p>
              <p className="mt-3 leading-relaxed">
                Related reading:{" "}
                <Link href="/curtains/sheer" className="underline">Sheer curtains</Link>{" "}·{" "}
                <Link href="/blinds/roller-blinds/blockout" className="underline">
                  Blockout roller blinds
                </Link>{" "}·{" "}
                <Link href="/blinds/honeycomb-blinds" className="underline">
                  Honeycomb blinds
                </Link>{" "}·{" "}
                <Link href="/shutters/plantation-shutters" className="underline">
                  Plantation shutters
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
