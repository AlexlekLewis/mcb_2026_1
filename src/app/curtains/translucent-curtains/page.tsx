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
            heroImage="/images/product-unique/mcb-translucent-curtains-light-filtering-hero.webp"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Filter The Light"
            types={[
                {
                    title: "S-Fold Heading",
                    description: "Modern wave style for a consistent drape.",
                    image: "/images/product-unique/mcb-translucent-s-fold-heading-detail.webp"
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
