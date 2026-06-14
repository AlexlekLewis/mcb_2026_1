import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    alternates: { canonical: "/security" },
    title: "Security Doors Melbourne | Fly Screens & Pet Mesh",
    description: "Custom security doors, fly screens and pet mesh in Melbourne. Protect your home without losing light or airflow.",
};

export default function SecurityPage() {
    const nearby = getNearbyLocations('security', 8);

    return (
        <ProductTemplate
            nearbyLocations={nearby}
            title="Security Doors, Fly Screens and Pet Mesh Melbourne"
            subtitle="Safer homes without losing light or airflow."
            heroImage="/images/product-unique/mcb-security-products-category-hero.webp"
            description="Choose from stainless steel mesh security doors, privacy grilles, diamond grille doors, window grilles, security side panels, fly screens and pet mesh. We custom measure and install each screen so your home feels safer, cooler and more comfortable."
            intentLabel="Security, airflow and insect control"
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
            decisionGuide={[
                { title: "Premium mesh security", description: "Best for clear views, airflow and stronger protection at entry doors." },
                { title: "Privacy grille", description: "Best where you want added privacy with around 70% blockage from prying eyes." },
                { title: "Fly screens and aluminium mesh", description: "Best for insect protection, natural ventilation and higher-traffic openings." },
                { title: "Pet mesh", description: "Best for high-traffic doors and homes with pets." },
            ]}
            comparisonRows={[
                { label: "Security mesh", bestFor: "Premium protection", notes: "Clear view, airflow and strong mesh options." },
                { label: "Privacy grille", bestFor: "Privacy at doors and panels", notes: "Around 70% blockage from prying eyes." },
                { label: "Diamond grille", bestFor: "Visible deterrent", notes: "Traditional security look at accessible price points." },
                { label: "Aluminium Mesh fly screen", bestFor: "Insects, airflow and traffic", notes: "Keeps bugs out with a stronger mesh option for busier openings." },
                { label: "Pet mesh", bestFor: "Pets and traffic", notes: "Stronger mesh for claws and everyday use." },
            ]}
            types={[
                {
                    title: "Marine Grade Security Doors",
                    description: "The gold standard in protection. Featuring 316 Marine Grade Stainless Steel woven mesh that provides uncompromised security without hindering your view or airflow.",
                    image: "/images/sec-stainless.webp",
                    href: "/security/security-doors"
                },
                {
                    title: "Decorative Diamond Grille",
                    description: "Classic visual deterrence. Sturdy 7mm aluminium grille doors that offer a traditional aesthetic and reliable barrier against intruders.",
                    image: "/images/sec-diamond.webp",
                    href: "/security/security-doors"
                },
                {
                    title: "Privacy Grille",
                    description: "A privacy-focused grille option that blocks around 70% from prying eyes while keeping airflow.",
                    image: "/images/product-unique/mcb-privacy-grille-security-door-detail.webp",
                    href: "/security/security-doors"
                },
                {
                    title: "Window Grilles and Security Side Panels",
                    description: "Custom-measured grille and side panel options for vulnerable windows and entry surrounds.",
                    image: "/assets/security_window_screen.png",
                    href: "/security/security-doors"
                },
                {
                    title: "Insect, Fly Screens and Aluminium Mesh",
                    description: "Partial security and full insect protection. Available in durable fibreglass or upgraded aluminium mesh for higher traffic areas and pet resistance.",
                    image: "/images/sec-fly.webp",
                    href: "/security/fly-screens"
                },
                {
                    title: "Pet Mesh",
                    description: "Stronger everyday mesh for busy homes, pets, airflow and insect control.",
                    image: "/assets/security_window_screen.png",
                    href: "/security/pet-mesh"
                }
            ]}
            faq={[
                { question: "Can security doors still let air through?", answer: "Yes. Security mesh and grille doors are designed to improve airflow while adding protection." },
                { question: "What is the difference between security doors and fly screens?", answer: "Fly screens focus on insects and airflow. Security doors add stronger mesh, frames and locking options." },
                { question: "Can you match the colour to my home?", answer: "Security doors and screens can usually be powder coated to suit existing frames and facade colours." },
                { question: "Can you quote screens while measuring curtains or blinds?", answer: "Yes. Security doors, fly screens and pet mesh can be quoted during the same home visit." },
            ]}
        />
    );
}
