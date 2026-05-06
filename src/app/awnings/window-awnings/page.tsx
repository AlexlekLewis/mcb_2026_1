import { ProductTemplate } from "@/components/ProductTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Window Awnings Melbourne | External Heat & Glare Control",
    description: "Window awnings in Melbourne for external heat, glare and privacy control. Free in-home measure and quote.",
    alternates: { canonical: "/awnings/window-awnings" },
};

export default function WindowAwningsPage() {
    return (
        <ProductTemplate
            title="Window Awnings Melbourne"
            subtitle="Stop heat before it reaches the glass."
            heroImage="/assets/auto_guide_awning.webp"
            description="Window awnings shade exposed glass from outside, helping reduce heat and glare before it enters the room. They are a practical option for hot windows, street-facing rooms and west-facing elevations."
            intentLabel="External window shade"
            features={[
                { title: "Heat Reduction", description: "External shade can reduce heat before the sun reaches the glass." },
                { title: "Glare Control", description: "Make bright rooms more comfortable during harsh sun." },
                { title: "Privacy and Weather", description: "Product suitability depends on exposure, window position and fixing conditions." },
            ]}
            decisionGuide={[
                { title: "Choose for hot windows", description: "Best for rooms that overheat from direct sun." },
                { title: "Compare with folding arm awnings", description: "Folding arms shade patios; window awnings shade the window itself." },
                { title: "Compare with zipscreens", description: "Zipscreens suit larger alfresco openings and outdoor rooms." },
            ]}
            comparisonRows={[
                { label: "Window awning", bestFor: "Hot windows", notes: "External shade mounted near the window." },
                { label: "Folding arm awning", bestFor: "Patios and decks", notes: "Retractable overhead shade." },
                { label: "Outdoor blind", bestFor: "Alfresco openings", notes: "Vertical fabric shade and privacy." },
            ]}
            types={[
                {
                    title: "Auto Guide Awnings",
                    description: "A classic external awning style for heat control and privacy on suitable windows.",
                    image: "/assets/auto_guide_awning.webp"
                },
                {
                    title: "Window Shade Awnings",
                    description: "External fabric shade for exposed rooms and sun-facing windows.",
                    image: "/assets/awning_hero.webp"
                }
            ]}
            faq={[
                { question: "Do window awnings reduce heat?", answer: "Yes. They help by shading the glass before direct sun heats the room." },
                { question: "Are window awnings different from folding arm awnings?", answer: "Yes. Window awnings shade windows, while folding arm awnings usually shade patios, decks and outdoor dining areas." },
                { question: "Will you check if my windows are suitable?", answer: "Yes. We check fixing points, exposure and window position during the free measure." },
            ]}
        />
    );
}
