import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA, ModernFitPromise, ProofBar, SecurityMoat } from "@/components/CROSections";
import { quoteHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Modern Curtains and Blinds | Melbourne Window Furnishings",
  description: "Learn about Modern Curtains and Blinds, a Melbourne team providing custom curtains, blinds, shutters, security screens, awnings and motorisation with free in-home measure and quote.",
};

export default function AboutPage() {
  return (
    <main className="bg-white pt-36">
      <section className="container mx-auto px-4 py-20 text-center">
        <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">About Modern Curtains and Blinds</span>
        <h1 className="mx-auto mb-6 max-w-4xl font-serif text-4xl text-mcb-charcoal md:text-6xl">
          Local advice, custom fit and professional installation
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-stone-500">
          Modern Curtains and Blinds helps Melbourne homeowners choose, measure and install window furnishings that suit the way they live. We bring samples to your home, explain your options clearly, and manage the process from quote to installation.
        </p>
        <Link href={quoteHref()} className="mt-8 inline-flex rounded-sm bg-mcb-terracotta px-7 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal">
          Book Free Measure & Quote
        </Link>
      </section>
      <ProofBar />
      <ModernFitPromise />
      <SecurityMoat />
      <FinalCTA />
    </main>
  );
}
