'use client';

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
                        <h1 className="font-serif text-4xl md:text-5xl text-stone-800 mb-8">Privacy Policy</h1>

                        <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-stone-200 prose prose-stone max-w-none">
                            <p className="lead text-lg text-stone-600 mb-8">
                                Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information.
                            </p>

                            <div className="space-y-8 text-stone-700">
                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">1. Information Collection</h3>
                                    <p>
                                        We collect information you provide directly to us, such as when you request a quote, book a consultation, or contact us for support. This may include your name, email address, phone number, and address.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">2. Use of Information</h3>
                                    <p>
                                        We use the information we collect to provide, maintain, and improve our services, to process your orders, and to communicate with you about your project.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">3. Data Protection</h3>
                                    <p>
                                        We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="font-serif text-2xl text-stone-800 mb-4">4. Contact Us</h3>
                                    <p>
                                        If you have any questions about this Privacy Policy, please contact us at admin@moderncurtainsandblinds.com.au.
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
