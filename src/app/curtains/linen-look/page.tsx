import { ProductTemplate } from "@/components/ProductTemplate";

export default function LinenLookCurtainsPage() {
    return (
        <ProductTemplate
            title="Linen-Look Curtains"
            subtitle="The organic beauty of linen without the maintenance."
            heroImage="/assets/linen_look_curtains_hero.png"
            description="Linen-look fabrics capture the nubby texture, natural slubs, and relaxed drape of pure linen, but are spun from durable polyester blends. This gives you the earthy aesthetic you love with superior resistance to creasing and fading."
            features={[
                {
                    title: "Natural Aesthetic",
                    description: "Perfect for coastal, Hamptons, and Scandi interior styles."
                },
                {
                    title: "Easy Care",
                    description: "Unlike pure linen, these fabrics resist shrinking and wrinkling in humidity."
                },
                {
                    title: "Beautiful Draping",
                    description: "Falls heavily and softly, pooling beautifully on the floor if desired."
                }
            ]}
            types={[
                {
                    title: "Linen Sheers",
                    description: "Open weaves that let the breeze through.",
                    image: "/assets/linen_sheer_detail.png"
                },
                {
                    title: "Heavy Linen-Look",
                    description: "Thick, textured fabrics for a substantial, cozy feel.",
                    image: "/assets/linen_heavy_detail.png"
                }
            ]}
        />
    );
}
