import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Modern Curtains and Blinds Privacy Policy outlining how we collect, use and protect your personal information.",
};

const privacySections = [
  {
    title: "Information Collection",
    body: [
      "We collect personal information when you register, place an order, or fill out a form on our site.",
    ],
  },
  {
    title: "Information Use",
    body: [
      "The information collected is used to personalise your experience, improve our website, process transactions, and send periodic emails.",
    ],
  },
  {
    title: "Information Protection",
    body: [
      "We use various security measures to protect your personal information.",
    ],
  },
  {
    title: "Third-Party Disclosure",
    body: [
      "We do not sell, trade, or transfer your personally identifiable information to outside parties.",
    ],
  },
  {
    title: "Contact",
    body: [
      `For privacy questions or to update your details, contact Modern Curtains and Blinds at ${SITE.email} or call ${SITE.phoneDisplay}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-mcb-paper px-4 py-28">
      <div className="container mx-auto max-w-4xl">
        <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Policy</span>
        <h1 className="mb-5 font-serif text-4xl text-mcb-charcoal md:text-5xl">Modern Curtains and Blinds Privacy Policy</h1>
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-stone-600">
          We are dedicated to safeguarding your privacy. This policy outlines how we collect, use, and protect your information.
        </p>

        <div className="space-y-5">
          {privacySections.map((section) => (
            <section key={section.title} className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-serif text-2xl text-mcb-charcoal">{section.title}</h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-stone-600">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
