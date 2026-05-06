import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Motorised Outdoor Blinds Melbourne | Remote Outdoor Shade",
    description: "Motorised outdoor blinds, zipscreens and awnings for remote outdoor shade and privacy. Free Melbourne measure and quote.",
    alternates: { canonical: "/awnings/motorised-outdoor-blinds" },
};

export default function MotorisedOutdoorBlindsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("awnings", 8)}
            title="Motorised Outdoor Blinds Melbourne"
            subtitle="Remote control for alfresco shade, privacy and comfort."
            heroImage="/images/product-unique/mcb-motorised-outdoor-blinds-hero.webp"
            description="Motorised outdoor blinds make daily alfresco shade easier, especially across wide spans or frequently used outdoor areas. We check product suitability, power access, exposure and control preferences before recommending a motorised outdoor system."
            intentLabel="Outdoor shade automation"
            features={[
                { title: "Remote Operation", description: "Control suitable outdoor blinds and awnings without manual handling." },
                { title: "Great for Wide Spans", description: "Motorisation can make larger outdoor openings much easier to use." },
                { title: "Control Options", description: "Discuss remote, wall switch, app and schedule options where suitable." },
            ]}
            decisionGuide={[
                { title: "Choose for convenience", description: "Best when the outdoor shade will be adjusted often." },
                { title: "Check power access", description: "We confirm wiring, power and product compatibility during the measure." },
                { title: "Compare product types", description: "Motorisation can apply to selected zipscreens, awnings and outdoor blind systems." },
            ]}
            comparisonRows={[
                { label: "Motorised zipscreen", bestFor: "Alfresco openings", notes: "Remote operation for track-guided outdoor shade." },
                { label: "Motorised awning", bestFor: "Patio/window shade", notes: "Useful for larger or high-use awnings." },
                { label: "Manual outdoor product", bestFor: "Simple use", notes: "May suit smaller or less frequently used openings." },
            ]}
            types={[
                {
                    title: "Remote Outdoor Control",
                    description: "Control selected outdoor blind systems with simple remote operation.",
                    image: "/images/product-unique/mcb-motorised-outdoor-blinds-remote.webp",
                },
                {
                    title: "Motorised Alfresco Shade",
                    description: "Make larger zipscreen and outdoor shade systems easier to use every day.",
                    image: "/images/product-unique/mcb-motorised-outdoor-blinds-zipscreen.webp",
                },
            ]}
            faq={[
                { question: "Can all outdoor blinds be motorised?", answer: "Not all systems or openings are suitable. We check span, exposure, product type and power access before recommending motorisation." },
                { question: "Can motorised outdoor blinds use remotes or apps?", answer: "Depending on the selected motor and controls, remote, wall switch, app and schedule options may be available." },
                { question: "Are motorised outdoor products good for alfresco areas?", answer: "Yes, especially where the opening is wide or the blind will be adjusted often for sun, privacy or wind comfort." },
            ]}
        />
    );
}
