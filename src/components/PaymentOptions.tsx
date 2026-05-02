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
      <section className={`bg-mcb-charcoal text-white ${topOffset ? "pt-36 lg:pt-40" : ""}`}>
        <div className="container mx-auto px-4 py-2.5 md:px-6 md:py-3">
          <div className="overflow-hidden rounded-sm border border-white/15 bg-gradient-to-r from-[#332165] via-[#4a2574] to-[#ff3157] p-[1px] shadow-lg">
            <div className="flex flex-col gap-3 bg-mcb-charcoal/90 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between md:px-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative h-8 w-40 shrink-0 md:h-9 md:w-48">
                  <Image
                    src="/assets/payright/payright-long-lozenge-white.png"
                    alt="Payright"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white md:text-sm">
                    Interest free payment plans available
                  </p>
                  <p className="mt-0.5 max-w-2xl text-xs leading-relaxed text-stone-200 md:text-sm">
                    Ask about Payright during your free in-home measure and quote.
                  </p>
                </div>
              </div>
              <Link
                href={quoteHref()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:bg-mcb-clay-light md:text-sm"
              >
                Get a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <p className="mt-1.5 text-center text-[10px] leading-relaxed text-stone-400 md:text-right">
            {disclaimer}
          </p>
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
