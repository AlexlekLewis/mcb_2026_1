import { ProductTemplate } from "@/components/ProductTemplate";
import { InlineAnswer } from "@/components/InlineAnswer";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Plantation Shutters Melbourne | Timber, PVC & Aluminium",
    description: "Custom plantation shutters for light control, airflow, privacy and long-term value. Free Melbourne in-home measure and quote.",
    image: "/images/product-unique/mcb-plantation-shutters-range-hero.webp",
    path: "/shutters/plantation-shutters",
});


export default function PlantationShuttersPage() {
    const product = productData.find(p => p.slug === "plantation-shutters");

    if (!product) {
        return notFound();
    }

    return (
        <>
            <ProductTemplate
                title={product.title.split("|")[0]}
                subtitle={product.intro.heading}
                heroImage="/images/product-unique/mcb-plantation-shutters-range-hero.webp"
                description={product.description}
                features={product.features}
                benefits={product.benefits}
                ctaText="Get a Free Quote"
                decisionGuide={[
                    { title: "PVC shutters", description: "Best for bathrooms, kitchens and laundries where moisture and humidity rule out timber." },
                    { title: "Timber shutters", description: "Best for living rooms and bedrooms that want premium natural grain, warmth and insulation." },
                    { title: "Aluminium shutters", description: "Best for outdoor patios, alfresco zones and balconies that need weather-resistant performance." },
                ]}
                types={[
                    {
                        title: "PVC Shutters",
                        description: "Engineered for wet areas. Durable PVC shutters are a practical choice for bathrooms, kitchens and laundries without compromising on style.",
                        image: "/images/plantation-shutters-hero.webp",
                        href: "/shutters/plantation-shutters/polymer"
                    },
                    {
                        title: "Timber Shutters",
                        description: "Premium timber shutters that offer natural beauty and insulation. Available in painted and stained finishes to match your interiors.",
                        image: "/images/timber-shutter-detail.png",
                        href: "/shutters/plantation-shutters/timber"
                    },
                    {
                        title: "Alfresco Aluminium",
                        description: "Blur the lines between indoor and outdoor living. Weather-resistant, high-grade aluminium shutters designed to withstand the elements while providing privacy on patios and balconies.",
                        image: "/images/aluminium-shutter-detail.png",
                        href: "/shutters/plantation-shutters/aluminium"
                    }
                ]}
            />
            <InlineAnswer
                lastUpdated="2026-05-24"
                heading="Questions we get on the visit"
                items={[
                    {
                        question: "PVC vs basswood plantation shutters: which suits Melbourne homes best?",
                        answer:
                            "For Melbourne homes we install Basswood in living and bedrooms, PVC in bathrooms — that's the split we make most weeks in 2026. A-Grade Basswood (Tilia Americana) takes paint and stain beautifully and reads as a more permanent window furnishing. PVC handles bathroom humidity in a way no timber will. The compromise is finish: PVC cleaner, Basswood warmer.",
                        anchor: "q-pvc-basswood-comparison",
                    },
                    {
                        question: "How much do plantation shutters cost per window in Melbourne?",
                        answer:
                            "We don't publish a per-window number in 2026 — the same Preston window can double in price by material and shape, and we'd rather measure it than guess. Basswood with a custom arch is a different conversation to a PVC stack in a laundry. Biggest cost levers: material, motorisation, unusual shapes. The free in-home measure walks you through it.",
                        anchor: "q-plantation-shutters-cost",
                        related: {
                            label: "Which shutters suit a bathroom?",
                            href: "/shutters/plantation-shutters#q-shutters-bathroom-moisture",
                        },
                    },
                    {
                        question: "Can plantation shutters be installed in a bathroom (moisture)?",
                        answer:
                            "Yes — PVC plantation shutters in Melbourne bathrooms are something we install most weeks of 2026. PVC handles moisture and humidity in a way no timber will, and louvres still tilt for airflow after a shower. The trade-off is finish: PVC reads cleaner and more modern. If you want the warmth of real timber, we'd save that for living areas.",
                        anchor: "q-shutters-bathroom-moisture",
                    },
                ]}
            />
        </>
    );
}
