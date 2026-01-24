import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCATIONS, getLocationBySlug, getNearbyLocations } from '@/lib/locations';
import { ProductTemplate } from '@/components/ProductTemplate';

interface Props {
    params: {
        suburb: string;
    };
}

// Generate static params for all locations at build time
export async function generateStaticParams() {
    return LOCATIONS.map((loc) => ({
        suburb: loc.slug,
    }));
}

// Generate unique metadata for each location
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const suburb = await getLocationBySlug(params.suburb);
    if (!suburb) return {};

    return {
        title: `Curtains and Blinds ${suburb.name} | Custom Made Window Treatments`,
        description: `Looking for curtains and blinds in ${suburb.name} ${suburb.postcode}? We provide premium custom made blinds, shutters and security doors. Free measure and quote in ${suburb.name}.`,
        openGraph: {
            title: `Curtains and Blinds ${suburb.name} | Custom Made Window Treatments`,
            description: `Looking for curtains and blinds in ${suburb.name}? We are local experts providing premium custom window furnishings.`,
        }
    };
}

export default async function LocationPage({ params }: Props) {
    const suburb = await getLocationBySlug(params.suburb);
    const nearby = getNearbyLocations(params.suburb);

    if (!suburb) {
        notFound();
    }

    // Dynamic features content based on location to reduce "duplicate content" feel
    const features = [
        {
            title: `Local to ${suburb.name}`,
            description: "We are your local window furnishing experts, providing timely service and professional installation throughout the area."
        },
        {
            title: "Custom Made Quality",
            description: "Every product is custom manufactured to exact specifications, ensuring a perfect fit for your home's unique windows."
        },
        {
            title: "Full Warranty",
            description: "Enjoy peace of mind with our comprehensive warranty on all fabrics, mechanisms, and installation work."
        }
    ];

    const types = [
        {
            title: "Roller Blinds",
            description: `Modern and functional roller blinds for ${suburb.name} homes. Available in blockout, light filtering, and sunscreen fabrics.`,
            href: "/blinds"
        },
        {
            title: "S-Fold Curtains",
            description: "Elegant sheer and blockout curtains that add improved insulation and style to any room.",
            href: "/curtains"
        },
        {
            title: "Plantation Shutters",
            description: "Timeless plantation shutters that increase curbside appeal and offer superior light control.",
            href: "/shutters"
        },
        {
            title: "Security Doors",
            description: "Protect your family with our high-grade security doors and screens, custom fitted for maximum strength.",
            href: "/security"
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Modern Curtains & Blinds",
        "image": "https://moderncurtains.com.au/assets/curtain_hero.png",
        "telephone": "1300732319",
        "url": `https://moderncurtains.com.au/locations/${suburb.slug}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": suburb.name,
            "addressRegion": "VIC",
            "postalCode": suburb.postcode,
            "addressCountry": "AU"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-37.7431", // Default to Preston/Central if specific lat/long not available, or omit if strictly service area
            "longitude": "145.0081"
        },
        "areaServed": {
            "@type": "City",
            "name": suburb.name,
            "sameAs": `https://en.wikipedia.org/wiki/${suburb.name.replace(/\s+/g, '_')},_Victoria`
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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductTemplate
                title={`Curtains and Blinds ${suburb.name}`}
                subtitle={`Premium Window Furnishings for ${suburb.name} Homes`}
                heroImage="/assets/curtain_hero.png"
                description={`Elevate your home in ${suburb.name} with our range of custom made curtains, blinds, and shutters. We come to you with samples.`}
                features={features}
                types={types}
                ctaText="Book Free Measure"
                nearbyLocations={nearby}
            />
        </>
    );
}
