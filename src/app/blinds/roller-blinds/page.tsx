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
                    title: "Blockout Rollers",
                    description: "100% privacy and darkness. Perfect for bedrooms and media rooms.",
                    image: "/assets/roller_blockout_detail.png"
                },
                {
                    title: "Sunscreen Rollers",
                    description: "Reduce glare and UV rays while keeping your view to the outside. Ideal for living areas.",
                    image: "/assets/roller_sunscreen_detail.png"
                },
                {
                    title: "Light Filtering",
                    description: "Softly diffuse light for a glowing interior ambience while maintaining day and night privacy.",
                    image: "/assets/roller_light_filtering_detail.png"
                }
            ]}
        />
    );
}
