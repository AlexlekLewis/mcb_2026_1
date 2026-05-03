import { ProductTemplate } from "@/components/ProductTemplate";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata({
    title: "Theatre Velvet Curtains Melbourne | Acoustic Luxury",
    description: "Heavy theatre velvet curtains for media rooms, formal spaces, acoustic softness and luxury drape. Free Melbourne measure and quote.",
    image: "/images/product-unique/mcb-theatre-velvet-curtains-media-room-hero.webp",
    path: "/curtains/theatre-velvet",
});


export default function TheatreVelvetCurtainsPage() {
    return (
        <ProductTemplate
            title="Theatre Class Velvet"
            subtitle="The pinnacle of luxury. Pure opulence for your home."
            heroImage="/images/product-unique/mcb-theatre-velvet-curtains-media-room-hero.webp"
            description="Inspired by the grandeur of classic theatres and luxury hotels, our Theatre Class Velvet curtains make an unmistakable statement. The deep pile and rich drape of genuine velvet transforms any room into a space of refined elegance. Naturally heavy, these curtains offer excellent light blockout and acoustic properties."
            features={[
                {
                    title: "Luxurious Weight & Drape",
                    description: "The heavy weight of velvet creates a rich, elegant drape that pools beautifully on the floor."
                },
                {
                    title: "Superior Acoustics",
                    description: "Velvet's dense pile absorbs sound, making it ideal for home theatres and music rooms."
                },
                {
                    title: "Vibrant Colour Depth",
                    description: "Velvet holds dye exceptionally well, resulting in rich, deep colours that shimmer in the light."
                }
            ]}
            types={[
                {
                    title: "Classic Cotton Velvet",
                    description: "Traditional cotton pile with a subtle sheen. Timeless elegance for formal living and dining.",
                    image: "/images/product-unique/mcb-heavy-velvet-curtain-drape-detail.webp"
                },
                {
                    title: "Performance Velvet",
                    description: "Modern polyester blend for enhanced durability and easier care, without sacrificing the look.",
                    image: "/images/product-unique/mcb-performance-velvet-curtains-acoustic-room.webp"
                }
            ]}
        />
    );
}
