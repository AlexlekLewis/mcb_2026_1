import { ProductTemplate } from "@/components/ProductTemplate";

export default function RomanBlindsPage() {
    return (
        <ProductTemplate
            title="Roman Blinds"
            subtitle="Soft folds for a sophisticated, tailored look."
            heroImage="/assets/roman_blinds_closeup.png"
            description="Roman Blinds combine the softness of curtains with the functionality of blinds. When raised, the fabric stacks neatly in distinct soft folds; when lowered, it creates a smooth, flat decorative finish. An elegant choice for bedrooms and formal living spaces."
            features={[
                {
                    title: "Timeless Elegance",
                    description: "Adds warmth, depth, and texture to a room that roller blinds sometimes lack."
                },
                {
                    title: "Custom Fabrics",
                    description: "Available in a massive range of curtain fabrics, allowing for perfect coordination with other window treatments."
                },
                {
                    title: "Various Folds",
                    description: "Choose from soft stack (casual) or hard batten (structured) styles to match your interior design."
                }
            ]}
            types={[
                {
                    title: "Translucent Romans",
                    description: "Allow soft light to filter through, highlighting the beautiful texture of the fabric weave.",
                    image: "/assets/roman_translucent_detail.png"
                },
                {
                    title: "Blockout Romans",
                    description: "Fully lined for thermal insulation and room darkening, making them ideal for bedrooms.",
                    image: "/assets/roman_blockout_detail.png"
                }
            ]}
        />
    );
}
