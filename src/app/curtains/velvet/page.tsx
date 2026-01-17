import { ProductTemplate } from "@/components/ProductTemplate";

export default function VelvetCurtainsPage() {
    return (
        <ProductTemplate
            title="Velvet Curtains"
            subtitle="Opulent, dramatic, and incredibly cozy."
            heroImage="/assets/velvet_curtains_hero.png"
            description="Velvet curtains bring an immediate sense of luxury and drama to a space. The dense pile of the fabric naturally catches the light, creating rich highlights and deep shadows. Beyond looks, velvet is an excellent thermal and acoustic insulator."
            features={[
                {
                    title: "Rich Texture",
                    description: "Adds depth and softness to rooms with hard surfaces like tiling or glass."
                },
                {
                    title: "Maximum Warmth",
                    description: "The heavy weight of velvet makes it the best choice for drafty period homes."
                },
                {
                    title: "Dramatic Style",
                    description: "Available in deep jewel tones like emerald, navy, and charcoal for a statement look."
                }
            ]}
            types={[
                {
                    title: "Cotton Velvet",
                    description: "Matte finish and natural breathability for a sophisticated look.",
                    image: "/assets/velvet_cotton_matte.png"
                },
                {
                    title: "Poly Velvet",
                    description: "Durable, stain-resistant, and possessing a slight sheen for glamour.",
                    image: "/assets/velvet_poly_sheen.png"
                }
            ]}
        />
    );
}
