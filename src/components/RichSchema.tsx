import { SITE } from "@/lib/site";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": SITE.url,
    name: SITE.name,
    alternateName: ["MCB", "Modern Curtains & Blinds"],
    image: `${SITE.url}/assets/logo.png`,
    logo: `${SITE.url}/assets/logo.png`,
    url: SITE.url,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    foundingDate: "2018",
    founders: [
      { "@type": "Person", name: "Deane" },
      { "@type": "Person", name: "Dee" },
    ],
    slogan: "Free in-home measure and quote across Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Preston",
      addressRegion: "VIC",
      postalCode: "3072",
      addressCountry: "AU",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: SITE.serviceArea,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "Finance"],
    serviceType: [
      "Custom curtains",
      "Custom blinds",
      "Plantation shutters",
      "Security doors",
      "Fly screens",
      "Outdoor awnings",
      "Motorisation",
    ],
    sameAs: [
      "https://maps.app.goo.gl/zRBNX1LBoTc2DK2g9",
    ],
    // NOTE: aggregateRating + review are intentionally NOT included here, and
    // are no longer emitted anywhere on the site. See the removal note below.
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * REMOVED 2026-07-27 (growth audit) — `OrganizationReviewSchema`.
 *
 * It emitted `aggregateRating` + 6 `Review` nodes on the homepage. Two problems,
 * either of which is enough to warrant removal:
 *
 *  1. **Self-serving review markup.** Google does not support review /
 *     aggregateRating markup for reviews *about the business itself* placed on
 *     that business's own site under LocalBusiness / Organization. This is the
 *     classic structured-data manual-action trigger. The 2026-06-14 "scope it to
 *     the homepage" step reduced the blast radius but did not make it eligible.
 *  2. **No visible counterpart.** The reviews render client-side via the Elfsight
 *     widget, so the server-rendered DOM only ever said "Loading Google reviews…".
 *     Marked-up content must be present on the page. `reviewCount` was also a
 *     hardcoded literal that never tracked the real GBP total.
 *
 * The reviews themselves are genuine — this is a markup-eligibility issue, not an
 * authenticity one. Star ratings still surface through the Google Business Profile,
 * where they ARE eligible, and the Elfsight widget still shows them to humans.
 * `CURATED_REVIEWS` / `REVIEW_AGGREGATE` remain in use for *visible* on-page trust
 * copy in QuoteForm.tsx, which is policy-clean.
 *
 * Do not reintroduce review markup without rendering the reviews as server-side
 * HTML *and* confirming current Google eligibility for self-hosted reviews.
 */

export function ContactPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE.url}/quote#contactpage`,
    name: "Book a Free In-Home Measure & Quote",
    description:
      "Book a free in-home measure and quote for custom curtains, blinds, shutters, security doors, fly screens, awnings and motorisation in Melbourne.",
    url: `${SITE.url}/quote`,
    isPartOf: { "@id": SITE.url },
    about: { "@id": SITE.url },
    mainEntity: {
      "@type": "Organization",
      "@id": SITE.url,
      name: SITE.name,
      telephone: SITE.phoneDisplay,
      email: SITE.email,
      areaServed: { "@type": "AdministrativeArea", name: SITE.serviceArea },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function QuoteServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE.url}/quote#service`,
    name: "Free in-home measure and quote",
    serviceType: "Window furnishings measure and quote",
    provider: { "@id": SITE.url },
    areaServed: { "@type": "AdministrativeArea", name: SITE.serviceArea },
    audience: { "@type": "Audience", audienceType: "Homeowners and renovators" },
    description:
      "A consultant visits your home with samples, measures your windows or doors and provides a clear written quote — free and with no obligation.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "AUD",
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/quote`,
      description: "Free in-home measure and written quote, no obligation.",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqPageSchema({
  items,
}: {
  items: Array<{ question: string; answer: string }>;
}) {
  if (!items || items.length === 0) return null;
  const schema = {
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
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessSchema({
  suburb,
}: {
  suburb: { name: string; slug: string; postcode: string; latitude: number; longitude: number };
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/locations/${suburb.slug}#localbusiness`,
    name: `${SITE.name} — ${suburb.name}`,
    image: `${SITE.url}/assets/curtain_hero.png`,
    telephone: SITE.phoneDisplay,
    email: SITE.email,
    url: `${SITE.url}/locations/${suburb.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: suburb.name,
      addressRegion: "VIC",
      postalCode: suburb.postcode,
      addressCountry: "AU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: suburb.latitude,
      longitude: suburb.longitude,
    },
    areaServed: { "@type": "City", name: suburb.name },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    // Per-suburb LocalBusiness schemas intentionally omit aggregateRating —
    // the rating belongs on the single OrganizationSchema (above) to avoid the
    // spam signal of 693 "locations" all reporting identical ratings.
    parentOrganization: { "@id": SITE.url },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
