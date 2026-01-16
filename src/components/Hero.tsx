"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
    {
        id: "curtains",
        type: "video",
        src: "/assets/Curtains_Hero.mp4",
        headline: "Soft. Sustainable. Stylish.",
        subhead: "Premium Australian Made Curtains, Custom Crafted for Your Home.",
        cta: "Shop Curtains",
        href: "/curtains",
        align: "center", // Text alignment
    },
    {
        id: "security",
        type: "image",
        src: "/assets/security_door_hero.png",
        headline: "Protect What Matters.",
        subhead: "Crimsafe Security Doors. Maximum Strength, Zero Compromise.",
        cta: "Book Free Measure",
        href: "/security",
        align: "left",
    },
    {
        id: "blinds",
        type: "image",
        src: "/assets/roller_blind_hero.png",
        headline: "Motorisation Sale.",
        subhead: "Up to 40% Off Motorised Roller Blinds. New Year Special.",
        cta: "View Offers",
        href: "/blinds",
        align: "right",
    },
];

export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 6000); // 6 seconds per slide
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-mcb-charcoal">
            <AnimatePresence mode="wait">
                <motion.div
                    key={SLIDES[currentSlide].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Layer */}
                    {SLIDES[currentSlide].type === "video" ? (
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        >
                            <source src={SLIDES[currentSlide].src} type="video/mp4" />
                        </video>
                    ) : (
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <motion.div
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.05 }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="w-full h-full relative"
                            >
                                <Image
                                    src={SLIDES[currentSlide].src}
                                    alt={SLIDES[currentSlide].headline}
                                    fill
                                    className="object-cover opacity-60"
                                    priority
                                />
                            </motion.div>
                        </div>
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center container mx-auto px-6">
                        <div className={`w-full max-w-4xl text-white ${SLIDES[currentSlide].align === 'left' ? 'text-left mr-auto' :
                            SLIDES[currentSlide].align === 'right' ? 'text-right ml-auto' :
                                'text-center mx-auto'
                            }`}>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight"
                            >
                                {SLIDES[currentSlide].headline}
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-lg md:text-2xl text-stone-200 mb-10 max-w-2xl inline-block"
                            >
                                {SLIDES[currentSlide].subhead}
                            </motion.p>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.8 }}
                            >
                                <Link href={SLIDES[currentSlide].href} className="inline-flex items-center gap-3 bg-white text-mcb-charcoal px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-mcb-terracotta hover:text-white transition-all duration-300">
                                    {SLIDES[currentSlide].cta}
                                    <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute bottom-10 right-10 flex gap-4 z-20">
                <button onClick={prevSlide} className="p-3 border border-white/20 text-white hover:bg-white hover:text-mcb-charcoal transition-all rounded-full">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextSlide} className="p-3 border border-white/20 text-white hover:bg-white hover:text-mcb-charcoal transition-all rounded-full">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-10 left-10 flex gap-3 z-20">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-white scale-125' : 'bg-white/40'}`}
                    />
                ))}
            </div>
        </section>
    );
}
