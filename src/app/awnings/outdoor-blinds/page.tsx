import { ProductTemplate } from "@/components/ProductTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Outdoor Blinds Melbourne | Zipscreens & Alfresco Blinds",
    description: "Outdoor blinds in Melbourne for alfresco areas, patios and exposed openings. Compare zipscreens, track-guided blinds and outdoor shade options.",
    alternates: { canonical: "/awnings/outdoor-blinds" },
};

export default function OutdoorBlindsPage() {
    return (
        <ProductTemplate
            title="Outdoor Blinds Melbourne"
            subtitle="Shade, privacy and wind control for outdoor living."
            heroImage="/images/product-unique/mcb-zipscreens-alfresco-hero.webp"
            description="Outdoor blinds help turn patios, decks and alfresco areas into more usable spaces. We help you compare zipscreens, track-guided outdoor blinds and other shade options based on exposure, privacy, wind and how you use the area."
            intentLabel="Alfresco shade and privacy"
            features={[
                { title: "Alfresco Comfort", description: "Reduce sun, glare and wind so outdoor areas feel more usable through the year." },
                { title: "Privacy Control", description: "Create a more private outdoor room without permanently closing the area in." },
                { title: "Measured for Exposure", description: "We assess the opening, fixing points and weather exposure before recommending a system." },
            ]}
            decisionGuide={[
                { title: "Choose zipscreens", description: "Best for track-guided alfresco shade, privacy and wind control." },
                { title: "Choose awnings", description: "Best for shading patios, decks or hot windows before the sun reaches the glass." },
                { title: "Choose outdoor shutters", description: "Best where you want a more architectural aluminium shutter finish." },
            ]}
            comparisonRows={[
                { label: "Zipscreens", bestFor: "Alfresco openings", notes: "Track-guided fabric for shade, privacy and wind control." },
                { label: "Folding arm awnings", bestFor: "Patios and decks", notes: "Retractable overhead shade." },
                { label: "Window awnings", bestFor: "Hot windows", notes: "Stops heat before it reaches the glass." },
            ]}
            types={[
                {
                    title: "Zipscreens",
                    description: "Track-guided outdoor blinds for alfresco areas and larger outdoor openings.",
                    image: "/images/product-unique/mcb-zipscreens-alfresco-hero.webp",
                    href: "/awnings/zipscreens"
                },
                {
                    title: "Folding Arm Awnings",
                    description: "Retractable overhead shade for patios, decks and outdoor dining.",
                    image: "/assets/folding_arm_awning.webp",
                    href: "/awnings/folding-arm-awnings"
                },
                {
                    title: "Window Awnings",
                    description: "External shade for hot windows and exposed rooms.",
                    image: "/assets/auto_guide_awning.webp",
                    href: "/awnings/window-awnings"
                }
            ]}
            faq={[
                { question: "Are zipscreens outdoor blinds?", answer: "Yes. Zipscreens are a type of track-guided outdoor blind commonly used for alfresco shade, privacy and wind control." },
                { question: "Can outdoor blinds be motorised?", answer: "Many outdoor blind systems can be motorised depending on size, power access and product type." },
                { question: "Will you check wind exposure?", answer: "Yes. We assess exposure and fixing conditions during the free measure." },
            ]}
        />
    );
}
