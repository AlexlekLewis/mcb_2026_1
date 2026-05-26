import type { Metadata } from "next";
import Link from "next/link";
import { FaqPageSchema } from "@/components/RichSchema";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export const metadata: Metadata = {
  title:
    "Blackout curtains for pooja & prayer rooms in Melbourne | Modern Curtains and Blinds",
  description:
    "How to choose blackout window furnishings for a pooja room, mandir corner or prayer space in a Melbourne home. Sheer + blockout layering, triple-pass blockout, parents' suite privacy, and what we fit across the northern and western growth corridors.",
  alternates: {
    canonical: "/guides/pooja-prayer-room-blackout-curtains-australia",
  },
  openGraph: {
    title: "Blackout curtains for pooja and prayer rooms in Melbourne",
    description:
      "What works for pooja room blackout, mandir-corner curtaining, parents' suite privacy and Diwali decorating in Melbourne new builds.",
  },
};

const faqItems = [
  {
    question: "What's the best blackout curtain for a pooja room in a Melbourne home?",
    answer:
      "A triple-pass blockout curtain or a sheer + blockout layered combination. Triple-pass blockout uses three layers of acrylic-coated fabric bonded together so light cannot pass through, even mid-morning. Sheer + blockout layered gives you the same nighttime darkness with a softer daytime look — the sheer is drawn during the day for soft light and privacy, the blockout closes for pooja or sleep. Both work; the choice usually comes down to whether you want the curtain look during the day.",
  },
  {
    question: "How do I keep a diya or candle flame steady near a pooja room window?",
    answer:
      "A heavier-weight blockout curtain with a side-channel or wall-to-wall track reduces the draft moving through the room when the window isn't fully sealed — Melbourne new-build windows are usually well-sealed, but the layering of curtains over the window stops the residual draft from moving the flame. If the altar is positioned close to the window, run the curtain ceiling-to-floor and wall-to-wall rather than window-only to fully enclose the area.",
  },
  {
    question: "How do you handle privacy for a parents' downstairs suite?",
    answer:
      "Multigenerational households are common across the northern and western growth corridors — Wollert, Mickleham, Tarneit, Greenvale — and the downstairs guest or parents' retreat needs full visual separation from the rest of the home. The fitout we recommend most often is sheer + blockout layering on the bedroom window for daytime soft light and full nighttime privacy, plus a curtain or panel on the doorway between the suite and the main living area where the floorplan needs it.",
  },
  {
    question: "Can I hang fairy lights or Diwali decorations on builder-supplied curtain tracks?",
    answer:
      "Builder-supplied curtain tracks are usually rated for the curtain weight only, not for any additional decorative load. Clip fairy lights to the curtain header (the top hem of the fabric itself) rather than to the track. Adhesive hooks on the cornice line or wall work for heavier decorations. If you're planning to redecorate annually and want a track rated for that kind of use, we can specify a heavier-duty track at the in-home measure.",
  },
  {
    question: "Do you fit pooja room curtains in Tarneit, Wollert and Mickleham?",
    answer:
      "Yes — we fit window furnishings across the full north and west growth corridors of Melbourne, including Tarneit, Truganina, Wollert, Mickleham, Donnybrook, Beveridge, Greenvale, Deanside and Fraser Rise. We bring fabric samples to the in-home measure so you can compare textures, colours and opacity levels for the pooja room specifically — picking a fabric on-site against your home's light is the right way to do it.",
  },
];

