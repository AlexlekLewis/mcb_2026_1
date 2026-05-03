import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "S-Fold Curtains Melbourne | Custom Wave Curtains",
    description: "Custom S-Fold curtains for continuous wave headings, sliding doors and floor-to-ceiling windows. Free in-home measure and quote.",
    image: "/images/product-unique/mcb-s-fold-curtains-living-room-hero.webp",
    path: "/curtains/s-fold-curtains",
});


export default function SFoldCurtainsPage() {
    return (
        <ProductTemplate
            title="S-Fold Curtains"
            subtitle="The contemporary choice for fluid, continuous waves."
            heroImage="/images/product-unique/mcb-s-fold-curtains-living-room-hero.webp"
            description="S-Fold (or Wave) curtains are the modern standard for floor-to-ceiling windows. Using a specialized track and tape system, the fabric hangs in continuous, deep 'S' shaped curves that look identical from both the front and back."
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
                    title: "Sheer S-Fold",
                    description: "The most popular application. Soft, flowing sheers that filter light beautifuly.",
                    image: "/images/product-unique/mcb-s-fold-curtain-wave-heading-detail.webp"
                },
                {
                    title: "Blockout S-Fold",
                    description: "Combine the wave style with heavy blockout fabrics for a dramatic, moody effect.",
                    image: "/assets/blockout_curtains.png"
                }
            ]}
        />
    );
}
