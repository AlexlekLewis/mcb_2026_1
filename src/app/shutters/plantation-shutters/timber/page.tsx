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
            title="Timber Shutters Melbourne"
            subtitle="The warmth of natural timber. The elegance of handcrafted design."
            heroImage="/images/product-unique/mcb-timber-plantation-shutters-hero.webp"
            description="Our timber plantation shutters bring natural warmth and beauty to living spaces, bedrooms and feature rooms. Each shutter is crafted for a premium timber look, with painted or stained finishes that suit classic and modern interiors."
            features={[
                {
                    title: "Natural Beauty",
                    description: "A genuine timber look with warmth, texture and a premium interior feel."
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
            decisionGuide={[
                { title: "Timber Select", description: "Best for living rooms and bedrooms where you want a fine, even grain that takes paint or stain beautifully." },
                { title: "Western Red Cedar", description: "Best for premium spaces and larger panels — naturally resistant, lightweight and beautifully grained." },
                { title: "Painted vs stained finish", description: "Choose painted for a clean, contemporary look or stained to highlight natural grain in classic interiors." },
            ]}
            types={[
                {
                    title: "Timber Select",
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
