import { SITE } from "@/lib/site";

export const JsonLd = () => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "name": SITE.name,
        "image": `${SITE.url}/assets/logo.png`,
        "@id": SITE.url,
        "url": SITE.url,
        "telephone": SITE.phoneDisplay,
        "email": SITE.email,
        "areaServed": {
            "@type": "AdministrativeArea",
            "name": SITE.serviceArea
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Melbourne",
            "addressRegion": "VIC",
            "addressCountry": "AU"
        },
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "17:00"
            }
        ],
        "serviceType": [
            "Custom curtains",
            "Custom blinds",
            "Plantation shutters",
            "Security doors",
            "Fly screens",
            "Outdoor awnings",
            "Motorisation"
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};
