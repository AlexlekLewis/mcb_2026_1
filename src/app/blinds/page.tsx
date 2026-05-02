import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Custom Blinds Melbourne | Roller, Honeycomb, Venetian & Roman",
    description: "Made-to-measure blinds in Melbourne including roller, double roller, honeycomb, Venetian, Roman, vertical and panel glide blinds. Free in-home measure and quote.",
};

export default function BlindsPage() {
    const nearby = getNearbyLocations('blinds', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Custom Made-to-Measure Blinds Melbourne"
            subtitle="Roller, Roman, Honeycomb, Venetian and more."
            heroImage="/assets/roller_blind_hero.png"
            description="From simple roller blinds to double rollers, honeycomb blinds, Venetians and Romans, we help you choose the right blind for each room. Every blind is measured to fit and professionally installed."
            intentLabel="Light, privacy and heat control"
            features={[
                {
                    title: "Thermal Efficiency",
                    description: "Our blockout and honeycomb fabrics provide exceptional insulation, significantly reducing your energy bills."
                },
                {
                    title: "Smart Home Ready",
                    description: "Integrate seamlessly with your smart home system using our advanced motorisation options for automated light control."
                },
                {
                    title: "Child Safe Direct",
                    description: "All our blinds comply with strict Australian safety standards, ensuring a safe environment for your family."
                }
            ]}
            decisionGuide={[
                { title: "Need darkness?", description: "Choose blockout roller blinds for bedrooms, nurseries, media rooms and privacy." },
                { title: "Need daytime view?", description: "Choose sunscreen blinds to reduce glare and heat while keeping a daytime outlook." },
                { title: "Need insulation?", description: "Choose honeycomb blinds for a cellular air pocket that helps with summer heat and winter cold." },
                { title: "Need sliding-door coverage?", description: "Choose vertical or panel glide blinds for large glass doors and wide openings." },
                { title: "Need softness?", description: "Choose Roman blinds when you want fabric warmth without full curtains." },
                { title: "Need airflow?", description: "Choose Venetians for tilt control, ventilation and adjustable privacy." },
            ]}
            comparisonRows={[
                { label: "Blockout roller", bestFor: "Bedrooms and privacy", notes: "Simple, cost-effective darkness and privacy." },
                { label: "Sunscreen roller", bestFor: "Glare and daytime view", notes: "Reduces UV and heat while keeping rooms bright." },
                { label: "Double roller", bestFor: "Day and night control", notes: "Combines sunscreen and blockout on one bracket." },
                { label: "Honeycomb", bestFor: "Insulation", notes: "Cellular structure helps reduce heat transfer." },
                { label: "Venetian", bestFor: "Airflow and tilt control", notes: "Timber, PVC/faux wood and aluminium options." },
                { label: "Vertical / panel glide", bestFor: "Sliding doors", notes: "Practical coverage for wide openings." },
            ]}
            types={[
                {
                    title: "Roller Blinds",
                    description: "The classic modern choice. Simple, durable, and available in hundreds of fabrics from screen to blockout.",
                    image: "/assets/roller_blinds_interior.png",
                    href: "/blinds/roller-blinds"
                },
                {
                    title: "Double Rollers",
                    description: "The best of both worlds. Combine a screen blind for day privacy with a blockout blind for night-time comfort on a single bracket.",
                    image: "/assets/double_roller_blinds.png",
                    href: "/blinds/double-roller-blinds"
                },
                {
                    title: "Roman Blinds",
                    description: "Add warmth and texture with the soft folds of a Roman blind. A sophisticated alternative that acts like a curtain but functions like a blind.",
                    image: "/assets/roman_blinds.png",
                    href: "/blinds/roman-blinds"
                },
                {
                    title: "Honeycomb Blinds",
                    description: "Energy-efficient cellular blinds that help insulate hot, cold or exposed rooms.",
                    image: "/assets/honeycomb_blinds.png",
                    href: "/blinds/honeycomb-blinds"
                },
                {
                    title: "Venetian Blinds",
                    description: "Timber, PVC/faux wood and aluminium slats for precise light, privacy and airflow control.",
                    image: "/images/venetian-blinds-hero.png",
                    href: "/blinds/venetian-blinds"
                },
                {
                    title: "Vertical Blinds",
                    description: "A practical option for sliding doors, large windows and rental-friendly light control.",
                    image: "/assets/vertical_blinds_modern.png",
                    href: "/blinds/vertical-blinds"
                },
                {
                    title: "Panel Glide Blinds",
                    description: "Wide fabric panels that glide smoothly across large doors and contemporary openings.",
                    image: "/assets/panel_glide_blinds.png",
                    href: "/blinds/panel-glide"
                }
            ]}
            faq={[
                { question: "Which blinds are best for bedrooms?", answer: "Blockout roller blinds, double rollers and honeycomb blinds are the most common bedroom choices because they improve privacy and light control." },
                { question: "What is the difference between sunscreen and blockout blinds?", answer: "Sunscreen blinds reduce glare and heat while preserving daytime views. Blockout blinds provide stronger privacy and darkness." },
                { question: "Can blinds be motorised?", answer: "Yes. Many roller, double roller, honeycomb and curtain products can be motorised depending on size, power access and control preference." },
                { question: "Do you bring fabric samples?", answer: "Yes. We bring samples to your home so you can compare colours and opacity in your own light." },
            ]}
        />
    );
}
