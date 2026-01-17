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
                    title: "Timber Venetians",
                    description: "Real wood slats that add natural warmth and character to study and living areas.",
                    image: "/assets/venetian_timber_detail.png"
                },
                {
                    title: "PVC Vision Wood",
                    description: "White, bright, and impervious to moisture. The look of wood with the durability of plastic.",
                    image: "/assets/venetian_pvc_detail.png"
                },
                {
                    title: "Aluminium Venetians",
                    description: "Slimline 25mm slats for a retro office chic or modern minimalist aesthetic.",
                    image: "/assets/venetian_aluminium_detail.png"
                }
            ]}
        />
    );
}
