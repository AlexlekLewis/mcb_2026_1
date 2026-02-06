import { ProductTemplate } from "@/components/ProductTemplate";

export default function RollerBlindsPage() {
    return (
        <ProductTemplate
            title="Roller Blinds"
            subtitle="The modern standard for simplicity and control."
            heroImage="/assets/roller_blinds_interior.png"
            description="Our custom-made Roller Blinds offer a sleek, architectural look that fits perfectly into any modern home. Simple to operate and incredibly durable, they come in an extensive range of fabrics including blockout, light-filtering, and solar screen options."
            features={[
                {
                    title: "Versatile Control",
                    description: "Choose from chain operation, spring-loaded zero-gravity, or full motorisation for ultimate convenience."
                },
                {
                    title: "Fabric Variety",
                    description: "Hundreds of textures and colours available, from textured weaves to smooth blockouts and high-performance screens."
                },
                {
                    title: "Dual Brackets",
                    description: "Combine Day (Screen) and Night (Blockout) blinds on a single slimline bracket for 24-hour privacy and light control."
                }
            ]}
            types={[
                {
                    title: "Premium Blockout Collection",
                    description: "Complete privacy and light exclusion. Featuring 100% blockout acrylic coated fabrics that provide exceptional thermal insulation and finish consistency.",
                    image: "/assets/roller_blockout_detail.png"
                },
                {
                    title: "Solar Control Screen",
                    description: "Engineered to cut glare and UV rays while preserving your view. Essential for protecting furniture and flooring from sun damage without losing connection to the outdoors.",
                    image: "/assets/roller_sunscreen_detail.png"
                },
                {
                    title: "Designer Light Filtering",
                    description: "A sophisticated middle ground. Textured fabrics that glow when back-lit, offering privacy day and night without the heavy look of a blockout.",
                    image: "/assets/roller_light_filtering_detail.png"
                },
                {
                    title: "Dual Roller System",
                    description: "The best of both worlds. Combine a Screen blind for day use and a Blockout blind for night privacy on a single slimline bracket.",
                    image: "/assets/double_roller_blinds.png"
                }
            ]}
        />
    );
}
