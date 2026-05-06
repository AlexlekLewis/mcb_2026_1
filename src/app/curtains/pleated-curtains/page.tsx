import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Pleated Curtains Melbourne | Pinch, Pencil & Box Pleat",
    description: "Custom pleated curtains for tailored classic interiors, bedrooms and formal rooms. Free Melbourne in-home measure and quote.",
    image: "/images/product-unique/mcb-pleated-curtains-modern-hero.png",
    path: "/curtains/pleated-curtains",
});


export default function PleatedCurtainsPage() {
    return (
        <ProductTemplate
            title="Pleated Curtains"
            subtitle="Classic tailoring for a timeless, elegant finish."
            heroImage="/images/product-unique/mcb-pleated-curtains-modern-hero.png"
            description="Pleated curtains feature a header that gathers the fabric into uniform folds (pleats). From the classic French (Pinch) Pleat to the versatile Box Pleat, this style adds a touch of traditional formality and structure to any room."
            features={[
                {
                    title: "Pinch Pleat",
                    description: "Fabric is gathered into groups of 2 or 3 pleats for a full, tailored look."
                },
                {
                    title: "Pencil Pleat",
                    description: "Tightly gathered folds resembling a row of pencils. Casual and adjustable."
                },
                {
                    title: "Box Pleat",
                    description: "Flat, deep folds that give a tailored, almost masculine architectural finish."
                }
            ]}
            types={[
                {
                    title: "Formal Dining",
                    description: "Create a sense of occasion with heavy, pinch-pleated drapes.",
                    image: "/images/product-unique/mcb-pleated-curtains-formal-dining.png"
                },
                {
                    title: "Classic Bedroom",
                    description: "Add softness and romance with gathered pencil pleats.",
                    image: "/images/product-unique/mcb-pleated-curtains-classic-bedroom.png"
                }
            ]}
        />
    );
}
