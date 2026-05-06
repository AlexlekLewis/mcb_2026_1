import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cassette Blinds Melbourne | Custom Roller Blind Headbox Systems",
    description: "Custom cassette blinds in Melbourne for stronger room darkening, reduced light gaps and a cleaner enclosed roller blind finish. Free in-home measure and quote.",
    alternates: { canonical: "/blinds/cassette-blinds" },
};

export default function CassetteBlindsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("blinds", 8)}
            title="Cassette Blinds Melbourne"
            subtitle="A stronger room-darkening blind system with a cleaner enclosed finish."
            heroImage="/images/product-unique/mcb-cassette-blinds-neat-headbox-hero.webp"
            description="Cassette blinds are designed for rooms where stronger room darkening matters. The enclosed headbox and side-channel options can help reduce light gaps while also making the blind look cleaner and more finished than an exposed roller."
            intentLabel="Room darkening and reduced light gaps"
            features={[
                {
                    title: "Reduced Light Gaps",
                    description: "Cassette and side-channel systems can help reduce the light that leaks around standard roller blinds."
                },
                {
                    title: "Room Darkening",
                    description: "A strong option for theatre rooms, nurseries, bedrooms and night-shift workers who need a darker room."
                },
                {
                    title: "Cleaner Finished Look",
                    description: "The headbox conceals the roll and brackets for a neater finish than an exposed roller blind."
                }
            ]}
            decisionGuide={[
                { title: "Choose cassette for dark rooms", description: "Best for theatre rooms, nurseries and bedrooms where reducing light gaps is important." },
                { title: "Ask about side channels", description: "Side channels can improve room darkening where the window reveal and product system are suitable." },
                { title: "Consider motorisation early", description: "Motorisation can pair well with cassette blinds if the motor and headbox are selected together." },
            ]}
            comparisonRows={[
                { label: "Standard roller", bestFor: "Simple value", notes: "Visible roll and brackets, lower hardware profile." },
                { label: "Cassette roller", bestFor: "Room darkening", notes: "Enclosed headbox helps reduce top light gaps." },
                { label: "Motorised cassette", bestFor: "Bedrooms and theatre rooms", notes: "Pairs room-darkening hardware with remote or app operation." },
            ]}
            types={[
                {
                    title: "Standard Cassette Roller Blinds",
                    description: "A tidy enclosed system for rooms where top light gaps and exposed hardware are a concern.",
                    image: "/images/product-unique/mcb-cassette-roller-blind-headbox-detail.webp"
                },
                {
                    title: "Blockout Cassette Blinds",
                    description: "Useful for theatre rooms, nurseries and night-shift workers bedrooms where stronger darkness matters.",
                    image: "/images/product-unique/mcb-blockout-cassette-blinds-bedroom.webp"
                },
                {
                    title: "Motorised Cassette Blinds",
                    description: "Remote or app control with a more polished blind headbox, subject to size and motor compatibility.",
                    image: "/images/product-unique/mcb-motorised-cassette-blinds-detail.webp"
                }
            ]}
            faq={[
                { question: "Do cassette blinds block all light gaps?", answer: "They can significantly improve room darkening, especially when paired with suitable side channels, but final light control depends on the window reveal, fitting method and fabric choice." },
                { question: "Are cassette blinds available for every window?", answer: "Not always. We confirm suitability during the measure because cassette size, fixing surface and blind dimensions matter." },
                { question: "Can cassette blinds be motorised?", answer: "Yes, many cassette blind systems can be motorised if the chosen hardware and blind size support it." },
            ]}
        />
    );
}
