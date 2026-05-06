"use client";

import { ClipboardList, FileText, Hammer, Ruler } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: ClipboardList,
        title: "1. Book Your Free Visit",
        description: "Tell us what you need help with and we will arrange a time to visit your home."
    },
    {
        icon: Ruler,
        title: "2. Samples & Measuring",
        description: "We bring samples, check your rooms and measure the windows or doors properly."
    },
    {
        icon: FileText,
        title: "3. Clear Written Quote",
        description: "You receive product advice and written pricing before anything is ordered."
    },
    {
        icon: Hammer,
        title: "4. Make & Install",
        description: "Your products are custom made and professionally installed with care."
    }
];

export function ProcessTimeline() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-mcb-terracotta font-bold tracking-widest uppercase text-sm mb-4 block">How It Works</span>
                    <h2 className="font-serif text-3xl md:text-5xl text-mcb-charcoal mb-6">From First Visit to Final Fit</h2>
                    <p className="text-stone-500 text-lg">No pressure, no guesswork. We help you compare the right products before anything is ordered.</p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-stone-200" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
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
