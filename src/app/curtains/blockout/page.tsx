import { ProductTemplate } from "@/components/ProductTemplate";

export default function BlockoutCurtainsPage() {
    return (
        <ProductTemplate
            title="Luxury Blockout Collection"
            subtitle="Total darkness. Complete privacy. Uncompromising style."
            heroImage="/images/blockout-curtain-detail.png"
            description="For bedrooms, nurseries, and home theatres, our Luxury Blockout Collection delivers 100% light exclusion without sacrificing aesthetics. These heavyweight fabrics feature an acrylic coating that blocks light completely while offering superior thermal insulation – keeping rooms cooler in summer and warmer in winter."
            features={[
                {
                    title: "100% Light Blockout",
                    description: "True darkness at any time of day. Essential for shift workers, light-sensitive sleepers, and media rooms."
                },
                {
                    title: "Thermal Insulation",
                    description: "The dense fabric construction and coating significantly reduces heat transfer through your windows."
                },
                {
                    title: "Noise Reduction",
                    description: "The heavyweight material provides a subtle sound dampening effect, creating a quieter sanctuary."
                }
            ]}
            types={[
                {
                    title: "Velvet Blockout",
                    description: "Rich, luxurious velvet finish that adds texture and opulence to bedrooms and formal living areas.",
                    image: "/images/blockout-curtain-detail.png"
                },
                {
                    title: "Linen-Look Blockout",
                    description: "The relaxed aesthetic of linen with full light-blocking capability. Perfect for a modern coastal vibe.",
                    image: "/images/blockout-curtain-detail.png"
                }
            ]}
        />
    );
}
