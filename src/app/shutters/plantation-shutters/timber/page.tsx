import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Timber Plantation Shutters Melbourne",
    description: "Timber plantation shutters for natural warmth, premium interiors and adjustable light control. Free Melbourne measure and quote.",
    image: "/images/product-unique/mcb-timber-plantation-shutters-hero.webp",
    path: "/shutters/plantation-shutters/timber",
});


export default function TimberShuttersPage() {
    return (
        <ProductTemplate
            title="Select Hardwood Collection"
            subtitle="The warmth of natural timber. The elegance of handcrafted design."
            heroImage="/images/product-unique/mcb-timber-plantation-shutters-hero.webp"
            description="Our Select Hardwood Collection features ethically sourced, premium timber plantation shutters that bring unmatched natural beauty to your living spaces. Each shutter is carefully crafted from select hardwoods, offering exceptional insulation and a timeless aesthetic that only real wood can provide."
            features={[
                {
                    title: "Natural Beauty",
                    description: "Genuine wood grain and texture that cannot be replicated by synthetic materials."
                },
                {
                    title: "Superior Insulation",
                    description: "Wood is a natural insulator, helping to regulate temperature and reduce energy costs."
                },
                {
                    title: "Endless Finishes",
                    description: "Available in a wide range of stains to showcase natural grain, or painted to match your interior."
                }
            ]}
            types={[
                {
                    title: "Basswood Select",
                    description: "Lightweight yet strong. Fine, even grain that takes stain beautifully.",
                    image: "/images/product-unique/mcb-natural-timber-shutter-grain-detail.webp"
                },
                {
                    title: "Western Red Cedar",
                    description: "Naturally resistant to decay and insects. Perfect for premium applications.",
                    image: "/images/product-unique/mcb-western-red-cedar-shutters-detail.webp"
                }
            ]}
        />
    );
}
