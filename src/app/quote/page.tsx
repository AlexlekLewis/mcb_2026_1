import QuoteForm from "@/components/QuoteForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Book a Free In-Home Measure & Quote",
    description: "Book a free in-home measure and quote for custom curtains, blinds, shutters, security doors, fly screens, awnings and motorisation in Melbourne.",
};

import { Suspense } from "react";

export default function QuotePage() {
    return (
        <div className="pt-28">
            <Suspense fallback={<QuoteFormSkeleton />}>
                <QuoteForm />
            </Suspense>
        </div>
    );
}

function QuoteFormSkeleton() {
    return (
        <section className="min-h-screen bg-mcb-paper px-4 py-28">
            <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr]">
                <div className="rounded-sm bg-white p-8 shadow-xl">
                    <div className="mb-6 h-4 w-48 rounded bg-stone-200" />
                    <div className="mb-4 h-12 max-w-2xl rounded bg-stone-200" />
                    <div className="mb-10 h-6 max-w-3xl rounded bg-stone-100" />
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="h-12 rounded bg-mcb-terracotta/30" />
                        <div className="h-12 rounded bg-stone-100" />
                        <div className="h-12 rounded bg-stone-100" />
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="h-14 rounded bg-stone-100" />
                        <div className="h-14 rounded bg-stone-100" />
                    </div>
                </div>
                <div className="rounded-sm bg-mcb-charcoal p-8 text-white shadow-xl">
                    <div className="mb-4 h-8 w-52 rounded bg-white/20" />
                    <div className="space-y-4">
                        <div className="h-5 rounded bg-white/10" />
                        <div className="h-5 rounded bg-white/10" />
                        <div className="h-5 rounded bg-white/10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
