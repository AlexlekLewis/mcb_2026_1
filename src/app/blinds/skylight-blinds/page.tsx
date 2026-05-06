import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Skylight Blinds Melbourne | Heat, Glare & Light Control",
    description: "Custom skylight blinds in Melbourne for overhead windows, glare, heat and light control. Blockout, translucent and motorised options subject to suitability.",
    alternates: { canonical: "/blinds/skylight-blinds" },
};

export default function SkylightBlindsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("blinds", 8)}
            title="Skylight Blinds Melbourne"
            subtitle="Heat, glare and light control for overhead windows."
            heroImage="/images/product-unique/mcb-skylight-roof-window-hero.webp"
            description="Skylight blinds help manage the intense light and heat that can come through overhead glass. We assess window size, pitch, access and room use so the recommendation works with the skylight rather than against it."
            intentLabel="Control hard-to-reach overhead glass"
            features={[
                {
                    title: "Heat and Glare Control",
                    description: "Helps reduce harsh overhead light in kitchens, living spaces, stairwells and bedrooms."
                },
                {
                    title: "Blockout or Light Filtering",
                    description: "Choose stronger room darkening or softer daylight depending on how the room is used."
                },
                {
                    title: "Motorised Access",
                    description: "Motorisation can make sense for skylights that are difficult or unsafe to reach manually."
                }
            ]}
            decisionGuide={[
                { title: "Choose blockout for bedrooms", description: "Best where morning light or summer brightness interrupts sleep." },
                { title: "Choose translucent for living areas", description: "Softens overhead brightness while keeping the space naturally lit." },
                { title: "Choose motorisation for access", description: "Recommended when manual operation would be awkward, high or inconvenient." },
            ]}
            comparisonRows={[
                { label: "Blockout skylight blind", bestFor: "Bedrooms and media rooms", notes: "Stronger darkness and privacy where suitable." },
                { label: "Translucent skylight blind", bestFor: "Living areas", notes: "Softens glare while keeping daylight." },
                { label: "Motorised skylight blind", bestFor: "Hard-to-reach windows", notes: "Remote or app operation depending on hardware." },
            ]}
            types={[
                {
                    title: "Blockout Skylight Blinds",
                    description: "For overhead windows where light control and sleep quality matter most.",
                    image: "/images/product-unique/mcb-blockout-skylight-blinds-detail.webp"
                },
                {
                    title: "Translucent Skylight Blinds",
                    description: "For bright rooms that need glare reduction without losing all natural light.",
                    image: "/images/product-unique/mcb-translucent-skylight-cellular-blinds.webp"
                },
                {
                    title: "Motorised Skylight Blinds",
                    description: "For windows that are high, hard to reach or better suited to scheduled heat control.",
                    image: "/images/product-unique/mcb-motorised-skylight-blinds-remote-control.webp"
                }
            ]}
            faq={[
                { question: "Can every skylight have a blind installed?", answer: "Not every skylight is suitable. Size, angle, access, fixing surface and hardware compatibility all need to be checked during the measure." },
                { question: "Should skylight blinds be motorised?", answer: "Motorisation is often the most practical option for high or hard-to-reach skylights, but we will confirm the best operation method on site." },
                { question: "Do skylight blinds help with heat?", answer: "They can help manage glare and heat through overhead glass, especially when paired with the right fabric and fit for the room." },
            ]}
        />
    );
}
