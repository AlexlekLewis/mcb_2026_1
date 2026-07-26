# Cost & Security Audit — MCB Website 2026 — 2026-06-09

**Scope:** `repo/` (Next.js 16 App Router + Supabase + Vercel) · live DB project ref `lrhgrmklpvwyjzaipioh` · deploy: Vercel (moderncurtainsandblinds.com.au)
**Verified against live infra?** Code/migrations: yes, firsthand. Live Supabase DB: **NO** — the connected Supabase MCP cannot reach `lrhgrmklpvwyjzaipioh` (it only sees other org projects). RLS/advisor checks on the live DB are **owner action items** below.

## Verdict against the three goals
- **① Never overspend:** ⚠️ **AT RISK** — platform spend caps (Supabase/Vercel/Perplexity) not verifiable from code; must be confirmed in dashboards. Without them, an endpoint hole = unbounded bill.
- **② Can't get spent by bots:** ⚠️ **AT RISK** — cron auth is bypassable via a spoofable header (P0); no rate limiting anywhere; public quote endpoint sends 2 emails + triggers an optimisation run per hit.
- **③ Nothing exposed / data protected:** ✅ **MOSTLY GOOD** — no leaked secrets, `.env` clean, RLS deny-by-default *as coded*. Two gaps: dashboard session design (P1) and RLS must be confirmed *applied* on the live DB (P1).

## What's already good (don't regress)
- `.env*` and `.vercel` are gitignored; **no secret ever committed** (`git log --all` clean).
- Service-role key is **not** in the built bundle (`.next`) and **not** `NEXT_PUBLIC_`-prefixed — server-only. The browser never talks to Supabase directly, so there's no shipped anon key to abuse.
- RLS is enabled on all 19 public tables in migrations, with only 2 policies (on `mcb_projects`, `storage.objects`) → `lead_submissions` and `analytics_events` are **deny-all to anon** as coded.
- Input is length-clamped and HTML-escaped before going into emails (no obvious injection/XSS in the mail path).
- Cron crawlers use free scraping; the only paid external API is **Perplexity** (`ai-citation-probe`, ~5 queries/6h ≈ $1/mo) plus SMTP email. Small blast radius.

---

## Findings (highest risk first)

| # | Sev | Finding | Where | If exploited | Fix |
|---|-----|---------|-------|--------------|-----|
| 1 | **P0** | Cron auth bypassable via spoofable `x-vercel-cron` header | `src/lib/optimization/auth.ts:9-10` | Anyone can run all 8 crons: Perplexity spend, 60s site-crawl compute, external fetches — repeatable, unbounded | Drop the header short-circuit; require `Bearer ${CRON_SECRET}` |
| 2 | **P0** | No platform spend caps verifiable (Supabase/Vercel/Perplexity) | dashboards | Any cost hole becomes an unbounded invoice | Turn on spend caps + billing alerts (owner items) |
| 3 | **P1** | No rate limiting on any route | whole repo (grep: none) | Bots flood public endpoints freely | Add IP rate limit (Upstash/Vercel KV or Vercel firewall) |
| 4 | **P1** | Public quote endpoint: 2 emails + optimisation trigger + DB writes per hit, no captcha/honeypot/limit | `src/app/api/quote/route.ts:104,116,514` | Mailbomb arbitrary victims from your domain; burn SMTP quota + sender reputation; pollute leads + Google Ads conversions | Rate-limit + honeypot; validate email before send; cap |
| 5 | **P1** | Dashboard session cookie value == the password | `src/app/api/dashboard/login/route.ts:25`, `middleware.ts:145` | Static non-rotating credential = the secret; no brute-force limit on login | Random/HMAC session token; rate-limit login; constant-time compare |
| 6 | **P1** | RLS enabled in migrations but **not verified applied** on live DB | `lrhgrmklpvwyjzaipioh` | If a migration didn't apply, a PII table could be anon-readable | Run advisor / SQL check on the live project |
| 7 | **P2** | Public unauthenticated analytics ingest, no limit | `src/app/api/analytics/event/route.ts:5` | DB/egress bloat; the known bot-inflation problem | Rate-limit + drop on bot UA |
| 8 | **P2** | Public SSE stream, no auth, holds a function up to 4 min | `src/app/api/optimization/realtime/route.ts` | Many open connections = serverless compute burn | Auth-gate or cap concurrent connections |
| 9 | **P2** | SMTP creds in plaintext `.vercel.bak/.env.preview.local` (uncommitted) | `../.vercel.bak/` | Secret sprawl on disk | Delete the stale `.vercel.bak` backup |

