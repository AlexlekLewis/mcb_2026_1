import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Security Doors Melbourne | Stainless Mesh & Diamond Grille",
    description: "Custom security doors for airflow, entry protection and peace of mind. Free Melbourne in-home measure and quote.",
    image: "/images/security-door-hero.webp",
    path: "/security/security-doors",
});


export default function SecurityDoorsPage() {
    const product = productData.find(p => p.slug === "security-doors");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/security-door-hero.webp"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Get Secured"
            types={[
                {
                    title: "Invisi-Gard",
                    description: "316 Marine Grade Stainless Steel mesh. The premium choice.",
                    image: "/images/sec-stainless.webp"
                },
                {
                    title: "Diamond Grille",
                    description: "Traditional and cost-effective security solution.",
                    image: "/images/sec-diamond.webp"
                }
            ]}
        />
    );
}
