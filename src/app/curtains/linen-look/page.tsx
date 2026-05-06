import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Linen-Look Curtains Melbourne | Relaxed Custom Curtains",
    description: "Linen-look curtains with relaxed texture, soft drape and easier-care fabric performance. Free Melbourne measure and quote.",
    image: "/assets/linen_look_curtains_hero.webp",
    path: "/curtains/linen-look",
});


export default function LinenLookCurtainsPage() {
    return (
        <ProductTemplate
            title="Linen-Look Curtains"
            subtitle="The organic beauty of linen without the maintenance."
            heroImage="/assets/linen_look_curtains_hero.webp"
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
            decisionGuide={[
                { title: "Linen sheers", description: "Best for soft daytime privacy and an airy, breezy coastal feel." },
                { title: "Heavy linen-look", description: "Best for living areas and bedrooms where you want substantial drape and warmth." },
                { title: "Compare with pure linen", description: "Choose linen-look for easier care and better resistance to humidity, creasing and fading." },
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
                    image: "/assets/linen_heavy_detail.webp"
                }
            ]}
        />
    );
}