---

### 1. Cron auth bypass — **P0** (the headline money risk)
```ts
// src/lib/optimization/auth.ts:8-17
export function authoriseCron(request: Request): NextResponse | null {
    const vercelCron = request.headers.get("x-vercel-cron");
    if (vercelCron) return null;                 // ← ANY value of this header → authorised
    const expected = process.env.CRON_SECRET;
    const auth = request.headers.get("authorization");
    if (expected && auth === `Bearer ${expected}`) return null;
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
```
`x-vercel-cron` is **not a secret** and Vercel does not document stripping it from inbound external requests — its only documented cron-auth mechanism is `CRON_SECRET` via the `Authorization: Bearer` header. So `curl -H "x-vercel-cron: 1" https://moderncurtainsandblinds.com.au/api/cron/ai-citation-probe` plausibly executes the job. All 8 crons use this guard. Worst targets: `ai-citation-probe` (Perplexity $), `optimization-run` (60s crawl compute + self-traffic), `question-discovery` (external fetches → IP reputation).
Compounding: `CRON_SECRET` is absent from local env — **if it's also unset in Vercel, the Bearer branch can never match and the spoofable header is the *entire* defence.** (It also silently disables the quote→optimisation trigger, which early-returns when the secret is missing — `quote/route.ts:520`.)

**Fix:**
```ts
export function authoriseCron(request: Request): NextResponse | null {
  const expected = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (expected && auth === `Bearer ${expected}`) return null;   // the only trustworthy gate
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}
```
Then ensure `CRON_SECRET` is set in Vercel Production (Vercel auto-sends it as the Bearer token to scheduled crons). `sync-search-console` already uses this stricter inline pattern — make all crons match.

### 4. Quote endpoint fan-out — **P1**
One unauthenticated POST → `storeLeadSubmission` (DB insert + analytics insert + `triggerOptimizationRun()`), an **admin email**, and a **customer-confirmation email to the attacker-supplied address** (`route.ts:104` and `:116`). With no rate limit/captcha/honeypot, this is a spam/mailbomb relay and a sender-reputation/SMTP-quota risk, and it poisons the lead table + offline Google-Ads conversions. Fix: rate-limit per IP, add a hidden honeypot field, validate the email before the admin send, and cap requests/min.

*(P1 #5, P2 #7–9 detailed inline in the table; fixes as noted.)*

---

## Owner action items (only you can do these — dashboard/account)
- [ ] **Supabase** → project `lrhgrmklpvwyjzaipioh` → Settings → Cost Control / **Spend Cap = ON**.
- [ ] **Vercel** → Settings → **Spend Management** → set an amount + action (notify or **pause project**).
- [ ] **Perplexity** dashboard → set a **monthly hard spend limit**.
- [ ] Confirm **`CRON_SECRET` is set** in Vercel Production: `vercel env ls`.
- [ ] **Verify RLS on the live DB** (`lrhgrmklpvwyjzaipioh`) — paste the `pg_class`/`pg_policies` query (see skill `reference/checks.md`) into the Supabase SQL editor, or `curl` the `lead_submissions` REST endpoint with the anon key and confirm it returns `[]`/401, not rows.
- [ ] Set **billing alerts** at 50/80/100% on Supabase, Vercel, Perplexity.
- [ ] Delete the stale **`.vercel.bak/`** backup (holds SMTP creds in plaintext).

## Code fixes I can apply on request
- P0 #1 cron-auth hardening (2-line change to `auth.ts`) — quick, high value.
- P1 #3/#4 a small rate-limiter + honeypot for `quote` and `analytics/event`.
- P1 #5 dashboard session token (random value instead of the password) + login throttle.

> Re-run anytime with the `cost-security-audit` skill (`.claude/skills/cost-security-audit/`).
