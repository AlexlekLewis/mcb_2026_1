import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Fly Screens Melbourne | Window & Door Screens",
    description: "Custom fly screens and retractable screens for airflow and insect control. Free Melbourne measure and quote.",
    image: "/images/sec-fly.webp",
    path: "/security/fly-screens",
});


export default function FlyScreensPage() {
    const product = productData.find(p => p.slug === "fly-screens");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/sec-fly.webp"
            description={product.description}
            features={product.features}
            benefits={product.benefits}
            ctaText="Order Screens"
            types={[
                {
                    title: "Retractable Screens",
                    description: "For bi-fold and difficult areas where a screen needs to disappear when not in use.",
                    image: "/images/retractable-screen.webp"
                },
                {
                    title: "Sliding Door Fly Screens",
                    description: "Custom-measured screens for sliding doors and everyday ventilation.",
                    image: "/assets/security_window_screen.png"
                },
                {
                    title: "Aluminium Mesh",
                    description: "A stronger mesh upgrade for higher traffic windows and doors.",
                    image: "/images/product-unique/mcb-aluminium-mesh-flyscreen-detail.webp"
                }
            ]}
        />
    );
}
