"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoogleReviewsWidget } from "./GoogleReviewsWidget";
import { ProcessTimeline } from "./ProcessTimeline";
import { PaymentOptions } from "./PaymentOptions";

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
    types: ProductType[];
    ctaText?: string;
    nearbyLocations?: { name: string; slug: string; postcode: string }[];
}

export function ProductTemplate({
    title,
    subtitle,
    heroImage,
    description,
    features,
    types,
    ctaText = "Book Free Consultation",
    nearbyLocations
}: ProductTemplateProps) {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[70vh] w-full overflow-hidden bg-mcb-charcoal">
                <div className="absolute inset-0 w-full h-full">
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.05 }}
                        transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
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
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                <div className="absolute inset-0 flex items-center justify-center container mx-auto px-6">
                    <div className="text-center max-w-4xl text-white">
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="font-serif text-5xl md:text-7xl font-bold mb-6"
                        >
                            {title}
                        </motion.h1>
                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-xl md:text-2xl text-stone-200 font-light"
                        >
                            {subtitle}
                        </motion.p>
                    </div>
                </div>
            </section>

            <GoogleReviewsWidget />

            {/* Introduction */}
            <section className="py-24 container mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-mcb-terracotta font-bold tracking-widest uppercase text-sm mb-6 block">Premium Quality</span>
                    <h2 className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-8 leading-tight">
                        {description}
                    </h2>
                    <div className="w-24 h-1 bg-mcb-sage mx-auto rounded-full" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-mcb-paper">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-sm shadow-sm border-t-4 border-mcb-earth"
                            >
                                <div className="w-12 h-12 bg-mcb-clay/10 rounded-full flex items-center justify-center text-mcb-terracotta mb-6">
                                    <Star size={24} />
                                </div>
                                <h3 className="font-serif text-xl mb-3 text-mcb-charcoal">{feature.title}</h3>
                                <p className="text-stone-500 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            <ProcessTimeline />

            {/* Product Types / Collection */}
            <section className="py-24 container mx-auto px-6">
                <h2 className="font-serif text-3xl md:text-4xl text-mcb-charcoal mb-16 text-center">Our Collection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {types.map((type, idx) => (
                        <div key={idx} className="group flex flex-col md:flex-row gap-8 items-center">
                            {/* If we had specific images for types, we'd use them here. For now, using a stylish text card or the main image if provided */}
                            <div className="w-full md:w-1/2 overflow-hidden rounded-sm relative aspect-[4/3]">
                                <div className="absolute inset-0 bg-mcb-clay/10 z-10 group-hover:bg-transparent transition-colors" />
                                <Image
                                    src={type.image || heroImage} // Fallback to hero if no specific image
                                    alt={type.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <h3 className="font-serif text-2xl mb-4 text-mcb-charcoal group-hover:text-mcb-terracotta transition-colors">
                                    {type.href ? (
                                        <Link href={type.href}>{type.title}</Link>
                                    ) : (
                                        type.title
                                    )}
                                </h3>
                                <p className="text-stone-500 mb-6 leading-relaxed">{type.description}</p>
                                <div className="flex items-center gap-2 text-mcb-terracotta font-medium uppercase text-sm tracking-wider">
                                    <Check size={16} />
                                    <span>Custom Made</span>
                                    {type.href && <ArrowRight size={16} className="ml-2" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Payment Options Integration */}
                <div className="max-w-4xl mx-auto mt-16">
                    <PaymentOptions />
                </div>
            </section>

            {/* Nearby Locations / Service Area Graph */}
            {
                nearbyLocations && nearbyLocations.length > 0 && (
                    <section className="py-20 bg-stone-50 border-t border-stone-100">
                        <div className="container mx-auto px-6">
                            <h3 className="font-serif text-2xl text-mcb-charcoal mb-8 text-center">Also Configuring Homes Near {title.replace('Curtains and Blinds ', '')}</h3>
                            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                                {nearbyLocations.map((loc) => (
                                    <Link
                                        key={loc.slug}
                                        href={`/locations/${loc.slug}`}
                                        className="text-stone-500 hover:text-mcb-terracotta transition-colors text-sm font-medium border-b border-transparent hover:border-mcb-terracotta pb-0.5"
                                    >
                                        {loc.name} {loc.postcode}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* CTA Section */}
            <section className="bg-mcb-charcoal text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Image src={heroImage} alt="" fill className="object-cover" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="font-serif text-3xl md:text-5xl mb-6">Ready to Transform Your Home?</h2>
                    <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">Book a free in-home consultation with our design experts today.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href={`/quote?product=${title.replace('Premium ', '').replace('Custom Made ', '').replace(' & Screens', '')}`}
                            className="bg-mcb-terracotta text-white px-10 py-5 rounded-sm text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-mcb-charcoal transition-all shadow-xl hover:shadow-2xl"
                        >
                            {ctaText}
                        </Link>
                        <a href="tel:1300732319" className="flex items-center gap-2 text-white border border-white/30 px-8 py-5 rounded-sm text-lg font-medium hover:bg-white hover:text-mcb-charcoal transition-colors uppercase tracking-widest">
                            <Phone size={20} />
                            <span>Call 1300 732 319</span>
                        </a>
                    </div>
                </div>
            </section>
        </div >
    );
}
