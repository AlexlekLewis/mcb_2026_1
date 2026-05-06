import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gathered Curtains Melbourne | Soft Traditional Curtain Heading",
    description: "Gathered curtains for soft fullness, relaxed heading style and custom fabric finishes. Free Melbourne measure and quote.",
    alternates: { canonical: "/curtains/gathered-curtains" },
};

export default function GatheredCurtainsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("curtains", 8)}
            title="Gathered Curtains Melbourne"
            subtitle="Relaxed fullness with a softer, classic heading."
            heroImage="/images/product-unique/mcb-gathered-curtains-hero.webp"
            description="Gathered curtains suit homes that need softness, texture and a more relaxed fabric fall than a structured pleat. We help you choose the right fullness, fabric weight, lining and track or rod detail so the heading feels intentional rather than bulky."
            intentLabel="Soft gathered curtain heading"
            features={[
                { title: "Soft Fullness", description: "Gathered headings create a relaxed, generous fabric fall." },
                { title: "Flexible Style", description: "Works with selected sheers, light-filtering fabrics and lined curtains." },
                { title: "Made to Measure", description: "Fullness, stack and drop are planned for the actual window and room." },
            ]}
            decisionGuide={[
                { title: "Choose for relaxed rooms", description: "Best where you want softness without a very formal pleated heading." },
                { title: "Compare with S-Fold", description: "S-Fold is more architectural; gathered curtains feel softer and more traditional." },
                { title: "Confirm fabric weight", description: "The right gathered result depends on fabric weight, fullness and track style." },
            ]}
            comparisonRows={[
                { label: "Gathered", bestFor: "Relaxed softness", notes: "A softer heading with generous fabric fullness." },
                { label: "Pleated", bestFor: "Tailored structure", notes: "More formal and consistent folded heading." },
                { label: "S-Fold", bestFor: "Modern waves", notes: "Continuous wave heading on a compatible track." },
            ]}
            types={[
                {
                    title: "Gathered Heading Detail",
                    description: "A soft heading style with a relaxed fabric fall.",
                    image: "/assets/pleated_pencil_bedroom.png",
                },
                {
                    title: "Gathered Room Finish",
                    description: "Made-to-measure gathered curtains for bedrooms, living rooms and softer interiors.",
                    image: "/assets/pleated_pinch_formal.webp",
                },
            ]}
            faq={[
                { question: "Are gathered curtains the same as pleated curtains?", answer: "No. Gathered curtains have a softer, less structured heading, while pleated curtains use a more tailored fold pattern." },
                { question: "Can gathered curtains be sheer or blockout?", answer: "They can work with selected sheer, light-filtering and lined fabrics depending on the desired fullness and finish." },
                { question: "Will gathered curtains stack back neatly?", answer: "Stack depends on fabric weight, fullness and track or rod selection. We plan this during the measure." },
            ]}
        />
    );
}
