import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import {
  BrowseByNeed,
  ExpandedCategoryGrid,
  FAQBlock,
  FinalCTA,
  ModernFitPromise,
  ProcessStrip,
  ProofBar,
  SecurityMoat,
} from "@/components/CROSections";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";
import { quoteHref, SITE } from "@/lib/site";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative min-h-screen overflow-hidden bg-mcb-charcoal text-white">
        <Image
          src="/assets/curtain_hero.png"
          alt="Custom curtains, blinds and shutters installed in a Melbourne home"
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-mcb-charcoal" />
        <div className="container relative z-10 mx-auto flex min-h-screen items-center px-4 pb-20 pt-36">
          <div className="max-w-4xl">
            <span className="mb-5 inline-flex rounded-sm border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-mcb-clay-light backdrop-blur">
              Free in-home measure and quote across Melbourne
            </span>
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Custom Curtains, Blinds, Shutters and Security Screens in Melbourne
            </h1>
            <p className="mb-9 max-w-3xl text-lg leading-relaxed text-stone-100 md:text-2xl">
              Book a free in-home measure and quote. We bring samples, help you choose the right product for each room, measure accurately, and install with care.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={quoteHref()}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-7 py-4 font-bold uppercase tracking-wider text-white shadow-xl transition-colors hover:bg-white hover:text-mcb-charcoal"
              >
                Book Free Measure & Quote <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-7 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-mcb-charcoal"
              >
                <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <ProofBar />
      <BrowseByNeed />
      <ExpandedCategoryGrid />
      <ProcessStrip />
      <SecurityMoat />
      <ModernFitPromise />
      <GoogleReviewsWidget />
      <FAQBlock />
      <FinalCTA />
    </div>
  );
}
