import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cassette Blinds Melbourne | Custom Roller Blind Headbox Systems",
    description: "Custom cassette blinds in Melbourne for a cleaner enclosed roller blind finish. Blockout, translucent and motorised options subject to window suitability.",
    alternates: { canonical: "/blinds/cassette-blinds" },
};

export default function CassetteBlindsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("blinds", 8)}
            title="Cassette Blinds Melbourne"
            subtitle="A cleaner enclosed headbox for selected roller blind applications."
            heroImage="/images/product-unique/mcb-cassette-blinds-neat-headbox-hero.webp"
            description="Cassette blinds hide the fabric roll inside a neat headbox, creating a more integrated finish than an exposed roller. They are useful where a cleaner architectural look matters or where the blind hardware needs to feel more considered."
            intentLabel="A neater roller blind finish"
            features={[
                {
                    title: "Enclosed Headbox",
                    description: "Conceals the roll and bracket hardware for a cleaner finish at the top of the window."
                },
                {
                    title: "Fabric Protection",
                    description: "Helps keep the fabric roll protected when the blind is raised."
                },
                {
                    title: "Blockout and Motorised Options",
                    description: "Can be considered with blockout fabrics and motorisation where the window size and hardware are suitable."
                }
            ]}
            decisionGuide={[
                { title: "Choose cassette for visible living areas", description: "Best when an exposed roll would look unfinished in a prominent room." },
                { title: "Ask about side gaps", description: "A cassette can clean up the top detail, but side light gaps still depend on fit, reveal and fabric system." },
                { title: "Consider motorisation early", description: "Motorisation can pair well with cassette blinds if the motor and headbox are selected together." },
            ]}
            comparisonRows={[
                { label: "Standard roller", bestFor: "Simple value", notes: "Visible roll and brackets, lower hardware profile." },
                { label: "Cassette roller", bestFor: "Finished interiors", notes: "Enclosed headbox for a more integrated look." },
                { label: "Motorised cassette", bestFor: "Premium rooms", notes: "Pairs cleaner hardware with remote or app operation." },
            ]}
            types={[
                {
                    title: "Standard Cassette Roller Blinds",
                    description: "A tidy upgrade for living areas, home offices and visible window positions.",
                    image: "/images/product-unique/mcb-cassette-roller-blind-headbox-detail.webp"
                },
                {
                    title: "Blockout Cassette Blinds",
                    description: "Useful for bedrooms or media rooms where you want a cleaner top finish with stronger privacy and darkness.",
                    image: "/images/product-unique/mcb-blockout-cassette-blinds-bedroom.webp"
                },
                {
                    title: "Motorised Cassette Blinds",
                    description: "Remote or app control with a more polished blind headbox, subject to size and motor compatibility.",
                    image: "/images/product-unique/mcb-motorised-cassette-blinds-detail.webp"
                }
            ]}
            faq={[
                { question: "Do cassette blinds block all light gaps?", answer: "They can help tidy the top of the blind, but full light control depends on the window reveal, fitting method, side gaps and fabric choice." },
                { question: "Are cassette blinds available for every window?", answer: "Not always. We confirm suitability during the measure because cassette size, fixing surface and blind dimensions matter." },
                { question: "Can cassette blinds be motorised?", answer: "Yes, many cassette blind systems can be motorised if the chosen hardware and blind size support it." },
            ]}
        />
    );
}
