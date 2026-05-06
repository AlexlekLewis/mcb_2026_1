import { ProductTemplate } from "@/components/ProductTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Smart Drapes Melbourne | Soft Vertical Curtain-Style Blinds",
    description: "Smart Drapes in Melbourne for sliding doors, wide openings, privacy and filtered light. Free in-home measure and quote.",
    alternates: { canonical: "/blinds/soft-vertical-drapes" },
};

export default function SoftVerticalDrapesPage() {
    return (
        <ProductTemplate
            title="Smart Drapes Melbourne"
            subtitle="Soft fabric vanes with the movement of a curtain and the control of a blind."
            heroImage="/images/product-unique/mcb-veri-shades-soft-vertical-hero.webp"
            description="Smart Drapes are a strong choice for sliding doors and wide openings where you want walk-through access, filtered light and a gentler fabric look than traditional vertical blinds."
            intentLabel="Soft vertical shading"
            features={[
                {
                    title: "Walk-Through Convenience",
                    description: "Soft vertical fabric allows easier movement through doorways compared with many rigid panel systems."
                },
                {
                    title: "Light and Privacy Control",
                    description: "Adjust the vanes to shift between filtered light, daytime comfort and a more private setting."
                },
                {
                    title: "Curtain-Like Softness",
                    description: "A good middle ground when curtains feel too heavy but standard vertical blinds feel too commercial."
                }
            ]}
            decisionGuide={[
                { title: "Choose for sliding doors", description: "Best for doors used often, where walk-through access matters." },
                { title: "Compare with vertical blinds", description: "Traditional verticals are practical and cost-effective; soft vertical drapes give a softer fabric finish." },
                { title: "Compare with curtain", description: "Panel glide suits a crisp architectural look; soft vertical drapes suit softer interiors and frequent access." },
            ]}
            comparisonRows={[
                { label: "Vertical blinds", bestFor: "Value and simple function", notes: "Practical rotating vanes for large openings." },
                { label: "Panel glide", bestFor: "Modern wide panels", notes: "Clean sliding fabric panels for contemporary rooms." },
                { label: "Smart Drapes", bestFor: "Soft access and filtered light", notes: "Curtain-like feel with vertical blind-style control." },
            ]}
            types={[
                {
                    title: "Soft Walk-Through Drapes",
                    description: "Designed for doors and traffic zones where access should feel easy and natural.",
                    image: "/images/product-unique/mcb-veri-shades-walk-through-detail.webp"
                },
                {
                    title: "Privacy and Light Control",
                    description: "A flexible option for family rooms, dining areas and open-plan spaces that need both softness and function.",
                    image: "/images/product-unique/mcb-veri-shades-privacy-light-control.webp"
                },
                {
                    title: "Sliding Door Smart Drapes",
                    description: "A softer alternative to vertical blinds or panel glide blinds for large glass doors.",
                    image: "/images/product-unique/mcb-veri-shades-sliding-door-soft-vane.webp"
                }
            ]}
            faq={[
                { question: "Are Smart Drapes the same as vertical blinds?", answer: "They solve a similar sliding-door problem, but Smart Drapes use fabric vanes for a more curtain-like feel." },
                { question: "Are Smart Drapes good for doors you use often?", answer: "Yes. They are popular for sliding doors because the soft fabric makes moving through the opening easier." },
                { question: "Can you compare Smart Drapes with panel glide blinds at the measure?", answer: "Yes. We can bring suitable samples and talk through the best fit for your doorway, privacy needs and room style." },
            ]}
        />
    );
}
