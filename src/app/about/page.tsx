import type { Metadata } from "next";
import Link from "next/link";
import { FinalCTA, ModernFitPromise, ProofBar, SecurityMoat } from "@/components/CROSections";
import { quoteHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Modern Curtains and Blinds Melbourne",
  description: "Family-owned Melbourne window furnishings business with 30+ years' combined experience in custom curtains, blinds, plantation shutters, security doors, awnings, outdoor blinds, zip screens and roller shutters.",
};

export default function AboutPage() {
  return (
    <main className="bg-white pt-36">
      <section className="container mx-auto px-4 py-20 text-center">
        <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">About Modern Curtains and Blinds</span>
        <h1 className="mx-auto mb-6 max-w-4xl font-serif text-4xl text-mcb-charcoal md:text-6xl">
          Are We The Right Choice For You?
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg font-medium leading-relaxed text-mcb-charcoal">
          Experience 30+ Years of Personal, Expert Window Furnishings in Melbourne
        </p>
        <div className="mx-auto max-w-3xl space-y-5 text-left text-lg leading-relaxed text-stone-600">
          <p>
            Our family has proudly served Melbourne and the wider Melbourne area for a combined 30 years, transforming houses into homes with our custom window furnishings. Our family-owned and operated business was inspired by a passion for quality and a desire to provide genuine, hands-on service&mdash;because we believe that every client deserves a personal touch. Our unique approach is built around our core values: We Care, You Matter, We Listen.
          </p>
          <p>
            From custom curtains and blinds to plantation shutters, security doors, awnings, outdoor blinds, zip screens, and roller shutters, we offer a complete range of products that elevate your home&apos;s style and functionality. Our customer experience is designed to be seamless and stress-free, starting with your enquiry and appointment, followed by a site visit and precise measurements, a free quote with your approval, secure order processing, and culminating in professional installation with attentive aftercare. Each of our installers, with over 10 years of experience, treats every home with respect and care, ensuring that every installation meets our high standards of quality, craftsmanship, and professionalism.
          </p>
          <p>
            Choose Modern Curtains and Blinds for a journey defined by exceptional service, expert advice, and products that truly make a difference in your home.
          </p>
        </div>
        <Link href={quoteHref()} className="mt-10 inline-flex rounded-sm bg-mcb-terracotta px-7 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal">
          Book Your Free Measure & Quote
        </Link>
      </section>
      <ProofBar />
      <ModernFitPromise />
      <SecurityMoat />
      <FinalCTA />
    </main>
  );
}
