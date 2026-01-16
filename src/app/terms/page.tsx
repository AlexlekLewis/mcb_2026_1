'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-stone-50 flex flex-col">
            <Navbar />

            <section className="flex-grow pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-8">Terms and Conditions</h1>

                        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-stone-200 prose prose-stone max-w-none">
                            <p className="lead text-lg text-stone-600 mb-8">
                                Please review our terms and conditions carefully before using our services.
                            </p>

                            <div className="space-y-8 text-stone-700">
                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">1. General</h3>
                                    <p>
                                        [Terms and Conditions content to be inserted here. Please provide the specific legal text from your original document.]
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">2. Quotes and Orders</h3>
                                    <p>
                                        All quotes are valid for 30 days. Orders are confirmed upon receipt of deposit.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">3. Installation</h3>
                                    <p>
                                        Installation times are estimates and may vary. We strive to complete all work in a timely and professional manner.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">4. Warranty</h3>
                                    <p>
                                        We offer standard manufacturer warranties on all our products. Please contact us for specific warranty details regarding your purchase.
                                    </p>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
