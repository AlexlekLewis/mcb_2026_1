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
                    title: "PVC Shutters",
                    description: "Moisture resistant, perfect for bathrooms and kitchens.",
                    image: "/images/pvc-shutters.jpg"
                },
                {
                    title: "Timber Shutters",
                    description: "Premium basswood for living areas and bedrooms.",
                    image: "/images/timber-shutters.jpg"
                },
                {
                    title: "Aluminium Shutters",
                    description: "Durable options for outdoor patios and balconies.",
                    image: "/images/aluminium-shutters.jpg"
                }
            ]}
        />
    );
}
