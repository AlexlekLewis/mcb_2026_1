import { ProductTemplate } from "@/components/ProductTemplate";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function RollerShuttersPage() {
    const product = productData.find(p => p.slug === "roller-shutters");

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
            ctaText="Secure Your Home"
            types={[
                {
                    title: "Architectural 40mm Profile",
                    description: "Curved profile design that offers superior lateral strength and a compact roll size. Manufactured from high-quality aluminium for enduring performance in Australian conditions.",
                    image: "/images/roller-shutters.png"
                },
                {
                    title: "Insulated Solar Shield",
                    description: "Foam-injected slats provide a heavy duty thermal barrier, reducing heat entry by up to 90% in summer and keeping warmth in during winter. Excellent noise reduction properties.",
                    image: "/images/motorised-roller-shutters.png"
                },
                {
                    title: "Intelligent Automation",
                    description: "Control your home's security from anywhere. Options for wall switches, remote controls, or smartphone integration for complete peace of mind.",
                    image: "/images/motorised-roller-shutters.png"
                }
            ]}
        />
    );
}
