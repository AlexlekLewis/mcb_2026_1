/**
 * AI citation probes — ask AI engines real customer queries and detect whether
 * MCB is cited. Current implementation: Perplexity (cheap, fast, returns sources).
 * Other engines (ChatGPT search, Gemini) will be added when their APIs stabilise.
 */

export const TARGET_QUERIES: string[] = [
    "best blinds Melbourne",
    "custom curtains Melbourne",
    "plantation shutters Melbourne",
    "motorised blinds Melbourne cost",
    "roller blinds Northcote",
    "plantation shutters Preston",
    "security doors Reservoir",
    "fly screens Brunswick",
    "in-home blinds quote Melbourne",
    "curtain installer Melbourne",
    "best plantation shutters near me Melbourne",
    "blackout curtains Coburg",
    "S-fold curtains Melbourne",
    "honeycomb blinds Melbourne",
    "outdoor awnings Heidelberg",
    "Wavefold curtains Melbourne",
    "panel glide blinds Melbourne",
    "soft vertical drapes Melbourne",
    "veri shades Melbourne",
    "free measure and quote Melbourne blinds",
];

export interface ProbeResult {
    engine: "perplexity" | "openai" | "google_ai_overviews" | "claude" | "gemini" | "manual";
    query_text: string;
    cited: boolean;
    citation_url?: string;
    citation_rank?: number;
    response_excerpt?: string;
    competitor_cited: string[];
    cost_usd?: number;
    raw_response?: unknown;
}

const MCB_DOMAINS = ["moderncurtainsandblinds.com.au", "modern-curtains-and-blinds"];
const COMPETITOR_HINTS = [
    "luxaflex", "spotlight", "shadefactor", "veneta", "blindsonline",
    "tuiss", "blindsdirect", "rollerhouse", "blindstation",
    "diy-blinds", "abc-blinds", "watson-blinds", "decor-blinds",
];

export async function probePerplexity(query: string, apiKey: string): Promise<ProbeResult> {
    const url = "https://api.perplexity.ai/chat/completions";
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "sonar",
            messages: [
                { role: "system", content: "You are a helpful local-search assistant. Cite sources." },
                { role: "user", content: query },
            ],
            return_citations: true,
            temperature: 0.2,
        }),
    });

    if (!res.ok) {
        return {
            engine: "perplexity",
            query_text: query,
            cited: false,
            competitor_cited: [],
            response_excerpt: `Probe error ${res.status}`,
        };
    }

    const data = await res.json() as {
        choices?: Array<{ message?: { content?: string } }>;
        citations?: string[];
        usage?: { total_tokens?: number };
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    const citations: string[] = data.citations ?? [];

    let citedUrl: string | undefined;
    let rank: number | undefined;
    for (let i = 0; i < citations.length; i += 1) {
        const u = citations[i].toLowerCase();
        if (MCB_DOMAINS.some((d) => u.includes(d))) {
            citedUrl = citations[i];
            rank = i + 1;
            break;
        }
    }

    const competitors = citations.filter((u) => {
        const low = u.toLowerCase();
        return COMPETITOR_HINTS.some((h) => low.includes(h));
    });

    // Perplexity sonar pricing approx $0.001/query — note only.
    return {
        engine: "perplexity",
        query_text: query,
        cited: Boolean(citedUrl),
        citation_url: citedUrl,
        citation_rank: rank,
        response_excerpt: content.slice(0, 400),
        competitor_cited: competitors,
        cost_usd: 0.001,
        raw_response: { content, citations },
    };
}
