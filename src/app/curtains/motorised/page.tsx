import { ProductTemplate } from "@/components/ProductTemplate";

export default function MotorisedCurtainsPage() {
    return (
        <ProductTemplate
            title="Motorised Intelligence"
            subtitle="Effortless control at your fingertips."
            heroImage="/images/product-unique/mcb-motorised-curtains-hero-track-remote.webp"
            description="Embrace the future of home automation with our Motorised Intelligence range. Whisper-quiet motors allow you to open and close your curtains with a remote, wall switch, or smartphone app. Program schedules to wake with natural light or close for privacy as the sun sets – all without lifting a finger."
            features={[
                {
                    title: "Smart Home Integration",
                    description: "Compatible with major smart home systems including Google Home, Alexa, and Apple HomeKit."
                },
                {
                    title: "Whisper-Quiet Operation",
                    description: "Premium motors operate silently, ensuring no disruption to your peaceful environment."
                },
                {
                    title: "Scheduled Automation",
                    description: "Set timers to open and close your curtains, simulating occupancy while you're away."
                }
            ]}
            types={[
                {
                    title: "Battery Powered",
                    description: "No wiring required. Rechargeable lithium batteries offer months of operation between charges.",
                    image: "/images/product-unique/mcb-smart-home-motorised-curtains-app-control.webp"
                },
                {
                    title: "Hardwired Systems",
                    description: "Ideal for new builds or renovations. Continuous power for complete peace of mind.",
                    image: "/images/product-unique/mcb-hardwired-motorised-curtain-track-detail.webp"
                }
            ]}
        />
    );
}
