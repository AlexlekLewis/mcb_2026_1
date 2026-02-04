import { ProductTemplate } from "@/components/ProductTemplate";

export default function PolymerShuttersPage() {
    return (
        <ProductTemplate
            title="Hydro-Proof Polymer Shutters"
            subtitle="Engineered for wet areas. Built to last."
            heroImage="/images/plantation-shutters-hero.png"
            description="Our Hydro-Proof Polymer Shutters are specifically designed for bathrooms, kitchens, laundries, and any area with high humidity or moisture. Featuring a reinforced polymer construction with an aluminium core, they are completely waterproof, UV resistant, and will never warp, peel, or discolour."
            features={[
                {
                    title: "100% Waterproof",
                    description: "Impervious to moisture and humidity. Can be wiped down or even hosed off for easy cleaning."
                },
                {
                    title: "Aluminium Core Reinforcement",
                    description: "Hidden aluminium inserts in every louver provide structural rigidity without adding weight."
                },
                {
                    title: "UV Stabilised",
                    description: "Engineered to resist fading and yellowing even under direct Australian sunlight."
                }
            ]}
            types={[
                {
                    title: "Pure White Polymer",
                    description: "Classic crisp white finish that brightens wet areas and complements modern bathroom designs.",
                    image: "/images/plantation-shutters-hero.png"
                },
                {
                    title: "Custom Colours",
                    description: "Available in a range of custom painted finishes to match your cabinetry and decor.",
                    image: "/images/plantation-shutters-hero.png"
                }
            ]}
        />
    );
}
