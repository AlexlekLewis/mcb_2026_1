"use client";

import { ClipboardList, Hammer, Star } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: ClipboardList,
        title: "1. Free Measure & Quote",
        description: "We bring samples to you. Our experts measure your windows and provide advice on the best fabrics and styles."
    },
    {
        icon: Hammer,
        title: "2. Custom Crafting",
        description: "Your order is sent to our Melbourne facility where it is locally manufactured to your exact specifications."
    },
    {
        icon: Star,
        title: "3. Professional Install",
        description: "Our experienced team installs your new window furnishings, ensuring a perfect fit and leaving your home spotless."
    }
];

export function ProcessTimeline() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-mcb-terracotta font-bold tracking-widest uppercase text-sm mb-4 block">How It Works</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-mcb-charcoal mb-6">Simple, Seamless Process</h2>
                    <p className="text-stone-500 text-lg">From our first visit to the final reveal, we make transforming your home effortless.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-stone-200" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="flex flex-col items-center text-center bg-white p-4"
                            >
                                <div className="w-24 h-24 rounded-full bg-mcb-paper border-4 border-white shadow-lg flex items-center justify-center text-mcb-terracotta mb-8">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="font-serif text-2xl text-mcb-charcoal mb-4">{step.title}</h3>
                                <p className="text-stone-500 leading-relaxed max-w-xs">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
