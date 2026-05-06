import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Plantation Shutters Melbourne | Timber, PVC & Aluminium",
    description: "Custom plantation shutters in Melbourne including timber, PVC and aluminium shutters. Free in-home measure and quote.",
};

export default function ShuttersPage() {
    const nearby = getNearbyLocations('shutters', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Plantation Shutters Melbourne"
            subtitle="Timber, PVC and Aluminium."
            heroImage="/images/product-unique/mcb-shutters-category-hero.webp"
            description="Add privacy, airflow, insulation, a modern look and long-term value with plantation shutters made to fit your windows. We help you choose timber for warmth, PVC for wet areas or aluminium for outdoor spaces."
            intentLabel="Long-term value and airflow"
            features={[
                {
                    title: "Modern Look",
                    description: "A clean built-in finish that suits contemporary and classic Melbourne homes."
                },
                {
                    title: "Insulating & Efficient",
                    description: "Shutters provide an excellent thermal barrier, trapping air against the window to keep your home comfortable year-round."
                },
                {
                    title: "Moisture Resistant",
                    description: "PVC shutters are a practical choice for bathrooms, kitchens and laundries."
                }
            ]}
            decisionGuide={[
                { title: "Timber shutters", description: "Best for living spaces and bedrooms where natural warmth and a premium finish matter." },
                { title: "PVC shutters", description: "Best for bathrooms, laundries, kitchens and family homes needing easy cleaning." },
                { title: "Aluminium shutters", description: "Best for balconies, alfresco areas, patios and exposed outdoor spaces." },
            ]}
            comparisonRows={[
                { label: "Timber", bestFor: "Premium interiors", notes: "Lightweight, warm and classic." },
                { label: "PVC", bestFor: "Wet areas", notes: "Moisture-resistant and easy to clean." },
                { label: "Aluminium", bestFor: "Outdoor/alfresco", notes: "Durable in exposed areas." },
            ]}
            types={[
                {
                    title: "Timber Shutters",
                    description: "Crafted from premium, sustainable Basswood. Lightweight and stained or painted to perfection for a classic look.",
                    image: "/assets/timber_shutters.webp",
                    href: "/shutters/plantation-shutters/timber"
                },
                {
                    title: "PVC Shutters",
                    description: "Durable, easy to clean, and water-resistant. The ideal choice for high-humidity areas and busy family homes.",
                    image: "/assets/pvc_shutters_bathroom.png",
                    href: "/shutters/plantation-shutters/polymer"
                },
                {
                    title: "Aluminium Shutters",
                    description: "Aluminium shutters designed to withstand the Melbourne weather. Enclose your patio or balcony for all-season use.",
                    image: "/assets/outdoor_shutters_balcony.webp",
                    href: "/shutters/plantation-shutters/aluminium"
                },
            ]}
            faq={[
                { question: "Which shutters are best for bathrooms?", answer: "PVC shutters are the best fit for wet areas because they handle moisture better than timber." },
                { question: "Can shutters help with airflow?", answer: "Yes. Adjustable louvres let you control light, privacy and ventilation." },
                { question: "Are outdoor shutters different from indoor shutters?", answer: "Outdoor shutters are typically aluminium and built for weather exposure, balconies and alfresco spaces." },
                { question: "Do you measure unusual windows?", answer: "Yes. The free measure and quote lets us check sizes, frames and installation requirements." },
            ]}
        />
    );
}
