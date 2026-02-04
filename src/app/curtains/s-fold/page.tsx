import { ProductTemplate } from "@/components/ProductTemplate";

export default function SFoldCurtainsPage() {
    return (
        <ProductTemplate
            title="S-Fold Signature Series"
            subtitle="The architect's choice for soft, flowing elegance."
            heroImage="/images/sfold-curtain-detail.png"
            description="S-Fold, also known as Ripple Fold or Wave Curtains, creates a continuous, uniform wave pattern that is both modern and timeless. The fabric glides effortlessly on a track system, offering a clean silhouette that suits contemporary interiors. Our Signature Series uses premium fabrics and precision engineering for a flawless finish."
            features={[
                {
                    title: "Uniform Wave Pattern",
                    description: "Perfectly spaced, continuous waves create a sleek, architectural look that never goes out of style."
                },
                {
                    title: "Effortless Operation",
                    description: "The track system allows the curtain to glide smoothly with minimal effort, ideal for large windows and sliding doors."
                },
                {
                    title: "Premium Fabric Options",
                    description: "Available in sheer voiles, light-filtering linens, and luxurious blockout fabrics to match any room's needs."
                }
            ]}
            types={[
                {
                    title: "Sheer S-Fold",
                    description: "Gossamer-light fabrics that filter sunlight beautifully while maintaining privacy during the day.",
                    image: "/images/sheer-curtain-detail.png"
                },
                {
                    title: "Blockout S-Fold",
                    description: "Total light exclusion with the same elegant wave. Perfect for bedrooms and home theatres.",
                    image: "/images/blockout-curtain-detail.png"
                }
            ]}
        />
    );
}
