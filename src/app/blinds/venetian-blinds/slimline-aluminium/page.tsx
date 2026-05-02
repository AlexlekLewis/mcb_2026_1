import { ProductTemplate } from "@/components/ProductTemplate";

export default function SlimlineAluminiumVenetiansPage() {
    return (
        <ProductTemplate
            title="Slimline Aluminium (25mm)"
            subtitle="The modern minimalist choice."
            heroImage="/images/product-unique/mcb-slimline-aluminium-venetians-hero.webp"
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
                    image: "/images/product-unique/mcb-25mm-aluminium-venetian-discreet-profile.webp"
                },
                {
                    title: "Metallic Finish",
                    description: "Adds a touch of shimmer and sophistication for modern office spaces.",
                    image: "/images/product-unique/mcb-aluminium-venetian-metallic-finish-detail.webp"
                }
            ]}
        />
    );
}
