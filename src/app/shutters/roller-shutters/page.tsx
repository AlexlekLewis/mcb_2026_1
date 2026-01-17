import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";

export default function RollerShuttersPage() {
    const nearby = getNearbyLocations('shutters', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Roller Shutters"
            subtitle="Ultimate security and climate control."
            heroImage="/assets/roller_shutters_homepage.png" // Using the generated homepage image for now or reusing specific ones
            description="Secure your home and reduce energy costs with our premium aluminium Roller Shutters. Designed for Melbourne weather, they offer complete control over light, noise, and privacy at the touch of a button."
            features={[
                {
                    title: "Enhanced Security",
                    description: "A visible deterrent that physically protects your windows from intruders and extreme weather events."
                },
                {
                    title: "Thermal Insulation",
                    description: "Save on heating and cooling bills by creating an air pocket that stops heat transfer by up to 90%."
                },
                {
                    title: "Noise Reduction",
                    description: "Significantly reduce traffic noise and outside disturbances for a peaceful home environment."
                }
            ]}
            types={[
                {
                    title: "Motorised Shutters",
                    description: "Operate your shutters with a remote, wall switch, or smartphone app. Perfect for hard-to-reach windows.",
                    image: "/assets/motorised_rollers.png" // Reusing appropriate existing asset or placeholder
                },
                {
                    title: "Residential Series",
                    description: "Sleek profile design available in a wide range of modern colours to complement your home's facade.",
                    image: "/assets/roller_shutters_homepage.png" // Reusing
                },
                {
                    title: "Commercial & High Security",
                    description: "Heavy-duty options for businesses or homes requiring maximum protection levels.",
                    image: "/assets/security_door_hero.png" // Placeholder - similar aesthetic
                }
            ]}
        />
    );
}
