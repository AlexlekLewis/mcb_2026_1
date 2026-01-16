"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, MapPin, Phone, Mail, User, MessageSquare, Star, Quote } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// Larger pool of reviews to cycle through
const reviewPool = [
    {
        name: "Angela Voronkova",
        text: "Tate provided an amazing service. The blinds look fantastic and the installation was quick!",
        stars: 5,
    },
    {
        name: "Deepak Mathew",
        text: "Outstanding service and guidance from start to finish! Highly recommend for security doors.",
        stars: 5,
    },
    {
        name: "Sarah Jenkins",
        text: "Professional, efficient, and great quality products. My sheer curtains transformed the room.",
        stars: 5,
    },
    {
        name: "Michael Chen",
        text: "Loved the free measure and quote service. Very helpful advice on motorisation options.",
        stars: 5,
    },
    {
        name: "Jessica Lewis",
        text: "The outdoor awnings are perfect for our deck. Great quality and installed on time.",
        stars: 5,
    },
    {
        name: "David O'Reilly",
        text: "Excellent communication and the final product is exactly what we wanted. 10/10.",
        stars: 5,
    },
    {
        name: "Emma Wilson",
        text: "Crimsafe doors feel super secure without blocking the view. Thanks team!",
        stars: 5,
    },
    {
        name: "James Thompson",
        text: "Reasonably priced and top tier quality. The S-Fold curtains look elegant.",
        stars: 5,
    },
    {
        name: "Sophie Clark",
        text: "Installation was a breeze. The team was respectful and cleaned up after themselves.",
        stars: 5,
    },
    {
        name: "Ryan Hughes",
        text: "Very happy with the plantation shutters. They completely modernized our living area.",
        stars: 5,
    },
    {
        name: "Linda Gare",
        text: "Quick turnaround time from quote to installation. Would use them again.",
        stars: 5,
    },
    {
        name: "Peter Morris",
        text: "Great advice on the blockout blinds for the nursery. Works perfectly.",
        stars: 5,
    }
];

// Fixed positions for the 7 floating bubbles
const positions = [
    "top-0 -left-16",
    "top-1/4 -right-20",
    "bottom-1/3 -left-20",
    "bottom-20 -right-16",
    "top-20 -right-8",
    "bottom-0 -left-8",
    "top-[60%] -right-24"
];

const productOptions = [
    "Blinds",
    "Curtains",
    "Plantation Shutters",
    "Outdoor Blinds",
    "Roller Shutters",
    "Security Doors",
    "Awnings",
    "Fly Screen Doors",
    "Zip Screens",
];

const windowOptions = ["1-5", "5-10", "10-20", "20 +"];

const referralOptions = [
    "Google",
    "Facebook",
    "Instagram",
    "Referral",
    "Card",
    "Existing Customer",
    "Other",
];

import { useSearchParams } from "next/navigation";

