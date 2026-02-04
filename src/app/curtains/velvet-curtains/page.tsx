import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function VelvetCurtainsPage() {
    const product = productData.find(p => p.slug === "velvet-curtains");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage={product.heroImage}
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Add Luxury"
            types={[
                {
                    title: "Theatre Curtains",
                    description: "Heavy velvet for sound absorption and light block.",
                    image: "/images/theatre-velvet-curtains.png"
                },
                {
                    title: "Decorative Drapes",
                    description: "Add a touch of warmth and class to living areas.",
                    image: "/images/decorative-velvet-drapes.png"
                }
            ]}
        />
    );
}
