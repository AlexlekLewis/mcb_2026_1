import { ProductTemplate } from "@/components/ProductTemplate";

export default function PleatedCurtainsPage() {
    return (
        <ProductTemplate
            title="Pleated Curtains"
            subtitle="Classic tailoring for a timeless, elegant finish."
            heroImage="/assets/pleated_curtains_hero.png"
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
                    image: "/assets/pleated_pinch_formal.png"
                },
                {
                    title: "Classic Bedroom",
                    description: "Add softness and romance with gathered pencil pleats.",
                    image: "/assets/pleated_pencil_bedroom.png"
                }
            ]}
        />
    );
}
