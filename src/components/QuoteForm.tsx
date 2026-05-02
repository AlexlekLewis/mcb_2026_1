"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CalendarDays, Check, ChevronLeft, Clock, Mail, MapPin, MessageSquare, Phone, ShieldCheck, User } from "lucide-react";
import { quoteProductOptions } from "@/lib/cro-data";
import { SITE } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const windowOptions = ["1-5", "5-10", "10-20", "20+"];
const contactTimes = ["Morning", "Afternoon", "Evening", "Anytime"];
const projectStages = ["Ready to book", "Comparing options", "Building or renovating", "Just need advice"];

type QuoteFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  suburb: string;
  products: string[];
  windowCount: string;
  bestContactTime: string;
  appointmentPreference: string;
  projectStage: string;
  needsAdvice: boolean;
  message: string;
};

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const initialProduct = getInitialProduct(searchParams.get("product"));
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    suburb: "",
    products: initialProduct ? [initialProduct] : [],
    windowCount: "",
    bestContactTime: "",
    appointmentPreference: "",
    projectStage: "",
    needsAdvice: initialProduct === "Unsure / Need Advice",
    message: "",
  });

  const canContinue = useMemo(() => {
    if (step === 1) {
      return formData.suburb.trim().length > 1 && (formData.products.length > 0 || formData.needsAdvice);
    }
    if (step === 2) {
      return formData.firstName.trim().length > 1 && formData.phone.trim().length > 5 && formData.email.includes("@");
    }
    return true;
  }, [formData, step]);

  const handleProductToggle = (product: string) => {
    trackFormStart();
    setFormData((prev) => {
      const selected = prev.products.includes(product)
        ? prev.products.filter((item) => item !== product)
        : [...prev.products, product];
      return {
        ...prev,
        products: selected,
        needsAdvice: selected.includes("Unsure / Need Advice"),
      };
    });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    trackFormStart();
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const trackFormStart = () => {
    if (hasTrackedStart) return;
    setHasTrackedStart(true);
    trackEvent("quote_form_start", {
      has_product_context: Boolean(initialProduct),
    });
  };

  const handleContinue = () => {
    if (step === 1) {
      trackEvent("quote_step_1_complete", getQuoteTrackingPayload(formData));
    }

    if (step === 2) {
      trackEvent("quote_step_2_complete", getQuoteTrackingPayload(formData));
    }

    setStep((current) => current + 1);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    trackEvent("quote_step_3_submit", getQuoteTrackingPayload(formData));

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      trackEvent(res.ok ? "quote_success" : "quote_error", getQuoteTrackingPayload(formData));
      setStatus(res.ok ? "success" : "error");
    } catch (error) {
      console.error(error);
      trackEvent("quote_error", getQuoteTrackingPayload(formData));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="min-h-screen bg-mcb-paper px-4 py-28">
        <div className="container mx-auto max-w-3xl rounded-sm bg-white p-8 text-center shadow-xl md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check className="h-10 w-10" />
          </div>
          <h1 className="mb-4 font-serif text-4xl text-mcb-charcoal">Thanks, {formData.firstName || "there"}.</h1>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-stone-600">
            We have received your request and will contact you within 24 business hours to arrange your free in-home measure and quote.
          </p>
          <a href={SITE.phoneHref} className="mt-8 inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-6 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal">
            <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-mcb-paper px-4 py-28">
      <div className="container mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.72fr]">
        <div className="rounded-sm bg-white p-6 shadow-xl md:p-10">
          <div className="mb-8">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Free in-home measure</span>
            <h1 className="mb-4 font-serif text-4xl text-mcb-charcoal md:text-5xl">Book Your Free In-Home Measure & Quote</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-stone-500">
              No obligation. We bring samples, measure your windows, recommend suitable products and provide a clear written quote.
            </p>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            {["Project basics", "Your details", "Best time"].map((label, index) => {
              const current = index + 1;
              return (
                <div key={label} className={cn("rounded-sm border p-3 text-sm font-semibold", step >= current ? "border-mcb-terracotta bg-mcb-terracotta text-white" : "border-stone-200 bg-stone-50 text-stone-500")}>
                  {current}. {label}
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-7">
                <InputField icon={<MapPin />} label="Suburb or postcode" name="suburb" value={formData.suburb} onChange={handleChange} placeholder="Preston, VIC" required />

                <div>
                  <label className="mb-3 block text-sm font-bold text-mcb-charcoal">What products are you interested in?</label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {quoteProductOptions.map((product) => (
                      <button
                        key={product}
                        type="button"
                        onClick={() => handleProductToggle(product)}
                        className={cn(
                          "min-h-12 rounded-sm border px-3 py-3 text-sm font-semibold transition-all",
                          formData.products.includes(product)
                            ? "border-mcb-charcoal bg-mcb-charcoal text-white"
                            : "border-stone-200 bg-white text-stone-600 hover:border-mcb-terracotta"
                        )}
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-mcb-charcoal">How many windows or doors?</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {windowOptions.map((option) => (
                      <label key={option} className={cn("cursor-pointer rounded-sm border p-3 text-center text-sm font-semibold", formData.windowCount === option ? "border-mcb-terracotta bg-mcb-paper text-mcb-charcoal" : "border-stone-200 text-stone-600")}>
                        <input type="radio" name="windowCount" value={option} checked={formData.windowCount === option} onChange={handleChange} className="sr-only" />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <InputField icon={<User />} label="First name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required />
                  <InputField icon={<User />} label="Last name (optional)" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <InputField icon={<Phone />} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0400 000 000" required />
                  <InputField icon={<Mail />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" required />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <SelectField icon={<Clock />} label="Best time to contact" name="bestContactTime" value={formData.bestContactTime} onChange={handleChange} options={contactTimes} />
                  <SelectField icon={<CalendarDays />} label="Project stage" name="projectStage" value={formData.projectStage} onChange={handleChange} options={projectStages} />
                </div>
                <InputField icon={<CalendarDays />} label="Preferred appointment day/time (optional)" name="appointmentPreference" value={formData.appointmentPreference} onChange={handleChange} placeholder="e.g. Friday afternoon or Saturday morning" />
                <div>
                  <label className="mb-2 block text-sm font-bold text-mcb-charcoal">Message or questions</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about rooms, light, privacy, heat, security or anything you are unsure about."
                      className="min-h-32 w-full rounded-sm border border-stone-200 bg-white py-3 pl-12 pr-4 text-stone-700 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
                    />
                  </div>
                </div>
                <div className="rounded-sm border border-dashed border-stone-300 bg-stone-50 p-4 text-sm leading-relaxed text-stone-500">
                  Have plans or photos? Mention that in your message for now. A secure upload option is listed for the next backend upgrade.
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:justify-between">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((current) => current - 1)} className="inline-flex items-center justify-center gap-2 rounded-sm border border-stone-200 px-5 py-3 font-bold text-mcb-charcoal">
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : <span />}

              {step < 3 ? (
                <button
                  type="button"
                  disabled={!canContinue}
                  onClick={handleContinue}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-6 py-3 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-6 py-3 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Sending..." : "Request My Free Measure & Quote"}
                </button>
              )}
            </div>

            {status === "error" && (
              <p className="rounded-sm bg-red-50 p-4 text-center text-sm font-medium text-red-700">
                Something went wrong. Please call {SITE.phoneDisplay} and we can help right away.
              </p>
            )}
          </form>
        </div>

        <aside className="space-y-5">
          <div className="rounded-sm bg-mcb-charcoal p-7 text-white shadow-xl">
            <h2 className="mb-4 font-serif text-3xl">What happens next?</h2>
            <div className="space-y-5">
              {[
                "We contact you within 24 business hours.",
                "We bring samples and measure your windows or doors.",
                "You receive a clear written quote before anything is ordered.",
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-mcb-clay-light" />
                  <p className="leading-relaxed text-stone-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-stone-200 bg-white p-7 shadow-sm">
            <ShieldCheck className="mb-4 h-8 w-8 text-mcb-terracotta" />
            <h3 className="mb-3 font-serif text-2xl text-mcb-charcoal">No pressure. Just clear advice.</h3>
            <p className="mb-5 leading-relaxed text-stone-500">
              Not sure what you need? That is exactly what the free measure and quote is for. We will show suitable samples and explain your options.
            </p>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-2 font-bold text-mcb-terracotta">
              <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}

function getQuoteTrackingPayload(formData: QuoteFormData) {
  return {
    selected_product_count: formData.products.length,
    needs_advice: formData.needsAdvice,
    has_window_count: Boolean(formData.windowCount),
    has_suburb: Boolean(formData.suburb.trim()),
    has_email: Boolean(formData.email.trim()),
    has_phone: Boolean(formData.phone.trim()),
    has_appointment_preference: Boolean(formData.appointmentPreference.trim()),
    has_message: Boolean(formData.message.trim()),
    best_contact_time_selected: Boolean(formData.bestContactTime),
    project_stage_selected: Boolean(formData.projectStage),
  };
}

function getInitialProduct(productParam: string | null) {
  if (!productParam) return "";
  const decoded = decodeURIComponent(productParam).replace(/\+/g, " ");
  const matched = quoteProductOptions.find((option) => option.toLowerCase() === decoded.toLowerCase());
  if (matched) return matched;
  return decoded.toLowerCase().includes("unsure") ? "Unsure / Need Advice" : decoded;
}

function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-mcb-charcoal">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-sm border border-stone-200 bg-white py-3 pl-12 pr-4 text-stone-700 outline-none transition placeholder:text-stone-300 focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-mcb-charcoal">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400">{icon}</div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-sm border border-stone-200 bg-white py-3 pl-12 pr-4 text-stone-700 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
