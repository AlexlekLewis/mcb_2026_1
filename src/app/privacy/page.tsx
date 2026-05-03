import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Modern Curtains and Blinds website enquiries, quote requests and customer communications.",
};

const privacySections = [
  {
    title: "Information We Collect",
    body: [
      "Modern Curtains and Blinds collects personal information when you submit a quote enquiry, contact form, chat callback request, order request or other website form.",
      "This may include your name, phone number, email address, suburb, product interests, appointment preferences and any project details you choose to provide.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use enquiry and order information to respond to you, arrange appointments, prepare quotes, process transactions, improve the website and communicate about your project.",
      "Where you ask for product advice, we may use the details you provide to recommend suitable curtains, blinds, shutters, security screens, awnings, motorisation or related products.",
    ],
  },
  {
    title: "Protecting Your Information",
    body: [
      "We take reasonable steps to protect personal information submitted through the website, quote forms and customer communication channels.",
      "Please avoid submitting sensitive information that is not needed for a window furnishing, security screen or installation enquiry.",
    ],
  },
  {
    title: "Third-Party Disclosure",
    body: [
      "We do not sell, trade or transfer personally identifiable information to outside parties for unrelated marketing purposes.",
      "Information may be shared only where reasonably needed to respond to your enquiry, process an order, support installation, meet legal obligations or use approved service providers.",
    ],
  },
  {
    title: "Website Chat And Quote Enquiries",
    body: [
      "The website chat assistant is designed to answer common product, appointment, pricing and warranty questions. If you request a callback, your submitted details are treated as a quote or contact enquiry.",
      "For pricing, availability and product suitability, the most accurate advice is provided during a free in-home measure and quote.",
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
        <h1 className="mb-5 font-serif text-4xl text-mcb-charcoal md:text-5xl">Privacy Policy</h1>
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-stone-600">
          Modern Curtains and Blinds is committed to handling customer information carefully and using it only for relevant enquiries, quotes, orders and customer communication.
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
