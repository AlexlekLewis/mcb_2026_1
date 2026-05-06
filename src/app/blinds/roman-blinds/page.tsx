import { ProductTemplate } from "@/components/ProductTemplate";
import { legacyBlindContent } from "@/lib/legacy-blind-content";

const content = legacyBlindContent.romanBlinds;

export const metadata = content.metadata;

export default function RomanBlindsPage() {
    return (
        <ProductTemplate
            title="Roman Blinds"
            subtitle="Soft folds for a sophisticated, tailored look."
            heroImage="/assets/roman_blinds_closeup.png"
            description="Roman Blinds combine soft fabric folds with the functionality of a blind. When raised, the fabric stacks neatly; when lowered, it creates a smooth, tailored finish. Blockout Roman blinds are a main option for bedrooms, privacy and a softer room-darkening look."
            intentLabel={content.intentLabel}
            features={[
                {
                    title: "Timeless Elegance",
                    description: "Adds warmth, depth, and texture to a room that roller blinds sometimes lack."
                },
                {
                    title: "Blockout Option",
                    description: "Choose lined blockout fabric when privacy, room darkening and bedroom comfort are the priority."
                },
                {
                    title: "Various Folds",
                    description: "Choose from soft stack (casual) or hard batten (structured) styles to match your interior design."
                }
            ]}
            types={[
                {
                    title: "Translucent Romans",
                    description: "Allow soft light to filter through, highlighting the beautiful texture of the fabric weave.",
                    image: "/assets/roman_translucent_detail.png"
                },
                {
                    title: "Blockout Romans",
                    description: "Fully lined for thermal insulation and room darkening, making them ideal for bedrooms.",
                    image: "/assets/roman_blockout_detail.png"
                }
            ]}
            decisionGuide={content.decisionGuide}
            comparisonRows={content.comparisonRows}
            faq={content.faq}
        />
    );
}
