import type { PageCrawlSummary } from "./types";

const REQUIRED_JSONLD_TYPES = ["HomeAndConstructionBusiness", "Organization", "LocalBusiness"];

interface CrawlOptions {
    baseUrl: string;
    urls: string[];
    userAgent?: string;
    perRequestTimeoutMs?: number;
}

/**
 * Fetches each URL as a configurable User-Agent (default: GPTBot)
 * and returns a structured crawl summary. Runs requests in parallel
 * with a hard per-request timeout so the cron can't hang.
 */
export async function crawlPages({
    baseUrl,
    urls,
    userAgent = "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)",
    perRequestTimeoutMs = 8000,
}: CrawlOptions): Promise<PageCrawlSummary[]> {
    const tasks = urls.map((path) => crawlOne(baseUrl, path, userAgent, perRequestTimeoutMs));
    return Promise.all(tasks);
}

async function crawlOne(baseUrl: string, urlPath: string, userAgent: string, timeoutMs: number): Promise<PageCrawlSummary> {
    const url = new URL(urlPath, baseUrl).toString();
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch(url, {
            headers: { "User-Agent": userAgent, Accept: "text/html" },
            signal: controller.signal,
            cache: "no-store",
        });
        const html = await res.text();
        clearTimeout(t);
        return analyse(urlPath, res.status, html);
    } catch (err) {
        clearTimeout(t);
        return failed(urlPath, err);
    }
}

function failed(urlPath: string, err: unknown): PageCrawlSummary {
    return {
        url_path: urlPath,
        status: 0,
        bytes: 0,
        fetched_at: new Date().toISOString(),
        has_h1: false,
        h1_count: 0,
        jsonld_types: [],
        jsonld_count: 0,
        title_length: 0,
        meta_description_length: 0,
        has_faq_block: false,
        has_canonical: false,
        raw_text_length: 0,
        js_only_render_suspected: true,
        broken_internal_links: [],
        score: 0,
        flags: ["fetch_failed:" + (err instanceof Error ? err.message : String(err))],
    };
}

function analyse(urlPath: string, status: number, html: string): PageCrawlSummary {
    const bytes = new Blob([html]).size;
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    const h1s = [...html.matchAll(/<h1[\s>]/gi)];
    const hasCanonical = /<link\s+rel=["']canonical["']/i.test(html);

    const jsonldMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    const jsonldTypes: string[] = [];
    for (const m of jsonldMatches) {
        try {
            const parsed = JSON.parse(m[1]);
            collectTypes(parsed, jsonldTypes);
        } catch { /* skip malformed JSON-LD */ }
    }

    const hasFaqBlock = jsonldTypes.includes("FAQPage") || /faq/i.test(html);

    // Strip script + style to estimate visible-text length (proxy for content depth).
    const stripped = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ");
    const rawTextLength = stripped.replace(/\s+/g, " ").trim().length;

    // Heuristic: if HTML has <body> but almost no static text, render is JS-dependent.
    const jsOnly = rawTextLength < 400 && /next-page-data|__NEXT_DATA__/i.test(html);

    const flags: string[] = [];
    if (status !== 200) flags.push(`status_${status}`);
    if (h1s.length === 0) flags.push("no_h1");
    if (h1s.length > 1) flags.push("multiple_h1");
    if (!titleMatch || titleMatch[1].length < 25) flags.push("short_title");
    if (!metaDescMatch || metaDescMatch[1].length < 50) flags.push("short_meta_description");
    if (!hasCanonical) flags.push("no_canonical");
    if (jsonldTypes.length === 0) flags.push("no_jsonld");
    if (!hasFaqBlock) flags.push("no_faq_block");
    if (jsOnly) flags.push("js_only_render_suspected");
    if (!REQUIRED_JSONLD_TYPES.some((t) => jsonldTypes.includes(t))) flags.push("missing_business_schema");

    // Per-page score 0..100.
    let score = 100;
    score -= flags.length * 8;
    score = Math.max(0, score);

    return {
        url_path: urlPath,
        status,
        bytes,
        fetched_at: new Date().toISOString(),
        has_h1: h1s.length > 0,
        h1_count: h1s.length,
        jsonld_types: jsonldTypes,
        jsonld_count: jsonldMatches.length,
        title_length: titleMatch ? titleMatch[1].length : 0,
        meta_description_length: metaDescMatch ? metaDescMatch[1].length : 0,
        has_faq_block: hasFaqBlock,
        has_canonical: hasCanonical,
        raw_text_length: rawTextLength,
        js_only_render_suspected: jsOnly,
        broken_internal_links: [],
        score,
        flags,
    };
}

function collectTypes(obj: unknown, out: string[]): void {
    if (!obj) return;
    if (Array.isArray(obj)) { obj.forEach((x) => collectTypes(x, out)); return; }
    if (typeof obj !== "object") return;
    const o = obj as Record<string, unknown>;
    const t = o["@type"];
    if (typeof t === "string") out.push(t);
    if (Array.isArray(t)) t.forEach((x) => { if (typeof x === "string") out.push(x); });
    // Recurse into nested @graph / mainEntity / itemListElement etc.
    for (const v of Object.values(o)) {
        if (v && typeof v === "object") collectTypes(v, out);
    }
}
