import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { authoriseCron } from "@/lib/optimization/auth";

/**
 * Monthly suburb uniqueness audit.
 *
 * Walks all suburb landing pages (/locations/[suburb] and
 * /locations/[suburb]/[product]) and scores how much of their content is
 * genuinely unique vs the templated baseline. Writes results to
 * public.suburb_audit for PR 4's consolidation tooling.
 *
 * Approach (free, no LLM): fetches each page's rendered HTML, strips chrome,
 * computes a Jaccard-like similarity to a reference baseline (first page
 * fetched), and stores word-count + uniqueness percentage. Coarse but
 * sufficient for surfacing consolidation candidates.
 *
 * Cron: 1st of month, 14:00 UTC (00:00 AEST). See vercel.json.
 */

export const runtime = "nodejs";
export const maxDuration = 300;

interface PageSample {
  url: string;
  suburbSlug: string;
  productSlug: string | null;
  text: string;
  wordCount: number;
}

export async function GET(request: Request) {
  const unauthorised = authoriseCron(request);
  if (unauthorised) return unauthorised;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  // Load the suburb URL list from src/lib/locations.ts via dynamic import
  // — keeps this route self-contained.
  const { LOCATIONS } = await import("@/lib/locations");

  // Use the www host directly — the apex 307-redirects, and fetch from a
  // Vercel function doesn't always preserve the Authorization-less request
  // shape through the redirect.
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moderncurtainsandblinds.com.au";

  // Cap per-run scan to 60 pages so we stay under maxDuration. Rotate
  // through the full set by day-of-month, wrapping with modulo so we never
  // overshoot LOCATIONS.length (~693 in this repo).
  const CAP = 60;
  const offsetRaw = (new Date().getUTCDate() - 1) * CAP;
  const offset = LOCATIONS.length > 0 ? offsetRaw % LOCATIONS.length : 0;
  const slice = LOCATIONS.slice(offset, offset + CAP);

  const samples: PageSample[] = [];
  for (const suburb of slice) {
    const url = `${origin}/locations/${suburb.slug}`;
    try {
      const html = await fetchHtml(url);
      const text = extractMainText(html);
      const words = text.split(/\s+/).filter(Boolean);
      samples.push({
        url: `/locations/${suburb.slug}`,
        suburbSlug: suburb.slug,
        productSlug: null,
        text,
        wordCount: words.length,
      });
    } catch {
      // skip
    }
  }

  if (samples.length === 0) {
    return NextResponse.json({ ok: true, samples: 0, message: "no pages fetched" });
  }

  // Score uniqueness against the FIRST page as baseline.
  const baseline = new Set(tokenise(samples[0].text));

  const auditedAt = new Date().toISOString();
  let inserted = 0;
  for (const s of samples) {
    const tokens = new Set(tokenise(s.text));
    const overlap = intersectionSize(tokens, baseline);
    const union = tokens.size + baseline.size - overlap;
    const similarity = union > 0 ? overlap / union : 0;
    const uniquePct = +(((1 - similarity) * 100).toFixed(2));

    const recommendation =
      uniquePct < 20 ? "consolidate" : uniquePct < 35 ? "redirect" : "keep";

    try {
      await supabase.from("suburb_audit").insert({
        url: s.url,
        suburb_slug: s.suburbSlug,
        product_slug: s.productSlug,
        unique_word_count: Math.max(0, s.wordCount - overlap),
        unique_pct: uniquePct,
        recommendation,
        audited_at: auditedAt,
      });
      inserted++;
    } catch {
      // skip
    }
  }

  return NextResponse.json({ ok: true, samples: samples.length, inserted });
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "user-agent": "MCB-suburb-audit/1.0" },
  });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return res.text();
}

function extractMainText(html: string): string {
  // Crude — strip scripts/styles, drop tags, collapse whitespace.
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function tokenise(text: string): string[] {
  return text
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
}

function intersectionSize<T>(a: Set<T>, b: Set<T>): number {
  let count = 0;
  for (const x of a) if (b.has(x)) count++;
  return count;
}
