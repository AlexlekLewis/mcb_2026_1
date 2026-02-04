import { ProductTemplate } from "@/components/ProductTemplate";

export default function VenetianBlindsPage() {
    return (
        <ProductTemplate
            title="Venetian Blinds"
            subtitle="Precise light control with classic timber charm."
            heroImage="/assets/venetian_blinds_timber.png"
            description="Venetian Blinds offer superior versatility, allowing you to tilt the slats to control the exact amount of light and privacy you need. Our collection features premium Timber, sustainable Eco-Wood, and durable Aluminium options."
            features={[
                {
                    title: "Ultimate Control",
                    description: "Tilt slats to direct sunlight up (for ambient light) or down (for reading), or close completely for privacy."
                },
                {
                    title: "Material Options",
                    description: "Real Basswood for luxury warmth, or moisture-resistant PVC Composites perfect for bathrooms."
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
                    image: "/assets/venetian_aluminium_detail.png"
                },
                {
                    title: "Wideline Aluminium (50mm)",
                    description: "A bold statement with retro appeal. Robust 50mm slats that offer a classic aesthetic with the durability and moisture resistance of high-grade aluminium.",
                    image: "/assets/venetian_aluminium_detail.png"
                },
                {
                    title: "Premium PVC Composite",
                    description: "The look of real wood with superior durability. Highly resistant to moisture and humidity, making them the ideal solution for bathrooms, laundries, and kitchens.",
                    image: "/assets/venetian_pvc_detail.png"
                },
                {
                    title: "Urban Timber Collection",
                    description: "Authentic timber venetians that bring natural warmth and texture to living spaces. Sustainably sourced and available in a range of rich stains and painted finishes.",
                    image: "/assets/venetian_timber_detail.png"
                }
            ]}
        />
    );
}
