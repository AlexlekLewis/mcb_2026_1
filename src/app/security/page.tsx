import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";

export default function SecurityPage() {
    const nearby = getNearbyLocations('security', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Security Doors & Screens"
            subtitle="Maximum protection without compromising style."
            heroImage="/assets/security_door_hero.png"
            description="Protect what matters most with our range of high-performance security solutions. We combine industrial-strength materials with elegant design to keep your home safe and beautiful."
            features={[
                {
                    title: "Crimsafe Technology",
                    description: "We utilise industry-leading stainless steel mesh that surpasses Australian Standards for impact and knife-shear resistance."
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
                    title: "Security Screen Doors",
                    description: "Enjoy fresh air and clear views with our high-tensile stainless steel mesh doors. Secure, insect-proof, and stylish.",
                    image: "/assets/security_screen_door.png" // Updated
                },
                {
                    title: "Decorative Doors",
                    description: "Combine heritage charm or modern geometry with security. Our decorative cast aluminium grilles offer timeless appeal.",
                    image: "/assets/decorative_security_door.png" // Updated
                },
                {
                    title: "Fly Screens",
                    description: "Extend your protection to every opening. Our fixed and exit-safe window screens provide peace of mind for the whole house.",
                    image: "/assets/security_window_screen.png" // Updated
                }
            ]}
        />
    );
}
