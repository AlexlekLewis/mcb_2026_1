import { ProductTemplate } from "@/components/ProductTemplate";
import { legacyBlindContent } from "@/lib/legacy-blind-content";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

const content = legacyBlindContent.sunscreenBlinds;

export const metadata = content.metadata;

export default function SunscreenBlindsPage() {
    const product = productData.find(p => p.slug === "sunscreen-roller-blinds");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title="Sunscreen Blinds"
            subtitle="Glare Reduction & UV Protection"
            heroImage="/images/sunscreen-blinds.png"
            description="Preserve daytime outlook while reducing glare, UV exposure and harsh afternoon sun. Sunscreen blinds are ideal for bright living areas, offices and open-plan rooms."
            intentLabel={content.intentLabel}
            features={product.features}
            benefits={product.benefits}
            ctaText="Book Free Measure & Quote"
            types={[
                {
                    title: "3% Openness",
                    description: "Good balance of view and privacy.",
                    image: "/images/sunscreen-blind-detail.png"
                },
                {
                    title: "5% Openness",
                    description: "Better view, standard UV protection.",
                    image: "/images/sunscreen-blind-view.png"
                }
            ]}
            decisionGuide={content.decisionGuide}
            comparisonRows={content.comparisonRows}
            faq={content.faq}
        />
    );
}
