import { ProductTemplate } from "@/components/ProductTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Folding Arm Awnings Melbourne | Retractable Patio Shade",
    description: "Folding arm awnings in Melbourne for retractable patio, deck and outdoor dining shade. Free in-home measure and quote.",
    alternates: { canonical: "/awnings/folding-arm-awnings" },
};

export default function FoldingArmAwningsPage() {
    return (
        <ProductTemplate
            title="Folding Arm Awnings Melbourne"
            subtitle="Retractable shade for patios, decks and outdoor dining."
            heroImage="/assets/folding_arm_awning.webp"
            description="Folding arm awnings create flexible overhead shade where you want outdoor comfort without permanent posts or a fixed roof. They retract neatly when not in use and can be assessed for manual or motorised operation."
            intentLabel="Retractable patio shade"
            features={[
                { title: "Retractable Shade", description: "Extend the awning when you need shade and retract it when you want open sky." },
                { title: "No Front Posts", description: "Folding arms support the fabric for a clean, open patio feel." },
                { title: "Manual or Motorised", description: "Operation options depend on size, access and product suitability." },
            ]}
            decisionGuide={[
                { title: "Choose for patios", description: "Best for decks, courtyards and outdoor dining areas needing overhead shade." },
                { title: "Check exposure", description: "Wind exposure, fixing surface and projection size all affect product suitability." },
                { title: "Compare with zipscreens", description: "Zipscreens suit vertical openings; folding arms suit overhead shade." },
            ]}
            comparisonRows={[
                { label: "Folding arm awning", bestFor: "Overhead shade", notes: "Retractable shade over patios and decks." },
                { label: "Zipscreen", bestFor: "Vertical openings", notes: "Track-guided side shade and privacy." },
                { label: "Window awning", bestFor: "Hot windows", notes: "External shade close to the window." },
            ]}
            types={[
                {
                    title: "Manual Folding Arm Awnings",
                    description: "Simple retractable shade for suitable patios and decks.",
                    image: "/assets/folding_arm_awning.webp"
                },
                {
                    title: "Motorised Folding Arm Awnings",
                    description: "Remote operation for larger awnings or daily outdoor use.",
                    image: "/assets/awning_hero.webp"
                }
            ]}
            faq={[
                { question: "Are folding arm awnings good for patios?", answer: "Yes. They are designed for retractable overhead shade over patios, decks and outdoor dining spaces." },
                { question: "Do folding arm awnings need posts?", answer: "No. The folding arms support the fabric from the wall-mounted system, subject to fixing suitability." },
                { question: "Can folding arm awnings be motorised?", answer: "Many systems can be motorised depending on size, product and power access." },
            ]}
        />
    );
}
