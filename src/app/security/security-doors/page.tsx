import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
import { productData } from "@/lib/data";
import { notFound } from "next/navigation";
export const metadata = pageMetadata({
    title: "Security Doors Melbourne | Stainless Mesh & Diamond Grille",
    description: "Custom security doors for airflow, entry protection and peace of mind. Free Melbourne in-home measure and quote.",
    image: "/images/security-door-hero.webp",
    path: "/security/security-doors",
});


export default function SecurityDoorsPage() {
    const product = productData.find(p => p.slug === "security-doors");

    if (!product) {
        return notFound();
    }

    return (
        <ProductTemplate
            title={product.title.split("|")[0]}
            subtitle={product.intro.heading}
            heroImage="/images/security-door-hero.webp"
            description="Our security door collection includes Invisi-Gard stainless steel mesh, diamond grille, privacy grille, window grilles and security side panels. Each option is measured to suit the opening, frame and level of privacy, airflow and entry protection you need."
            features={product.features}
            benefits={product.benefits}
            ctaText="Get Secured"
            decisionGuide={[
                { title: "Invisi-Gard stainless mesh", description: "Best when you want maximum security with a near-invisible view through and corrosion resistance." },
                { title: "Privacy grille", description: "Best for street-facing entries where you want a stronger visual barrier and reduced view-in." },
                { title: "Diamond grille", description: "Best for a traditional, cost-effective security door that still allows airflow." },
                { title: "Window grilles & side panels", description: "Best for vulnerable windows and door-side openings that need matching protection." },
            ]}
            types={[
                {
                    title: "Invisi-Gard",
                    description: "316 Marine Grade Stainless Steel mesh. The premium choice.",
                    image: "/images/sec-stainless.webp"
                },
                {
                    title: "Privacy Grille",
                    description: "Around 70% blockage from prying eyes while maintaining airflow and a strong visual barrier.",
                    image: "/images/product-unique/mcb-privacy-grille-security-door-detail.webp"
                },
                {
                    title: "Diamond Grille",
                    description: "Traditional and cost-effective security solution.",
                    image: "/images/sec-diamond.webp"
                },
                {
                    title: "Window Grilles and Security Side Panels",
                    description: "Measured grille and panel options for vulnerable windows and door-side openings.",
                    image: "/assets/security_window_screen.png"
                }
            ]}
        />
    );
}
