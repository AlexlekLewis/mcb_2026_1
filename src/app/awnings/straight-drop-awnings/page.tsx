import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Straight Drop Awnings Melbourne | Exterior Window Shade",
    description: "Straight drop awnings for exterior window shade, heat reduction and privacy. Free Melbourne in-home measure and quote.",
    alternates: { canonical: "/awnings/straight-drop-awnings" },
};

export default function StraightDropAwningsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("awnings", 8)}
            title="Straight Drop Awnings Melbourne"
            subtitle="Simple vertical shade for hot windows and exposed outdoor areas."
            heroImage="/images/product-unique/mcb-straight-drop-awning-fabric-drop-detail.webp"
            description="Straight drop awnings are a practical exterior shade solution for windows, verandahs and sheltered openings where you want sun control without a bulky structure. We measure the opening, check fixing points and recommend the right fabric and operation for the exposure."
            intentLabel="Exterior heat and glare control"
            features={[
                { title: "Straight Vertical Drop", description: "Fabric drops directly down from the headbox to shade the glass or opening." },
                { title: "Heat Before It Hits Glass", description: "External shade helps reduce heat before it reaches the window." },
                { title: "Clean, Simple Operation", description: "A practical option for suitable windows, verandahs and sheltered spaces." },
            ]}
            decisionGuide={[
                { title: "Choose for hot windows", description: "Best when direct sun is heating the room through external glass." },
                { title: "Check wind exposure", description: "We assess whether straight drop, fixed guide, wire guide or zipscreen is the better fit." },
                { title: "Compare operation options", description: "Manual and motorised options depend on span, access and product suitability." },
            ]}
            comparisonRows={[
                { label: "Straight drop", bestFor: "Simple exterior shade", notes: "Vertical drop fabric for windows and sheltered openings." },
                { label: "Fixed guide", bestFor: "More guided side retention", notes: "Better when the fabric needs more control in the opening." },
                { label: "Zipscreen", bestFor: "Alfresco enclosure", notes: "Track-guided system for outdoor rooms and larger spans." },
            ]}
            types={[
                {
                    title: "Window Straight Drop Awnings",
                    description: "A neat shade option for exposed windows where heat and glare are the main issue.",
                    image: "/images/product-unique/mcb-straight-drop-awning-bottom-rail-detail.webp",
                },
                {
                    title: "Slim Guided Exterior Shade",
                    description: "For openings that need more side control, we can compare straight drop, wire guide and fixed guide options during the measure.",
                    image: "/images/product-unique/mcb-wire-guide-awning-balcony.webp",
                },
            ]}
            faq={[
                { question: "Are straight drop awnings the same as zipscreens?", answer: "No. Both are outdoor shade products, but zipscreens use a track-guided system while straight drop awnings are a simpler vertical drop style." },
                { question: "Can straight drop awnings reduce heat?", answer: "Yes. They help by shading the outside of the glass before direct sun enters the room." },
                { question: "Will you check if this is suitable for my opening?", answer: "Yes. The measure lets us check wind exposure, fixing points, access and whether another outdoor product is a better fit." },
            ]}
        />
    );
}
