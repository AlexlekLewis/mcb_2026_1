import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function FlyScreensPage() {
    const product = productData.find(p => p.slug === "fly-screens");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/sec-fly.png"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Order Screens"
            types={[
                {
                    title: "Retractable Screens",
                    description: "Disappear when not in use. Perfect for bi-folds.",
                    image: "/images/retractable-screen.png"
                },
                {
                    title: "Pet Mesh",
                    description: "Heavier gauge mesh resistant to claws.",
                    image: "/images/pet-mesh.png"
                }
            ]}
        />
    );
}
