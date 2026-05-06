import { ProductTemplate } from "@/components/ProductTemplate";
import { getNearbyLocations } from "@/lib/locations";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Motorised Blinds Melbourne | Remote, App & Smart Blind Control",
    description: "Motorised blinds in Melbourne for roller blinds, double rollers and suitable custom blind systems. Remote, app, schedule and smart-home options. Free measure and quote.",
    alternates: { canonical: "/blinds/motorised-blinds" },
};

export default function MotorisedBlindsPage() {
    return (
        <ProductTemplate
            nearbyLocations={getNearbyLocations("blinds", 8)}
            title="Motorised Blinds Melbourne"
            subtitle="Remote, app and schedule control for everyday convenience."
            heroImage="/images/product-unique/mcb-motorised-blinds-remote-hero.webp"
            description="Motorised blinds make light, privacy and heat control easier across hard-to-reach windows, large glazing and multi-room homes. We help you choose the right motor, control style and power approach during your in-home consultation."
            intentLabel="Smart control for custom blinds"
            features={[
                {
                    title: "Remote and App Control",
                    description: "Open one blind, a room group or a whole-home scene from a remote, app or compatible smart control setup."
                },
                {
                    title: "Cleaner Child-Safe Operation",
                    description: "Motorisation reduces the need for loose chains and cords on suitable products."
                },
                {
                    title: "Retrofit or Renovation Options",
                    description: "Battery motors can often be added after the blinds are installed, without damaging the property or running new wiring."
                }
            ]}
            decisionGuide={[
                { title: "Choose battery motors for existing homes", description: "A practical way to add motors after the fact, often without new wiring or property damage." },
                { title: "Choose wired motors for renovations", description: "Best considered early when walls, ceilings or electrical plans are already being opened." },
                { title: "Choose smart hubs for routines", description: "Useful when you want timers, room scenes, app control or compatible voice control." },
            ]}
            comparisonRows={[
                { label: "Battery motor", bestFor: "Existing homes", notes: "Adds motorisation after the fact without new wiring in many homes." },
                { label: "Wired motor", bestFor: "Renovations and new builds", notes: "Neat long-term power where electrical access is planned." },
                { label: "Smart hub", bestFor: "Schedules and scenes", notes: "Adds app-based routines and broader automation options." },
            ]}
            types={[
                {
                    title: "Battery Motor Roller Blinds",
                    description: "A popular upgrade for bedrooms, living rooms and windows where chain operation feels inconvenient.",
                    image: "/images/product-unique/mcb-battery-motor-roller-blinds-detail.webp"
                },
                {
                    title: "Hardwired Motorised Blinds",
                    description: "A strong option for new builds, renovations and banks of larger blinds where long-term wiring makes sense.",
                    image: "/images/product-unique/mcb-hardwired-motorised-blinds-bank.webp"
                },
                {
                    title: "Smart Hub and App Control",
                    description: "Control blinds through schedules, scenes and compatible smart-home workflows when supported by the selected motor system.",
                    image: "/images/product-unique/mcb-smart-hub-blinds-app-control.webp"
                }
            ]}
            faq={[
                { question: "Can existing blinds be motorised?", answer: "Some blinds can have battery motors added after the fact, often without damaging the property or running new wiring. Suitability depends on the blind hardware, size, condition and motor compatibility, which we can assess during a visit." },
                { question: "Are motorised blinds worth it?", answer: "They are especially useful for large windows, hard-to-reach glass, bedrooms, families wanting fewer cords and homes that benefit from scheduled heat or glare control." },
                { question: "Do motorised blinds need an electrician?", answer: "Battery motor systems often do not. Wired motor systems usually need electrical planning and installation by a licensed professional." },
            ]}
        />
    );
}
