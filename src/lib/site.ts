export const SITE = {
  name: "Modern Curtains and Blinds",
  // Fallback is the canonical www origin. The apex 307-redirects, so an unset
  // NEXT_PUBLIC_BASE_URL silently flipped metadataBase — and with it every
  // canonical, og:url, JSON-LD @id and breadcrumb item across ~780 pages — to a
  // redirecting host. sitemap.ts and robots.ts were hardened this way in the
  // 2026-07 growth audit; this one was missed.
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.moderncurtainsandblinds.com.au",
  phoneDisplay: "1300 732 319",
  phoneHref: "tel:1300732319",
  email: "admin@moderncurtainsandblinds.com.au",
  serviceArea: "Melbourne, Victoria",
};

export const quoteHref = (product?: string) =>
  product ? `/quote?product=${encodeURIComponent(product)}` : "/quote";
