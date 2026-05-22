import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Link2, Share2 } from "lucide-react";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Social Tracking",
  description: "Private social media tracking links for Modern Curtains and Blinds.",
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = Promise<{ created?: string; error?: string }>;

type SocialLink = {
  id: string;
  name: string;
  platform: string;
  placement: string;
  destination_path: string;
  destination_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string | null;
  active: boolean;
  created_at: string;
  page_views: number;
  visitors: number;
  quote_clicks: number;
  phone_taps: number;
  chat_opens: number;
  quote_successes: number;
  leads: number;
};

const platformOptions = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["tiktok", "TikTok"],
  ["linkedin", "LinkedIn"],
  ["pinterest", "Pinterest"],
  ["youtube", "YouTube"],
  ["other", "Other"],
];

const mediumOptions = [
  ["organic_social", "Organic social"],
  ["paid_social", "Paid social"],
  ["social", "General social"],
  ["influencer", "Influencer"],
  ["referral", "Referral"],
];

export default async function SocialTrackingPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const links = await loadSocialLinks();

  return (
    <div className="min-h-screen bg-stone-100 px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col justify-between gap-4 border-b border-stone-300 pb-5 md:flex-row md:items-end">
          <div>
            <Link href="/dashboard" className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-mcb-terracotta">
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Link>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-mcb-terracotta">Social media</p>
            <h1 className="font-serif text-4xl text-mcb-charcoal">Social Tracking</h1>
          </div>
          <div className="text-sm text-stone-500">
            Saved links: {links.length}
          </div>
        </header>

        {params.created === "1" ? (
          <div className="mb-5 flex items-center gap-2 rounded-sm border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" /> Social tracking link saved.
          </div>
        ) : null}

        {params.error ? (
          <div className="mb-5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            The link could not be saved. Check the fields and try again.
          </div>
        ) : null}

        <section className="mb-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-sm border border-stone-300 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-stone-200 pb-3">
              <Share2 className="h-5 w-5 text-mcb-terracotta" />
              <h2 className="font-serif text-2xl text-mcb-charcoal">New Social Link</h2>
            </div>

            <form action="/api/dashboard/social-links" method="POST" className="space-y-4">
              <Field label="Link name" name="name" placeholder="Instagram bio - May offer" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label="Platform" name="platform" options={platformOptions} />
                <SelectField label="Medium" name="utmMedium" options={mediumOptions} />
              </div>
              <Field label="Placement" name="placement" placeholder="bio, story, reel, post, ad" required />
              <Field label="Destination path" name="destinationPath" placeholder="/quote or /curtains/sheer" defaultValue="/quote" required />
              <Field label="Campaign" name="utmCampaign" placeholder="may_2026_social" required />
              <Field label="Content label" name="utmContent" placeholder="bio_link, story_1, reel_sheer_curtains" />
              <div>
                <label className="mb-2 block text-sm font-bold text-mcb-charcoal" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
                />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-mcb-terracotta px-5 py-3 font-bold uppercase tracking-wider text-white transition-colors hover:bg-mcb-charcoal"
              >
                <Link2 className="h-4 w-4" /> Save Tracking Link
              </button>
            </form>
          </div>

          <div className="rounded-sm border border-stone-300 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-stone-200 pb-3">
              <ExternalLink className="h-5 w-5 text-mcb-terracotta" />
              <h2 className="font-serif text-2xl text-mcb-charcoal">Saved Links</h2>
            </div>

            {links.length === 0 ? (
              <p className="rounded-sm bg-stone-50 p-4 text-sm text-stone-500">
                No social tracking links have been saved yet.
              </p>
            ) : (
              <div className="space-y-4">
                {links.map((link) => (
                  <article key={link.id} className="rounded-sm border border-stone-200 bg-stone-50 p-4">
                    <div className="mb-3 flex flex-col justify-between gap-2 md:flex-row md:items-start">
                      <div>
                        <h3 className="font-bold text-mcb-charcoal">{link.name}</h3>
                        <p className="text-sm text-stone-500">
                          {formatLabel(link.platform)} / {link.placement} / {link.utm_medium}
                        </p>
                      </div>
                      <span className="rounded-sm bg-white px-2 py-1 text-xs font-bold uppercase tracking-wide text-stone-500">
                        {link.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <input
                      readOnly
                      value={link.destination_url}
                      className="mb-3 w-full rounded-sm border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700"
                      aria-label={`${link.name} tracked URL`}
                    />

                    <div className="grid gap-2 text-xs text-stone-600 sm:grid-cols-4">
                      <Metric label="Views" value={link.page_views} />
                      <Metric label="Visitors" value={link.visitors} />
                      <Metric label="Quote Clicks" value={link.quote_clicks} />
                      <Metric label="Leads" value={link.leads} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

async function loadSocialLinks() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("dashboard_social_link_performance_30d")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load social tracking links:", error);
    return [];
  }

  return (data || []) as SocialLink[];
}

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-mcb-charcoal" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[][] }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-mcb-charcoal" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="w-full rounded-sm border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-mcb-terracotta focus:ring-2 focus:ring-mcb-clay/30"
      >
        {options.map(([value, labelText]) => (
          <option key={value} value={value}>
            {labelText}
          </option>
        ))}
      </select>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-sm border border-stone-200 bg-white p-2">
      <p className="font-bold uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-mcb-charcoal">{value.toLocaleString()}</p>
    </div>
  );
}

function formatLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
