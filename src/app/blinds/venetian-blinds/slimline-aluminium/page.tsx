import { ProductTemplate } from "@/components/ProductTemplate";

export default function SlimlineAluminiumVenetiansPage() {
    return (
        <ProductTemplate
            title="Slimline Aluminium (25mm)"
            subtitle="The modern minimalist choice."
            heroImage="/images/venetian-blinds-hero.png"
            description="Our Slimline 25mm Aluminium Venetians deliver sleek, discreet light control for contemporary spaces. The narrow slats almost disappear when open, maximizing your view while the durable aluminium construction ensures years of trouble-free operation in any room."
            features={[
                {
                    title: "Discreet Profile",
                    description: "25mm slats create a subtle, modern look that complements minimalist interiors."
                },
                {
                    title: "Moisture Resistant",
                    description: "Aluminium is ideal for kitchens, bathrooms, and other high-humidity areas."
                },
                {
                    title: "Precise Control",
                    description: "Tilt slats to direct light exactly where you want it, or close completely for privacy."
                }
            ]}
            types={[
                {
                    title: "Matte Finish",
                    description: "Subtle and understated. Reduces glare and fingerprints for a clean look.",
                    image: "/images/venetian-blinds-hero.png"
                },
                {
                    title: "Metallic Finish",
                    description: "Adds a touch of shimmer and sophistication for modern office spaces.",
                    image: "/images/venetian-blinds-hero.png"
                }
            ]}
        />
    );
}
