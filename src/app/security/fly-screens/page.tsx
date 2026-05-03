import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Fly Screens Melbourne | Window, Door & Pet Mesh",
    description: "Custom fly screens, retractable screens and pet mesh for airflow and insect control. Free Melbourne measure and quote.",
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
                    description: "Disappear when not in use. Perfect for bi-folds.",
                    image: "/images/retractable-screen.webp"
                },
                {
                    title: "Pet Mesh & Window Screens",
                    description: "Heavier gauge mesh and custom window screens for busy homes, pets and everyday airflow.",
                    image: "/assets/security_window_screen.png"
                }
            ]}
        />
    );
}
