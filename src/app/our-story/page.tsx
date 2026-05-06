import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FinalCTA, ProofBar } from "@/components/CROSections";
import { quoteHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story | Modern Curtains and Blinds Melbourne",
  description: "Meet the Modern Curtains and Blinds team and learn about our family-owned Melbourne window furnishing business.",
};

export default function OurStoryPage() {
  return (
    <main className="bg-white pt-36">
      <section className="container mx-auto grid items-center gap-12 px-4 py-20 lg:grid-cols-[0.8fr_1fr]">
        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-sm bg-mcb-paper">
          <Image
            src="/assets/mcb-owners.jpg"
            alt="Modern Curtains and Blinds owners"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Our Story</span>
          <h1 className="mb-6 font-serif text-4xl text-mcb-charcoal md:text-6xl">
            Local Advice from a Family-Owned Melbourne Business
          </h1>
          <div className="space-y-5 text-lg leading-relaxed text-stone-600">
            <p>
              Modern Curtains and Blinds helps Melbourne homeowners choose custom curtains, blinds, plantation shutters, security doors, fly screens, awnings and motorisation with practical advice and careful measuring.
            </p>
            <p>
              The business is built around a simple promise: bring the samples to your home, explain the options clearly, measure properly and install with care.
            </p>
          </div>
          <Link href={quoteHref()} className="mt-8 inline-flex rounded-sm bg-mcb-terracotta px-7 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal">
            Book Free Measure & Quote
          </Link>
        </div>
      </section>
      <ProofBar />
      <FinalCTA />
    </main>
  );
}
