import { ProductTemplate } from "@/components/ProductTemplate";
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
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/product-unique/mcb-plantation-shutters-range-hero.webp"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Get a Free Quote"
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
    );
}
