import { ProductTemplate } from "@/components/ProductTemplate";

export default function TimberShuttersPage() {
    return (
        <ProductTemplate
            title="Select Hardwood Collection"
            subtitle="The warmth of natural timber. The elegance of handcrafted design."
            heroImage="/images/timber-shutter-detail.png"
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
                    image: "/images/timber-shutter-detail.png"
                },
                {
                    title: "Western Red Cedar",
                    description: "Naturally resistant to decay and insects. Perfect for premium applications.",
                    image: "/images/timber-shutter-detail.png"
                }
            ]}
        />
    );
}
