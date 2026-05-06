import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Known AI / LLM crawler user agents. Match case-insensitive substring.
// Sources: each vendor's published bot docs as of 2026.
const AI_BOTS: Array<{ id: string; pattern: RegExp }> = [
  { id: "GPTBot", pattern: /GPTBot/i }, // OpenAI training crawler
  { id: "OAI-SearchBot", pattern: /OAI-SearchBot/i }, // OpenAI ChatGPT search index
  { id: "ChatGPT-User", pattern: /ChatGPT-User/i }, // OpenAI live browse on user request
  { id: "ClaudeBot", pattern: /ClaudeBot/i }, // Anthropic training crawler
  { id: "Claude-Web", pattern: /Claude-Web/i }, // Anthropic legacy
  { id: "anthropic-ai", pattern: /anthropic-ai/i }, // Anthropic legacy
  { id: "PerplexityBot", pattern: /PerplexityBot/i }, // Perplexity training
  { id: "Perplexity-User", pattern: /Perplexity-User/i }, // Perplexity live answer
  { id: "Google-Extended", pattern: /Google-Extended/i }, // Google AI training opt-out token
  { id: "Googlebot", pattern: /Googlebot/i }, // Google search
  { id: "Bingbot", pattern: /Bingbot/i }, // Bing / Copilot
  { id: "Applebot-Extended", pattern: /Applebot-Extended/i }, // Apple AI training opt-out token
  { id: "Applebot", pattern: /Applebot/i }, // Apple search
  { id: "CCBot", pattern: /CCBot/i }, // Common Crawl (used by many LLMs)
  { id: "Bytespider", pattern: /Bytespider/i }, // ByteDance / Doubao
  { id: "Amazonbot", pattern: /Amazonbot/i }, // Amazon Alexa / AI
  { id: "DuckAssistBot", pattern: /DuckAssistBot/i }, // DuckDuckGo AI
  { id: "MistralAI-User", pattern: /MistralAI-User/i },
  { id: "Cohere-AI", pattern: /cohere-ai/i },
  { id: "Diffbot", pattern: /Diffbot/i },
  { id: "FacebookBot", pattern: /FacebookBot/i },
  { id: "Meta-ExternalAgent", pattern: /Meta-ExternalAgent/i }, // Meta AI training
  { id: "YouBot", pattern: /YouBot/i }, // You.com
];

function detectBot(ua: string): string | null {
  if (!ua) return null;
  for (const bot of AI_BOTS) {
    if (bot.pattern.test(ua)) return bot.id;
  }
  return null;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const dashboardResponse = getDashboardAuthResponse(request);
    if (dashboardResponse) return dashboardResponse;
  }

  const ua = request.headers.get("user-agent") || "";
  const botId = detectBot(ua);

  const response = NextResponse.next();

  if (botId) {
    // Surface bot identity on the response so it shows up in Vercel logs and
    // can be queried via Vercel Observability or any log drain.
    // We log once per request via a console.log too — Vercel captures this.
    response.headers.set("x-mcb-bot", botId);

    const url = new URL(request.url);
    // Single-line JSON for log scrapers (Vercel Logs, log drains, etc.).
    console.log(
      JSON.stringify({
        type: "ai_bot_request",
        bot: botId,
        path: url.pathname,
        host: url.host,
        ua,
      })
    );
  }

  return response;
}

function getDashboardAuthResponse(request: NextRequest) {
  if (request.nextUrl.pathname === "/dashboard/login") {
    return null;
  }

  const dashboardPassword = process.env.DASHBOARD_PASSWORD;
  if (!dashboardPassword) {
    return null;
  }

  const sessionCookie = request.cookies.get("mcb_dashboard_session")?.value;
  if (sessionCookie === dashboardPassword) {
    return null;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/dashboard/login";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Run on all non-static requests. Skips _next, static assets, and api/quote
// (the form submit endpoint — bots aren't filling forms).
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|map)$).*)",
  ],
};
