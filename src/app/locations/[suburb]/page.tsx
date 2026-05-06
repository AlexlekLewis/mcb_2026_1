import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCATIONS, getLocationBySlug, getNearbyLocations } from '@/lib/locations';
import { ProductTemplate } from '@/components/ProductTemplate';
import { SITE } from '@/lib/site';
import { LOCATION_PRODUCTS } from '@/lib/location-products';
import { PageViewTracker } from '@/components/PageViewTracker';

interface Props {
    params: Promise<{
        suburb: string;
    }>;
}

// Generate static params for all locations at build time
export async function generateStaticParams() {
    return LOCATIONS.map((loc) => ({
        suburb: loc.slug,
    }));
}

// Generate unique metadata for each location
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { suburb: slug } = await params;
    const suburb = getLocationBySlug(slug);
    if (!suburb) return {};

    return {
        title: `Curtains & Blinds ${suburb.name} | Free Quote`,
        description: `Curtains and blinds in ${suburb.name} ${suburb.postcode}. Custom curtains, roller blinds, shutters, security doors, fly screens and awnings with free in-home measure and quote.`,
        alternates: {
            canonical: `/locations/${suburb.slug}`,
        },
        openGraph: {
            title: `Curtains and Blinds ${suburb.name}`,
            description: `Free in-home measure and quote for custom curtains, blinds, shutters and security screens in ${suburb.name}.`,
        }
    };
}

export default async function LocationPage({ params }: Props) {
    const { suburb: slug } = await params;
    const suburb = getLocationBySlug(slug);
    const nearby = getNearbyLocations(slug);

    if (!suburb) {
        notFound();
    }

    // Dynamic features content based on location to reduce "duplicate content" feel
    const features = [
        {
            title: `Local to ${suburb.name}`,
            description: `We provide in-home measure and quote appointments across ${suburb.name} and nearby Melbourne suburbs.`
        },
        {
            title: "Samples Brought to You",
            description: "Compare fabrics, colours, textures and mesh options in your own home before choosing."
        },
        {
            title: "Every Opening Covered",
            description: "Ask about curtains, blinds, shutters, security doors, fly screens, awnings and motorisation during one visit."
        }
    ];

    const types = [
        {
            title: "Custom Blinds",
            description: `Modern roller, sunscreen, translucent, honeycomb, Venetian and specialty blinds for ${suburb.name} homes.`,
            href: `/locations/${suburb.slug}/blinds`,
            image: "/assets/roller_blind_hero.webp"
        },
        {
            title: "Custom Curtains",
            description: "Sheer, blockout, double, Wavefold and motorised curtains measured and installed.",
            href: `/locations/${suburb.slug}/curtains`,
            image: "/assets/curtain_hero.png"
        },
        {
            title: "Plantation Shutters",
            description: "Timeless plantation shutters that increase curbside appeal and offer superior light control.",
            href: `/locations/${suburb.slug}/shutters`,
            image: "/images/plantation-shutters-hero.webp"
        },
        {
            title: "Security Doors & Screens",
            description: "Security doors, fly screens and pet mesh custom fitted for peace of mind.",
            href: `/locations/${suburb.slug}/security-doors`,
            image: "/images/security-door-hero.webp"
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": SITE.name,
        "image": `${SITE.url}/assets/curtain_hero.png`,
        "telephone": SITE.phoneDisplay,
        "url": `${SITE.url}/locations/${suburb.slug}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": suburb.name,
            "addressRegion": "VIC",
            "postalCode": suburb.postcode,
            "addressCountry": "AU"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": suburb.latitude,
            "longitude": suburb.longitude
        },
        "areaServed": {
            "@type": "City",
            "name": suburb.name
        },
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday"
                ],
                "opens": "09:00",
                "closes": "17:00"
            }
        ]
    };

    return (
        <>
            <PageViewTracker
                event="view_location"
                payload={{
                    page_type: "location",
                    suburb_slug: suburb.slug,
                    suburb_name: suburb.name,
                    suburb_postcode: suburb.postcode,
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductTemplate
                title={`Curtains and Blinds ${suburb.name}`}
                subtitle={`Free in-home measure and quote in ${suburb.name}`}
                heroImage="/assets/curtain_hero.png"
                description={`We provide free in-home measure and quote appointments across ${suburb.name}, bringing fabric samples, product advice and professional measuring to your home. Choose from custom curtains, roller blinds, plantation shutters, security doors, fly screens, awnings and motorisation.`}
                features={features}
                intentLabel={`${suburb.name} service area`}
                decisionGuide={[
                    { title: "For bedrooms", description: "Blockout curtains, blockout roller blinds and roller shutters for privacy and better sleep." },
                    { title: "For living areas", description: "Sheers, Wavefold curtains, sunscreen blinds and translucent blinds for soft light and daytime privacy." },
                    { title: "For security", description: "Security doors, fly screens and pet mesh can be quoted during the same visit." },
                ]}
                types={types}
                ctaText="Book Free Measure"
                nearbyLocations={nearby}
                faq={[
                    { question: `Do you service ${suburb.name}?`, answer: `Yes. We offer in-home measure and quote appointments across ${suburb.name} and nearby Melbourne suburbs.` },
                    { question: "Can you quote multiple products in one visit?", answer: "Yes. We can measure and quote curtains, blinds, shutters, security screens, awnings and motorisation during one appointment." },
                    { question: "Do you bring samples?", answer: "Yes. We bring suitable samples so you can compare colours and textures in your own home." },
                ]}
                internalLinks={{
                    title: `Popular products in ${suburb.name}`,
                    description: `Each product page is tailored for ${suburb.name} so customers can move from local intent to the right quote path quickly.`,
                    links: LOCATION_PRODUCTS.map((product) => ({
                        label: `${product.title} ${suburb.name}`,
                        href: `/locations/${suburb.slug}/${product.slug}`,
                        description: product.bestFor,
                    })),
                }}
            />
        </>
    );
}
