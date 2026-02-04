import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";

export default function CurtainsPage() {
    const nearby = getNearbyLocations('curtains', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Custom Made Curtains"
            subtitle="Soft. Sustainable. Stylish. Elevate your Melbourne home."
            heroImage="/assets/curtain_hero.png" // Using PNG as static hero for speed/consistency, or could use GIF
            description="Experience the perfect blend of luxury and functionality with our custom-made curtains. From the flowing lines of S-Fold sheers to the insulating power of blockouts, we craft window furnishings that define your space."
            features={[
                {
                    title: "S-Fold Specialists",
                    description: "Our signature S-Fold (Wave) heading creates a continuous, soft wave that adds instant contemporary elegance to any room."
                },
                {
                    title: "Premium Fabrics",
                    description: "Sourced from the world's leading textile mills, including linen blends, textured weaves, and 100% blockouts."
                },
                {
                    title: "Melbourne Made",
                    description: "Handcrafted locally in our Melbourne facility, ensuring superior quality control and faster turnaround times."
                }
            ]}
            types={[
                {
                    title: "S-Fold Signature Series",
                    description: "Our flagship curtain heading style. A continuous, fluid wave that brings architectural elegance to any room. Creates a seamless floor-to-ceiling effect that enhances feeling of space.",
                    image: "/images/sfold-curtain-detail.png",
                    href: "/curtains/s-fold"
                },
                {
                    title: "Sheer Elegance Collection",
                    description: "Light-filtering masterpieces. Featuring premium linen-look and textured voids that provide daytime privacy while filling your home with soft, diffused natural light.",
                    image: "/images/sheer-curtain-detail.png",
                    href: "/curtains/sheer"
                },
                {
                    title: "Luxury Blockout",
                    description: "The ultimate in climate and light control. Our 3-pass coated blockout fabrics ensure 100% light exclusion and superior thermal insulation for year-round comfort.",
                    image: "/images/blockout-curtain-detail.png",
                    href: "/curtains/blockout"
                },
                {
                    title: "Theatre Class Velvet",
                    description: "Rich, opulent textures for media rooms and formal lounges. Heavyweight velvet drapes that dampen sound and create a true cinematic darkness.",
                    image: "/images/blockout-curtain-detail.png",
                    href: "/curtains/theatre-velvet"
                },
                {
                    title: "Motorised Intelligence",
                    description: "Seamless automation. Integrate your curtains with smart home systems for 'wake up' scenes and security simulation. Cord-free safety and effortless control.",
                    image: "/images/roller-blind-detail.png",
                    href: "/curtains/motorised"
                }
            ]}
        />
    );
}
