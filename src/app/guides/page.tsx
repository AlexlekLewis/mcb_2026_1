import type { Metadata } from "next";
import Link from "next/link";
import { PrimaryCTA } from "@/components/PrimaryCTA";

/**
 * Guides hub.
 *
 * Added 2026-07-27 (growth audit): the six guide pages were live, indexable
 * and self-canonical but had no index page (this route 404'd), were absent
 * from the sitemap, and had no internal links from anywhere in the nav — so
 * they were effectively unpublished. This hub gives the tier a crawlable
 * entry point and passes link equity to each guide.
 *
 * Title deliberately omits the brand — the root layout template appends
 * "| Modern Curtains and Blinds" once.
 */
export const metadata: Metadata = {
  title: "Window Furnishing Guides for Melbourne Homes",
  description:
    "Practical buyer's guides for Melbourne homes — energy-efficient curtains and blinds for winter, new-build inclusions, estate covenant rules for roller shutters and zipscreens, pooja and prayer room blackout, and corridor-by-corridor guidance for the north, west and south-east.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Window furnishing guides for Melbourne homes",
    description:
      "New-build inclusions, estate covenants, blackout for prayer rooms, and growth-corridor buyer's guides.",
  },
};

interface GuideCard {
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
}

const GUIDES: GuideCard[] = [
  {
    href: "/guides/new-build-window-furnishings-not-included",
    eyebrow: "New-build buyer's guide",
    title: "Are window furnishings included in your new build?",
    blurb:
      "Almost certainly not. What's standard across the volume builders, what to budget, and how to avoid paying premium prices for entry-tier product.",
  },
  {
    href: "/guides/estate-covenant-roller-shutters-zipscreens-melbourne",
    eyebrow: "Estate covenants",
    title: "Estate covenant rules for roller shutters, zipscreens and awnings",
    blurb:
      "Which Melbourne growth-corridor estates restrict external shutters and zipscreens — and what's allowed instead. Smiths Lane, Aurora, Riverdale, Cloverton and more.",
  },
  {
    href: "/guides/pooja-prayer-room-blackout-curtains-australia",
    eyebrow: "Blackout & privacy",
    title: "Blackout curtains for pooja and prayer rooms",
    blurb:
      "Choosing blackout for a pooja room, mandir corner or prayer space — sheer + blockout layering, triple-pass blockout, and parents' suite privacy.",
  },
  {
    href: "/guides/window-furnishings-northern-growth-corridor",
    eyebrow: "Northern corridor",
    title: "Northern growth corridor buyer's guide",
    blurb:
      "Wollert, Donnybrook, Beveridge, Mickleham, Greenvale. Build profile, builder mix, covenants and what gets fitted across Aurora, Lyndarum and Cloverton.",
  },
  {
    href: "/guides/window-furnishings-western-growth-corridor",
    eyebrow: "Western corridor",
    title: "Western growth corridor buyer's guide",
    blurb:
      "Tarneit, Deanside, Fraser Rise. Build profile, wind exposure, covenants and what works across the Riverdale, Habitat and Atherstone estates.",
  },
  {
    href: "/guides/window-furnishings-south-east-growth-corridor",
    eyebrow: "South-east corridor",
    title: "South-east growth corridor buyer's guide",
    blurb:
      "Clyde, Clyde North, Officer, Officer South. Build profile, builder mix and what gets fitted in Smiths Lane, Five Farms, Arcadia, Timbertop and Kaduna Park.",
  },
];

export default function GuidesHub() {
  return (
    <article className="min-h-screen bg-mcb-paper">
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <header className="mb-12">
          <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
            Guides
          </span>
          <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
            Window furnishing guides for Melbourne homes
          </h1>
          <p className="text-lg leading-relaxed text-stone-600">
            Straight answers to the questions we get asked on the tools — what your builder
            actually includes, what your estate covenant will and won&apos;t allow, and what
            works in the homes going up across Melbourne&apos;s growth corridors. Written by
            the people who measure and fit them.
          </p>
        </header>

        {/* Featured seasonal guide — flagship editorial, winter–spring 2026. */}
        <Link
          href="/guides/energy-efficient-curtains-blinds-melbourne"
          className="group mb-8 block overflow-hidden rounded-lg bg-mcb-charcoal p-8 text-white transition-all hover:-translate-y-1 hover:shadow-xl md:p-10"
        >
          <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-mcb-clay-light">
            Featured · Seasonal guide
          </span>
          <h2 className="mb-4 max-w-2xl font-serif text-3xl leading-tight group-hover:text-mcb-clay-light md:text-4xl">
            The warmest thing you&apos;ll do for your home this year
          </h2>
          <p className="mb-5 max-w-2xl leading-relaxed text-stone-300">
            Up to 40% of your heating can escape through bare glass. How the
            right curtains and blinds keep the warmth you&apos;ve paid for — and
            why this is the year to improve the home you own instead of moving.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mcb-clay-light">
            Read the guide →
          </span>
        </Link>

        <div className="grid gap-6 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group flex flex-col rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-mcb-terracotta"
            >
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-mcb-terracotta">
                {g.eyebrow}
              </span>
              <h2 className="mb-3 font-serif text-xl leading-tight text-mcb-charcoal group-hover:text-mcb-terracotta">
                {g.title}
              </h2>
              <p className="text-sm leading-relaxed text-stone-600">{g.blurb}</p>
              <span className="mt-4 text-sm font-medium text-mcb-terracotta">
                Read the guide →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-stone-200 bg-white p-8 text-center">
          <h2 className="mb-3 font-serif text-2xl text-mcb-charcoal">
            Still working out what suits your place?
          </h2>
          <p className="mb-6 leading-relaxed text-stone-600">
            We measure on site, talk through the options in your own rooms, and quote for free
            anywhere across greater Melbourne.
          </p>
          <PrimaryCTA location="section" label="Book a free measure &amp; quote" />
        </div>
      </div>
    </article>
  );
}
