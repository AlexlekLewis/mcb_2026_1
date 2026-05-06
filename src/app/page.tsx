import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import {
  BrowseByNeed,
  ExpandedCategoryGrid,
  FAQBlock,
  FamilyBusinessStory,
  FinalCTA,
  ModernFitPromise,
  ProcessStrip,
  ProofBar,
  SecurityMoat,
} from "@/components/CROSections";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";
import { HeroScroll } from "@/components/HeroScroll";
import { quoteHref, SITE } from "@/lib/site";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroScroll>
        <div className="container mx-auto px-4 pb-20 pt-4 md:pt-36">
          <div className="max-w-4xl">
            <span className="mb-3 hidden rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-mcb-clay-light backdrop-blur md:mb-5 md:inline-flex md:px-4 md:py-2 md:text-xs">
              Free in-home measure and quote across Melbourne
            </span>
            <h1 className="mb-4 font-serif text-[2rem] font-bold leading-[1.08] md:mb-6 md:text-6xl md:leading-tight lg:text-7xl">
              Custom Curtains, Blinds, Shutters, Outdoor Products and Security Doors/Screens in Melbourne
            </h1>
            <p className="mb-6 max-w-3xl text-base leading-relaxed text-stone-100 md:mb-9 md:text-2xl">
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
      </HeroScroll>

      <ProofBar />
      <BrowseByNeed />
      <ExpandedCategoryGrid />
      <FamilyBusinessStory />
      <ProcessStrip />
      <SecurityMoat />
      <ModernFitPromise />
      <GoogleReviewsWidget />
      <FAQBlock />
      <FinalCTA />
    </div>
  );
}
