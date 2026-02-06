import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";

export default function BlindsPage() {
    const nearby = getNearbyLocations('blinds', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Premium Roller Blinds"
            subtitle="Sleek design meets everyday functionality."
            heroImage="/assets/roller_blind_hero.png"
            description="Our collection of blinds offers the perfect balance of light control, privacy, and architectural style. Whether you seek the minimalism of roller blinds or the texture of romans, we have the perfect fit."
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
                }
            ]}
        />
    );
}
