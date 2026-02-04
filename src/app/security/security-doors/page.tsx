import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function SecurityDoorsPage() {
    const product = productData.find(p => p.slug === "security-doors");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/security-door-hero.png"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Get Secured"
            types={[
                {
                    title: "Invisi-Gard",
                    description: "316 Marine Grade Stainless Steel mesh. The premium choice.",
                    image: "/images/sec-stainless.png"
                },
                {
                    title: "Diamond Grille",
                    description: "Traditional and cost-effective security solution.",
                    image: "/images/sec-diamond.png"
                }
            ]}
        />
    );
}
