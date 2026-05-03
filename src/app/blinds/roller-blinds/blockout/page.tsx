import { ProductTemplate } from "@/components/ProductTemplate";
import { legacyBlindContent } from "@/lib/legacy-blind-content";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

const content = legacyBlindContent.blockoutBlinds;

export const metadata = content.metadata;

export default function BlockoutBlindsPage() {
    const product = productData.find(p => p.slug === "blockout-roller-blinds");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title="Blockout Blinds"
            subtitle="Complete Darkness & Privacy"
            heroImage="/images/blockout-blinds.png"
            description="Our made-to-measure blockout blinds are designed for privacy, room darkening and everyday control in bedrooms, nurseries, media rooms and street-facing spaces."
            intentLabel={content.intentLabel}
            features={product.features}
            benefits={product.benefits}
            ctaText="Book Free Measure & Quote"
            types={[
                {
                    title: "Blockout Roller",
                    description: "Sleek and simple with total light block.",
                    image: "/images/blockout-roller-fabric.webp"
                },
                {
                    title: "Blockout Roman",
                    description: "Elegance with functionality.",
                    image: "/images/blockout-roman-blind.png"
                }
            ]}
            decisionGuide={content.decisionGuide}
            comparisonRows={content.comparisonRows}
            faq={content.faq}
        />
    );
}
