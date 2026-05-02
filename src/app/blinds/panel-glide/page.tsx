import { ProductTemplate } from "@/components/ProductTemplate";

export default function PanelGlidePage() {
    return (
        <ProductTemplate
            title="Panel Glide Blinds"
            subtitle="A sleek, modern alternative to vertical blinds."
            heroImage="/images/product-unique/mcb-panel-glide-blinds-sliding-door-hero.webp"
            description="Panel Glide blinds feature wide, flat panels of fabric that glide effortlessly sideways on a multi-track system. They emulate the look of sliding doors and are perfect for contemporary open-plan living areas."
            features={[
                {
                    title: "Fabric Match",
                    description: "Can be made from the exact same fabrics as your Roller Blinds for a consistent look throughout the home."
                },
                {
                    title: "Easy Operation",
                    description: "Use a simple wand to slide the panels across. No chains or cords to tangle."
                },
                {
                    title: "Room Divider",
                    description: "Can also be ceiling mounted to act as a flexible room divider or wardrobe screen."
                }
            ]}
            types={[
                {
                    title: "Blockout Panels",
                    description: "Solid panels for privacy and cinema-style darkness.",
                    image: "/images/product-unique/mcb-panel-glide-fabric-match-detail.webp"
                },
                {
                    title: "Screen Panels",
                    description: "Semi-transparent panels that reduce glare but maintain your connection to the garden.",
                    image: "/images/product-unique/mcb-panel-glide-screen-panels-daytime-view.webp"
                }
            ]}
        />
    );
}
