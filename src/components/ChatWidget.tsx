"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  ChevronRight,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { quoteHref, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type LeadStatus = "idle" | "loading" | "success" | "error";

type LeadForm = {
  name: string;
  phone: string;
  suburb: string;
  message: string;
};

const interestOptions = [
  "Unsure / Need Advice",
  "Curtains",
  "Blinds",
  "Shutters",
  "Security Doors",
  "Fly Screens",
  "Outdoor Blinds",
  "Motorisation",
];

const pathInterestMap: Array<[string, string]> = [
  ["sheer", "Sheer Curtains"],
  ["blockout-curtains", "Blockout Curtains"],
  ["s-fold", "S-Fold Curtains"],
  ["curtains", "Curtains"],
  ["roller-blinds", "Roller Blinds"],
  ["blockout-blinds", "Blockout Blinds"],
  ["sunscreen-blinds", "Sunscreen Blinds"],
  ["double-roller", "Double Roller Blinds"],
  ["honeycomb", "Honeycomb Blinds"],
  ["venetian", "Venetian Blinds"],
  ["roman", "Roman Blinds"],
  ["vertical", "Vertical Blinds"],
  ["panel-glide", "Panel Glide Blinds"],
  ["cassette", "Cassette Blinds"],
  ["skylight", "Skylight Blinds"],
  ["veri-shades", "Veri Shades"],
  ["blinds", "Blinds"],
  ["plantation-shutters", "Plantation Shutters"],
  ["roller-shutters", "Roller Shutters"],
  ["shutters", "Shutters"],
  ["security-doors", "Security Doors"],
  ["fly-screens", "Fly Screens"],
  ["security", "Security Doors"],
  ["zipscreens", "Zipscreens"],
  ["awnings", "Outdoor Blinds"],
  ["motorisation", "Motorisation"],
];

const quickPrompts = [
  {
    label: "Help me choose",
    icon: HelpCircle,
    interest: "Unsure / Need Advice",
    message: "I need advice choosing the right product for light, privacy, heat or security.",
  },
  {
    label: "Ask about Payright",
    icon: CreditCard,
    interest: "Unsure / Need Advice",
    message: "I would like to ask about Payright payment options for my measure and quote.",
  },
];

