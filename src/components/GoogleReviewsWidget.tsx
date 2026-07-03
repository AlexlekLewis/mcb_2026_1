"use client";

import Script from "next/script";
import { MessageSquareQuote } from "lucide-react";
import { PrimaryCTA } from "./PrimaryCTA";

export function GoogleReviewsWidget() {
    return (
        <section
            id="google-reviews"
            aria-labelledby="google-reviews-heading"
            className="scroll-mt-32 overflow-x-hidden bg-mcb-paper py-5 md:py-6"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="overflow-hidden rounded-sm border border-stone-200 bg-white shadow-sm">
                    <div className="h-1 bg-gradient-to-r from-mcb-terracotta via-mcb-clay to-mcb-sage" />

                    <div className="flex flex-col gap-3 border-b border-stone-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5">
                        <div className="flex min-w-0 items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mcb-paper text-mcb-terracotta">
                                <MessageSquareQuote className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <span className="block text-[10px] font-bold uppercase tracking-widest text-mcb-terracotta">
                                    Google reviews
                                </span>
                                <h2
                                    id="google-reviews-heading"
                                    className="font-serif text-lg leading-tight text-mcb-charcoal md:text-xl"
                                >
                                    Feedback from Recent Customers
                                </h2>
                            </div>
                        </div>

                        <PrimaryCTA
                            location="google-reviews"
                            label="Book a free quote"
                            className="shrink-0"
                        />
                    </div>

                    <div className="p-2.5 md:p-3">
                        <div className="relative h-[230px] min-w-0 overflow-hidden rounded-sm border border-stone-100 bg-mcb-paper md:h-[250px]">
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
        </section>
    );
}
