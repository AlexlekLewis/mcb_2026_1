import { ProductTemplate } from "@/components/ProductTemplate";

export default function HoneycombBlindsPage() {
    return (
        <ProductTemplate
            title="Honeycomb Blinds"
            subtitle="The ultimate energy-saving window covering."
            heroImage="/images/product-unique/mcb-honeycomb-blinds-clean-energy-efficient-room-hero.webp"
            description="Also known as Cellular Blinds, Honeycomb blinds feature a unique hexagonal cell structure that traps air, creating an insulating barrier against summer heat and winter cold. They are incredibly efficient and stack away to almost nothing."
            features={[
                {
                    title: "Thermal Efficiency",
                    description: "Can reduce heat loss through windows by up to 60%, significantly lowering your energy bills."
                },
                {
                    title: "Top-Down / Bottom-Up",
                    description: "Lower from the top to let light in while keeping the bottom closed for privacy. Distinctive and versatile."
                },
                {
                    title: "Minimal Stack",
                    description: "When raised, the blind compresses into a tiny stack, preserving maximum view."
                }
            ]}
            types={[
                {
                    title: "Translucent Cellular",
                    description: "Softly filters natural light while maintaining privacy. The unique cellular structure traps air to provide insulation without blocking the sun's glow. Available in refined 20mm cell sizes.",
                    image: "/images/product-unique/mcb-honeycomb-cellular-blind-insulation-detail.webp"
                },
                {
                    title: "Blockout Cellular Shield",
                    description: "The ultimate thermal barrier. foil-lined cells prevent light leakage and maximize energy efficiency. Perfect for nurseries and bedrooms requiring total darkness.",
                    image: "/images/product-unique/mcb-blockout-honeycomb-blinds-bedroom.webp"
                },
                {
                    title: "Cordless & Safe",
                    description: "Designed with family safety in mind. Our effortless cordless lifting system eliminates dangling strings, offering a sleek look and peace of mind.",
                    image: "/images/product-unique/mcb-cordless-honeycomb-blinds-clean-child-safe.webp"
                }
            ]}
        />
    );
}
