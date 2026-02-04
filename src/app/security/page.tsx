import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";

export default function SecurityPage() {
    const nearby = getNearbyLocations('security', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Security Doors & Screens"
            subtitle="Maximum protection without compromising style."
            heroImage="/images/security-door-hero.png"
            description="Protect what matters most with our range of high-performance security solutions. We combine industrial-strength materials with elegant design to keep your home safe and beautiful."
            features={[
                {
                    title: "High-Tensile Mesh",
                    description: "We utilize industry-leading 316 Marine Grade Stainless Steel mesh that surpasses Australian Standards for impact and knife-shear resistance."
                },
                {
                    title: "Triple Lock System",
                    description: "Every security door comes standard with a triple-locking mechanism for superior defense against forced entry."
                },
                {
                    title: "Custom Powder Coating",
                    description: "Match your door perfectly to your home's facade with our extensive range of durable, weather-resistant powder coat colours."
                }
            ]}
            types={[
                {
                    title: "Marine Grade Security Doors",
                    description: "The gold standard in protection. Featuring 316 Marine Grade Stainless Steel woven mesh that provides uncompromised security without hindering your view or airflow.",
                    image: "/images/stainless-security-door.png"
                },
                {
                    title: "Decorative Diamond Grille",
                    description: "Classic visual deterrence. Sturdy 7mm aluminium grille doors that offer a traditional aesthetic and reliable barrier against intruders.",
                    image: "/images/diamond-grille-door.png"
                },
                {
                    title: "Insect & Fly Screens",
                    description: "Partial security and full insect protection. Available in durable fibreglass or upgraded aluminium mesh for higher traffic areas and pet resistance.",
                    image: "/images/fly-screen-window.png"
                }
            ]}
        />
    );
}
