"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, Info, Mail, MapPin, MessageSquare, Phone, ShieldCheck, Star, User } from "lucide-react";
import {
  quoteProductCategories,
  resolveProductCategoryFromDeepLink,
  type QuoteProductCategory,
} from "@/lib/cro-data";
import { CURATED_REVIEWS, REVIEW_AGGREGATE } from "@/lib/customer-reviews";
import { SITE } from "@/lib/site";
import { getClientTrackingContext, trackEvent } from "@/lib/analytics";
import { hashUserData } from "@/lib/conversion-hashing";
import { classifySuburbInput, extractPostcode } from "@/lib/postcodes";
import { cn } from "@/lib/utils";

const NEEDS_ADVICE_CATEGORY: QuoteProductCategory = "Not sure — need advice";

// Per-lead conversion value sent to Google Ads.
//   Avg sale A$4,717 × 25% close rate = A$1,179
// Smart Bidding (Max Conversion Value @ 1500% target ROAS) needs this signal
// to compare clicks. If you change this, also update the Call Leads action
// in Google Ads so call and form leads carry the same value.
const LEAD_CONVERSION_VALUE_AUD = 1179;

const windowOptions = ["1-5", "5-10", "10-20", "20+"];
const contactTimes = ["Morning", "Afternoon", "Evening", "Anytime"];
const projectStages = ["Ready to book", "Comparing options", "Building or renovating", "Just need advice"];
const referralOptions = [
  "Google Search",
  "AI search (ChatGPT, Gemini, Claude, etc.)",
  "Facebook or Instagram",
  "Friend or family referral",
  "Repeat customer",
  "Card or brochure left for me",
  "Local advertising",
  "Other",
];
const referralRequiresName = new Set(["Friend or family referral", "Repeat customer"]);

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
  referral: string;
  referrerName: string;
};

