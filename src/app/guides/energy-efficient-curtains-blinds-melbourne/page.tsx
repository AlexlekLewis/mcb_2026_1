import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Layers,
  MoonStar,
  PanelTop,
  SunMedium,
  ThermometerSun,
  Timer,
} from "lucide-react";
import { ArticleSchema, FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { Reveal } from "@/components/Reveal";
import { WovenQuestion } from "@/components/WovenQuestion";

/**
 * Flagship seasonal editorial — winter/spring 2026.
 *
 * Targets the energy-efficiency query cluster the site has never competed in
 * (GSC 3-month pull, Aug 2026: zero queries containing thermal/energy/winter
 * across 1,000 rows) while feeding internal link equity to the money pages
 * already in striking distance (blockout curtains/blinds, double rollers,
 * honeycomb). Buyer questions are woven into prose per house style; the
 * FAQPage JSON-LD below carries the same answers for answer engines.
 */
export const metadata: Metadata = {
  title: "Energy-Efficient Curtains & Blinds Melbourne",
  description:
    "Warm in winter, cooler in summer, cheaper to run. How quality curtains and blinds cut the heat your Melbourne home loses through its windows — and why fixing your windows beats moving house this year.",
  alternates: {
    canonical: "/guides/energy-efficient-curtains-blinds-melbourne",
  },
  openGraph: {
    title: "Energy-efficient curtains and blinds for Melbourne homes",
    description:
      "Up to 40% of your heating can escape through glass. What we fit to stop it — blockout curtains, layered doubles, snug rollers and honeycombs — and what it costs.",
  },
};

const PUBLISHED = "2026-08-13";

const faqItems = [
  {
    question: "Do blockout curtains actually keep heat in during winter?",
    answer:
      "Yes — meaningfully. A lined blockout curtain traps a layer of still air between the fabric and the glass, and still air is one of the best insulators there is. The catch is coverage: the curtain needs to run wider than the window frame, drop below the sill (to the floor is better), and sit close to the glass. A skimpy curtain that floats mid-air with gaps around every edge lets warm room air slide behind it, chill against the glass, and pour back out the bottom — so a poorly fitted curtain can do very little. Fit is most of the result, which is why we measure in your home rather than sell off a shelf.",
  },
  {
    question: "What are the best blinds to keep a Melbourne home warm?",
    answer:
      "Honeycomb (cellular) blinds are the strongest insulating blind — their hexagon cells trap air in pockets across the whole window. A quality blockout roller blind, measured snug inside the reveal so the gaps around the edges are small, is the value pick and gets you a lot of the benefit for less. A double roller adds a sunscreen layer for daytime, and layering any blind with a curtain over the top performs better than either alone. What matters more than the product name is the fit: a blind with daylight showing around all four edges is barely insulating anything.",
  },
  {
    question: "How much heat does a home lose through its windows?",
    answer:
      "Glass is the weakest thermal point of almost every Australian home — a single pane insulates poorly compared to an insulated wall. Up to 40% of a home's heating energy can be lost through its windows in winter, and bare glass is also where summer heat pours in. Covering the glass properly with lined curtains or close-fitting blinds is the fastest, cheapest way to close that gap — far cheaper than replacing the glazing itself.",
  },
  {
    question: "Are honeycomb blinds worth the extra cost over roller blinds?",
    answer:
      "Honestly — it depends on the room. Honeycomb cells trap air across the glass and are the best insulating blind you can fit. But a well-made blockout roller, measured tight to the opening, closes most of the same gap at a lower price point. For a bedroom you sleep in every night on a cold side of the house, honeycombs earn their keep. For a spare room or a window you rarely dress, a snug blockout roller is the smarter spend. We fit both, so we'll tell you straight which one each room deserves.",
  },
  {
    question: "Is it worth renovating instead of selling in Melbourne right now?",
    answer:
      "That's a conversation for you and your own advisers — but the pattern we see in Melbourne homes is clear: with values flat to slightly lower and forecasters split on when that turns, more owners are choosing to improve the home they already own rather than pay stamp duty, agent fees and moving costs to buy someone else's. Money spent making your own home warmer, quieter and better finished is money you get to live with every single day — and for most family homes, any value it adds is generally free of capital gains tax when you eventually sell, unlike an investment property. Ask your accountant how that applies to you.",
  },
  {
    question: "Do motorised blinds save energy?",
    answer:
      "Motorisation is a convenience product first — remotes, schedules, app and voice control — not an insulation product. Where it quietly helps in winter is timing: a schedule that closes every blind and curtain at dusk, every day, means the insulation you paid for is actually deployed before the evening chill sets in, whether you're home or not. But if you're motorising, do it because you'll love the convenience — the warmth discipline is a bonus.",
  },
];

/** Product cards — each links to a money page. */
const fixes = [
  {
    icon: MoonStar,
    title: "Blockout curtains",
    href: "/curtains/blockout",
    blurb:
      "Lined fabric, fitted wide of the frame and down to the floor. The single biggest warmth upgrade for a cold room — and the room looks finished.",
    tag: "The winter hero",
  },
  {
    icon: Layers,
    title: "Double curtains — sheer + blockout",
    href: "/curtains/double-curtains",
    blurb:
      "Sheer drawn by day for soft light and privacy, blockout drawn at dusk for warmth and sleep. The best-performing, best-looking combination we fit.",
    tag: "Best all-rounder",
  },
  {
    icon: PanelTop,
    title: "Blockout roller blinds",
    href: "/blinds/roller-blinds/blockout",
    blurb:
      "Measured snug to the opening so the edge gaps are small. Fitted right, a quality blockout roller closes most of the gap for less money.",
    tag: "The value pick",
  },
  {
    icon: SunMedium,
    title: "Double roller blinds",
    href: "/blinds/double-roller-blinds",
    blurb:
      "Blockout and sunscreen on one bracket. Daytime glare control and outlook, night-time cover — one clean unit on the window.",
    tag: "Day + night",
  },
  {
    icon: ThermometerSun,
    title: "Honeycomb blinds",
    href: "/blinds/honeycomb-blinds",
    blurb:
      "Hexagon cells trap a blanket of air across the glass — the strongest insulating blind made. Earns its keep on bedrooms and cold-side windows.",
    tag: "Maximum insulation",
  },
  {
    icon: Timer,
    title: "Motorisation",
    href: "/blinds/motorised-blinds",
    blurb:
      "Convenience first: remotes, schedules, voice. A dusk schedule also means your blinds and curtains actually close before the cold arrives.",
    tag: "Set and forget",
  },
];

export default function EnergyEfficiencyGuide() {
  return (
    <>
      <ArticleSchema
        headline="Energy-efficient curtains and blinds for Melbourne homes"
        description="How quality window furnishings cut winter heat loss and summer heat gain in Melbourne homes — what to fit, what it costs, and why improving beats moving this year."
        path="/guides/energy-efficient-curtains-blinds-melbourne"
        datePublished={PUBLISHED}
      />
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        {/* ————— Editorial hero ————— */}
        <header className="bg-mcb-charcoal text-white">
          <div className="container mx-auto max-w-4xl px-4 pb-16 pt-20 md:pb-20 md:pt-28">
            {/* Deliberately NOT wrapped in <Reveal>: the h1 here is the LCP
                element, and an opacity-0 entrance delays Largest Contentful
                Paint. Motion starts below the fold. */}
            <div>
              <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-clay-light">
                Seasonal guide · Winter–spring 2026
              </span>
              <h1 className="mb-6 font-serif text-4xl leading-[1.08] md:text-6xl">
                The warmest thing you&apos;ll do for your home this year
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-stone-300 md:text-xl">
                Melbourne winters find every gap in a house — and the biggest gap
                is the glass. Here&apos;s how the right curtains and blinds keep
                the warmth you&apos;ve already paid for, why fit matters more than
                anything on the label, and why so many Melbourne owners are
                putting money into the home they have instead of moving.
              </p>
              <p className="mt-8 text-sm uppercase tracking-widest text-stone-400">
                By the Modern Curtains and Blinds team · Updated 13 August 2026 ·
                8 min read
              </p>
            </div>
          </div>
        </header>

        {/* ————— Pull stat ————— */}
        <section className="border-b border-stone-200 bg-white">
          <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
            <Reveal>
              <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
                <p className="font-serif text-7xl leading-none text-mcb-terracotta md:text-8xl">
                  40<span className="text-5xl md:text-6xl">%</span>
                </p>
                <div>
                  <p className="text-xl leading-relaxed text-mcb-charcoal md:text-2xl">
                    Up to <strong>40% of a home&apos;s heating</strong> can be
                    lost through its windows. Not the walls, not the roof —
                    the glass.
                  </p>
                  <p className="mt-3 leading-relaxed text-stone-500">
                    Every winter evening, the heat you&apos;re paying for slides
                    straight out through bare panes. Covering them properly is
                    the fastest, cheapest fix a Melbourne home can make.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="container mx-auto max-w-3xl px-4 py-16">
          <div className="space-y-16 text-stone-700">
            {/* ————— Why glass ————— */}
            <WovenQuestion questionId="q-energy-why-windows-lose-heat">
              <Reveal>
                <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                  Why your windows are the coldest part of the house
                </h2>
                <p className="mb-4 leading-relaxed">
                  Walls have insulation in them. Ceilings have batts. Glass has —
                  glass. A single pane is a terrible insulator, and most
                  Melbourne homes, including plenty of near-new builds, are
                  single-glazed. Stand next to a bare window on a July night and
                  you can feel it working against you: warm air hits the cold
                  pane, cools, sinks, and rolls back across the floor. That
                  draught you feel around your ankles isn&apos;t coming under the
                  door — a lot of it is your own heating falling off the glass.
                </p>
                <p className="leading-relaxed">
                  The fix doesn&apos;t have to be new windows. Double glazing is
                  a fine thing, but it&apos;s a renovation-sized spend. The
                  practical move — the one that costs hundreds per window rather
                  than thousands — is to trap a layer of still air against the
                  glass with a properly fitted curtain or blind. Still air is one
                  of the best insulators there is. Every product we&apos;ll talk
                  about below is really just a different way of holding still air
                  where it does the most good.
                </p>
              </Reveal>
            </WovenQuestion>

            {/* ————— Fit is the product ————— */}
            <WovenQuestion questionId="q-energy-fit-beats-label">
              <Reveal>
                <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                  The part nobody tells you: fit beats the label
                </h2>
                <p className="mb-4 leading-relaxed">
                  People ask us whether blockout curtains actually keep the heat
                  in, and the honest answer is: the good ones do, and the badly
                  fitted ones barely help at all. A curtain that stops at the
                  sill, hangs narrow, and floats well clear of the glass leaves a
                  chimney behind it — warm air slips in at the top, chills
                  against the pane, and pours out the bottom all night. Same
                  fabric, same colour, almost none of the benefit.
                </p>
                <p className="mb-4 leading-relaxed">
                  What makes the difference is everything a sharp-eyed measure
                  picks up. The curtain running wider than the frame and down to
                  the floor. The blind sitting snug in the reveal so the edge
                  gaps are small. A pelmet or a closed-off track top, so warm
                  air can&apos;t dive in over the rail and start that loop in the
                  first place — the single most overlooked detail in the whole
                  job. None of that comes in a packet from a warehouse shelf; it
                  comes from someone standing in your room with a tape measure
                  who has done it a few thousand times.
                </p>
                <p className="leading-relaxed">
                  That&apos;s the real difference between cheap ready-mades and
                  made-to-measure. The cheap option isn&apos;t just a plainer
                  fabric — it&apos;s the gaps around all four edges doing quiet
                  damage to your power bill every night, then sagging and fading
                  until you replace it anyway. Buying twice is the expensive way
                  to buy curtains.
                </p>
              </Reveal>
            </WovenQuestion>

            {/* ————— What to fit (product cards) ————— */}
            <section>
              <Reveal>
                <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                  What we fit to keep the warmth in
                </h2>
                <p className="mb-8 leading-relaxed">
                  Different rooms deserve different answers — a bedroom on the
                  cold side of the house has a different job to a north-facing
                  living room. These are the products doing the work in Melbourne
                  homes this winter, and what each one is best at.
                </p>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-2">
                {fixes.map((f, i) => (
                  <Reveal key={f.href} delay={Math.min(i * 0.06, 0.24)}>
                    <Link
                      href={f.href}
                      className="group flex h-full flex-col rounded-sm border border-stone-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-mcb-clay hover:shadow-lg"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <f.icon className="h-7 w-7 text-mcb-terracotta" />
                        <span className="rounded-sm bg-mcb-sand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-mcb-terracotta-deep">
                          {f.tag}
                        </span>
                      </div>
                      <h3 className="mb-2 font-serif text-xl leading-tight text-mcb-charcoal group-hover:text-mcb-terracotta">
                        {f.title}
                      </h3>
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-stone-600">
                        {f.blurb}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mcb-terracotta">
                        See options{" "}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* ————— Honest comparison ————— */}
            <WovenQuestion questionId="q-energy-honeycomb-vs-roller">
              <Reveal>
                <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                  Honeycombs, rollers, or curtains — where your money works
                  hardest
                </h2>
                <p className="mb-4 leading-relaxed">
                  If you&apos;re wondering whether honeycomb blinds are worth the
                  extra over rollers, here&apos;s how we call it in people&apos;s
                  homes. Honeycomb cells trap air across the whole pane —
                  they&apos;re the strongest insulating blind made, and on a
                  bedroom you sleep in every night they earn their price. But a
                  quality blockout roller, measured snug so daylight
                  doesn&apos;t show around the edges, closes most of the same
                  gap for less. On a spare room, the roller is usually the
                  smarter spend. We sell both, so we&apos;ve got no reason to
                  talk you into the dearer one.
                </p>
                <p className="leading-relaxed">
                  And the best-performing window in the house is usually a
                  layered one: a blind at the glass with a{" "}
                  <Link href="/curtains/blockout" className="underline">
                    lined curtain
                  </Link>{" "}
                  over the top, or a{" "}
                  <Link href="/curtains/double-curtains" className="underline">
                    sheer-plus-blockout double
                  </Link>{" "}
                  on a dual track. Two layers, two air pockets, and a room that
                  holds its warmth into the small hours — with the soft, finished
                  look that a bare blind on its own never quite manages. If
                  summer glare is the other half of your problem — a west-facing
                  room that cooks from 3pm — the same logic runs in reverse, and
                  a{" "}
                  <Link
                    href="/blinds/roller-blinds/sunscreen"
                    className="underline"
                  >
                    sunscreen layer
                  </Link>{" "}
                  or{" "}
                  <Link href="/awnings" className="underline">
                    outdoor shade
                  </Link>{" "}
                  keeps the heat off the glass before it gets in.
                </p>
              </Reveal>
            </WovenQuestion>

            {/* ————— Improve vs move ————— */}
            <WovenQuestion questionId="q-energy-improve-vs-move">
              <Reveal>
                <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                  Why this is the year to improve, not move
                </h2>
                <p className="mb-4 leading-relaxed">
                  There&apos;s a bigger reason this guide exists, and it&apos;s
                  not just the weather. Melbourne values have been flat to
                  slightly lower this year, and the forecasters are split on
                  when that turns. When prices aren&apos;t running, the maths of
                  trading houses gets ugly — stamp duty, agent fees, moving
                  costs, and months of upheaval, all to buy a house with someone
                  else&apos;s window furnishings. Plenty of owners are looking at
                  that and making the other call: stay put, and make the home you
                  already own warmer, quieter and better finished.
                </p>
                <p className="mb-4 leading-relaxed">
                  Money spent on your own home is money you live with every day.
                  You feel it the first cold evening after the install, and every
                  evening after that — a living room that holds its heat, a
                  bedroom that&apos;s dark and still at 6am, and a heater that
                  doesn&apos;t have to work as hard to get there. And there&apos;s
                  a quiet tax angle most people never think about: for most
                  family homes, the value your own home gains is generally exempt
                  from capital gains tax when you eventually sell — unlike an
                  investment property. We&apos;re curtain people, not
                  accountants, so ask yours how it applies to you — but improving
                  the home you live in is one of the few places your money works
                  that way.
                </p>
                <p className="leading-relaxed">
                  Custom window furnishings sit in a sweet spot on that list:
                  they change how every room looks and feels, they do real
                  thermal work morning and night, and they&apos;re fitted in
                  days, not renovation months. No permits, no skip bin in the
                  driveway, no living in a construction site through spring.
                </p>
              </Reveal>
            </WovenQuestion>

            {/* ————— Pricing (protected) ————— */}
            <Reveal>
              <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm md:p-8">
                <h3 className="mb-3 font-serif text-xl leading-tight text-mcb-charcoal md:text-2xl">
                  What a warmer room costs
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-stone-600">
                  Every home is different, but as a working guide for a single
                  standard window (around 3m × 2.7m, supplied and installed):
                </p>
                <ul className="ml-5 list-disc space-y-1.5 text-sm leading-relaxed text-stone-600">
                  <li>
                    Blockout curtain, lined and fitted floor-length:{" "}
                    <strong>$600 to $1,000</strong>
                  </li>
                  <li>
                    Sheer + blockout double on a dual track:{" "}
                    <strong>$1,500 to $2,000</strong>
                  </li>
                  <li>
                    Blockout roller blinds and honeycombs come in under a
                    curtain fitout for the same window — we&apos;ll price both
                    at the measure so you can compare like for like.
                  </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-stone-500">
                  Indicative pricing only, based on our standard fabric ranges at
                  a typical window size — reviewed August 2026. Your written
                  quote after the free in-home measure is the binding figure.{" "}
                  <Link href="/pricing-policy" className="underline">
                    Full pricing policy →
                  </Link>
                </p>
              </section>
            </Reveal>

            {/* ————— Room by room ————— */}
            <WovenQuestion questionId="q-energy-room-by-room">
              <Reveal>
                <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                  A quick room-by-room call sheet
                </h2>
                <p className="mb-4 leading-relaxed">
                  <strong className="text-mcb-charcoal">Bedrooms:</strong>{" "}
                  warmth and darkness carry equal weight — a{" "}
                  <Link href="/curtains/blockout" className="underline">
                    blockout curtain
                  </Link>{" "}
                  or{" "}
                  <Link href="/blinds/honeycomb-blinds" className="underline">
                    honeycomb
                  </Link>{" "}
                  , floor-length where the room allows it. Kids sleep later in
                  dark rooms; so do you.
                </p>
                <p className="mb-4 leading-relaxed">
                  <strong className="text-mcb-charcoal">Living rooms:</strong>{" "}
                  you want light all day and warmth all evening — that&apos;s
                  the{" "}
                  <Link href="/curtains/double-curtains" className="underline">
                    sheer + blockout double
                  </Link>{" "}
                  or a{" "}
                  <Link
                    href="/blinds/double-roller-blinds"
                    className="underline"
                  >
                    double roller
                  </Link>{" "}
                  doing both jobs on one window.
                </p>
                <p className="mb-4 leading-relaxed">
                  <strong className="text-mcb-charcoal">
                    West-facing rooms:
                  </strong>{" "}
                  the winter problem flips in January.{" "}
                  <Link
                    href="/blinds/roller-blinds/sunscreen"
                    className="underline"
                  >
                    Sunscreen fabrics
                  </Link>{" "}
                  keep the outlook and cut the glare; the blockout layer handles
                  July. One window, both seasons answered.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-mcb-charcoal">
                    Alfresco and outdoor rooms:
                  </strong>{" "}
                  <Link href="/awnings/zipscreens" className="underline">
                    zipscreens
                  </Link>{" "}
                  and{" "}
                  <Link href="/awnings" className="underline">
                    outdoor blinds
                  </Link>{" "}
                  turn a freezing pergola into a usable winter room. One thing
                  we&apos;ll say plainly: Melbourne weather destroys bargain
                  outdoor product — sun, wind and rain find every corner cut.
                  Outdoor is where quality hardware pays for itself twice over.
                </p>
              </Reveal>
            </WovenQuestion>

            {/* ————— CTA ————— */}
            <Reveal>
              <section className="rounded-sm bg-mcb-charcoal p-8 text-white md:p-10">
                <h2 className="mb-3 font-serif text-2xl leading-tight md:text-3xl">
                  Be warm before the next power bill
                </h2>
                <p className="mb-6 max-w-2xl leading-relaxed text-stone-300">
                  We&apos;ll come to you, measure properly, bring fabric samples
                  you can hold up in your own light, and quote it all in
                  writing — free, no obligation, anywhere across greater
                  Melbourne. You&apos;ll know exactly what a warmer home costs
                  before you spend a dollar.
                </p>
                <PrimaryCTA
                  location="inline"
                  productContext="Unsure / Need Advice"
                  label="Book your free in-home measure"
                  variant="primary"
                  className="px-7 py-4 hover:bg-white hover:text-mcb-charcoal"
                  extraPayload={{ section: "energy-guide-cta" }}
                />
              </section>
            </Reveal>

            {/* ————— Related ————— */}
            <Reveal>
              <section className="text-sm text-stone-500">
                <p className="leading-relaxed">
                  Related reading:{" "}
                  <Link href="/guides" className="underline">
                    All guides
                  </Link>{" "}
                  ·{" "}
                  <Link
                    href="/guides/new-build-window-furnishings-not-included"
                    className="underline"
                  >
                    New-build inclusions guide
                  </Link>{" "}
                  ·{" "}
                  <Link
                    href="/guides/pooja-prayer-room-blackout-curtains-australia"
                    className="underline"
                  >
                    Pooja &amp; prayer room blackout
                  </Link>{" "}
                  ·{" "}
                  <Link href="/pricing-policy" className="underline">
                    Pricing policy
                  </Link>
                  .
                </p>
              </section>
            </Reveal>
          </div>
        </div>
      </article>
    </>
  );
}
