import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { quoteHref, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact | Free Measure & Quote",
  description: "Contact Modern Curtains and Blinds for a free in-home measure and quote across Melbourne.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-mcb-paper pt-36">
      <section className="container mx-auto grid gap-8 px-4 py-20 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-sm bg-white p-8 shadow-sm md:p-12">
          <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Contact</span>
          <h1 className="mb-6 font-serif text-4xl text-mcb-charcoal md:text-6xl">Book Advice for Your Home</h1>
          <p className="mb-8 text-lg leading-relaxed text-stone-500">
            The fastest way to get started is to request a free in-home measure and quote. We bring samples, measure your windows or doors, and provide clear written pricing.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={quoteHref()} className="rounded-sm bg-mcb-terracotta px-6 py-4 text-center font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal">
              Request Free Quote
            </Link>
            <a href={SITE.phoneHref} className="rounded-sm border border-stone-200 px-6 py-4 text-center font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:bg-mcb-charcoal hover:text-white">
              Call {SITE.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <ContactCard icon={<Phone />} title="Phone" text={SITE.phoneDisplay} href={SITE.phoneHref} />
          <ContactCard icon={<Mail />} title="Email" text={SITE.email} href={`mailto:${SITE.email}`} />
          <ContactCard icon={<MapPin />} title="Service area" text="Melbourne, Victoria. We come to you." />
        </div>
      </section>
    </main>
  );
}

function ContactCard({ icon, title, text, href }: { icon: React.ReactNode; title: string; text: string; href?: string }) {
  const content = (
    <div className="rounded-sm bg-white p-6 shadow-sm">
      <div className="mb-4 text-mcb-terracotta">{icon}</div>
      <h2 className="mb-2 font-serif text-2xl text-mcb-charcoal">{title}</h2>
      <p className="text-stone-500">{text}</p>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