export default function QuoteForm({ initialProductParam }: { initialProductParam?: string } = {}) {
  const initialCategory = resolveProductCategoryFromDeepLink(initialProductParam);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const trackedSectionsRef = useRef<{ s1: boolean; s2: boolean }>({ s1: false, s2: false });
  const trackedOutOfAreaRef = useRef(false);
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    suburb: "",
    products: initialCategory ? [initialCategory] : [],
    windowCount: "",
    bestContactTime: "",
    appointmentPreference: "",
    projectStage: "",
    needsAdvice: initialCategory === NEEDS_ADVICE_CATEGORY,
    message: "",
    referral: "",
    referrerName: "",
  });

  const section1Valid = useMemo(() =>
    formData.suburb.trim().length > 1 &&
    formData.products.length > 0 &&
    Boolean(formData.windowCount),
  [formData.suburb, formData.products, formData.windowCount]);

  const suburbVicStatus = useMemo(
    () => classifySuburbInput(formData.suburb),
    [formData.suburb]
  );
  const showOutOfAreaWarning = suburbVicStatus === "out";

  // Fire `quote_out_of_area_warning` at most once per session, the first time the
  // user's suburb input resolves to a non-VIC postcode. Soft signal — submission
  // is not blocked.
  useEffect(() => {
    if (!showOutOfAreaWarning) return;
    if (trackedOutOfAreaRef.current) return;
    trackedOutOfAreaRef.current = true;
    trackEvent("quote_out_of_area_warning", {
      postcode: extractPostcode(formData.suburb) || "",
      raw_suburb: formData.suburb.slice(0, 80),
    });
  }, [showOutOfAreaWarning, formData.suburb]);

  const section2Valid = useMemo(() =>
    section1Valid &&
    formData.firstName.trim().length > 1 &&
    formData.phone.trim().length > 5 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()),
  [section1Valid, formData.firstName, formData.phone, formData.email]);

  const referralComplete = useMemo(() => {
    if (!formData.referral) return false;
    if (referralRequiresName.has(formData.referral)) {
      return formData.referrerName.trim().length > 1;
    }
    return true;
  }, [formData.referral, formData.referrerName]);

  const section3Valid = useMemo(() =>
    section2Valid &&
    Boolean(formData.bestContactTime) &&
    Boolean(formData.projectStage) &&
    referralComplete,
  [section2Valid, formData.bestContactTime, formData.projectStage, referralComplete]);

  const allValid = section3Valid;

  useEffect(() => {
    if (section1Valid && !trackedSectionsRef.current.s1) {
      trackedSectionsRef.current.s1 = true;
      trackEvent("quote_step_1_complete", getQuoteTrackingPayload(formData));
    }
  }, [section1Valid, formData]);

  useEffect(() => {
    if (section2Valid && !trackedSectionsRef.current.s2) {
      trackedSectionsRef.current.s2 = true;
      trackEvent("quote_step_2_complete", getQuoteTrackingPayload(formData));
    }
  }, [section2Valid, formData]);

  const handleProductToggle = (product: string) => {
    trackFormStart();
    setFormData((prev) => {
      const selected = prev.products.includes(product)
        ? prev.products.filter((item) => item !== product)
        : [...prev.products, product];
      return {
        ...prev,
        products: selected,
        needsAdvice: selected.includes(NEEDS_ADVICE_CATEGORY),
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
      has_product_context: Boolean(initialCategory),
    });
  };

  // Block Enter from submitting from any input/select. Textarea keeps natural newline behaviour.
  const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return;
    const target = event.target as HTMLElement;
    if (target.tagName === "TEXTAREA") return;
    if (target instanceof HTMLButtonElement && target.type === "submit") return;
    event.preventDefault();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Only the explicit submit button can submit. Anything else (e.g. an unexpected
    // keyboard path) is rejected. The submit button is also disabled until allValid.
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    if (!submitter || submitter.dataset.role !== "quote-submit") return;
    if (!allValid) {
      reportMissingFields(formData, section1Valid, section2Valid, referralComplete);
      return;
    }

    setStatus("loading");
    trackEvent("quote_step_3_submit", getQuoteTrackingPayload(formData));

    const trackingContext = getClientTrackingContext();
    const gclid = trackingContext.gclid || "";

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "quote_form",
          gclid,
          trackingContext,
          suburbVicStatus,
        }),
      });

      if (res.ok) {
        // Enhanced Conversions: hash PII client-side and attach to quote_success.
        // Hashing happens off the critical path — if it errors, fire the event
        // without ec_* fields and let GA4/Ads still record the conversion.
        let ecData = {};
        try {
          ecData = await hashUserData({
            email: formData.email,
            phone: formData.phone,
            firstName: formData.firstName,
            lastName: formData.lastName,
          });
        } catch (hashError) {
          console.error("Enhanced Conversion hashing failed:", hashError);
        }
        trackEvent("quote_success", {
          ...getQuoteTrackingPayload(formData),
          value: LEAD_CONVERSION_VALUE_AUD,
          currency: "AUD",
          gclid: gclid || undefined,
          ...ecData,
        });
        setStatus("success");
      } else {
        trackEvent("quote_error", getQuoteTrackingPayload(formData));
        setStatus("error");
      }
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
          <h1 className="mb-4 font-serif text-4xl text-mcb-charcoal">Thank You, {formData.firstName || "there"}.</h1>
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
          <div className="mb-6">
            <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-mcb-terracotta">Free in-home measure</span>
            <h1 className="mb-4 font-serif text-4xl text-mcb-charcoal md:text-5xl">Book Your Free In-Home Measure & Quote</h1>
            <p className="max-w-3xl text-lg leading-relaxed text-stone-500">
              <strong className="text-mcb-charcoal">Takes about 60 seconds.</strong> We&apos;ll call within 24 business hours to book a time that suits — no obligation, samples brought to you.
            </p>
          </div>

          {/* Mobile-only trust strip — desktop has the right sidebar for this */}
          <div className="mb-8 grid grid-cols-3 gap-2 rounded-sm border border-stone-200 bg-white p-3 text-center text-xs leading-tight text-stone-600 lg:hidden">
            <div>
              <Star className="mx-auto mb-1 h-4 w-4 fill-mcb-terracotta text-mcb-terracotta" aria-hidden />
              <span className="font-bold text-mcb-charcoal">{REVIEW_AGGREGATE.rating.toFixed(1)}/5</span> from {REVIEW_AGGREGATE.count} Google reviews
            </div>
            <div>
              <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-mcb-terracotta" aria-hidden />
              Family-owned in Melbourne
            </div>
            <div>
              <Check className="mx-auto mb-1 h-4 w-4 text-mcb-terracotta" aria-hidden />
              Free &amp; no obligation
            </div>
          </div>

          <div className="mb-8 grid gap-3 sm:grid-cols-3">
            <SectionMarker number={1} label="Project basics" complete={section1Valid} active />
            <SectionMarker number={2} label="Your details" complete={section2Valid} active={section1Valid} />
            <SectionMarker number={3} label="Best time" complete={section3Valid} active={section2Valid} />
          </div>

          <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="space-y-10">
            <SectionPanel title="1. Project basics" complete={section1Valid} open>
              <div className="space-y-7">
                <div>
                  <InputField
                    icon={<MapPin />}
                    label="Suburb or postcode"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleChange}
                    placeholder="e.g. 3072 or Preston"
                    autoComplete="postal-code"
                    inputMode="text"
                    enterKeyHint="next"
                    required
                  />
                  {showOutOfAreaWarning && (
                    <div
                      role="status"
                      className="mt-3 flex items-start gap-3 rounded-sm border border-sky-200 bg-sky-50 p-3 text-sm leading-relaxed text-sky-900"
                    >
                      <Info className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
                      <span>
                        We mainly cover Victoria — if you&apos;re nearby, send your details anyway and we&apos;ll let you know if we can help. If you typed the wrong postcode, just edit it above.
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-mcb-charcoal">
                    What are you looking for?
                    <span className="ml-1 text-mcb-terracotta">*</span>
                  </label>
                  <p className="mb-3 text-sm text-stone-500">
                    Don&apos;t worry about specifics — we&apos;ll work out the right products together at the free visit.
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {quoteProductCategories.map((product) => (
                      <button
                        key={product}
                        type="button"
                        onClick={() => handleProductToggle(product)}
                        aria-pressed={formData.products.includes(product)}
                        className={cn(
                          "min-h-14 rounded-sm border px-3 py-3 text-sm font-semibold transition-all",
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
                  <label className="mb-1 block text-sm font-bold text-mcb-charcoal">
                    How many windows or doors?
                    <span className="ml-1 text-mcb-terracotta">*</span>
                  </label>
                  <p className="mb-3 text-sm text-stone-500">
                    Rough estimate is fine — we&apos;ll measure exactly when we visit.
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {windowOptions.map((option) => (
                      <label key={option} className={cn("cursor-pointer rounded-sm border p-3 text-center text-sm font-semibold", formData.windowCount === option ? "border-mcb-terracotta bg-mcb-paper text-mcb-charcoal" : "border-stone-200 text-stone-600")}>
                        <input type="radio" name="windowCount" value={option} checked={formData.windowCount === option} onChange={handleChange} className="sr-only" required />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SectionPanel>

            <div>
              <SectionPanel title="2. Your details" complete={section2Valid} open={section1Valid}>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputField icon={<User />} label="First name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" autoComplete="given-name" enterKeyHint="next" required />
                    <InputField icon={<User />} label="Last name (optional)" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith" autoComplete="family-name" enterKeyHint="next" />
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <InputField icon={<Phone />} label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0400 000 000" autoComplete="tel" inputMode="tel" enterKeyHint="next" required />
                    <InputField icon={<Mail />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" autoComplete="email" inputMode="email" enterKeyHint="next" required />
                  </div>
                  <p className="text-xs text-stone-500">
                    We&apos;ll call once to book your visit. No marketing calls or spam emails.
                  </p>
                </div>
              </SectionPanel>
            </div>

            <div>
              <SectionPanel title="3. Best time & a few last details" complete={section3Valid} open={section2Valid}>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <SelectField icon={<Clock />} label="Best time to contact" name="bestContactTime" value={formData.bestContactTime} onChange={handleChange} options={contactTimes} required />
                    <SelectField icon={<CalendarDays />} label="Project stage" name="projectStage" value={formData.projectStage} onChange={handleChange} options={projectStages} required />
                  </div>
                  <SelectField
                    icon={<MessageSquare />}
                    label="Where did you hear about us?"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    options={referralOptions}
                    required
                  />
                  {referralRequiresName.has(formData.referral) && (
                    <InputField
                      icon={<User />}
                      label={formData.referral === "Repeat customer" ? "Which family member or address was the original job?" : "Who referred you? (so we can thank them)"}
                      name="referrerName"
                      value={formData.referrerName}
                      onChange={handleChange}
                      placeholder={formData.referral === "Repeat customer" ? "e.g. Smith family, 12 Example St" : "e.g. Sarah Jones"}
                      required
                    />
                  )}
                  <InputField icon={<CalendarDays />} label="Preferred appointment day/time (optional)" name="appointmentPreference" value={formData.appointmentPreference} onChange={handleChange} placeholder="e.g. Friday afternoon or Saturday morning" />
                  <div>
                    <label className="mb-2 block text-sm font-bold text-mcb-charcoal">
                      Message or questions (optional)
                    </label>
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
              </SectionPanel>
            </div>

            <div className="border-t border-stone-100 pt-6">
              <button
                type="submit"
                data-role="quote-submit"
                disabled={status === "loading" || !allValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-6 py-4 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {status === "loading" ? "Sending..." : "Request My Free Measure & Quote"}
              </button>
            </div>

            {status === "error" && (
              <p className="rounded-sm bg-red-50 p-4 text-center text-sm font-medium text-red-700">
                Something went wrong. Please call {SITE.phoneDisplay} and we can help right away.
              </p>
            )}
          </form>
        </div>

        <aside className="space-y-5">
          <TrustCard />
          <div className="rounded-sm bg-mcb-charcoal p-7 text-white shadow-xl">
            <h2 className="mb-4 font-serif text-3xl">What Happens Next?</h2>
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

function TrustCard() {
  // Highest-signal short review for the conversion page.
  // If you want to feature a different one, change the index — the source of
  // truth is CURATED_REVIEWS in src/lib/customer-reviews.ts.
  const featured = CURATED_REVIEWS[1];
  const snippet = featured.text.length > 200
    ? `${featured.text.slice(0, 197).trimEnd()}…`
    : featured.text;

  return (
    <div className="rounded-sm border border-mcb-terracotta/30 bg-mcb-paper p-7 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className="h-5 w-5 fill-mcb-terracotta text-mcb-terracotta"
            />
          ))}
        </div>
        <span className="text-sm font-bold text-mcb-charcoal">
          {REVIEW_AGGREGATE.rating.toFixed(1)} from {REVIEW_AGGREGATE.count} Google reviews
        </span>
      </div>
      <blockquote className="mb-4 leading-relaxed text-stone-700">
        &ldquo;{snippet}&rdquo;
      </blockquote>
      <p className="text-sm font-semibold text-mcb-charcoal">— {featured.author}</p>
      <Link
        href="/#google-reviews"
        className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-mcb-terracotta transition-colors hover:text-mcb-charcoal"
      >
        Read more reviews
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SectionMarker({ number, label, complete, active }: { number: number; label: string; complete: boolean; active: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-sm border p-3 text-sm font-semibold transition-colors",
        complete
          ? "border-mcb-terracotta bg-mcb-terracotta text-white"
          : active
          ? "border-mcb-terracotta bg-white text-mcb-terracotta"
          : "border-stone-200 bg-stone-50 text-stone-400"
      )}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">
        {complete ? <Check className="h-3 w-3" /> : number}
      </span>
      {label}
    </div>
  );
}

function SectionPanel({ title, complete, open, children }: { title: string; complete: boolean; open: boolean; children: React.ReactNode }) {
  return (
    <section
      aria-hidden={!open}
      className={cn(
        "overflow-hidden rounded-sm border transition-all duration-300",
        open ? "border-stone-200 bg-white" : "border-dashed border-stone-200 bg-stone-50"
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-3">
        <h2 className="font-serif text-lg text-mcb-charcoal">{title}</h2>
        {complete && (
          <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-600">
            <Check className="h-4 w-4" /> Done
          </span>
        )}
      </header>
      {open ? (
        <div className="p-5 md:p-6">{children}</div>
      ) : (
        <div className="px-5 py-6 text-sm text-stone-400">Complete the section above to continue.</div>
      )}
    </section>
  );
}

function reportMissingFields(
  formData: QuoteFormData,
  section1Valid: boolean,
  section2Valid: boolean,
  referralComplete: boolean,
) {
  const missing: string[] = [];
  if (formData.suburb.trim().length <= 1) missing.push("suburb");
  if (formData.products.length === 0) missing.push("products");
  if (!formData.windowCount) missing.push("windowCount");
  if (formData.firstName.trim().length <= 1) missing.push("firstName");
  if (formData.phone.trim().length <= 5) missing.push("phone");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) missing.push("email");
  if (!formData.bestContactTime) missing.push("bestContactTime");
  if (!formData.projectStage) missing.push("projectStage");
  if (!referralComplete) missing.push("referral");

  const step = !section1Valid ? 1 : !section2Valid ? 2 : 3;
  trackEvent("quote_field_error", {
    step,
    missing_fields: missing.join(","),
    missing_count: missing.length,
  });
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
    referral: formData.referral || "(not set)",
    has_referrer_name: Boolean(formData.referrerName.trim()),
  };
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
  autoComplete,
  inputMode,
  enterKeyHint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: React.HTMLAttributes<HTMLInputElement>["enterKeyHint"];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-mcb-charcoal">
        {label}
        {required && <span className="ml-1 text-mcb-terracotta">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400">{icon}</div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
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
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  icon: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-mcb-charcoal">
        {label}
        {required && <span className="ml-1 text-mcb-terracotta">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400">{icon}</div>
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
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
