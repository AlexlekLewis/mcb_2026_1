import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Translucent Curtains Melbourne | Light Filtering Privacy",
    description: "Custom translucent curtains for filtered daylight, glare reduction and privacy without full blockout. Free Melbourne measure and quote.",
    image: "/images/product-unique/mcb-translucent-curtains-light-filtering-hero.webp",
    path: "/curtains/translucent-curtains",
});


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
            decisionGuide={[
                { title: "Wavefold heading", description: "Best for modern living areas and large windows where you want continuous waves and a clean drape." },
                { title: "Pinch pleat", description: "Best for traditional and classic interiors that suit a tailored, structured heading." },
                { title: "Compare with sheer or blockout", description: "Choose translucent for filtered glow with privacy day and night — sheers won't give the same privacy after dark." },
            ]}
            types={[
                {
                    title: "Wavefold Heading",
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