export default function PoojaPrayerRoomGuide() {
  return (
    <>
      <FaqPageSchema items={faqItems} />

      <article className="min-h-screen bg-mcb-paper">
        <div className="container mx-auto max-w-3xl px-4 py-20">
          <header className="mb-12">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Cultural living · Window furnishings
            </span>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
              Blackout curtains for pooja and prayer rooms in Melbourne homes
            </h1>
            <p className="text-lg leading-relaxed text-stone-600">
              Pooja rooms, mandir corners and prayer spaces all share a quiet requirement that
              the rest of a home doesn&apos;t — proper darkness when the room is in use, soft
              filtered light the rest of the day, and a draft-free environment for a steady
              flame. We fit window furnishings into Melbourne homes across the northern and
              western growth corridors every week, and the pooja room is one of the spaces that
              comes up most often in the in-home measure conversation. This page walks through
              what works, what to ask for, and how to fit your prayer space properly.
            </p>
          </header>

          <div className="space-y-12 text-stone-700">
            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Why a pooja room asks more of a curtain than a regular bedroom
              </h2>
              <p className="mb-4 leading-relaxed">
                A bedroom needs blockout for sleep — usually for a few hours at night and a
                couple in the early morning. A pooja or prayer room is different. The room is
                used at different times of day, often during morning aarti when the rest of the
                house has full daylight outside, and the lighting in the room itself — diyas,
                lamps, sometimes incense — needs the surrounding ambient light controlled. The
                fabric has to handle that asymmetry. A thin or single-layer blockout fabric
                lets enough mid-morning light through that the diya glow is washed out and the
                feeling of the room changes.
              </p>
              <p className="leading-relaxed">
                Triple-pass blockout fabric is what handles this properly. Three layers of
                acrylic-coated material are bonded together so no light passes through even
                under bright outdoor sun. Combined with a side-channel or wall-to-wall track,
                it gives you the dark room a pooja or prayer space asks for, on demand, in the
                middle of the day if you need it.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Sheer plus blockout layered — the configuration we fit most often
              </h2>
              <p className="mb-4 leading-relaxed">
                For most growth-corridor homes we end up fitting a layered configuration on the
                pooja room window: a{" "}
                <Link href="/curtains/sheer" className="underline">sheer curtain</Link>{" "}
                in front of a{" "}
                <Link href="/curtains/blockout" className="underline">blockout curtain</Link>{" "}
                on the same dual-track system. The sheer is drawn for general use — it lets in
                soft, filtered light, maintains daytime privacy from neighbours, and softens
                the look of the window from inside the room. The blockout is drawn closed for
                pooja, for nighttime, or for any time you want full darkness on demand.
              </p>
              <p className="leading-relaxed">
                The same configuration also works as the answer for a parents&apos; or
                in-laws&apos; downstairs suite — the privacy and light-control needs are
                identical, and the layered curtain reads softer than a hard blockout-only
                window in what&apos;s usually a more formal room.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Mandir-corner curtaining
              </h2>
              <p className="mb-4 leading-relaxed">
                If your mandir is positioned in a corner or nook rather than a dedicated room,
                a slim ceiling-mounted track running across the nook lets you draw a fabric
                screen across when the mandir is in use. The same fabric choices apply —
                triple-pass blockout for full darkness, sheer-plus-blockout layered for
                flexibility — but the track sits in front of the nook rather than at the
                window.
              </p>
              <p className="leading-relaxed">
                For new builds with a square-set ceiling (no cornice), the track can sit flush
                to the ceiling and read very cleanly. For homes with a cornice, we&apos;ll work
                with the builder profile and recommend either a top-fixed bracket or a slimline
                wall-mounted system that doesn&apos;t clash with the existing cornice line.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Diyas, candles and draft control
              </h2>
              <p className="mb-4 leading-relaxed">
                If your altar is positioned close to a window, the steady airflow that you
                don&apos;t notice anywhere else in the house will move a diya flame around. A
                blockout lining helps in two ways — the heavier fabric absorbs the residual
                draft that a single-pane window can still let through, and the layered fabric
                weight creates a calmer envelope of air around the altar. A ceiling-to-floor,
                wall-to-wall configuration is stronger here than a window-only one — it
                encloses the immediate space rather than just covering the glass.
              </p>
              <p className="leading-relaxed">
                One thing we&apos;ll always raise during the in-home measure if it&apos;s
                relevant: keep fabric and incense smoke separation. Triple-pass blockout fabric
                absorbs odour over time. If incense is part of regular use in the room,
                we&apos;ll recommend a fabric grade that holds up better to that and we&apos;ll
                talk through cleaning intervals.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Diwali and festival decorating
              </h2>
              <p className="mb-4 leading-relaxed">
                A common question through the corridor — particularly in Tarneit, Wollert,
                Mickleham and Truganina — is how to handle decorating for Diwali, Eid and other
                celebrations without damaging the curtain tracks the builder installed.
                Builder-supplied tracks are usually rated for the curtain weight only.
                That&apos;s not a problem in itself, but it means decorative loads —
                fairy-light strings, hanging ornaments, draped fabric — should go on the
                curtain header (the top hem of the fabric itself) or on adhesive hooks on the
                cornice line, not on the track.
              </p>
              <p className="leading-relaxed">
                If you&apos;re planning annual heavier decorating and want a system that
                handles it, we can specify a heavier-duty track during the in-home measure that
                takes both the curtain weight and a reasonable decorative load. Worth doing
                once, at install, rather than discovering the limit on a Saturday in October.
              </p>
            </section>

            <section>
              <h2 className="mb-4 font-serif text-2xl leading-tight text-mcb-charcoal md:text-3xl">
                Multigenerational households and the parents&apos; suite
              </h2>
              <p className="mb-4 leading-relaxed">
                Across the northern and western growth corridors a high share of new builds
                have a downstairs guest or parents&apos; suite — sometimes a fully self-contained
                granny-flat-style wing, sometimes a bedroom with its own bathroom and a sliding
                door to the rest of the home. The window furnishings brief for the parents&apos;
                suite is usually the same brief as the pooja room: soft light during the day,
                full privacy at night, and a clear visual separation from the rest of the home.
              </p>
              <p className="leading-relaxed">
                The configuration we fit most often into that suite is sheer plus blockout
                layered on the bedroom window, blockout-only on the ensuite if it has a clear
                glazed window, and a privacy panel or curtain on the suite doorway where the
                floorplan opens directly into a shared living space.
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 font-serif text-lg leading-tight text-mcb-charcoal">
                Indicative pricing for a pooja-room fitout
              </h3>
              <p className="mb-4 leading-relaxed text-sm text-stone-600">
                For a single typical pooja room window (around 3m × 2.7m wall-to-wall),
                expect:
              </p>
              <ul className="ml-5 list-disc space-y-1 text-sm leading-relaxed text-stone-600">
                <li>Blockout-only configuration: $600 to $1,000 supplied and installed</li>
                <li>Sheer + blockout layered configuration: $1,500 to $2,000 supplied and installed</li>
              </ul>
              <p className="mt-4 text-sm leading-relaxed text-stone-500">
                Indicative only. Your written quote after the in-home measure is the binding figure.{" "}
                <Link href="/pricing-policy" className="underline">Full pricing policy →</Link>
              </p>
            </section>

            <section className="rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl leading-tight text-mcb-charcoal">
                Book your free in-home measure
              </h2>
              <p className="mb-6 leading-relaxed text-stone-600">
                We&apos;ll bring sheer and blockout samples in a range of colours and weights so
                you can compare them in your own light, near the altar, before deciding. Free,
                no-obligation.
              </p>
              <PrimaryCTA
                location="inline"
                productContext="blockout-curtains"
                label="Book free in-home measure"
              />
            </section>

            <section className="text-sm text-stone-500">
              <p className="leading-relaxed">
                Related reading:{" "}
                <Link href="/curtains/sheer" className="underline">Sheer curtains</Link>{" "}·{" "}
                <Link href="/curtains/blockout" className="underline">Blockout curtains</Link>{" "}·{" "}
                <Link href="/guides/new-build-window-furnishings-not-included" className="underline">
                  New-build inclusions guide
                </Link>{" "}·{" "}
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
