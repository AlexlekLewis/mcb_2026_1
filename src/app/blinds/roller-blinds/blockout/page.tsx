import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function BlockoutBlindsPage() {
    const product = productData.find(p => p.slug === "blockout-roller-blinds");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title="Blockout Blinds"
            subtitle="Complete Darkness & Privacy"
            heroImage="/images/blockout-blinds.png"
            description="Our Blockout Blinds are designed to provide maximum privacy and light control, perfect for bedrooms and media rooms."
            features={product.features}
            benefits={product.benefits}
            ctaText="Book Free Measure & Quote"
            types={[
                {
                    title: "Blockout Roller",
                    description: "Sleek and simple with total light block.",
                    image: "/images/blockout-roller-fabric.png"
                },
                {
                    title: "Blockout Roman",
                    description: "Elegance with functionality.",
                    image: "/images/blockout-roman-blind.png"
                }
            ]}
        />
    );
}
