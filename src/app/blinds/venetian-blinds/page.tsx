import { ProductTemplate } from "@/components/ProductTemplate";
import { legacyBlindContent } from "@/lib/legacy-blind-content";

const content = legacyBlindContent.venetianBlinds;

export const metadata = content.metadata;

export default function VenetianBlindsPage() {
    return (
        <ProductTemplate
            title="Venetian Blinds"
            subtitle="Precise light control across timber, PVC and aluminium styles."
            heroImage="/images/product-unique/mcb-venetian-blinds-range-hero.webp"
            description="Venetian Blinds offer superior versatility, allowing you to tilt the slats to control the exact amount of light and privacy you need. Our collection features premium timber, durable PVC composite and aluminium options."
            intentLabel={content.intentLabel}
            features={[
                {
                    title: "Ultimate Control",
                    description: "Tilt slats to direct sunlight up (for ambient light) or down (for reading), or close completely for privacy."
                },
                {
                    title: "Material Options",
                    description: "Timber for luxury warmth, or moisture-resistant PVC composites for bathrooms and laundries."
                },
                {
                    title: "Custom Finishes",
                    description: "Available in a wide range of paints, stains, and slat widths (50mm / 63mm) to suit your style."
                }
            ]}
            types={[
                {
                    title: "Slimline Aluminium (25mm)",
                    description: "The modern minimalist choice. Sleek, discreet 25mm slats that almost disappear when open. Perfect for residential and commercial spaces requiring subtle light control.",
                    image: "/images/product-unique/mcb-slimline-aluminium-venetian-blinds-25mm.webp",
                    href: "/blinds/venetian-blinds/slimline-aluminium"
                },
                {
                    title: "Wideline Aluminium (50mm)",
                    description: "A bold statement with retro appeal. Robust 50mm slats that offer a classic aesthetic with the durability and moisture resistance of high-grade aluminium.",
                    image: "/images/product-unique/mcb-wideline-aluminium-venetian-blinds-50mm.webp"
                },
                {
                    title: "Premium PVC Composite",
                    description: "The look of real wood with superior durability. Highly resistant to moisture and humidity, making them the ideal solution for bathrooms, laundries, and kitchens.",
                    image: "/images/product-unique/mcb-pvc-composite-venetian-blinds-bathroom.webp"
                },
                {
                    title: "Urban Timber Collection",
                    description: "Authentic timber venetians that bring natural warmth and texture to living spaces. Sustainably sourced and available in a range of rich stains and painted finishes.",
                    image: "/images/product-unique/mcb-urban-timber-venetian-blinds-living-room.webp",
                    href: "/blinds/venetian-blinds/urban-wood"
                }
            ]}
            decisionGuide={content.decisionGuide}
            comparisonRows={content.comparisonRows}
            faq={content.faq}
        />
    );
}
