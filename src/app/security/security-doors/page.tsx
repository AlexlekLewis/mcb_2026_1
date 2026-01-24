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
            heroImage={product.heroImage}
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Get Secured"
            types={[
                {
                    title: "Invisi-Gard",
                    description: "316 Marine Grade Stainless Steel mesh. The premium choice.",
                    image: "/images/invisi-gard.jpg"
                },
                {
                    title: "Diamond Grille",
                    description: "Traditional and cost-effective security solution.",
                    image: "/images/diamond-grille.jpg"
                }
            ]}
        />
    );
}
