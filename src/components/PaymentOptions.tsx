import Image from "next/image";

export function PaymentOptions() {
    return (
        <div className="py-8 border-t border-stone-100 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-sm font-medium">Interest Free Finance Available</span>
                </div>
                <div className="flex items-center gap-6 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    {/* Payright Logo - Using a reliable placeholder if direct asset fails, but aiming for accuracy */}
                    <div className="relative h-8 w-24">
                        <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Payright_Logo.svg/1200px-Payright_Logo.svg.png"
                            alt="Payright"
                            fill
                            className="object-contain" // Contain to ensure it looks correct
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
