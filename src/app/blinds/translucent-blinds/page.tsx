import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Translucent Blinds Melbourne | Light Filtering Custom Blinds",
    description: "Custom translucent blinds in Melbourne for soft daylight, reduced glare and daytime privacy. Free in-home measure and quote with samples brought to you.",
    alternates: { canonical: "/blinds/translucent-blinds" },
};

export default function TranslucentBlindsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("blinds", 8)}
            title="Translucent Blinds Melbourne"
            subtitle="Soft light-filtering blinds for privacy without closing the room in."
            heroImage="/images/product-unique/mcb-translucent-blinds-light-filtering-hero.webp"
            description="Translucent blinds are made for rooms where natural light matters. They soften glare, add daytime privacy and create a warmer interior finish than bare glass, while still keeping the room bright and welcoming."
            intentLabel="Soft light and privacy"
            features={[
                {
                    title: "Filtered Daylight",
                    description: "Diffuses harsh sun so living areas, dining rooms and studies feel calmer through the day."
                },
                {
                    title: "Daytime Privacy",
                    description: "Improves privacy compared with uncovered windows while keeping the room open and light."
                },
                {
                    title: "Coordinated Fabrics",
                    description: "Can be matched with blockout, sunscreen or curtain fabrics for a layered whole-home finish."
                }
            ]}
            decisionGuide={[
                { title: "Choose translucent for living rooms", description: "Ideal when you want daylight and softness rather than full darkness." },
                { title: "Pair with blockout for bedrooms", description: "Use translucent fabric for daytime comfort and add blockout where night privacy or sleep control matters." },
                { title: "Compare to sunscreen blinds", description: "Sunscreen fabrics keep more view; translucent fabrics create a softer, more private interior feel." },
            ]}
            comparisonRows={[
                { label: "Translucent roller", bestFor: "Soft daylight", notes: "Clean roller blind function with a gentler fabric effect." },
                { label: "Translucent Roman", bestFor: "Decorative rooms", notes: "Adds texture and fabric folds without a full curtain treatment." },
                { label: "Translucent panel glide", bestFor: "Wide glass", notes: "Large panels for sliding doors and contemporary openings." },
            ]}
            types={[
                {
                    title: "Light Filtering Roller Blinds",
                    description: "A simple, modern blind for reducing glare while keeping the room bright.",
                    image: "/images/product-unique/mcb-light-filtering-roller-blinds-detail.webp"
                },
                {
                    title: "Translucent Roman Blinds",
                    description: "Soft fabric folds for bedrooms, formal living rooms and spaces that need warmth and texture.",
                    image: "/images/product-unique/mcb-translucent-roman-blinds-soft-folds.webp"
                },
                {
                    title: "Translucent Panel Glide Blinds",
                    description: "Wide fabric panels for large doors where you want light control and a cleaner alternative to curtains.",
                    image: "/images/product-unique/mcb-translucent-panel-glide-wide-opening.webp"
                }
            ]}
            faq={[
                { question: "Are translucent blinds private at night?", answer: "They improve daytime privacy but are not the best choice for night privacy when lights are on. For bedrooms or street-facing rooms, we may recommend blockout or double blinds." },
                { question: "Are translucent blinds the same as sunscreen blinds?", answer: "No. Sunscreen blinds are more view-focused, while translucent blinds are softer and more fabric-like with less outward view." },
                { question: "Can translucent blinds be motorised?", answer: "Many roller blind applications can be motorised, depending on size, fabric weight and power preference." },
            ]}
        />
    );
}
