import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function SunscreenBlindsPage() {
    const product = productData.find(p => p.slug === "roller-blinds");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title="Sunscreen Blinds"
            subtitle="Glare Reduction & UV Protection"
            heroImage="/images/sunscreen-blinds.png"
            description="Preserve your view while blocking harmful UV rays and reducing heat."
            features={product.features}
            benefits={product.benefits}
            ctaText="Shop Sunscreen"
            types={[
                {
                    title: "3% Openness",
                    description: "Good balance of view and privacy.",
                    image: "/images/sunscreen-3.jpg"
                },
                {
                    title: "5% Openness",
                    description: "Better view, standard UV protection.",
                    image: "/images/sunscreen-5.jpg"
                }
            ]}
        />
    );
}
