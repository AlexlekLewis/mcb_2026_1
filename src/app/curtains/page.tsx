import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Custom Curtains Melbourne | Sheer, Blockout, S-Fold & Motorised",
    description: "Custom made-to-measure curtains in Melbourne including sheer, blockout, S-Fold, double, pleated, velvet and motorised curtains. Free in-home measure and quote.",
};

export default function CurtainsPage() {
    const nearby = getNearbyLocations('curtains', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Custom Made-to-Measure Curtains Melbourne"
            subtitle="Sheer, blockout, double, S-Fold, gathered, linen, velvet and motorised."
            heroImage="/assets/curtain_hero.png" // Using PNG as static hero for speed/consistency, or could use GIF
            description="Choose sheer curtains for soft daytime privacy, blockout curtains for better sleep, or double curtains for full day-to-night control. We bring fabric samples to your home and help you choose the right heading, lining and track for each room."
            intentLabel="Privacy, softness and better sleep"
            features={[
                {
                    title: "S-Fold Specialists",
                    description: "Our signature S-Fold (Wave) heading creates a continuous, soft wave that adds instant contemporary elegance to any room."
                },
                {
                    title: "Premium Fabrics",
                    description: "Sourced from the world's leading textile mills, including linen blends, textured weaves, and 100% blockouts."
                },
                {
                    title: "Melbourne Made",
                    description: "Handcrafted locally in our Melbourne facility, ensuring superior quality control and faster turnaround times."
                }
            ]}
            decisionGuide={[
                { title: "Sheer curtains", description: "Best for living rooms, dining rooms and soft daytime privacy." },
                { title: "Blockout curtains", description: "Best for bedrooms, nurseries, shift workers and media rooms." },
                { title: "Double curtains", description: "Best for full flexibility: soft daytime light plus night privacy." },
                { title: "S-Fold curtains", description: "Best for modern floor-to-ceiling windows and clean architectural waves." },
                { title: "Pleated curtains", description: "Best for formal, traditional or tailored interiors." },
                { title: "Motorised curtains", description: "Best for large windows, convenience, child safety and smart routines." },
            ]}
            comparisonRows={[
                { label: "Sheer", bestFor: "Daytime privacy", notes: "Softens light; pair with blockout for night privacy." },
                { label: "Blockout", bestFor: "Sleep and insulation", notes: "Ideal for bedrooms, nurseries and theatres." },
                { label: "Double", bestFor: "Day/night flexibility", notes: "Layer sheer and blockout for the most control." },
                { label: "S-Fold", bestFor: "Modern style", notes: "Continuous wave heading with smooth tracking." },
                { label: "Pleated", bestFor: "Tailored finish", notes: "Classic heading with structured folds." },
            ]}
            types={[
                {
                    title: "S-Fold Signature Series",
                    description: "Our flagship curtain heading style. A continuous, fluid wave that brings architectural elegance to any room. Creates a seamless floor-to-ceiling effect that enhances feeling of space.",
                    image: "/images/sfold-curtain-detail.png",
                    href: "/curtains/s-fold-curtains"
                },
                {
                    title: "Sheer Elegance Collection",
                    description: "Light-filtering masterpieces. Featuring premium linen-look and textured voids that provide daytime privacy while filling your home with soft, diffused natural light.",
                    image: "/images/sheer-curtain-detail.png",
                    href: "/curtains/sheer"
                },
                {
                    title: "Luxury Blockout",
                    description: "The ultimate in climate and light control. Our 3-pass coated blockout fabrics ensure 100% light exclusion and superior thermal insulation for year-round comfort.",
                    image: "/images/product-unique/mcb-theatre-velvet-curtains-category-card.webp",
                    href: "/curtains/blockout"
                },
                {
                    title: "Double Curtains",
                    description: "Layer sheer and blockout curtains for daytime softness, night privacy and a premium designer finish.",
                    image: "/images/product-unique/mcb-double-curtains-hero.webp",
                    href: "/curtains/double-curtains"
                },
                {
                    title: "Gathered Curtains",
                    description: "A softer, relaxed heading style for generous curtain fullness and classic fabric movement.",
                    image: "/images/product-unique/mcb-gathered-curtains-hero.webp",
                    href: "/curtains/gathered-curtains"
                },
                {
                    title: "Theatre Class Velvet",
                    description: "Rich, opulent textures for media rooms and formal lounges. Heavyweight velvet drapes that dampen sound and create a true cinematic darkness.",
                    image: "/images/blockout-curtain-detail.webp",
                    href: "/curtains/theatre-velvet"
                },
                {
                    title: "Motorised Intelligence",
                    description: "Seamless automation. Integrate your curtains with smart home systems for 'wake up' scenes and security simulation. Cord-free safety and effortless control.",
                    image: "/images/product-unique/mcb-motorised-curtains-category-card.webp",
                    href: "/curtains/motorised"
                }
            ]}
            faq={[
                { question: "Do sheer curtains provide privacy at night?", answer: "Sheers provide daytime privacy, but at night they should be paired with blockout curtains or blinds if you need full privacy." },
                { question: "What curtain heading is most modern?", answer: "S-Fold curtains are the most popular modern heading because they create consistent waves and work beautifully on large windows." },
                { question: "Can you layer curtains?", answer: "Yes. Double curtains combine a sheer and a blockout layer for flexible privacy, light and insulation." },
                { question: "Will you bring fabric samples?", answer: "Yes. We bring samples so you can see colours, textures and opacity in your own home." },
            ]}
        />
    );
}
