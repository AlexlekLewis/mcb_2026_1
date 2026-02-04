import { ProductTemplate } from "@/components/ProductTemplate";

export default function TheatreVelvetCurtainsPage() {
    return (
        <ProductTemplate
            title="Theatre Class Velvet"
            subtitle="The pinnacle of luxury. Pure opulence for your home."
            heroImage="/images/blockout-curtain-detail.png"
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
                    image: "/images/blockout-curtain-detail.png"
                },
                {
                    title: "Performance Velvet",
                    description: "Modern polyester blend for enhanced durability and easier care, without sacrificing the look.",
                    image: "/images/blockout-curtain-detail.png"
                }
            ]}
        />
    );
}
