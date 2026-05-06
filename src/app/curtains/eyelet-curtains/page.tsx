import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Eyelet Curtains Melbourne | Custom Curtain Rod Style",
    description: "Custom eyelet curtains for simple rods, soft waves and easy operation. Free in-home measure and quote across Melbourne.",
    image: "/assets/eyelet_curtains_hero.png",
    path: "/curtains/eyelet-curtains",
});


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
            decisionGuide={[
                { title: "Modern living rooms", description: "Best where you want a relaxed casual heading and a decorative curtain rod on display." },
                { title: "Kids rooms", description: "Best for cord-free safety and easy operation that children can manage themselves." },
                { title: "Compare with track styles", description: "Choose pleated or Wavefold instead if you want a more formal heading or floor-to-ceiling waves." },
            ]}
            types={[
                {
                    title: "Modern Living",
                    description: "A practical and stylish choice for high-traffic family rooms.",
                    image: "/assets/eyelet_modern_living.webp"
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
