import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wire Guide Awnings Melbourne | Slim Guided Outdoor Shade",
    description: "Wire guide awnings for slim exterior shade guidance on windows and outdoor openings. Free Melbourne measure and quote.",
    alternates: { canonical: "/awnings/wire-guide-awnings" },
};

export default function WireGuideAwningsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("awnings", 8)}
            title="Wire Guide Awnings Melbourne"
            subtitle="Slim side guidance for exterior shade fabrics."
            heroImage="/images/product-unique/mcb-wire-guide-awning-hero.webp"
            description="Wire guide awnings use slim side wires to help guide the fabric while keeping the look lighter than a full side-channel system. They can suit selected exterior windows and sheltered outdoor openings where clean shade and a minimal finish matter."
            intentLabel="Minimal guided exterior shade"
            features={[
                { title: "Slim Guide Wires", description: "A lighter side-guidance look than full channels or tracks." },
                { title: "Exterior Shade", description: "Helps manage glare, heat and privacy on suitable openings." },
                { title: "Clean Finish", description: "A restrained option where the exterior detail needs to feel subtle." },
            ]}
            decisionGuide={[
                { title: "Choose for a lighter look", description: "Best where side guidance is useful but a full fixed guide is visually too heavy." },
                { title: "Check exposure", description: "Wind and opening size determine whether wire guide, fixed guide or zipscreen is more suitable." },
                { title: "Confirm access", description: "Manual and motorised operation can be discussed depending on access and product fit." },
            ]}
            comparisonRows={[
                { label: "Wire guide", bestFor: "Slim guided shade", notes: "Minimal side wires for selected exterior openings." },
                { label: "Fixed guide", bestFor: "More side control", notes: "A stronger guide detail for certain openings." },
                { label: "Straight drop", bestFor: "Simple vertical shade", notes: "No side guidance where conditions allow." },
            ]}
            types={[
                {
                    title: "Wire Guide Detail",
                    description: "Slim side wires guide the fabric while keeping the exterior appearance clean.",
                    image: "/images/product-unique/mcb-wire-guide-awning-cable-detail.webp",
                },
                {
                    title: "Balcony and Window Shade",
                    description: "A refined option for selected windows, balconies and sheltered outdoor spaces.",
                    image: "/images/product-unique/mcb-wire-guide-awning-balcony.webp",
                },
            ]}
            faq={[
                { question: "What does a wire guide do?", answer: "The wire guide helps the awning fabric travel and sit more neatly without using a full side channel." },
                { question: "Is wire guide suitable for windy areas?", answer: "It depends on exposure and span. We check this on site and may recommend fixed guide or zipscreens instead." },
                { question: "Can wire guide awnings be motorised?", answer: "Motorisation may be possible on suitable systems, depending on product, size and power access." },
            ]}
        />
    );
}
