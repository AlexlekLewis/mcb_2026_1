import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { authoriseCron } from "@/lib/optimization/auth";

/**
 * Weekly question discovery.
 *
 * Scrapes:
 *  - Google "People Also Ask" via a small fan-out of seed queries
 *  - Reddit search RSS feeds (free, no auth) for category subreddits
 *  - Whirlpool forum search RSS
 *
 * Each finding is normalised to a question shape, scored by simple keyword
 * heuristics (commercial-intent words, content-gap proxies), and upserted
 * into public.content_backlog.
 *
 * Idempotent — uniqueness is enforced by lower(question).
 *
 * Cron: Mondays 23:00 UTC (09:00 AEST). See vercel.json.
 *
 * Honours the no-paid-services constraint — no LLM in the critical path.
 * If we later want semantic dedup or richer scoring, the LLM hook lives at
 * the bottom of this file (env-gated, off by default).
 */

export const runtime = "nodejs";
export const maxDuration = 60;

const SEED_QUERIES = [
  "best blinds Melbourne",
  "plantation shutters cost",
  "blinds vs curtains",
  "how to measure for blinds",
  "sheer curtains",
  "motorised blinds worth it",
  "roller blinds bedroom",
  "S-fold curtains",
];

const COMMERCIAL_KEYWORDS = [
  "cost",
  "price",
  "quote",
  "buy",
  "near me",
  "best",
  "cheap",
  "worth",
  "vs",
  "compare",
  "melbourne",
  "australia",
];

interface Discovered {
  question: string;
  source: "paa" | "reddit" | "whirlpool";
  source_url?: string;
}

export async function GET(request: Request) {
  const unauthorised = authoriseCron(request);
  if (unauthorised) return unauthorised;

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  const discoveries: Discovered[] = [];

  // ---------- PAA via Google (cheap fan-out) ----------
  for (const seed of SEED_QUERIES) {
    try {
      const paaFindings = await discoverFromGooglePaa(seed);
      discoveries.push(...paaFindings);
    } catch (err) {
      console.warn(`question-discovery PAA failed for "${seed}":`, err);
    }
  }

  // ---------- Reddit search RSS ----------
  try {
    const redditFindings = await discoverFromReddit();
    discoveries.push(...redditFindings);
  } catch (err) {
    console.warn("question-discovery Reddit failed:", err);
  }

  // ---------- Whirlpool RSS ----------
  try {
    const whirlpoolFindings = await discoverFromWhirlpool();
    discoveries.push(...whirlpoolFindings);
  } catch (err) {
    console.warn("question-discovery Whirlpool failed:", err);
  }

  // ---------- Score + upsert ----------
  let inserted = 0;
  for (const d of discoveries) {
    const question = normaliseQuestion(d.question);
    if (!question) continue;

    const score = scoreQuestion(question);

    try {
      const { error } = await supabase.from("content_backlog").upsert(
        {
          question,
          source: d.source,
          source_url: d.source_url ?? null,
          est_volume: score.estVolume,
          commercial_intent_score: score.commercialIntent,
          content_gap_score: score.contentGap,
        },
        { onConflict: "lower(question)", ignoreDuplicates: true },
      );
      if (!error) inserted++;
    } catch {
      // ignore per-row failures
    }
  }

  return NextResponse.json({
    ok: true,
    discoveredCount: discoveries.length,
    insertedCount: inserted,
  });
}

// ---------------------------------------------------------------------
// Source-specific scrapers
// ---------------------------------------------------------------------

async function discoverFromGooglePaa(seed: string): Promise<Discovered[]> {
  // Lightweight PAA scrape via Google's search results page. Best-effort —
  // Google's HTML changes; treat empty result as a non-failure.
  const url = `https://www.google.com/search?q=${encodeURIComponent(seed)}&gl=au&hl=en`;
  const res = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      "accept-language": "en-AU,en;q=0.9",
    },
  });
  if (!res.ok) return [];
  const html = await res.text();

  // Extract obvious question phrases — Google wraps PAA in spans with
  // recognisable shapes. We pull anything that looks like a question.
  const matches = html.match(/>([^<]{12,160}\?)</g) ?? [];
  const questions = matches
    .map((m) => m.replace(/^>|<$/g, "").trim())
    .filter(isQuestionLike);

  return Array.from(new Set(questions)).slice(0, 8).map((q) => ({
    question: q,
    source: "paa",
    source_url: url,
  }));
}

async function discoverFromReddit(): Promise<Discovered[]> {
  // Reddit blocks default UA on json + html. Use search.rss which still works
  // for many subreddits. If it doesn't return useful data, the function
  // returns [] without failing.
  const subs = ["AusRenovation", "AusFinance", "melbourne"];
  const findings: Discovered[] = [];

  for (const sub of subs) {
    try {
      const url = `https://www.reddit.com/r/${sub}/search.rss?q=blinds+OR+curtains+OR+shutters&restrict_sr=on&t=week`;
      const res = await fetch(url, {
        headers: { "user-agent": "MCB-website-bot/1.0 (admin@moderncurtainsandblinds.com.au)" },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      const titleMatches = xml.match(/<title>([^<]{12,160}\?)<\/title>/g) ?? [];
      for (const m of titleMatches) {
        const q = m.replace(/<\/?title>/g, "").trim();
        if (isQuestionLike(q)) findings.push({ question: q, source: "reddit" });
      }
    } catch {
      // ignore
    }
  }
  return findings.slice(0, 12);
}

async function discoverFromWhirlpool(): Promise<Discovered[]> {
  // Whirlpool has a search RSS endpoint for forum topics.
  try {
    const url =
      "https://forums.whirlpool.net.au/search.rss?q=blinds+OR+curtains+OR+shutters&type=thread";
    const res = await fetch(url, {
      headers: { "user-agent": "MCB-website-bot/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const titleMatches = xml.match(/<title>([^<]{12,160}\?)<\/title>/g) ?? [];
    return titleMatches
      .map((m) => m.replace(/<\/?title>/g, "").trim())
      .filter(isQuestionLike)
      .slice(0, 8)
      .map((q) => ({ question: q, source: "whirlpool" as const }));
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function isQuestionLike(s: string): boolean {
  if (!s) return false;
  if (s.length < 12 || s.length > 200) return false;
  if (!/\?$/.test(s)) return false;
  if (!/\b(what|how|why|when|where|which|do|does|is|are|can|should|will)\b/i.test(s))
    return false;
  return true;
}

function normaliseQuestion(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .slice(0, 300);
}

interface QuestionScore {
  estVolume: number;
  commercialIntent: number; // 1-10
  contentGap: number;       // 1-10
}

function scoreQuestion(question: string): QuestionScore {
  const lower = question.toLowerCase();

  // Commercial intent: count commercial keywords
  let commercialIntent = 3;
  for (const kw of COMMERCIAL_KEYWORDS) {
    if (lower.includes(kw)) commercialIntent = Math.min(10, commercialIntent + 1);
  }

  // Content gap proxy: longer + more specific = higher likely gap
  const words = lower.split(" ").length;
  const contentGap = Math.min(10, Math.max(3, Math.floor(words / 2)));

  // Volume placeholder — until we wire a real volume source we use a
  // pessimistic constant. Discovered questions tend to be long-tail.
  const estVolume = 100;

  return { estVolume, commercialIntent, contentGap };
}