export function ChatWidget() {
  const pathname = usePathname();
  const pageInterest = useMemo(() => getInterestFromPath(pathname), [pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState(pageInterest || "Unsure / Need Advice");
  const [hasCustomInterest, setHasCustomInterest] = useState(false);
  const [lead, setLead] = useState<LeadForm>({
    name: "",
    phone: "",
    suburb: "",
    message: "",
  });
  const [status, setStatus] = useState<LeadStatus>("idle");

  useEffect(() => {
    if (!hasCustomInterest && pageInterest) {
      setSelectedInterest(pageInterest);
    }
  }, [hasCustomInterest, pageInterest]);

  if (pathname?.startsWith("/quote")) return null;

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    trackEvent(nextOpen ? "chat_widget_open" : "chat_widget_close", {
      page_path: pathname,
      page_interest: pageInterest,
    });
  };

  const handlePrompt = (interest: string, message: string, label: string) => {
    setSelectedInterest(interest);
    setHasCustomInterest(true);
    setLead((current) => ({ ...current, message }));
    setStatus("idle");
    trackEvent("chat_quick_action", {
      action: label,
      product_interest: interest,
      page_path: pathname,
    });
  };

  const handleChange = (field: keyof LeadForm, value: string) => {
    setLead((current) => ({ ...current, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lead.name.trim() || !lead.phone.trim()) return;

    const { firstName, lastName } = splitName(lead.name);
    const payload = {
      firstName,
      lastName,
      email: "",
      phone: lead.phone.trim(),
      suburb: lead.suburb.trim(),
      products: [selectedInterest],
      windowCount: "",
      bestContactTime: "Anytime",
      appointmentPreference: "",
      projectStage: "Just need advice",
      needsAdvice: selectedInterest === "Unsure / Need Advice",
      message: [
        "Quick callback request from the website assistant.",
        `Interest: ${selectedInterest}.`,
        lead.message.trim(),
      ].filter(Boolean).join(" "),
    };

    setStatus("loading");
    trackEvent("chat_lead_submit", {
      product_interest: selectedInterest,
      has_suburb: Boolean(lead.suburb.trim()),
      has_message: Boolean(lead.message.trim()),
      page_path: pathname,
    });

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Quote request failed");
      setStatus("success");
      trackEvent("chat_lead_success", {
        product_interest: selectedInterest,
        page_path: pathname,
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
      trackEvent("chat_lead_error", {
        product_interest: selectedInterest,
        page_path: pathname,
      });
    }
  };

  return (
    <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-3 z-50 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Modern Curtains and Blinds quote assistant"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-[calc(100vw-1.5rem)] max-w-[390px] overflow-hidden rounded-sm border border-stone-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-mcb-charcoal px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/10">
                  <MessageCircle className="h-5 w-5 text-mcb-clay-light" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider">Quote assistant</h2>
                  <p className="text-xs text-stone-300">Free measure and product help</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close quote assistant"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-15rem)] overflow-y-auto bg-mcb-paper p-4 lg:max-h-[640px]">
              <div className="rounded-sm border border-stone-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-mcb-terracotta" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-mcb-charcoal">Need a quick answer before booking?</p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-500">
                      Choose a prompt, request a callback, or go straight to the full free in-home measure and quote form.
                    </p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Link
                    href={quoteHref(pageInterest || selectedInterest)}
                    onClick={() => trackEvent("chat_quote_click", { product_interest: pageInterest || selectedInterest, page_path: pathname })}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal"
                  >
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Book measure
                  </Link>
                  <a
                    href={SITE.phoneHref}
                    onClick={() => trackEvent("chat_phone_click", { page_path: pathname })}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-stone-300 bg-white px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:border-mcb-charcoal"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {SITE.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {quickPrompts.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => handlePrompt(prompt.interest, prompt.message, prompt.label)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:border-mcb-terracotta hover:text-mcb-terracotta"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {prompt.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="mt-3 rounded-sm border border-stone-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-mcb-terracotta">Request a callback</p>
                    <p className="mt-1 text-sm text-stone-500">Name and phone are enough to start.</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-stone-300" aria-hidden="true" />
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="chat-interest" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                      Product interest
                    </label>
                    <select
                      id="chat-interest"
                      value={selectedInterest}
                      onChange={(event) => {
                        setSelectedInterest(event.target.value);
                        setHasCustomInterest(true);
                      }}
                      className="h-11 w-full rounded-sm border border-stone-200 bg-white px-3 text-sm font-medium text-mcb-charcoal outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
                    >
                      {interestOptions.map((interest) => (
                        <option key={interest} value={interest}>{interest}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField
                      id="chat-name"
                      label="Name"
                      value={lead.name}
                      onChange={(value) => handleChange("name", value)}
                      autoComplete="name"
                      required
                    />
                    <TextField
                      id="chat-phone"
                      label="Phone"
                      type="tel"
                      value={lead.phone}
                      onChange={(value) => handleChange("phone", value)}
                      autoComplete="tel"
                      required
                    />
                  </div>

                  <TextField
                    id="chat-suburb"
                    label="Suburb"
                    value={lead.suburb}
                    onChange={(value) => handleChange("suburb", value)}
                    autoComplete="address-level2"
                  />

                  <div>
                    <label htmlFor="chat-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                      Message
                    </label>
                    <textarea
                      id="chat-message"
                      value={lead.message}
                      onChange={(event) => handleChange("message", event.target.value)}
                      placeholder="Tell us what room, product or problem you need help with."
                      className="min-h-20 w-full rounded-sm border border-stone-200 bg-white px-3 py-2 text-sm text-mcb-charcoal outline-none transition placeholder:text-stone-400 focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading" || !lead.name.trim() || !lead.phone.trim()}
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-mcb-charcoal px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-terracotta disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {status === "loading" ? "Sending..." : "Send callback request"}
                  </button>

                  {status === "success" && (
                    <p className="rounded-sm bg-green-50 p-3 text-sm font-medium leading-relaxed text-green-800">
                      Thanks. We have received your request and will contact you within 24 business hours.
                    </p>
                  )}

                  {status === "error" && (
                    <p className="rounded-sm bg-red-50 p-3 text-sm font-medium leading-relaxed text-red-700">
                      The request did not send. Please call {SITE.phoneDisplay} and we can help right away.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleToggle}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-colors focus:outline-none focus:ring-4 focus:ring-mcb-clay/40",
          isOpen ? "bg-mcb-charcoal" : "bg-mcb-terracotta hover:bg-mcb-charcoal"
        )}
        aria-label={isOpen ? "Close quote assistant" : "Open quote assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </motion.button>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="h-11 w-full rounded-sm border border-stone-200 bg-white px-3 text-sm text-mcb-charcoal outline-none transition placeholder:text-stone-400 focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
      />
    </div>
  );
}

function getInterestFromPath(pathname: string | null) {
  if (!pathname) return "";
  const normalized = pathname.toLowerCase();
  const match = pathInterestMap.find(([pathPart]) => normalized.includes(pathPart));
  return match?.[1] || "";
}

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "Website";
  return {
    firstName,
    lastName: parts.join(" "),
  };
}
