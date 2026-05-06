import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "PVC Plantation Shutters Melbourne | Wet Areas",
    description: "PVC plantation shutters for bathrooms, kitchens and laundries needing moisture-resistant custom shutters. Free Melbourne measure and quote.",
    image: "/images/product-unique/mcb-polymer-shutters-bathroom-hero.webp",
    path: "/shutters/plantation-shutters/polymer",
});


export default function PolymerShuttersPage() {
    return (
        <ProductTemplate
            title="PVC Shutters Melbourne"
            subtitle="Engineered for wet areas. Built to last."
            heroImage="/images/product-unique/mcb-polymer-shutters-bathroom-hero.webp"
            description="Our PVC shutters are designed for bathrooms, kitchens, laundries and other areas where moisture resistance matters. They are easy to clean, durable and made to suit wet-area windows without losing the clean plantation shutter look."
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
                    title: "Pure White PVC",
                    description: "Classic crisp white finish that brightens wet areas and complements modern bathroom designs.",
                    image: "/images/product-unique/mcb-waterproof-polymer-shutters-wet-area.webp"
                },
                {
                    title: "Custom Colours",
                    description: "Available in a range of custom painted finishes to match your cabinetry and decor.",
                    image: "/images/product-unique/mcb-polymer-shutter-colour-range-detail.webp"
                }
            ]}
        />
    );
}
