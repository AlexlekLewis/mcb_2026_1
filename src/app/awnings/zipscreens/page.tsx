import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Zipscreens Melbourne | Alfresco Outdoor Blinds",
    description: "Custom zipscreens for alfresco shade, wind protection, privacy and outdoor comfort. Free Melbourne measure and quote.",
    image: "/images/product-unique/mcb-zipscreens-alfresco-hero.webp",
    path: "/awnings/zipscreens",
});


export default function ZipscreensPage() {
    const product = productData.find(p => p.slug === "zipscreens");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/product-unique/mcb-zipscreens-alfresco-hero.webp"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Enclose Your Alfresco"
            types={[
                {
                    title: "Track Guided",
                    description: "No gaps, perfect seal against wind and bugs.",
                    image: "/images/product-unique/mcb-zipscreen-track-guided-side-channel-detail.webp"
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
