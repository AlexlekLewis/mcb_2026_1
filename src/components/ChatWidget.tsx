"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Bot,
  CalendarCheck,
  ChevronDown,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getClientTrackingContext, trackEvent } from "@/lib/analytics";
import { quoteHref, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type LeadStatus = "idle" | "loading" | "success" | "error";
type MessageRole = "assistant" | "user";

type ChatMessage = {
  role: MessageRole;
  content: string;
};

type LeadForm = {
  name: string;
  phone: string;
  suburb: string;
  message: string;
};

type SuggestedQuestion = {
  label: string;
  question: string;
};

const interestOptions = [
  "Unsure / Need Advice",
  "Curtains",
  "Blinds",
  "Shutters",
  "Security Doors",
  "Fly Screens",
  "Pet Mesh",
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
  ["soft-vertical-drapes", "Soft Vertical Drapes"],
  ["blinds", "Blinds"],
  ["plantation-shutters", "Plantation Shutters"],
  ["roller-shutters", "Roller Shutters"],
  ["shutters", "Shutters"],
  ["security-doors", "Security Doors"],
  ["fly-screens", "Fly Screens"],
  ["pet-mesh", "Pet Mesh"],
  ["security", "Security Doors"],
  ["zipscreens", "Zipscreens"],
  ["outdoor-blinds", "Outdoor Blinds"],
  ["folding-arm-awnings", "Folding Arm Awnings"],
  ["window-awnings", "Window Awnings"],
  ["awnings", "Outdoor Blinds"],
  ["motorisation", "Motorisation"],
];

const suggestedQuestions: SuggestedQuestion[] = [
  { label: "Help me choose", question: "Which product should I choose for my room?" },
  { label: "Price", question: "How much will this cost?" },
  { label: "Availability", question: "When can you come out to measure?" },
  { label: "Warranty", question: "What warranty do you offer?" },
  { label: "Showroom", question: "Do you have a showroom?" },
  { label: "Repairs", question: "Do you do repairs or replacement parts?" },
];

const initialMessage =
  "Hi, I can help with product choice, pricing, appointments, warranty, finance and what happens during a free in-home measure. Ask a question or choose one below.";

export function ChatWidget() {
  const pathname = usePathname();
  const pageInterest = useMemo(() => getInterestFromPath(pathname), [pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: initialMessage },
  ]);
  const [selectedInterest, setSelectedInterest] = useState(pageInterest || "Unsure / Need Advice");
  const [hasCustomInterest, setHasCustomInterest] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
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

  if (pathname?.startsWith("/quote") || pathname?.startsWith("/dashboard")) return null;

  const handleToggle = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    trackEvent(nextOpen ? "chat_widget_open" : "chat_widget_close", {
      page_path: pathname,
      page_interest: pageInterest,
    });
  };

  const handleAsk = (question: string, source: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const answer = getAssistantAnswer(trimmed, pageInterest || selectedInterest);
    setMessages((current) => [
      ...current,
      { role: "user", content: trimmed },
      { role: "assistant", content: answer },
    ]);
    setInputValue("");
    trackEvent("chat_question_answered", {
      source,
      product_interest: pageInterest || selectedInterest,
      question_topic: getQuestionTopic(trimmed),
      page_path: pathname,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAsk(inputValue, "typed");
  };

  const handleLeadSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      source: "chat_widget",
      trackingContext: getClientTrackingContext(),
      message: [
        "Quick callback request from the website chat assistant.",
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

  const handleLeadChange = (field: keyof LeadForm, value: string) => {
    setLead((current) => ({ ...current, [field]: value }));
    if (status !== "idle") setStatus("idle");
  };

  return (
    <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-3 z-50 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-label="Modern Curtains and Blinds chat assistant"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="w-[calc(100vw-1.5rem)] max-w-[410px] overflow-hidden rounded-sm border border-stone-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-mcb-charcoal px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white/10">
                  <MessageCircle className="h-5 w-5 text-mcb-clay-light" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider">MCB chat assistant</h2>
                  <p className="text-xs text-stone-300">Answers, then a clear next step</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-sm text-stone-300 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close chat assistant"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="max-h-[calc(100vh-19rem)] overflow-y-auto bg-mcb-paper p-4 lg:max-h-[640px]">
              <div className="space-y-3" aria-live="polite">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={cn(
                      "flex gap-2",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-mcb-charcoal text-white">
                        <Bot className="h-4 w-4" aria-hidden="true" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[86%] whitespace-pre-line rounded-sm px-3 py-2 text-sm leading-relaxed shadow-sm",
                        message.role === "user"
                          ? "bg-mcb-terracotta text-white"
                          : "border border-stone-200 bg-white text-stone-700"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {suggestedQuestions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleAsk(item.question, "suggested")}
                    className="min-h-10 rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-mcb-charcoal transition-colors hover:border-mcb-terracotta hover:text-mcb-terracotta"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-sm border border-stone-200 bg-white p-3 shadow-sm">
                <div className="grid gap-2">
                  <Link
                    href={quoteHref(pageInterest || selectedInterest)}
                    onClick={() => trackEvent("chat_quote_click", { product_interest: pageInterest || selectedInterest, page_path: pathname })}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal"
                  >
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Book free measure
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

              <button
                type="button"
                onClick={() => {
                  setShowCallback((current) => !current);
                  trackEvent("chat_callback_toggle", { page_path: pathname });
                }}
                className="mt-3 flex w-full items-center justify-between rounded-sm border border-stone-200 bg-white px-4 py-3 text-left shadow-sm"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-mcb-terracotta">Prefer a callback?</span>
                  <span className="mt-1 block text-sm text-stone-500">Leave name and phone only.</span>
                </span>
                <ChevronDown className={cn("h-5 w-5 text-stone-400 transition-transform", showCallback && "rotate-180")} aria-hidden="true" />
              </button>

              <AnimatePresence initial={false}>
                {showCallback && (
                  <motion.form
                    onSubmit={handleLeadSubmit}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 rounded-sm border border-stone-200 bg-white p-4 shadow-sm">
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
                            onChange={(value) => handleLeadChange("name", value)}
                            autoComplete="name"
                            required
                          />
                          <TextField
                            id="chat-phone"
                            label="Phone"
                            type="tel"
                            value={lead.phone}
                            onChange={(value) => handleLeadChange("phone", value)}
                            autoComplete="tel"
                            required
                          />
                        </div>

                        <TextField
                          id="chat-suburb"
                          label="Suburb"
                          value={lead.suburb}
                          onChange={(value) => handleLeadChange("suburb", value)}
                          autoComplete="address-level2"
                        />

                        <div>
                          <label htmlFor="chat-message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                            Message
                          </label>
                          <textarea
                            id="chat-message"
                            value={lead.message}
                            onChange={(event) => handleLeadChange("message", event.target.value)}
                            placeholder="Optional. Tell us what room, product or problem you need help with."
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
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-stone-200 bg-white p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Ask about products, price, warranty..."
                  className="h-11 min-w-0 flex-1 rounded-sm border border-stone-200 bg-white px-3 text-sm text-mcb-charcoal outline-none transition placeholder:text-stone-400 focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
                  aria-label="Ask the chat assistant a question"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-mcb-terracotta text-white transition-colors hover:bg-mcb-charcoal disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send question"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </form>
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
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
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

function getAssistantAnswer(question: string, productContext: string) {
  const normalized = normalize(question);

  if (matches(normalized, ["price", "cost", "how much", "starting", "budget", "quote"])) {
    return "Because everything is custom measured, MCB does not give starting prices in chat. Size, fabric, hardware, operation, motorisation and installation details all change the final price.\n\nThe best next step is a free in-home measure and quote or a phone call. That way you get clear written pricing for your exact windows, not a rough number that changes later.";
  }

  if (matches(normalized, ["when", "availability", "appointment", "measure", "come out", "book", "open", "hours"])) {
    return "MCB aims to respond within 24 business hours. Measure appointments are very flexible Monday to Saturday, generally between 8am and 6pm, with no Sunday appointments.\n\nInstallation scheduling is typically Monday to Saturday, around 7am to 5pm. Exact product lead times depend on the product, fabric, supplier and order details, so the team confirms timing during your quote.";
  }

  if (matches(normalized, ["warranty", "guarantee", "fault", "defect", "claim"])) {
    return "Most MCB products carry a 5-year warranty against manufacturing defects in materials and workmanship. Motorisation is listed with a 3-year warranty on motors and components.\n\nWarranty does not usually cover misuse, alterations, normal wear and tear, environmental fading or warping, or issues reported outside the required claim process. Proof of purchase is needed and service fees may apply depending on timing and claim type.";
  }

  if (matches(normalized, ["payright", "finance", "payment plan", "interest free", "pay later"])) {
    return "Payright payment options can be discussed during your free in-home measure and quote. It is best handled once the product range, sizes and quote are clear.\n\nFinance is subject to Payright approval. Fees, terms and conditions apply.";
  }

  if (matches(normalized, ["showroom", "store", "visit", "samples", "in home", "home visit"])) {
    return "MCB does not operate as a showroom-first business. The service is built around in-home custom measuring and quoting.\n\nThat means samples come to your home, so you can compare colours, textures and finishes in the actual light of the room before choosing.";
  }

  if (matches(normalized, ["repair", "repairs", "replacement part", "parts", "fix", "re-measure", "remeasure"])) {
    return "MCB is mainly focused on new custom supply and installation. Repairs are generally only considered for MCB's own products and installs. Replacement parts are not offered as a general service.\n\nRe-measures are generally for existing MCB customers. For a new project, the best path is a free in-home measure and quote.";
  }

  if (matches(normalized, ["why", "different", "choose", "family", "trust", "better", "big companies", "number"])) {
    return "MCB is a family-run business, so the service is personal rather than volume-driven. The team brings samples to your home, measures carefully, gives practical advice and provides a clear written quote.\n\nThe difference is attention to detail: you are not treated like a number, and the recommendation is based on your rooms, light, privacy, budget and the way you live.";
  }

  if (matches(normalized, ["brand", "somfy", "automate", "ziptrak", "invisi", "crimsafe"])) {
    return "MCB can discuss approved brands such as Somfy, Automate, Ziptrak, Invisi-Gard and Crimsafe where they suit the product and project.\n\nThe best brand depends on the opening, product type, control style, budget and installation requirements, so the team confirms the right option during the measure.";
  }

  if (matches(normalized, ["service area", "suburb", "location", "preston", "melbourne", "near me"])) {
    return "MCB services Melbourne and surrounding suburbs through in-home measure and quote appointments. If you are unsure whether your suburb is covered, call or submit the quote form with your suburb and the team will confirm.";
  }

  if (matches(normalized, ["curtain", "blind", "shutter", "security", "fly", "screen", "awning", "zipscreen", "motor", "product", "room", "choose", "privacy", "light", "heat"])) {
    return getProductAdvice(productContext, normalized);
  }

  return "I can help with product choice, price expectations, appointment timing, warranty, Payright, service area, repairs and what happens during the free measure.\n\nFor a detailed answer about your exact windows, the best next step is to book the free in-home measure or call MCB so the team can ask the right follow-up questions.";
}

function getProductAdvice(productContext: string, normalizedQuestion: string) {
  const context = productContext || "Unsure / Need Advice";

  if (matches(normalizedQuestion, ["bedroom", "sleep", "dark", "darkness", "blockout", "night"])) {
    return "For bedrooms, nurseries and media rooms, start with blockout curtains, blockout roller blinds, double rollers or roller shutters. They give stronger privacy and light control.\n\nIf you still want softness during the day, a double curtain or double roller setup gives you a daytime layer plus night privacy.";
  }

  if (matches(normalizedQuestion, ["daytime", "glare", "view", "sunscreen", "sun", "uv"])) {
    return "For glare and daytime comfort, sunscreen blinds are usually the cleanest choice. They reduce glare and heat while preserving daytime view.\n\nImportant: sunscreen blinds are not night-privacy products when lights are on inside, so pair them with blockout blinds or curtains if the room is exposed at night.";
  }

  if (matches(normalizedQuestion, ["insulation", "energy", "cold", "heat", "thermal", "honeycomb"])) {
    return "For insulation, honeycomb blinds are a strong option because their cellular structure helps trap air. Curtains with the right fabric and lining can also help soften heat, cold and room acoustics.\n\nThe best answer depends on the window, sun exposure and how much light control you want.";
  }

  if (matches(normalizedQuestion, ["airflow", "tilt", "venetian", "plantation"])) {
    return "If you want airflow and adjustable privacy, Venetian blinds and plantation shutters are worth comparing. Venetians are practical and flexible, while shutters give a more built-in architectural finish.\n\nDuring the measure, MCB can check frame depth, moisture, window shape and room use before recommending one.";
  }

  if (matches(normalizedQuestion, ["sliding", "wide", "door", "panel", "vertical", "veri"])) {
    return "For wide windows and sliding doors, panel glide blinds, vertical blinds and soft vertical drapes are common options. Panel glides are clean and architectural, verticals are practical, and soft vertical drapes give a softer curtain-like feel.\n\nThe right choice depends on stack space, walk-through use, privacy and the style of the room.";
  }

  if (matches(normalizedQuestion, ["security", "door", "fly", "pest", "mesh", "screen"])) {
    return "For airflow and insects, fly screens or pet mesh may be enough. For entry protection and stronger peace of mind, look at security doors or security screens.\n\nMCB can quote screens while measuring curtains or blinds, so it is worth mentioning every opening you want assessed.";
  }

  if (matches(normalizedQuestion, ["outdoor", "alfresco", "awning", "zipscreen", "wind", "rain"])) {
    return "For outdoor shade and alfresco comfort, compare zipscreens, outdoor blinds and awnings. Zipscreens suit track-guided privacy, sun and wind control, while awnings are often used for shade over windows or outdoor areas.\n\nExposure, fixing points and wind conditions matter, so these are best assessed on site.";
  }

  if (matches(normalizedQuestion, ["motor", "remote", "app", "smart", "automate", "somfy"])) {
    return "Motorisation is useful for large windows, hard-to-reach openings, multi-room homes and routines like closing for privacy or heat control. MCB can discuss Somfy, Automate and suitable control options during the measure.\n\nThe team will check power, product suitability and how you want to control the system.";
  }

  return `For ${context}, the team will look at light, privacy, heat, room use, fixing points, style and budget during the in-home measure. If you are unsure, that is exactly what the free quote is for: samples come to you and the recommendation is made in the room itself.`;
}

function getQuestionTopic(question: string) {
  const normalized = normalize(question);
  if (matches(normalized, ["price", "cost", "quote"])) return "pricing";
  if (matches(normalized, ["when", "appointment", "measure", "availability"])) return "appointments";
  if (matches(normalized, ["warranty", "fault", "defect"])) return "warranty";
  if (matches(normalized, ["payright", "finance"])) return "finance";
  if (matches(normalized, ["showroom", "samples"])) return "showroom";
  if (matches(normalized, ["repair", "parts"])) return "repairs";
  if (matches(normalized, ["why", "family", "trust"])) return "trust";
  if (matches(normalized, ["brand", "somfy", "automate", "ziptrak", "invisi", "crimsafe"])) return "brands";
  return "product_advice";
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/-]/g, " ");
}

function matches(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
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
