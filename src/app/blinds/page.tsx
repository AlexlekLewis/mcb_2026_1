import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Custom Blinds Melbourne | Roller, Honeycomb, Venetian & Specialty Blinds",
    description: "Made-to-measure blinds in Melbourne including roller, sunscreen, blockout, translucent, honeycomb, Venetian, Roman, vertical, panel glide, cassette, skylight, Veri Shades and motorised blinds. Free in-home measure and quote.",
};

export default function BlindsPage() {
    const nearby = getNearbyLocations('blinds', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Custom Made-to-Measure Blinds Melbourne"
            subtitle="Roller, sunscreen, blockout, honeycomb, Venetian, Roman, specialty and motorised blinds."
            heroImage="/assets/roller_blind_hero.png"
            description="From simple roller blinds to soft translucent light control, honeycomb insulation, Venetians, Romans and specialty blind systems, we help you choose the right blind for each room. Every blind is measured to fit and professionally installed."
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
                { title: "Need sliding-door coverage?", description: "Choose vertical, Veri Shades or panel glide blinds for large glass doors and wide openings." },
                { title: "Need softness?", description: "Choose Roman blinds when you want fabric warmth without full curtains." },
                { title: "Need airflow?", description: "Choose Venetians for tilt control, ventilation and adjustable privacy." },
                { title: "Need a cleaner cassette finish?", description: "Choose cassette blinds when the headbox and roller hardware need to look more integrated." },
                { title: "Need overhead control?", description: "Choose skylight blinds for heat, glare and light control on hard-to-reach windows." },
            ]}
            comparisonRows={[
                { label: "Blockout roller", bestFor: "Bedrooms and privacy", notes: "Simple, cost-effective darkness and privacy." },
                { label: "Sunscreen roller", bestFor: "Glare and daytime view", notes: "Reduces UV and heat while keeping rooms bright." },
                { label: "Translucent blind", bestFor: "Soft light", notes: "Filters daylight where full blockout is not needed." },
                { label: "Double roller", bestFor: "Day and night control", notes: "Combines sunscreen and blockout on one bracket." },
                { label: "Honeycomb", bestFor: "Insulation", notes: "Cellular structure helps reduce heat transfer." },
                { label: "Venetian", bestFor: "Airflow and tilt control", notes: "Timber, PVC/faux wood and aluminium options." },
                { label: "Vertical / panel glide / Veri Shades", bestFor: "Sliding doors", notes: "Practical coverage for wide openings." },
                { label: "Cassette / skylight", bestFor: "Specialty windows", notes: "Neater hardware or hard-to-reach overhead window control." },
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
                    title: "Translucent Blinds",
                    description: "Light-filtering blinds for soft daylight, reduced glare and rooms that need privacy without feeling closed in.",
                    image: "/images/product-unique/mcb-translucent-blinds-light-filtering-hero.webp",
                    href: "/blinds/translucent-blinds"
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
                },
                {
                    title: "Motorised Blinds",
                    description: "Remote, app and schedule control for roller blinds, double rollers and other suitable products.",
                    image: "/images/product-unique/mcb-motorised-blinds-remote-hero.webp",
                    href: "/blinds/motorised-blinds"
                },
                {
                    title: "Cassette Blinds",
                    description: "A cleaner enclosed headbox for selected roller blind applications and more polished room finishes.",
                    image: "/images/product-unique/mcb-cassette-blinds-neat-headbox-hero.webp",
                    href: "/blinds/cassette-blinds"
                },
                {
                    title: "Skylight Blinds",
                    description: "Heat, glare and light control for overhead windows and hard-to-reach glass.",
                    image: "/images/product-unique/mcb-skylight-blinds-overhead-heat-control-hero.webp",
                    href: "/blinds/skylight-blinds"
                },
                {
                    title: "Veri Shades",
                    description: "Soft vertical fabric vanes with curtain-like movement for sliding doors and wide openings.",
                    image: "/images/product-unique/mcb-veri-shades-soft-vertical-hero.webp",
                    href: "/blinds/veri-shades"
                }
            ]}
            faq={[
                { question: "Which blinds are best for bedrooms?", answer: "Blockout roller blinds, double rollers and honeycomb blinds are the most common bedroom choices because they improve privacy and light control." },
                { question: "What is the difference between sunscreen and blockout blinds?", answer: "Sunscreen blinds reduce glare and heat while preserving daytime views. Blockout blinds provide stronger privacy and darkness." },
                { question: "What are translucent blinds best for?", answer: "Translucent blinds are best for rooms where you want soft daylight and privacy without the full darkness of a blockout blind." },
                { question: "Do you supply specialty blinds like cassette, skylight and Veri Shades?", answer: "Yes. We can advise on specialty blind options during the in-home visit and confirm what is suitable for the window size, room and hardware requirements." },
                { question: "Can blinds be motorised?", answer: "Yes. Many roller, double roller, honeycomb and curtain products can be motorised depending on size, power access and control preference." },
                { question: "Do you bring fabric samples?", answer: "Yes. We bring samples to your home so you can compare colours and opacity in your own light." },
            ]}
        />
    );
}
