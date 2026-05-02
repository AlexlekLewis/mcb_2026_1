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
            heroImage="/images/product-unique/mcb-roller-shutters-exterior-window-hero.webp"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Secure Your Home"
            types={[
                {
                    title: "Architectural 40mm Profile",
                    description: "Curved profile design that offers superior lateral strength and a compact roll size. Manufactured from high-quality aluminium for enduring performance in Australian conditions.",
                    image: "/images/product-unique/mcb-40mm-roller-shutter-profile-detail.webp"
                },
                {
                    title: "Insulated Solar Shield",
                    description: "Foam-injected slats provide a heavy duty thermal barrier, reducing heat entry by up to 90% in summer and keeping warmth in during winter. Excellent noise reduction properties.",
                    image: "/images/product-unique/mcb-insulated-roller-shutters-solar-heat-control.webp"
                },
                {
                    title: "Intelligent Automation",
                    description: "Control your home's security from anywhere. Options for wall switches, remote controls, or smartphone integration for complete peace of mind.",
                    image: "/images/product-unique/mcb-motorised-roller-shutters-remote-control.webp"
                }
            ]}
        />
    );
}
