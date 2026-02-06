"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star, Phone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleReviewsWidget } from "./GoogleReviewsWidget";
import { ProcessTimeline } from "./ProcessTimeline";
import { PaymentOptions } from "./PaymentOptions";
import { useRef } from "react";

interface ProductFeature {
    title: string;
    description: string;
}

interface ProductType {
    title: string;
    description: string;
    image?: string;
    href?: string;
}

interface ProductTemplateProps {
    title: string;
    subtitle: string;
    heroImage: string;
    description: string;
    features: ProductFeature[];
    benefits?: string[];
    types: ProductType[];
    ctaText?: string;
    nearbyLocations?: { name: string; slug: string; postcode: string }[];
    faq?: { question: string; answer: string }[];
}

// Animation variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const
        }
    }
};

const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut" as const
        }
    }
};

const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut" as const
        }
    }
};

// Animated Button Component
function AnimatedButton({ children, href, variant = "primary", className = "" }: {
    children: React.ReactNode;
    href: string;
    variant?: "primary" | "secondary";
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link
                href={href}
                className={cn(
                    "relative group inline-flex items-center gap-2 overflow-hidden rounded-sm text-lg font-bold uppercase tracking-widest transition-all duration-300",
                    variant === "primary"
                        ? "bg-mcb-terracotta text-white px-10 py-5 shadow-xl hover:shadow-2xl"
                        : "border border-white/30 text-white px-8 py-5 hover:bg-white hover:text-mcb-charcoal",
                    className
                )}
            >
                {/* Shine effect on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <span className="relative z-10 flex items-center gap-2">{children}</span>
            </Link>
        </motion.div>
    );
}

// Animated Phone Button
function AnimatedPhoneButton({ children, href }: { children: React.ReactNode; href: string }) {
    return (
        <motion.a
            href={href}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative group flex items-center gap-2 text-white border border-white/30 px-8 py-5 rounded-sm text-lg font-medium hover:bg-white hover:text-mcb-charcoal transition-colors uppercase tracking-widest overflow-hidden"
        >
            <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
                <Phone size={20} />
            </motion.span>
            <span>{children}</span>
        </motion.a>
    );
}

export function ProductTemplate({
    title,
    subtitle,
    heroImage,
    description,
    features,
    benefits,
    types,
    ctaText = "Book a Free Measure and Quote",
    nearbyLocations,
    ...props
}: ProductTemplateProps) {
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    // Parallax effect for hero
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div className="bg-white min-h-screen overflow-x-hidden">
            {/* Hero Section with Parallax */}
            <section ref={heroRef} className="relative h-[70vh] w-full overflow-hidden bg-mcb-charcoal">
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0 w-full h-full"
                >
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src={heroImage}
                            alt={title}
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                    </motion.div>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                <motion.div
                    style={{ opacity: heroOpacity }}
                    className="absolute inset-0 flex items-center justify-center container mx-auto px-6"
                >
                    <div className="text-center max-w-4xl text-white">
                        {/* Animated sparkle decoration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex justify-center mb-4"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Sparkles className="w-8 h-8 text-mcb-terracotta" />
                            </motion.div>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 50, opacity: 0, filter: "blur(10px)" }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="font-serif text-5xl md:text-7xl font-bold mb-6"
                        >
                            {title}
                        </motion.h1>
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-xl md:text-2xl text-stone-200 font-light"
                        >
                            {subtitle}
                        </motion.p>

                        {/* Scroll indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2"
                        >
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
                            >
                                <motion.div className="w-1.5 h-3 bg-white/70 rounded-full" />
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            <GoogleReviewsWidget />

            {/* Introduction with scroll reveal */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="py-24 container mx-auto px-6"
            >
                <div className="max-w-3xl mx-auto text-center">
                    <motion.span
                        variants={itemVariants}
                        className="text-mcb-terracotta font-bold tracking-widest uppercase text-sm mb-6 block"
                    >
                        Premium Quality
                    </motion.span>
                    <motion.h2
                        variants={itemVariants}
                        className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-8 leading-tight"
                    >
                        {description}
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="w-24 h-1 bg-mcb-sage mx-auto rounded-full"
                    />
                </div>
            </motion.section>

            {/* Features Grid with staggered animations */}
            <section className="py-20 bg-mcb-paper">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                    >
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-mcb-earth cursor-pointer group"
                            >
                                <motion.div
                                    className="w-12 h-12 bg-mcb-clay/10 rounded-full flex items-center justify-center text-mcb-terracotta mb-6 group-hover:bg-mcb-terracotta group-hover:text-white transition-colors duration-300"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Star size={24} />
                                </motion.div>
                                <h3 className="font-serif text-xl mb-3 text-mcb-charcoal group-hover:text-mcb-terracotta transition-colors">{feature.title}</h3>
                                <p className="text-stone-500 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <ProcessTimeline />

            {/* Benefits Section */}
            {benefits && benefits.length > 0 && (
                <section className="py-20 bg-stone-50">
                    <div className="container mx-auto px-6">
                        <h2 className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-12 text-center">
                            Why Choose {title.replace("Custom ", "")}?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {benefits.map((benefit, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-4 p-6 bg-white rounded-sm shadow-sm"
                                >
                                    <div className="w-8 h-8 rounded-full bg-mcb-sage/20 flex items-center justify-center flex-shrink-0 text-mcb-olive">
                                        <Check size={16} />
                                    </div>
                                    <p className="font-medium text-mcb-charcoal">{benefit}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {props.faq && props.faq.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <h2 className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-12 text-center">
                            Common Questions
                        </h2>
                        <div className="space-y-6">
                            {props.faq.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="border-b border-stone-200 pb-6 last:border-0"
                                >
                                    <h3 className="font-serif text-xl text-mcb-charcoal mb-2">{item.question}</h3>
                                    <p className="text-stone-500 leading-relaxed">{item.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Product Types / Collection with alternating slide animations */}
            <section className="py-24 container mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-16 text-center"
                >
                    Our Collection
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {types.map((type, idx) => (
                        <motion.div
                            key={idx}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={idx % 2 === 0 ? slideInLeft : slideInRight}
                            className="group flex flex-col md:flex-row gap-8 items-center"
                        >
                            <motion.div
                                className="w-full md:w-1/2 overflow-hidden rounded-sm relative aspect-[4/3] cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                {type.href ? (
                                    <Link href={type.href} className="absolute inset-0 z-30">
                                        <span className="sr-only">View {type.title}</span>
                                    </Link>
                                ) : null}
                                <div className="absolute inset-0 bg-mcb-clay/10 z-10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                                <Image
                                    src={type.image || heroImage}
                                    alt={type.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Corner accent on hover */}
                                <div className="absolute bottom-0 right-0 w-0 h-0 bg-mcb-terracotta group-hover:w-16 group-hover:h-16 transition-all duration-300 z-20 pointer-events-none" />
                            </motion.div>
                            <div className="w-full md:w-1/2">
                                <motion.h3
                                    className="font-serif text-2xl mb-4 text-mcb-charcoal group-hover:text-mcb-terracotta transition-colors duration-300"
                                >
                                    {type.href ? (
                                        <Link href={type.href} className="hover:underline decoration-mcb-terracotta underline-offset-4">
                                            {type.title}
                                        </Link>
                                    ) : (
                                        type.title
                                    )}
                                </motion.h3>
                                <p className="text-stone-500 mb-6 leading-relaxed">{type.description}</p>
                                <motion.div
                                    className="flex items-center gap-2 text-mcb-terracotta font-medium uppercase text-sm tracking-wider"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Check size={16} />
                                    <span>Custom Made</span>
                                    {type.href && (
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight size={16} className="ml-2" />
                                        </motion.span>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Payment Options Integration */}
                <div className="max-w-4xl mx-auto mt-16">
                    <PaymentOptions />
                </div>
            </section>

            {/* Nearby Locations with hover animations */}
            {nearbyLocations && nearbyLocations.length > 0 && (
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="py-20 bg-stone-50 border-t border-stone-100"
                >
                    <div className="container mx-auto px-6">
                        <h3 className="font-serif text-2xl text-mcb-charcoal mb-8 text-center">
                            Also Configuring Homes Near {title.replace('Curtains and Blinds ', '')}
                        </h3>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex flex-wrap justify-center gap-4 md:gap-8"
                        >
                            {nearbyLocations.map((loc) => (
                                <motion.div key={loc.slug} variants={itemVariants}>
                                    <Link
                                        href={`/locations/${loc.slug}`}
                                        className="relative text-stone-500 hover:text-mcb-terracotta transition-colors text-sm font-medium pb-0.5 group"
                                    >
                                        {loc.name} {loc.postcode}
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-mcb-terracotta group-hover:w-full transition-all duration-300" />
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* CTA Section with enhanced animations */}
            <section className="bg-mcb-charcoal text-white py-24 relative overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute inset-0 opacity-10"
                >
                    <Image src={heroImage} alt="" fill className="object-cover" />
                </motion.div>

                {/* Floating particles effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-mcb-terracotta/30 rounded-full"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + i * 10}%`
                            }}
                            animate={{
                                y: [-20, 20, -20],
                                opacity: [0.3, 0.7, 0.3]
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                delay: i * 0.5
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-6 relative z-10 text-center"
                >
                    <motion.h2
                        className="font-serif text-3xl md:text-5xl mb-6"
                        initial={{ letterSpacing: "0.1em" }}
                        whileInView={{ letterSpacing: "0em" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Ready to Transform Your Home?
                    </motion.h2>
                    <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
                        Book a free in-home consultation with our design experts today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <AnimatedButton
                            href={`/quote?product=${title.replace('Premium ', '').replace('Custom Made ', '').replace(' & Screens', '')}`}
                            variant="primary"
                        >
                            {ctaText}
                        </AnimatedButton>
                        <AnimatedPhoneButton href="tel:1300732319">
                            Call 1300 732 319
                        </AnimatedPhoneButton>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
