import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing Policy | Modern Curtains and Blinds",
  description:
    "How Modern Curtains and Blinds publishes indicative pricing — what's included, what changes the price, how to get a binding written quote, and how often the published ranges are refreshed.",
  alternates: { canonical: "/pricing-policy" },
};

const sections: Array<{ title: string; body: string[]; bullets?: string[] }> = [
  {
    title: "About these indicative prices",
    body: [
      "The pricing shown on our product pages is indicative only and provided to help you budget for your project. It is not a quote and not an offer of sale. Treat it as a guide; rely on the written quote we give you after the free in-home measure.",
    ],
  },
  {
    title: "What's included in our indicative prices",
    body: [
      "Unless we say otherwise on the product page, the indicative range covers:",
    ],
    bullets: [
      "Our standard baseline product configuration as described on that page (typical size range, baseline fabric or material grade, manual operation unless stated, standard colour, standard install on a typical residential opening)",
      "Standard installation within our Melbourne service area",
      "GST",
    ],
  },
  {
    title: "What can change the price",
    body: [
      "Your final price depends on the actual measurements, conditions and choices at your home. The price moves when any of the following apply:",
    ],
    bullets: [
      "Opening size, shape, position and access — oversized openings, two-storey heights, voids, stairwells, bay windows, curved or arched openings and angled walls all change the price",
      "Fabric, material, colour and finish selection — premium fabrics, hardwood timbers, custom colour matches, premium polymer grades and specialty meshes carry a premium over the baseline",
      "Operation type — motorised, app-controlled, hardwired-power, smart-home-integrated and dual-bracket (double roller) configurations cost more than baseline manual operation",
      "Window furnishings type combinations — sheer + blockout layering, dual rollers, shutter + curtain layering carry a combined per-opening cost above the single-product baseline",
      "Install conditions — square-set ceilings, render or face-brick, plaster repair, electrical work for motorisation, scaffolding or hoist requirements for high or unsafe access, and Heritage Overlay or estate-covenant compliance work can change the install line",
      "Removal and disposal of existing window furnishings",
      "Locations outside our standard service area — a travel surcharge may apply, disclosed up front in your quote",
    ],
  },
  {
    title: "How to get a binding price",
    body: [
      "A binding price is the written quote we provide after the free in-home measure. The measure is no-obligation. Your written quote is valid for 30 days from the date of issue.",
    ],
  },
  {
    title: "Price refresh",
    body: [
      "Indicative pricing on our product pages is reviewed and refreshed quarterly. Each product page shows the date its indicative range was last updated, in the form \"as at [Month YYYY]\". If the date stamp is older than the current quarter, the page is due for refresh and the figures may not reflect current supplier costs.",
    ],
  },
  {
    title: "Promotions, finance and packages",
    body: [
      "Promotional pricing, package discounts and finance options are not reflected in the indicative ranges on our product pages unless explicitly stated. Ask during your in-home measure if any are available for your project.",
    ],
  },
  {
    title: "Builder packages and house-and-land inclusions",
    body: [
      "If your builder is including a \"window furnishings allowance\" in your contract, please bring the inclusion specification to your in-home measure. We will quote against that spec so you can compare like for like.",
    ],
  },
  {
    title: "Questions",
    body: [
      `For any question about our pricing or the policy on this page, contact Modern Curtains and Blinds at ${SITE.email} or call ${SITE.phoneDisplay}. We're happy to walk through any indicative range on the site and explain what it would mean for your home.`,
    ],
  },
];

export default function PricingPolicyPage() {
  return (
    <div className="min-h-screen bg-mcb-paper px-4 py-28">
      <div className="container mx-auto max-w-4xl">
        <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
          Policy
        </span>
        <h1 className="mb-5 font-serif text-4xl text-mcb-charcoal md:text-5xl">
          Pricing Policy
        </h1>
        <p className="mb-10 max-w-3xl text-lg leading-relaxed text-stone-600">
          We publish indicative pricing on our product pages so you can budget for your project before
          we visit. This page explains exactly what those indicative figures cover, what can change the
          price, and how to get the binding written quote that will actually apply to your home.
        </p>

        <div className="space-y-5">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-3 font-serif text-2xl text-mcb-charcoal">{section.title}</h2>
              <div className="space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-stone-600">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="ml-5 list-disc space-y-2 text-stone-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
          <p className="mb-4 leading-relaxed text-stone-600">
            Ready to get your binding written quote? The in-home measure is free and no-obligation.
          </p>
          <Link
            href="/quote"
            className="inline-block rounded-md bg-mcb-terracotta px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-mcb-terracotta/90"
          >
            Book your free in-home measure
          </Link>
        </div>
      </div>
    </div>
  );
}
