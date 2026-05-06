import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Double Curtains Melbourne | Sheer and Blockout Layers",
    description: "Double curtains with sheer and blockout layers for day-to-night privacy, softness and insulation. Free Melbourne measure and quote.",
    alternates: { canonical: "/curtains/double-curtains" },
};

export default function DoubleCurtainsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("curtains", 8)}
            title="Double Curtains Melbourne"
            subtitle="Sheer softness by day. Blockout comfort by night."
            heroImage="/images/product-unique/mcb-double-curtains-hero.webp"
            description="Double curtains combine a sheer layer with a blockout or lined curtain layer so the room can shift from soft daytime privacy to full night-time comfort. We help you choose fabric weight, heading style, track layout and stack position so both layers work together."
            intentLabel="Day-to-night curtain control"
            features={[
                { title: "Two Functional Layers", description: "Use sheers for daytime softness and blockout curtains for night privacy and sleep." },
                { title: "Designer Finish", description: "Layered curtains add depth, softness and a more complete window treatment." },
                { title: "Measured Track Layout", description: "We plan the double track, stack space and fabric fall during the measure." },
            ]}
            decisionGuide={[
                { title: "Choose for bedrooms", description: "Great when you want soft light during the day and darkness at night." },
                { title: "Choose for living rooms", description: "Useful when daytime privacy and evening comfort both matter." },
                { title: "Compare with blinds", description: "Double curtains are softer and fuller than blinds, with more fabric presence in the room." },
            ]}
            comparisonRows={[
                { label: "Sheer layer", bestFor: "Daytime privacy", notes: "Softens light without fully closing the room." },
                { label: "Blockout layer", bestFor: "Night privacy", notes: "Adds darkness, insulation and a more private finish." },
                { label: "Double track", bestFor: "Independent control", notes: "Lets each layer operate separately." },
            ]}
            types={[
                {
                    title: "Sheer Front Layer",
                    description: "A soft light-filtering layer for everyday privacy and gentle natural light.",
                    image: "/images/product-unique/mcb-double-curtains-sheer-layer-detail.webp",
                },
                {
                    title: "Blockout Back Layer",
                    description: "A heavier layer for night privacy, room darkening and insulation.",
                    image: "/images/product-unique/mcb-double-curtains-blockout-layer-detail.webp",
                },
            ]}
            faq={[
                { question: "What are double curtains?", answer: "Double curtains use two curtain layers, most commonly a sheer layer and a blockout or lined layer, on a double track." },
                { question: "Are double curtains good for bedrooms?", answer: "Yes. They are popular in bedrooms because they allow soft daytime light and stronger night-time privacy and darkness." },
                { question: "Can double curtains be motorised?", answer: "Selected double curtain setups can be motorised depending on track, span, fabric weight and power access." },
            ]}
        />
    );
}
