import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Wavefold Curtains Melbourne | Custom Wave Curtains",
    description: "Custom Wavefold curtains for continuous wave headings, sliding doors and floor-to-ceiling windows. Free in-home measure and quote.",
    image: "/images/product-unique/mcb-s-fold-curtains-living-room-hero.webp",
    path: "/curtains/s-fold-curtains",
});


export default function SFoldCurtainsPage() {
    return (
        <ProductTemplate
            title="Wavefold Curtains"
            subtitle="The contemporary choice for fluid, continuous waves."
            heroImage="/images/product-unique/mcb-s-fold-curtains-living-room-hero.webp"
            description="Wavefold curtains are the modern standard for floor-to-ceiling windows. Using a specialized track and tape system, the fabric hangs in continuous, deep 'S' shaped curves that look identical from both the front and back."
            features={[
                {
                    title: "Modern Aesthetic",
                    description: "Creates a clean, architectural line that complements modern interiors perfectly."
                },
                {
                    title: "Minimal Stack",
                    description: "The fabric stacks back very neatly, occupying less space than traditional pleats when open."
                },
                {
                    title: "Effortless Glide",
                    description: "The runner system ensures smooth, nearly silent operation even for large spans."
                }
            ]}
            types={[
                {
                    title: "Sheer Wavefold",
                    description: "The most popular application. Soft, flowing sheers that filter light beautifully.",
                    image: "/images/product-unique/mcb-wavefold-curtains-track-heading-detail.webp"
                },
                {
                    title: "Blockout Wavefold",
                    description: "Combine the wave style with heavy blockout fabrics for a dramatic, moody effect.",
                    image: "/assets/blockout_curtains.png"
                }
            ]}
        />
    );
}
