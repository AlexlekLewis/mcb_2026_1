"use client";

import Link from "next/link";
import Script from "next/script";
import { ArrowRight, BadgeCheck, MessageSquareQuote } from "lucide-react";
import { quoteHref } from "@/lib/site";

export function GoogleReviewsWidget() {
    return (
        <section id="google-reviews" aria-labelledby="google-reviews-heading" className="scroll-mt-32 bg-white py-16 md:py-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="overflow-hidden rounded-sm border border-stone-200 bg-mcb-paper shadow-sm">
                    <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
                        <div className="bg-mcb-charcoal p-7 text-white md:p-10">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-mcb-clay-light">
                                <MessageSquareQuote className="h-6 w-6" />
                            </div>
                            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-mcb-clay-light">
                                Google reviews
                            </span>
                            <h2 id="google-reviews-heading" className="mb-5 font-serif text-3xl leading-tight md:text-4xl">
                                See what customers say after their measure and install
                            </h2>
                            <p className="mb-7 text-base leading-relaxed text-stone-300 md:text-lg">
                                Real feedback helps you understand how the team communicates, measures and installs before you book your free in-home quote.
                            </p>

                            <div className="mb-8 grid gap-3 text-sm text-stone-200">
                                {["Samples brought to your home", "Clear written quote before ordering", "Measured and installed with care"].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <BadgeCheck className="h-4 w-4 shrink-0 text-mcb-clay-light" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={quoteHref()}
                                className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-mcb-charcoal"
                            >
                                Book a free quote <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="relative bg-white p-4 md:p-6">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-mcb-terracotta via-mcb-clay to-mcb-sage" />
                            <div className="mb-4 flex flex-col gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-mcb-terracotta">
                                        Customer feedback
                                    </p>
                                    <p className="mt-1 text-sm text-stone-500">
                                        Live review feed powered by Google.
                                    </p>
                                </div>
                                <div className="rounded-sm border border-stone-200 px-3 py-2 text-xs font-bold uppercase tracking-widest text-mcb-charcoal">
                                    Google feed
                                </div>
                            </div>

                            <div className="relative min-h-[320px] overflow-hidden rounded-sm border border-stone-100 bg-mcb-paper">
                                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-medium text-stone-400">
                                    Loading Google reviews...
                                </div>
                                <div className="relative z-10 bg-white">
                                    <Script
                                        src="https://static.elfsight.com/platform/platform.js"
                                        strategy="lazyOnload"
                                        async
                                    />
                                    <div
                                        className="elfsight-app-7befc592-9c56-4e59-8c2d-5b7073681391"
                                        data-elfsight-app-lazy
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
