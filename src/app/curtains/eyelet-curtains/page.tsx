import { ProductTemplate } from "@/components/ProductTemplate";

export default function EyeletCurtainsPage() {
    return (
        <ProductTemplate
            title="Eyelet Curtains"
            subtitle="Simple, modern, and easy to operate."
            heroImage="/assets/eyelet_curtains_hero.png"
            description="Eyelet curtains feature metal rings punched directly into the fabric header, allowing them to slide directly onto a curtain rod. This creates large, soft waves and a casual, contemporary look that works well in living areas and bedrooms."
            features={[
                {
                    title: "Easy Installation",
                    description: "Simply thread onto a pole. No hooks, tracks, or cords required."
                },
                {
                    title: "Deep Folds",
                    description: "Naturally creates large, uniform waves for a relaxed but tidy appearance."
                },
                {
                    title: "Feature Rods",
                    description: "Allows you to showcase decorative curtain rods and finials as part of the design."
                }
            ]}
            types={[
                {
                    title: "Modern Living",
                    description: "A practical and stylish choice for high-traffic family rooms.",
                    image: "/assets/eyelet_modern_living.png"
                },
                {
                    title: "Kids Rooms",
                    description: "Durable and easy for children to open and close without tangling cords.",
                    image: "/assets/eyelet_kids_room.png"
                }
            ]}
        />
    );
}
