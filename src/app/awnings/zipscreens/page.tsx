import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function ZipscreensPage() {
    const product = productData.find(p => p.slug === "zipscreens");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/zipscreen-track-guided.png"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Enclose Your Alfresco"
            types={[
                {
                    title: "Track Guided",
                    description: "No gaps, perfect seal against wind and bugs.",
                    image: "/images/zipscreen-track-guided.png"
                },
                {
                    title: "Motorised Zipscreens",
                    description: "Control your outdoor climate remotely.",
                    image: "/images/motorised-zipscreen.png"
                }
            ]}
        />
    );
}
