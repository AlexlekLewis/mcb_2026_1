export const SITE = {
  name: "Modern Curtains and Blinds",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://moderncurtainsandblinds.com.au",
  phoneDisplay: "1300 732 319",
  phoneHref: "tel:1300732319",
  email: "admin@moderncurtainsandblinds.com.au",
  serviceArea: "Melbourne, Victoria",
};

export const quoteHref = (product?: string) =>
  product ? `/quote?product=${encodeURIComponent(product)}` : "/quote";
