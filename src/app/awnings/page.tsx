import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Outdoor Blinds & Awnings Melbourne | Zipscreens & Alfresco Shade",
    description: "Outdoor blinds, zipscreens, folding arm awnings and alfresco shade solutions in Melbourne. Free in-home measure and quote.",
};

export default function AwningsPage() {
    const nearby = getNearbyLocations('awnings', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Outdoor Awnings, Zipscreens and Alfresco Blinds Melbourne"
            subtitle="Use your deck, patio or alfresco area more often."
            heroImage="/assets/awning_hero.webp"
            description="Shade hot windows, protect alfresco areas and make outdoor spaces more comfortable in sun, wind and light rain. We help you choose between folding arm awnings, window awnings, zipscreens and outdoor shutters based on your exposure and how you use the space."
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
                { title: "Cool exposed windows", description: "Choose auto guide or window awnings to reduce heat before it reaches the glass." },
                { title: "Enclose alfresco areas", description: "Choose zipscreens or track-guided outdoor blinds for privacy, sun and wind control." },
                { title: "Need outdoor privacy?", description: "Choose outdoor shutters or zipscreens depending on the opening and exposure." },
            ]}
            comparisonRows={[
                { label: "Zipscreens", bestFor: "Alfresco rooms", notes: "Track-guided fabric for shade, privacy and wind control." },
                { label: "Folding arm awnings", bestFor: "Patios and decks", notes: "Retractable shade when you need it." },
                { label: "Window awnings", bestFor: "Hot windows", notes: "Stops heat before it hits the glass." },
                { label: "Outdoor shutters", bestFor: "Privacy and structure", notes: "Durable option for balconies and outdoor living." },
            ]}
            types={[
                {
                    title: "Folding Arm Awnings",
                    description: "Create an instant alfresco dining area. Retracts neatly against the wall when not in use for an unobtrusive look.",
                    image: "/assets/folding_arm_awning.webp",
                    href: "/awnings"
                },
                {
                    title: "Auto Guide Awnings",
                    description: "The classic Australian sun solution. Perfect for ground floor windows, offering privacy and excellent heat reduction.",
                    image: "/assets/auto_guide_awning.webp",
                    href: "/awnings"
                },
                {
                    title: "Zipscreen Blinds",
                    description: "Turn your pergola into an outdoor room. These track-guided blinds seal off the elements for year-round entertaining.",
                    image: "/assets/zipscreen_blinds.png",
                    href: "/awnings/zipscreens"
                },
                {
                    title: "Outdoor Shutters",
                    description: "Aluminium shutters for patios, balconies and alfresco privacy where a more architectural finish is preferred.",
                    image: "/assets/outdoor_shutters_balcony.webp",
                    href: "/shutters/plantation-shutters/aluminium"
                }
            ]}
            faq={[
                { question: "What is best for an alfresco area?", answer: "Zipscreens and track-guided outdoor blinds are common choices because they help with sun, privacy, wind and insects." },
                { question: "Do awnings reduce heat inside?", answer: "Yes. External awnings can reduce heat by stopping direct sun before it reaches the glass." },
                { question: "Can outdoor products be motorised?", answer: "Many awnings and outdoor blind systems can be motorised depending on size, power and product type." },
                { question: "Will you check wind exposure?", answer: "Yes. The free measure lets us assess exposure and recommend a suitable outdoor solution." },
            ]}
        />
    );
}
