import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard } from "lucide-react";
import { quoteHref } from "@/lib/site";

interface PaymentOptionsProps {
  topOffset?: boolean;
  variant?: "banner" | "section";
}

const disclaimer = "Finance is subject to Payright approval. Fees, terms and conditions apply.";

export function PaymentOptions({ topOffset = false, variant = "section" }: PaymentOptionsProps) {
  if (variant === "banner") {
    return (
      <section className={`bg-mcb-charcoal text-white ${topOffset ? "pt-[112px] md:pt-[116px] lg:pt-[120px]" : ""}`}>
        <div className="mx-auto w-full max-w-7xl px-4 py-1.5 md:px-6 md:py-2">
          <div className="overflow-hidden rounded-sm border border-white/15 bg-gradient-to-r from-[#332165] via-[#4a2574] to-[#ff3157] p-[1px] shadow-lg">
            <div className="grid gap-2 bg-mcb-charcoal/90 px-3 py-2 backdrop-blur sm:grid-cols-[auto_1fr] sm:items-center md:grid-cols-[auto_1fr_auto] md:gap-4 md:px-4">
              <div className="relative h-6 w-28 shrink-0 md:h-7 md:w-36">
                <Image
                  src="/assets/payright/payright-corporate-tight.png"
                  alt="Payright"
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-col gap-0.5 lg:flex-row lg:items-baseline lg:gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white md:text-xs">
                    Interest free payment plans available
                  </p>
                  <p className="text-[11px] leading-snug text-stone-200 md:text-xs">
                    Ask about Payright during your free in-home measure and quote.
                  </p>
                </div>
                <p className="mt-0.5 text-[9px] leading-tight text-stone-400 md:text-[10px]">
                  {disclaimer}
                </p>
              </div>
              <Link
                href={quoteHref()}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm bg-white px-3 text-xs font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:bg-mcb-clay-light sm:col-span-2 md:col-span-1"
              >
                Get a quote <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="rounded-sm border border-stone-200 bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-[220px_1fr_auto] md:items-center">
        <div className="relative h-14 w-44 md:w-52">
          <Image
            src="/assets/payright/payright-corporate.png"
            alt="Payright"
            fill
            sizes="208px"
            className="object-contain object-left"
          />
        </div>
        <div>
          <p className="font-serif text-xl text-mcb-charcoal">
            Interest free finance available
          </p>
          <p className="mt-1 text-sm leading-relaxed text-stone-500">
            Spread the cost of your custom window furnishings with Payright. We can talk through finance during your quote.
          </p>
        </div>
        <div className="grid gap-2 text-sm text-mcb-charcoal">
          {["Flexible payment option", "Ask during your quote"].map((item) => (
            <div key={item} className="flex items-center gap-2 font-semibold">
              <BadgeCheck className="h-4 w-4 text-mcb-terracotta" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-start gap-2 border-t border-stone-100 pt-4 text-xs leading-relaxed text-stone-400">
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-mcb-terracotta" />
        <span>{disclaimer}</span>
      </div>
    </div>
  );
}
