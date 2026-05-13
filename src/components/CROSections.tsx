import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { categoryCards, defaultFaq, needCards, processSteps, trustItems } from "@/lib/cro-data";
import { SITE } from "@/lib/site";
import { PrimaryCTA } from "@/components/PrimaryCTA";

export function ProofBar({ className = "" }: { className?: string }) {
  return (
    <section className={`bg-mcb-paper border-y border-stone-200 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <item.icon className="mt-0.5 h-6 w-6 shrink-0 text-mcb-terracotta" />
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-mcb-charcoal">{item.label}</p>
                <p className="text-xs leading-snug text-stone-500">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrowseByNeed() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Start With The Problem</span>
          <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal md:text-5xl">What Do You Need Help With?</h2>
          <p className="text-lg leading-relaxed text-stone-500">
            If you are not sure which product is right, choose the outcome you want and we will guide you from there.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {needCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-sm border border-stone-200 bg-mcb-paper p-6 transition-all hover:-translate-y-1 hover:border-mcb-clay hover:bg-white hover:shadow-lg"
            >
              <card.icon className="mb-5 h-8 w-8 text-mcb-terracotta" />
              <h3 className="mb-3 font-serif text-2xl text-mcb-charcoal">{card.title}</h3>
              <p className="mb-5 leading-relaxed text-stone-500">{card.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mcb-terracotta">
                See Options <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExpandedCategoryGrid() {
  return (
    <section className="bg-mcb-paper py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Full service range</span>
          <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal md:text-5xl">Every Window and Doorway Covered</h2>
          <p className="text-lg leading-relaxed text-stone-500">
            Curtains, blinds, shutters, security screens, outdoor shade and motorisation can all be planned in one visit.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categoryCards.map((card) => (
            <Link key={card.title} href={card.href} className="group overflow-hidden rounded-sm bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={card.image}
                  alt={`${card.title} by Modern Curtains and Blinds`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/30" />
              </div>
              <div className="p-6">
                <h3 className="mb-3 font-serif text-2xl text-mcb-charcoal">{card.title}</h3>
                <p className="mb-5 leading-relaxed text-stone-500">{card.description}</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mcb-terracotta">
                  Explore range <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessStrip() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">How it works</span>
          <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal md:text-5xl">A Clear Path from Idea to Install</h2>
          <p className="text-lg leading-relaxed text-stone-500">No pressure, no guesswork. We help you compare the right products before anything is ordered.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step.title} className="rounded-sm border border-stone-200 bg-mcb-paper p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-mcb-terracotta font-serif text-xl text-white">{index + 1}</div>
              <h3 className="mb-3 font-serif text-xl text-mcb-charcoal">{step.title}</h3>
              <p className="leading-relaxed text-stone-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FamilyBusinessStory() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto grid items-center gap-12 px-4 lg:grid-cols-[0.78fr_1fr]">
        <div className="mx-auto w-full max-w-sm">
          <div className="relative mx-auto aspect-square w-full max-w-[19rem] overflow-hidden rounded-full border-8 border-mcb-paper shadow-xl shadow-stone-200/80">
            <Image
              src="/assets/mcb-owners.jpg"
              alt="Owners of Modern Curtains and Blinds"
              fill
              sizes="(min-width: 1024px) 304px, 80vw"
              className="object-cover"
            />
          </div>
          <div className="mx-auto mt-6 max-w-xs border-l-4 border-mcb-terracotta bg-mcb-paper px-5 py-4">
            <p className="text-sm font-bold uppercase tracking-widest text-mcb-charcoal">Family-owned Melbourne business</p>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">Personal advice from people who care how it looks, fits and lasts.</p>
          </div>
        </div>
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">The people behind the measure</span>
          <h2 className="mb-6 font-serif text-3xl text-mcb-charcoal md:text-5xl">
            A Family Business with 30+ Years of Hands-On Experience
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-stone-600">
            <p>
              Modern Curtains and Blinds is run by real people, not a call centre. You get practical guidance from a local team that understands Melbourne homes, tricky windows, changing light and the details that make custom window furnishings feel finished.
            </p>
            <p>
              From the first measure to the final install, the focus is simple: clear advice, careful measuring, quality products and a result the family would be happy to put in their own home.
            </p>
          </div>
          <Link
            href="/our-story"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-mcb-terracotta transition-colors hover:text-mcb-charcoal"
          >
            Read our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SecurityMoat() {
  return (
    <section className="bg-mcb-charcoal py-20 text-white">
      <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-clay-light">The MCB Advantage</span>
          <h2 className="mb-6 font-serif text-3xl md:text-5xl">Curtains, Blinds and Security Products from Our Melbourne Team</h2>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-stone-300">
            While we are measuring your windows, we can also quote security doors, fly screens and pet mesh so every opening in your home is covered properly.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryCTA
              location="section"
              productContext="Security Doors"
              label="Ask about security"
              variant="primary"
              className="px-6 py-4 hover:bg-white hover:text-mcb-charcoal"
              extraPayload={{ section: "security-moat" }}
            />
            <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-6 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-mcb-charcoal">
              <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src="/images/security-door-hero.webp"
            alt="Custom security door and screen solution for a Melbourne home"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function FinalCTA({ product }: { product?: string }) {
  return (
    <section className="bg-mcb-paper py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal md:text-5xl">Book Your Free In-Home Measure and Quote</h2>
        <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-stone-500">
          No obligation. We bring samples, measure your windows, explain your options and provide a clear written quote.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryCTA
            location="section"
            productContext={product}
            variant="primary"
            className="px-7 py-4 hover:bg-mcb-charcoal"
            extraPayload={{ section: "final-cta" }}
          />
          <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-sm border border-mcb-charcoal/20 px-7 py-4 font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:bg-mcb-charcoal hover:text-white">
            <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ModernFitPromise() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="rounded-sm border border-mcb-clay/40 bg-mcb-paper p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">The Modern Promise</span>
              <h2 className="font-serif text-3xl text-mcb-charcoal md:text-4xl">Measured Right and Installed Properly</h2>
            </div>
            <div className="space-y-4 text-stone-600">
              <p className="text-lg leading-relaxed">
                We measure and install your products with care. If an issue is caused by our measuring or installation, we will make it right.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {["No-pressure consultation", "Samples in your own light", "Clear written quote", "Aftercare if you need us"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold text-mcb-charcoal">
                    <CheckCircle2 className="h-4 w-4 text-mcb-terracotta" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FAQBlock({ items = defaultFaq }: { items?: { question: string; answer: string }[] }) {
  return (
    <section className="bg-white py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: items.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Questions</span>
          <h2 className="font-serif text-3xl text-mcb-charcoal md:text-4xl">Common Questions Before You Book</h2>
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <details key={item.question} className="group rounded-sm border border-stone-200 bg-mcb-paper p-5 open:bg-white open:shadow-sm">
              <summary className="cursor-pointer list-none font-serif text-xl text-mcb-charcoal">
                {item.question}
              </summary>
              <p className="mt-3 leading-relaxed text-stone-500">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
