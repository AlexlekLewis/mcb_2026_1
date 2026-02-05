import { HeroScroll } from "@/components/HeroScroll";
import { ServiceSelector } from "@/components/ServiceSelector";
import { TrustBar } from "@/components/TrustBar";
import { CategoryGrid } from "@/components/CategoryGrid";
import { GoogleReviewsWidget } from "@/components/GoogleReviewsWidget";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Modern Curtains and Blinds",
    "image": "https://moderncurtains.com.au/assets/logo.png",
    "@id": "https://moderncurtains.com.au",
    "url": "https://moderncurtains.com.au",
    "telephone": "1300 663 376",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Design Avenue",
      "addressLocality": "Melbourne",
      "addressRegion": "VIC",
      "postalCode": "3000",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -37.8136,
      "longitude": 144.9631
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.facebook.com/moderncurtains",
      "https://www.instagram.com/moderncurtains"
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroScroll />
      <GoogleReviewsWidget />
      <ServiceSelector />
      <TrustBar />
      <CategoryGrid />

      {/* Additional value proposition section based on report's "About" context */}
      <section className="py-24 bg-mcb-paper">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-6">Experience the Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto mt-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-2xl font-serif text-mcb-terracotta">1</div>
              <h3 className="font-serif text-xl mb-3">Custom Made in Melbourne</h3>
              <p className="text-stone-500">Every blind, curtain, and door is manufactured to your exact specifications in our local facility.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-2xl font-serif text-mcb-terracotta">2</div>
              <h3 className="font-serif text-xl mb-3">Professional Installation</h3>
              <p className="text-stone-500">Our team of experienced installers ensures a perfect fit and finish, every single time.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-2xl font-serif text-mcb-terracotta">3</div>
              <h3 className="font-serif text-xl mb-3">Industry Leading Warranty</h3>
              <p className="text-stone-500">Peace of mind with our comprehensive warranties on all fabrics, mechanisms, and security screens.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