export default function QuoteForm() {
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        suburb: "",
        products: [] as string[],
        windowCount: "",
        referral: "",
        referrerName: "",
        message: "",
    });

    // Auto-select product from URL
    useEffect(() => {
        const productParam = searchParams.get('product');
        if (productParam) {
            // Capitalize first letter to match productOptions
            const formattedProduct = productParam.charAt(0).toUpperCase() + productParam.slice(1);
            // Handle known mappings if URL param implies a specific category
            let productToAdd = formattedProduct;

            // Map generic terms to form options if needed (e.g. "shutters" -> "Plantation Shutters")
            if (formattedProduct.includes("Shutters") && !productOptions.includes(formattedProduct)) {
                productToAdd = "Plantation Shutters";
            }
            if (formattedProduct === "Security") {
                productToAdd = "Security Doors";
            }

            if (productOptions.includes(productToAdd)) {
                setFormData(prev => ({
                    ...prev,
                    products: prev.products.includes(productToAdd) ? prev.products : [...prev.products, productToAdd]
                }));
            }
        }
    }, [searchParams]);

    const relevantProductsForCount = [
        "Blinds",
        "Curtains",
        "Plantation Shutters",
        "Outdoor Blinds",
        "Roller Shutters",
        "Fly Screen Doors",
        "Zip Screens"
    ];

    const showWindowCount = formData.products.some(p => relevantProductsForCount.includes(p));

    // State to hold the currently displayed reviews
    const [activeReviews, setActiveReviews] = useState(() => {
        return reviewPool.slice(0, 7).map((review, i) => ({
            ...review,
            id: i, // stable ID for position mapping
            position: positions[i]
        }));
    });

    // Cycle reviews effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveReviews(current => {
                // Pick a random slot to update (0-6)
                const slotToUpdate = Math.floor(Math.random() * 7);

                // Pick a random new review from the pool that isn't currently displayed
                const displayedNames = current.map(r => r.name);
                const available = reviewPool.filter(r => !displayedNames.includes(r.name));
                const newReview = available[Math.floor(Math.random() * available.length)];

                if (!newReview) return current; // Should not happen if pool is big enough

                const newReviews = [...current];
                newReviews[slotToUpdate] = {
                    ...newReview,
                    id: current[slotToUpdate].id, // Keep the ID/position stable
                    position: positions[slotToUpdate]
                };
                return newReviews;
            });
        }, 5000); // Change one review every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleProductToggle = (product: string) => {
        setFormData((prev) => {
            if (prev.products.includes(product)) {
                return { ...prev, products: prev.products.filter((p) => p !== product) };
            } else {
                return { ...prev, products: [...prev.products, product] };
            }
        });
    };

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
                // Reset form optionally, or redirect
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
        }
    };

    return (
        <section className="relative w-full min-h-screen bg-stone-50 py-20 px-4 overflow-hidden flex items-center justify-center">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-mcb-sage/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-mcb-clay/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-12">
                {/* Intro / Floating Reviews Section (Desktop Left/Center) */}
                <div className="hidden lg:block absolute w-full max-w-[1400px] h-full pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {activeReviews.map((review) => (
                            <FloatingReview key={`${review.id}-${review.name}`} review={review} />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Mobile Reviews (Stacked) */}
                <div className="lg:hidden w-full flex flex-col gap-4 mb-8">
                    <h2 className="text-3xl font-serif text-stone-800 text-center mb-2">
                        What our clients say
                    </h2>
                    <div className="flex overflow-x-auto gap-4 py-4 px-2 snap-x">
                        {activeReviews.slice(0, 4).map((review, index) => (
                            <div key={index} className="snap-center shrink-0 w-[280px] bg-white p-6 rounded-xl shadow-sm border border-stone-100">
                                <div className="flex gap-1 mb-2">
                                    {[...Array(review.stars)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-stone-600 text-sm mb-4">"{review.text}"</p>
                                <p className="font-medium text-stone-800 text-sm">- {review.name}</p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Form Container */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-12"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-4">
                            Get a Free Quote
                        </h1>
                        <p className="text-stone-500 text-lg">
                            Tell us about your project and we'll bring our samples to you.
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-3xl font-serif text-stone-800 mb-4">Quote Received!</h3>
                                <p className="text-stone-600 text-lg max-w-md mx-auto">
                                    Thank you, {formData.firstName}. We'll be in touch shortly to arrange your free measure and quote.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-stone-800 border-b border-stone-200 pb-2">
                                        1. Your Details
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            icon={<User className="w-5 h-5 text-stone-400" />}
                                            label="First Name"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Jane"
                                        />
                                        <InputField
                                            icon={<User className="w-5 h-5 text-stone-400" />}
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            icon={<Mail className="w-5 h-5 text-stone-400" />}
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="jane@example.com"
                                        />
                                        <InputField
                                            icon={<Phone className="w-5 h-5 text-stone-400" />}
                                            label="Phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0400 000 000"
                                        />
                                    </div>
                                    <InputField
                                        icon={<MapPin className="w-5 h-5 text-stone-400" />}
                                        label="Suburb"
                                        name="suburb"
                                        value={formData.suburb}
                                        onChange={handleChange}
                                        placeholder="Richmond, VIC"
                                    />
                                </div>

                                {/* Project Details */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-stone-800 border-b border-stone-200 pb-2">
                                        2. Project Details
                                    </h3>

                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-stone-700">
                                            What products are you interested in?
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {productOptions.map((product) => (
                                                <button
                                                    key={product}
                                                    type="button"
                                                    onClick={() => handleProductToggle(product)}
                                                    className={cn(
                                                        "flex items-center justify-center py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 border",
                                                        formData.products.includes(product)
                                                            ? "bg-stone-800 text-white border-stone-800 shadow-md transform scale-[1.02]"
                                                            : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50"
                                                    )}
                                                >
                                                    {product}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {showWindowCount && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-3 overflow-hidden"
                                            >
                                                <label className="block text-sm font-medium text-stone-700">
                                                    How many windows or doors?
                                                </label>
                                                <div className="flex flex-wrap gap-4">
                                                    {windowOptions.map((option) => (
                                                        <label
                                                            key={option}
                                                            className={cn(
                                                                "flex items-center gap-2 cursor-pointer py-2 px-4 rounded-full border transition-all",
                                                                formData.windowCount === option
                                                                    ? "bg-stone-100 border-stone-400 ring-1 ring-stone-400"
                                                                    : "bg-white border-stone-200 hover:border-stone-300"
                                                            )}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="windowCount"
                                                                value={option}
                                                                checked={formData.windowCount === option}
                                                                onChange={handleChange}
                                                                className="text-stone-800 focus:ring-stone-500"
                                                                required={showWindowCount}
                                                            />
                                                            <span className="text-sm text-stone-700">{option}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-medium text-stone-800 border-b border-stone-200 pb-2">
                                        3. Final Touches
                                    </h3>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-700">
                                            How did you hear about us?
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="referral"
                                                value={formData.referral}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 appearance-none text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all"
                                            >
                                                <option value="">Select an option</option>
                                                {referralOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                                        </div>
                                        <AnimatePresence>
                                            {formData.referral === "Referral" && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden pt-2"
                                                >
                                                    <InputField
                                                        label="Who referred you?"
                                                        name="referrerName"
                                                        value={(formData as any).referrerName}
                                                        onChange={handleChange}
                                                        placeholder="Enter their name"
                                                        icon={<User className="w-5 h-5 text-stone-400" />}
                                                    />
                                                    <p className="text-xs text-stone-500 mt-1 ml-1">
                                                        Please let us know so we can reach out and thank them!
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-stone-700">
                                            Additional Message
                                        </label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-stone-400" />
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3 min-h-[120px] text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all resize-y"
                                                placeholder="Any specific requirements or questions?"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full bg-stone-900 text-white font-medium text-lg py-4 rounded-2xl hover:bg-stone-800 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    {status === "loading" ? "Sending Request..." : "Request Free Quote"}
                                </button>
                                {status === "error" && (
                                    <p className="text-red-500 text-center text-sm">Something went wrong. Please try calling us instead.</p>
                                )}
                                <p className="text-center text-xs text-stone-400 mt-4">
                                    We respect your privacy. Your details are safe with us.
                                </p>
                            </form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

function InputField({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
}: {
    label: string;
    name: string;
    type?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">{label}</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {icon}
                </div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required
                    className="w-full bg-white border border-stone-200 rounded-xl pl-12 pr-4 py-3 text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all placeholder:text-stone-300"
                />
            </div>
        </div>
    );
}

function FloatingReview({ review }: { review: any }) {
    return (
        <motion.div
            layoutId={review.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8 }}
            className={cn(
                "absolute bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/50 w-[260px]",
                review.position
            )}
        >
            <div className="flex gap-1 mb-2">
                {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                ))}
            </div>
            <p className="text-stone-600 text-sm mb-3 relative z-10 leading-relaxed font-medium">"{review.text}"</p>
            <p className="font-bold text-stone-900 text-xs uppercase tracking-wide">- {review.name}</p>
            <Quote className="absolute bottom-4 right-4 w-12 h-12 text-stone-200/50 fill-stone-200/50 -z-0" />
        </motion.div>
    )
}
