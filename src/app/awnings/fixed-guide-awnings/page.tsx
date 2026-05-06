import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Fixed Guide Awnings Melbourne | Guided Outdoor Shade",
    description: "Fixed guide awnings for exterior shade, side guidance and outdoor privacy. Free Melbourne in-home measure and quote.",
    alternates: { canonical: "/awnings/fixed-guide-awnings" },
};

export default function FixedGuideAwningsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("awnings", 8)}
            title="Fixed Guide Awnings Melbourne"
            subtitle="Guided exterior shade for windows and outdoor openings."
            heroImage="/images/product-unique/mcb-fixed-guide-awning-outdoor-shade-hero.webp"
            description="Fixed guide awnings help keep the fabric travelling neatly within a guided exterior system. They can suit windows and outdoor openings where straight drop fabric needs more control, but a full zipscreen enclosure may not be required."
            intentLabel="Guided shade and privacy"
            features={[
                { title: "Guided Fabric Travel", description: "Side guidance helps the fabric sit more predictably across the opening." },
                { title: "Exterior Heat Control", description: "Reduces direct sun before it reaches windows or outdoor sitting areas." },
                { title: "Measured for Exposure", description: "We check wind, span, fixing surfaces and the right product style before quoting." },
            ]}
            decisionGuide={[
                { title: "Choose for guided shade", description: "Best when a simple straight drop needs extra side control." },
                { title: "Compare with zipscreens", description: "Zipscreens are stronger for full alfresco enclosure and larger outdoor spans." },
                { title: "Check the fixing surface", description: "The free measure confirms whether the guides can be installed cleanly and safely." },
            ]}
            comparisonRows={[
                { label: "Fixed guide", bestFor: "Controlled exterior shade", notes: "Guided fabric for windows and outdoor openings." },
                { label: "Straight drop", bestFor: "Simple shade", notes: "Less guided, cleaner and simpler where suitable." },
                { label: "Wire guide", bestFor: "Slim guidance", notes: "A lighter guide look where full channels are not preferred." },
            ]}
            types={[
                {
                    title: "Side Guide Detail",
                    description: "A more controlled edge detail for outdoor fabric shade.",
                    image: "/images/product-unique/mcb-fixed-guide-awning-side-track-detail.webp",
                },
                {
                    title: "Exterior Window Guide",
                    description: "A practical guided awning approach for heat and privacy control.",
                    image: "/images/product-unique/mcb-fixed-guide-awning-fabric-panel-detail.webp",
                },
            ]}
            faq={[
                { question: "What is a fixed guide awning?", answer: "It is an exterior awning style where the fabric is guided at the sides to help it travel and sit more neatly." },
                { question: "Is this the same as a zipscreen?", answer: "No. A zipscreen is a more enclosed track-guided outdoor blind system. Fixed guide awnings are assessed separately for the opening." },
                { question: "Will you recommend the right guide system?", answer: "Yes. We compare straight drop, fixed guide, wire guide and zipscreen options during the measure." },
            ]}
        />
    );
}
