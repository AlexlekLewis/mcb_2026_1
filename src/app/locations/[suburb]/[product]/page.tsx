import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Check, MapPin, Phone } from "lucide-react";
import { getLocationBySlug, getNearbyLocations } from "@/lib/locations";
import { getLocationProductBySlug, getLocationProductsByCategory, LOCATION_PRODUCTS } from "@/lib/location-products";
import { quoteHref, SITE } from "@/lib/site";
import { PageViewTracker } from "@/components/PageViewTracker";

interface Props {
  params: Promise<{
    suburb: string;
    product: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { suburb: suburbSlug, product: productSlug } = await params;
  const suburb = getLocationBySlug(suburbSlug);
  const product = getLocationProductBySlug(productSlug);

  if (!suburb || !product) return {};

  const title = `${product.title} ${suburb.name} | Free Measure & Quote`;
  const description = `${product.title} in ${suburb.name} ${suburb.postcode}. ${product.description} Book a free in-home measure and quote with samples brought to you.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/locations/${suburb.slug}/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: `${product.title} ${suburb.name}`,
        },
      ],
    },
  };
}

export default async function LocationProductPage({ params }: Props) {
  const { suburb: suburbSlug, product: productSlug } = await params;
  const suburb = getLocationBySlug(suburbSlug);
  const product = getLocationProductBySlug(productSlug);

  if (!suburb || !product) {
    notFound();
  }

  const nearbyLocations = getNearbyLocations(suburb.slug, 6);
  const relatedProducts = getLocationProductsByCategory(product.category)
    .filter((item) => item.slug !== product.slug)
    .slice(0, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${product.title} ${suburb.name}`,
    "serviceType": product.title,
    "provider": {
      "@type": "LocalBusiness",
      "name": SITE.name,
      "telephone": SITE.phoneDisplay,
      "url": SITE.url,
    },
    "areaServed": {
      "@type": "City",
      "name": suburb.name,
      "addressRegion": "VIC",
      "postalCode": suburb.postcode,
    },
    "description": product.description,
  };

  return (
    <main className="bg-white pt-32">
      <PageViewTracker
        event="view_location_product"
        payload={{
          page_type: "location_product",
          suburb_slug: suburb.slug,
          suburb_name: suburb.name,
          suburb_postcode: suburb.postcode,
          product_slug: product.slug,
          product_category: product.category,
          product_name: product.title,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-stone-100 bg-mcb-paper px-4 py-16 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest text-mcb-terracotta">
              <MapPin className="h-4 w-4" />
              {suburb.name} {suburb.postcode}
            </div>
            <h1 className="mb-5 font-serif text-4xl leading-tight text-mcb-charcoal md:text-6xl">
              {product.title} {suburb.name}
            </h1>
            <p className="mb-5 text-xl leading-relaxed text-stone-600">
              {product.description}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-stone-500">
              {product.localIntent} We provide free in-home measure and quote appointments across {suburb.name} {suburb.postcode} and nearby Melbourne suburbs.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={quoteHref(product.quoteProduct)}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-6 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal"
              >
                Book free measure <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-stone-300 px-6 py-4 font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:bg-mcb-charcoal hover:text-white"
              >
                <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-200 shadow-xl">
            <Image
              src={product.image}
              alt={`${product.title} inspiration for ${suburb.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                title: "Measured at your home",
                body: `We check the opening, fixing points, light, privacy and access requirements in ${suburb.name}.`,
              },
              {
                title: "Samples brought to you",
                body: "Compare fabrics, mesh, finishes and colours in the room where the product will be installed.",
              },
              {
                title: "Clear written quote",
                body: "You get advice, measurements and pricing before anything is ordered or made.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-sm border border-stone-200 bg-mcb-paper p-6">
                <Check className="mb-4 h-6 w-6 text-mcb-terracotta" />
                <h2 className="mb-3 font-serif text-2xl text-mcb-charcoal">{item.title}</h2>
                <p className="leading-relaxed text-stone-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mcb-paper px-4 py-16 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">
              Product fit
            </span>
            <h2 className="font-serif text-3xl text-mcb-charcoal md:text-4xl">
              Is {product.shortTitle.toLowerCase()} right for your {suburb.name} home?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-stone-500">
              Best for: {product.bestFor}. We will confirm suitability during the in-home measure and quote.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/locations/${suburb.slug}/${item.slug}`}
                className="group rounded-sm border border-stone-200 bg-white p-5 transition-colors hover:border-mcb-terracotta"
              >
                <span className="flex items-center justify-between gap-3 font-serif text-xl text-mcb-charcoal">
                  {item.title} {suburb.name}
                  <ArrowRight className="h-4 w-4 shrink-0 text-mcb-terracotta transition-transform group-hover:translate-x-1" />
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-stone-500">
                  {item.bestFor}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20">
        <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-sm border border-stone-200 p-6 md:p-8">
            <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal">Nearby Service Areas</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {nearbyLocations.map((location) => (
                <Link
                  key={location.slug}
                  href={`/locations/${location.slug}/${product.slug}`}
                  className="flex items-center justify-between rounded-sm bg-mcb-paper px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-mcb-charcoal hover:text-white"
                >
                  {location.name}
                  <span className="text-xs opacity-70">{location.postcode}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-stone-200 p-6 md:p-8">
            <h2 className="mb-5 font-serif text-3xl text-mcb-charcoal">Explore the Full Range</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {LOCATION_PRODUCTS.slice(0, 12).map((item) => (
                <Link
                  key={item.slug}
                  href={`/locations/${suburb.slug}/${item.slug}`}
                  className="flex items-center justify-between rounded-sm bg-mcb-paper px-4 py-3 text-sm font-semibold text-stone-600 transition-colors hover:bg-mcb-charcoal hover:text-white"
                >
                  {item.shortTitle}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
            <Link
              href={`/locations/${suburb.slug}`}
              className="mt-6 inline-flex items-center gap-2 font-bold text-mcb-terracotta"
            >
              View all products in {suburb.name} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-mcb-charcoal px-4 py-20 text-center text-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="mb-5 font-serif text-4xl">Book Your Free {product.shortTitle.toLowerCase()} Quote in {suburb.name}</h2>
          <p className="mb-8 text-lg leading-relaxed text-stone-300">
            No obligation. We bring samples, measure properly and provide a clear written quote.
          </p>
          <Link
            href={quoteHref(product.quoteProduct)}
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-7 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-mcb-charcoal"
          >
            Request free measure <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
