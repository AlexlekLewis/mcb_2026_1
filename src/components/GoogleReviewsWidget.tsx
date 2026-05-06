"use client";

import Link from "next/link";
import Script from "next/script";
import { ArrowRight, BadgeCheck, MessageSquareQuote } from "lucide-react";
import { quoteHref } from "@/lib/site";

export function GoogleReviewsWidget() {
    return (
        <section id="google-reviews" aria-labelledby="google-reviews-heading" className="scroll-mt-32 overflow-x-hidden bg-mcb-paper py-12 md:py-14">
            <div className="container mx-auto px-4 md:px-6">
                <div className="overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
                    <div className="grid min-w-0 lg:grid-cols-[0.36fr_0.64fr]">
                        <div className="min-w-0 border-b border-stone-100 bg-white p-6 md:p-8 lg:border-b-0 lg:border-r">
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-mcb-paper text-mcb-terracotta">
                                <MessageSquareQuote className="h-6 w-6" />
                            </div>
                            <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-mcb-terracotta">
                                Google reviews
                            </span>
                            <h2 id="google-reviews-heading" className="mb-4 font-serif text-3xl leading-tight text-mcb-charcoal md:text-4xl">
                                Feedback from Recent Customers
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-stone-600">
                                Real feedback helps you understand how the team communicates, measures and installs before you book your free in-home quote.
                            </p>

                            <div className="mb-7 flex flex-wrap gap-2 text-xs font-semibold text-mcb-charcoal">
                                {["Samples brought to your home", "Clear written quote before ordering", "Measured and installed with care"].map((item) => (
                                    <div key={item} className="flex items-center gap-2 rounded-sm border border-stone-200 bg-mcb-paper px-3 py-2">
                                        <BadgeCheck className="h-4 w-4 shrink-0 text-mcb-terracotta" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href={quoteHref()}
                                className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-5 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal"
                            >
                                Book a free quote <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        <div className="relative min-w-0 bg-white p-4 md:p-6">
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

                            <div className="relative h-[300px] min-w-0 overflow-hidden rounded-sm border border-stone-100 bg-mcb-paper md:h-[320px]">
                                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-medium text-stone-400">
                                    Loading Google reviews...
                                </div>
                                <div className="relative z-10 w-full max-w-full overflow-hidden bg-white">
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
