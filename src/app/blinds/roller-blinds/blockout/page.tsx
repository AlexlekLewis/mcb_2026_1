import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function BlockoutBlindsPage() {
    // Reusing roller blinds data but highlighting blockout features if specific data not present
    const product = productData.find(p => p.slug === "roller-blinds");

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
            ctaText="Shop Blockout"
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
