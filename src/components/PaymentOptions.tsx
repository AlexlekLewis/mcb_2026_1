import Image from "next/image";

export function PaymentOptions() {
    return (
        <div className="py-8 border-t border-stone-100 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-sm font-medium">Interest Free Finance Available</span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    {/* Payright Banners - Displaying available options */}
                    <div className="relative h-12 w-32 md:h-16 md:w-48">
                        <Image
                            src="/assets/payright_desktop_0.png"
                            alt="Payright Finance"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="relative h-12 w-32 md:h-16 md:w-48 hidden sm:block">
                        <Image
                            src="/assets/payright_desktop_1.png"
                            alt="Buy Now Pay Later"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
            <p className="text-xs text-stone-400 mt-2 text-center sm:text-right">
                *Subject to approval. Terms and conditions apply.
            </p>
        </div>
    );
}
