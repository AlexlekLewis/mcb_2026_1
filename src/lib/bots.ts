/**
 * Canonical AI / LLM crawler identifiers (read side).
 *
 * These id strings MUST mirror the `id` fields of the `AI_BOTS` array in
 * src/middleware.ts. Middleware is the *writer* — it is the only thing that
 * inserts rows into `public.bot_crawls`, and it only ever writes one of these
 * ids. This list is the *reader*: dashboard + weekly-digest aggregation iterate
 * it to get an exact per-bot breakdown without a GROUP BY (PostgREST can't
 * aggregate over the REST API, and fetching raw rows to count them silently
 * hits the 1000-row response cap — see fetchBotCrawlSummary in
 * src/lib/dashboard/v2/data.ts).
 *
 * When you add a bot to AI_BOTS in middleware.ts, add its id here too.
 * (The headline total7d/prior7d KPIs use an unfiltered COUNT, so they stay
 * correct even if this list drifts; only the per-bot breakdown would miss a
 * brand-new id until it's added here.)
 */
export const AI_BOT_IDS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Googlebot",
  "Bingbot",
  "Applebot-Extended",
  "Applebot",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "Cohere-AI",
  "Diffbot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "YouBot",
] as const;

/**
 * Internal marker bot_ids written into bot_crawls for observability that are
 * NOT real crawler hits (e.g. the weekly digest logs `_digest_sent`). Excluded
 * from headline crawl counts.
 */
export const NON_CRAWLER_BOT_IDS = ["_digest_sent"] as const;
