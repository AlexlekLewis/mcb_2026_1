import { ProductTemplate } from "@/components/ProductTemplate";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Motorised Blinds & Curtains Melbourne | Remote, App & Voice Control",
    description: "Motorised blinds, curtains and awnings in Melbourne with remote, app, hub and voice-control options. Free in-home measure and quote.",
};

export default function MotorisationPage() {
    return (
        <ProductTemplate
            title="Motorised Blinds and Curtains Melbourne"
            subtitle="Remote, app, schedule and voice-control options."
            heroImage="/assets/roller_blind_hero.webp" // Reusing appropriate image
            description="Open and close blinds, curtains and awnings by remote, app, schedule or voice control. We help you choose battery or wired motors, smart hubs and compatible products for everyday convenience and child-safe operation."
            intentLabel="Convenience, child safety and smart routines"
            features={[
                {
                    title: "Wire-Free Options",
                    description: "No need for an electrician. Our rechargeable battery motors are easy to install and last months on a single charge."
                },
                {
                    title: "App Control",
                    description: "Control your blinds from anywhere in the world using your smartphone. Set scenes, timers, and automate your day."
                },
                {
                    title: "Voice Integration",
                    description: "Compatible with Google Home, Amazon Alexa, and Apple HomeKit for true hands-free operation."
                }
            ]}
            decisionGuide={[
                { title: "Battery motors", description: "Best for retrofit projects and windows where running new wiring is not practical." },
                { title: "Wired motors", description: "Best for new builds, renovations and large banks of automated products." },
                { title: "Smart hubs", description: "Best for app control, scheduling, voice assistants and scenes." },
                { title: "Motorised curtains", description: "Best for wide openings, tall windows and protecting fabrics from handling." },
            ]}
            comparisonRows={[
                { label: "Remote control", bestFor: "Simple operation", notes: "Open one or more products without wall switches." },
                { label: "App control", bestFor: "Schedules and scenes", notes: "Useful for privacy, heat and routines." },
                { label: "Voice control", bestFor: "Smart homes", notes: "Compatibility depends on the motor and hub." },
                { label: "Battery motors", bestFor: "Retrofit installs", notes: "No electrician needed for many suitable products." },
            ]}
            types={[
                {
                    title: "Motorised Rollers",
                    description: "The most popular choice for automation. Perfect for hard-to-reach windows and managing banks of blinds simultaneously.",
                    image: "/assets/motorised_rollers.webp" // Updated
                },
                {
                    title: "Motorised Curtains",
                    description: "Add a touch of luxury with curtains that glide open at sunrise. Protect high-end fabrics from handling damage.",
                    image: "/assets/motorised_curtains.png" // Reusing appropriate image
                },
                {
                    title: "Smart Hubs",
                    description: "The brain of your operation. Connect your blinds to your Wi-Fi network for app control and third-party integration.",
                    image: "/assets/smart_hub_blinds.png" // Updated
                }
            ]}
            faq={[
                { question: "Can existing blinds be motorised?", answer: "Some products can be retrofitted, but it depends on the existing blind, size and hardware. We can assess this during a visit." },
                { question: "Do battery motors need an electrician?", answer: "Many rechargeable battery motors do not require an electrician, making them useful for retrofit projects." },
                { question: "Can motorisation help with child safety?", answer: "Yes. Motorised products reduce or remove the need for loose chains and cords." },
                { question: "Can I control blinds with an app or voice assistant?", answer: "Many systems support app, schedule and voice control when paired with the right hub." },
            ]}
        />
    );
}
