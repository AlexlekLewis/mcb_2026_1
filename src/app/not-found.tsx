import type { Metadata } from "next";
import Link from "next/link";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { SITE } from "@/lib/site";

/**
 * Branded 404.
 *
 * Added 2026-07-27 (growth audit). Previously the site served the unstyled
 * Next.js default ("404: This page could not be found") with no navigation,
 * no branding, and — because no metadata was set — it inherited the homepage
 * meta description, which reads as a soft-404 signal.
 *
 * Legacy URLs now mostly 301 (see next.config.ts); this page catches whatever
 * remains and gives it a route back into the funnel.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page has moved or no longer exists. Browse our curtains, blinds, shutters and security ranges, or book a free in-home measure and quote across Melbourne.",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/curtains", label: "Curtains" },
  { href: "/blinds", label: "Blinds" },
  { href: "/shutters", label: "Shutters" },
  { href: "/security", label: "Security screens" },
  { href: "/awnings", label: "Awnings & outdoor" },
  { href: "/guides", label: "Buyer's guides" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-mcb-paper">
      <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
        <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
          Page not found
        </span>
        <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-5xl">
          That page has moved or no longer exists
        </h1>
        <p className="mb-10 text-lg leading-relaxed text-stone-600">
          We rebuilt the site recently, so a few old links have changed. Here&apos;s where most
          people are heading — or give us a call and we&apos;ll point you the right way.
        </p>

        <nav aria-label="Popular sections" className="mb-12 flex flex-wrap justify-center gap-3">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-stone-300 px-5 py-2 text-sm text-mcb-charcoal transition-colors hover:border-mcb-terracotta hover:text-mcb-terracotta"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PrimaryCTA location="section" label="Book a free measure &amp; quote" />
          <a
            href={SITE.phoneHref}
            className="text-lg font-medium text-mcb-charcoal transition-colors hover:text-mcb-terracotta"
          >
            Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </main>
  );
}
