import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function TranslucentCurtainsPage() {
    const product = productData.find(p => p.slug === "translucent-curtains");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/sfold-translucent.png"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Filter The Light"
            types={[
                {
                    title: "S-Fold Heading",
                    description: "Modern wave style for a consistent drape.",
                    image: "/images/sfold-translucent.png"
                },
                {
                    title: "Pinch Pleat",
                    description: "Classic tailored look.",
                    image: "/images/pinch-pleat-translucent.png"
                }
            ]}
        />
    );
}
