import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Aluminium Shutters Melbourne | Outdoor & Alfresco",
    description: "Aluminium shutters for alfresco areas, balconies and outdoor privacy. Free Melbourne in-home measure and quote.",
    image: "/images/product-unique/mcb-aluminium-shutters-alfresco-hero.webp",
    path: "/shutters/plantation-shutters/aluminium",
});


export default function AluminiumShuttersPage() {
    return (
        <ProductTemplate
            title="Alfresco Aluminium Shutters"
            subtitle="Blur the lines between indoor and outdoor living."
            heroImage="/images/product-unique/mcb-aluminium-shutters-alfresco-hero.webp"
            description="Designed to withstand the harsh Australian elements, our Alfresco Aluminium Shutters are the perfect solution for patios, balconies, pergolas, and outdoor entertaining areas. Powder-coated for durability and available in a wide range of colours, they provide privacy, shade, and weather protection without compromising on style."
            features={[
                {
                    title: "Weather Resistant",
                    description: "High-grade aluminium with a durable powder coat finish resists rust, corrosion, and fading."
                },
                {
                    title: "Cyclone Rated Options",
                    description: "Available in configurations that meet Australian cyclone standards for coastal and high-wind areas."
                },
                {
                    title: "Adjustable Light & Privacy",
                    description: "Control sunlight and visibility with adjustable louvers, perfect for outdoor entertaining."
                }
            ]}
            types={[
                {
                    title: "Fixed Louver",
                    description: "Permanent angled louvers for consistent privacy and sun control. Low maintenance.",
                    image: "/images/product-unique/mcb-weather-resistant-aluminium-shutters.webp"
                },
                {
                    title: "Adjustable Louver",
                    description: "Tilt louvers open or closed to suit changing conditions throughout the day.",
                    image: "/images/product-unique/mcb-aluminium-shutter-adjustable-louvre-detail.webp"
                }
            ]}
        />
    );
}
