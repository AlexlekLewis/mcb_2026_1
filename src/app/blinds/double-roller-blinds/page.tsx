import { ProductTemplate } from "@/components/ProductTemplate";
import { legacyBlindContent } from "@/lib/legacy-blind-content";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

const content = legacyBlindContent.doubleRollerBlinds;

export const metadata = content.metadata;

export default function DoubleRollerBlindsPage() {
    const product = productData.find(p => p.slug === "double-roller-blinds");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/double-roller-hero.png"
            description={product.description}
            intentLabel={content.intentLabel}
            features={product.features}
            benefits={product.benefits}
            ctaText="Get a Quote"
            types={[
                {
                    title: "Dual System",
                    description: "Blockout and sun protection on one bracket.",
                    image: "/images/double-roller-bracket.png"
                },
                {
                    title: "Motorised Double",
                    description: "Independent control for ultimate convenience.",
                    image: "/images/double-roller-motor.png"
                }
            ]}
            decisionGuide={content.decisionGuide}
            comparisonRows={content.comparisonRows}
            faq={content.faq}
        />
    );
}
