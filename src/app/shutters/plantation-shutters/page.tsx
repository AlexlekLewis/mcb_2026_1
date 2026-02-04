import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function PlantationShuttersPage() {
    const product = productData.find(p => p.slug === "plantation-shutters");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage={product.heroImage}
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Get a Free Quote"
            types={[
                {
                    title: "Hydro-Proof Polymer",
                    description: "Engineered for wet areas. Fully waterproof reinforced polymer with an aluminium core. The perfect choice for bathrooms, kitchens, and laundries without compromising on style.",
                    image: "/images/pvc-shutters.jpg"
                },
                {
                    title: "Select Hardwood Collection",
                    description: "Ethically sourced premium timber shutters that offer unmatched natural beauty and insulation. Available in a wide range of painted and stained finishes to match your cabinetry.",
                    image: "/images/timber-shutters.jpg"
                },
                {
                    title: "Alfresco Aluminium",
                    description: "Blur the lines between indoor and outdoor living. Weather-resistant, high-grade aluminium shutters designed to withstand the elements while providing privacy on patios and balconies.",
                    image: "/images/aluminium-shutters.jpg"
                }
            ]}
        />
    );
}
