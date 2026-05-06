import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Outdoor Products Melbourne | Zipscreens, Awnings & Roller Shutters",
    description: "Outdoor products in Melbourne including zipscreens, roller shutters, folding arm, straight drop, auto, fixed guide and wire guide awnings. Free measure and quote.",
};

export default function AwningsPage() {
    const nearby = getNearbyLocations('awnings', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Outdoor Products Melbourne"
            subtitle="Use your deck, patio or alfresco area more often."
            heroImage="/images/product-unique/mcb-outdoor-products-category-hero.webp"
            description="Shade hot windows, protect alfresco areas and make outdoor spaces more comfortable in sun, wind and light rain. We help you choose between zipscreens, roller shutters, folding arm awnings, straight drop awnings, auto awnings, fixed guide awnings, motorised outdoor blinds and wire guide systems based on exposure and how you use the space."
            intentLabel="Shade, heat control and outdoor comfort"
            features={[
                {
                    title: "Sun & Heat Control",
                    description: "Block up to 90% of harmful UV rays and heat, keeping your outdoor and indoor areas significantly cooler."
                },
                {
                    title: "Wind Resistant",
                    description: "Our systems are engineered for Australian conditions, capable of withstanding high winds with durable retention systems."
                },
                {
                    title: "Seamless Integration",
                    description: "Designed to blend perfectly with your home's architecture, available in a wide range of powder-coated colours."
                }
            ]}
            decisionGuide={[
                { title: "Shade a patio", description: "Choose folding arm awnings for flexible shade over decks and outdoor dining areas." },
                { title: "Cool exposed windows", description: "Choose auto, straight drop, fixed guide or wire guide awnings to reduce heat before it reaches the glass." },
                { title: "Enclose alfresco areas", description: "Choose zipscreens for privacy, sun and wind control around outdoor rooms." },
                { title: "Need blockout or security?", description: "Choose roller shutters when protection, privacy, insulation and darkness matter." },
            ]}
            comparisonRows={[
                { label: "Zipscreens", bestFor: "Alfresco rooms", notes: "Track-guided fabric for shade, privacy and wind control." },
                { label: "Roller shutters", bestFor: "Security and blockout", notes: "Exterior shutter protection for heat, light and privacy control." },
                { label: "Folding arm awnings", bestFor: "Patios and decks", notes: "Retractable shade when you need it." },
                { label: "Straight drop awnings", bestFor: "Simple vertical shade", notes: "Exterior fabric shade for windows and sheltered openings." },
                { label: "Auto awnings", bestFor: "Classic window shade", notes: "External shade to reduce heat and glare." },
                { label: "Fixed guide awnings", bestFor: "Guided fabric control", notes: "Side guidance for suitable windows and outdoor openings." },
                { label: "Wire guide awnings", bestFor: "Slim guided finish", notes: "A lighter guide look for selected openings." },
            ]}
            types={[
                {
                    title: "Zipscreens",
                    description: "Track-guided outdoor shade for alfresco privacy, sun and wind control.",
                    image: "/images/product-unique/mcb-zipscreens-alfresco-hero.webp",
                    href: "/awnings/zipscreens"
                },
                {
                    title: "Roller Shutters",
                    description: "Exterior shutters for privacy, insulation, blockout and added protection.",
                    image: "/images/product-unique/mcb-roller-shutters-exterior-window-hero.webp",
                    href: "/shutters/roller-shutters"
                },
                {
                    title: "Folding Arm Awnings",
                    description: "Create an instant alfresco dining area. Retracts neatly against the wall when not in use for an unobtrusive look.",
                    image: "/assets/folding_arm_awning.webp",
                    href: "/awnings/folding-arm-awnings"
                },
                {
                    title: "Straight Drop Awnings",
                    description: "Simple vertical exterior shade for windows and sheltered openings.",
                    image: "/images/product-unique/mcb-straight-drop-awning-hero.webp",
                    href: "/awnings/straight-drop-awnings"
                },
                {
                    title: "Auto Awnings",
                    description: "Classic external awnings for window heat, glare and privacy control.",
                    image: "/images/product-unique/mcb-auto-awning-hero.webp",
                    href: "/awnings/auto-awnings"
                },
                {
                    title: "Fixed Guide Awnings",
                    description: "Guided exterior shade where the fabric needs more side control.",
                    image: "/images/product-unique/mcb-fixed-guide-awning-hero.webp",
                    href: "/awnings/fixed-guide-awnings"
                },
                {
                    title: "Motorised Outdoor Blinds",
                    description: "Remote operation for suitable outdoor blinds, zipscreens and awnings.",
                    image: "/images/product-unique/mcb-motorised-outdoor-blinds-hero.webp",
                    href: "/awnings/motorised-outdoor-blinds"
                },
                {
                    title: "Wire Guide Awnings",
                    description: "Slim side-guided awnings for a lighter exterior finish on suitable openings.",
                    image: "/images/product-unique/mcb-wire-guide-awning-hero.webp",
                    href: "/awnings/wire-guide-awnings"
                }
            ]}
            faq={[
                { question: "What is best for an alfresco area?", answer: "Zipscreens and selected motorised outdoor systems are common choices because they help with sun, privacy, wind and insects." },
                { question: "Do awnings reduce heat inside?", answer: "Yes. External awnings can reduce heat by stopping direct sun before it reaches the glass." },
                { question: "Can outdoor products be motorised?", answer: "Many awnings and outdoor blind systems can be motorised depending on size, power and product type." },
                { question: "Will you check wind exposure?", answer: "Yes. The free measure lets us assess exposure and recommend a suitable outdoor solution." },
            ]}
        />
    );
}
