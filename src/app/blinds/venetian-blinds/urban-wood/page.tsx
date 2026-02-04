import { ProductTemplate } from "@/components/ProductTemplate";

export default function UrbanTimberVenetiansPage() {
    return (
        <ProductTemplate
            title="Urban Timber Collection"
            subtitle="Authentic natural warmth for living spaces."
            heroImage="/images/timber-shutter-detail.png"
            description="Our Urban Timber Venetians bring the genuine warmth of natural wood into your home. Sustainably sourced and expertly crafted, these blinds feature rich timber stains or painted finishes that add character and elegance to bedrooms, living rooms, and studies."
            features={[
                {
                    title: "Natural Beauty",
                    description: "Real wood textures and grains that synthetic materials simply cannot replicate."
                },
                {
                    title: "Excellent Insulation",
                    description: "Wood is a natural insulator, helping to keep your home comfortable year-round."
                },
                {
                    title: "Wide Slat Options",
                    description: "Available in 50mm and 63mm slat widths to suit different window sizes and styles."
                }
            ]}
            types={[
                {
                    title: "Stained Timber",
                    description: "Enhance the natural grain with rich stains from honey oak to walnut.",
                    image: "/images/timber-shutter-detail.png"
                },
                {
                    title: "Painted Timber",
                    description: "Classic white or custom painted colours to match your interior palette.",
                    image: "/images/timber-shutter-detail.png"
                }
            ]}
        />
    );
}
