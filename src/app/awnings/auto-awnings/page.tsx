import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Auto Awnings Melbourne | Exterior Sun Control",
    description: "Auto awnings for exterior window shade, privacy and heat control. Free Melbourne in-home measure and quote.",
    alternates: { canonical: "/awnings/auto-awnings" },
};

export default function AutoAwningsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("awnings", 8)}
            title="Auto Awnings Melbourne"
            subtitle="Classic exterior shade for windows that cop the heat."
            heroImage="/images/product-unique/mcb-auto-guide-awning-exterior-hero.webp"
            description="Auto awnings are a familiar, effective way to reduce heat and glare on windows before the sun reaches the glass. They suit many ground-floor windows and can be discussed alongside straight drop, fixed guide and wire guide options during the measure."
            intentLabel="Classic external window awnings"
            features={[
                { title: "External Sun Control", description: "Shade the outside of the window to help reduce indoor heat and glare." },
                { title: "Privacy From Outside", description: "Create more daytime privacy while keeping the room usable." },
                { title: "Measured to Fit", description: "We check width, projection, wall fixing and nearby obstacles before recommending a system." },
            ]}
            decisionGuide={[
                { title: "Choose for hot rooms", description: "Best for rooms affected by direct sun through exterior windows." },
                { title: "Compare with straight drop", description: "Straight drop suits a simpler vertical shade; auto awnings suit classic window shade applications." },
                { title: "Consider motorisation", description: "Motorised operation can be considered where access or daily use makes manual operation less convenient." },
            ]}
            comparisonRows={[
                { label: "Auto awning", bestFor: "External window shade", notes: "Classic awning option for heat and privacy." },
                { label: "Straight drop", bestFor: "Simple vertical shade", notes: "Clean drop for suitable windows and sheltered openings." },
                { label: "Wire guide", bestFor: "Light side guidance", notes: "Useful when fabric needs subtle guidance without full tracks." },
            ]}
            types={[
                {
                    title: "Auto Awning Arm Detail",
                    description: "A compact exterior arm system for practical window shade.",
                    image: "/images/product-unique/mcb-auto-awning-arm-closeup.webp",
                },
                {
                    title: "Window Shade Finish",
                    description: "External fabric shade that helps manage heat before it enters the room.",
                    image: "/images/product-unique/mcb-auto-awning-window-shade-finish.webp",
                },
            ]}
            faq={[
                { question: "Do auto awnings help with heat?", answer: "Yes. They shade the exterior glass, which can reduce heat before it enters the room." },
                { question: "Are auto awnings only for windows?", answer: "They are most commonly used for exterior windows, but we confirm suitability on site based on the opening and fixing points." },
                { question: "Can auto awnings be motorised?", answer: "Some exterior awning systems can be motorised depending on product, access and power suitability." },
            ]}
        />
    );
}
