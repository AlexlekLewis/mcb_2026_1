import { ProductTemplate } from "@/components/ProductTemplate";

export default function SheerCurtainsPage() {
    return (
        <ProductTemplate
            title="Sheer Elegance Collection"
            subtitle="Light, airy, and timelessly beautiful."
            heroImage="/images/sheer-curtain-detail.png"
            description="Our Sheer Elegance Collection brings a sense of calm and sophistication to any space. These delicate fabrics softly filter natural light, creating a warm, ambient glow while preserving your connection to the outdoors. Perfect for living rooms, dining areas, and anywhere you want to welcome the light."
            features={[
                {
                    title: "Soft Light Diffusion",
                    description: "Transform harsh sunlight into a soft, even glow that illuminates your space naturally."
                },
                {
                    title: "Daytime Privacy",
                    description: "Maintain privacy during the day while still enjoying glimpses of the outside world."
                },
                {
                    title: "Layering Potential",
                    description: "Pair with blockout curtains or blinds for complete day-to-night versatility."
                }
            ]}
            types={[
                {
                    title: "Voile Sheers",
                    description: "Ultra-light, transparent fabrics that dance in the breeze. The classic choice for a romantic aesthetic.",
                    image: "/images/sheer-curtain-detail.png"
                },
                {
                    title: "Linen Sheers",
                    description: "Textured linen-look fabrics that add warmth and character while still filtering light beautifully.",
                    image: "/images/sfold-curtain-detail.png"
                }
            ]}
        />
    );
}
