import { ProductTemplate } from "@/components/ProductTemplate";
import { legacyBlindContent } from "@/lib/legacy-blind-content";

const content = legacyBlindContent.verticalBlinds;

export const metadata = content.metadata;

export default function VerticalBlindsPage() {
    return (
        <ProductTemplate
            title="Vertical Blinds"
            subtitle="Practical, economical, and perfect for large windows."
            heroImage="/images/product-unique/mcb-vertical-blinds-sliding-door-hero.webp"
            description="Modern Vertical Blinds have come a long way. With sleek, chainless bottom weights and contemporary fabric choices, they remain the most practical solution for large sliding doors and floor-to-ceiling windows, offering excellent light control."
            intentLabel={content.intentLabel}
            features={[
                {
                    title: "Ideal for Doors",
                    description: "The blades stack neatly to the side (left, right, or split), allowing easy walkthrough access to outdoor areas."
                },
                {
                    title: "Light Rotation",
                    description: "Rotate the blades 180 degrees to follow the sun or completely block it out."
                },
                {
                    title: "Cost Effective",
                    description: "One of the most affordable custom-made solutions for expansive glass areas."
                }
            ]}
            types={[
                {
                    title: "Fabric Verticals",
                    description: "Soft fabric vanes in screen or blockout textures that soften the acoustic of large tiled rooms.",
                    image: "/images/product-unique/mcb-vertical-blinds-patio-sliding-door.webp"
                },
                {
                    title: "Rigid PVC",
                    description: "Hard-wearing, wipe-clean blades that require no bottom weights. Great for rentals and high-traffic areas.",
                    image: "/images/product-unique/mcb-rigid-pvc-vertical-blinds-detail.webp"
                }
            ]}
            decisionGuide={content.decisionGuide}
            comparisonRows={content.comparisonRows}
            faq={content.faq}
        />
    );
}
