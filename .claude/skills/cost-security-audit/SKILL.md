---
name: cost-security-audit
description: >-
  Audit a web app for the three failure modes that cost real money or leak
  customer data, and produce a prioritised, fix-ready report. Use when the user
  asks for a "security audit", "protection audit", "am I protected", "check my
  API endpoints / rate limiters / RLS / exposed keys / secrets", "can bots spend
  my money", "will this cost me money", "is my user data safe", "did I leave
  anything exposed", or before/after shipping anything that touches API routes,
  env vars, Supabase, auth, billing, email/SMS, or an LLM API. Defaults to a
  Next.js (App Router) + Supabase + Vercel stack but adapts to others.
---

# Cost & Security Audit

A repeatable audit that answers three questions a business owner actually cares about:

1. **Can I ever be billed more than I expect?** (platform spend caps, unbounded paid work)
2. **Can a bot or attacker spend my money?** (unauthed/expensive endpoints, no rate limits, email/LLM abuse)
3. **Is anything exposed, and is customer data protected?** (leaked secrets, RLS, auth, PII)

This is a **posture audit of the whole app**, not a diff review. (For diff review use `/security-review`.) The output is a single prioritised report ranked by money + data risk, each finding with `file:line`, severity, and the exact fix.

---

## How to run it

Work the phases in order. **Verify firsthand — quote real `file:line` and real command output.** Do not assert "rate limiting is missing" or "RLS is on" without showing the grep/command that proves it. Use parallel tool calls and `Explore` subagents to fan out reads; you keep the conclusions.

Two rules that keep the audit honest:

- **Never claim a control exists without proof, and never claim it's missing without searching for it under several names** (rate-limit / ratelimit / throttle / upstash / @vercel/kv, etc.). Both false-positives and false-negatives are expensive here.
- **Confirm you're pointed at the *real* project.** The single most dangerous mistake (see Landmines) is auditing a different Supabase/Vercel project than the one that's actually live. Cross-check the project ref in `.env*` / config against whatever MCP or dashboard you're inspecting *before* trusting any result.

---

## Phase 0 — Map the surface (10 min)

Establish what exists before judging it.

- Stack & deploy target: `package.json`, `next.config.*`, `vercel.json`, framework, hosting.
- **Where the real backend lives:** read `.env*`, `CLAUDE.md`, `README`, and any config for the Supabase project ref / DB host / API base. Write the ref down. Everything downstream must target *this* ref.
- Enumerate the API surface: every `route.ts`/`route.js` under `app/api` (or `pages/api`, or serverless functions), plus `vercel.json` `crons`, plus `middleware.ts`.
- Inventory paid/external services actually called: grep for `anthropic|openai|@ai-sdk|perplexity|cohere|generativelanguage|replicate|stripe|twilio|resend|sendgrid|nodemailer|s3|cloudinary`. This is your money-blast-radius list.
- Git hygiene baseline: is it a git repo, what's in `.gitignore`, is `.env*` ignored.

See `reference/checks.md` for the exact command arsenal.

## Phase 1 — Secrets & key exposure  → *Goal 3 (nothing exposed)*

- **Was a secret ever committed?** `git log --all -p -- '*.env*'` and scan history for key signatures. A rotated-but-once-committed key is still a finding (history is forever on a pushed repo).
- **Is a server secret leaking to the client?** Grep the **built output** (`.next/`, `dist/`, `build/`) and all client bundles for the literal value of each service-role key / API key / DB password. Any hit = critical leak.
- **Are secrets correctly scoped?** In Next.js, anything prefixed `NEXT_PUBLIC_` is shipped to the browser. List every `NEXT_PUBLIC_*` and confirm none is a service-role key, DB password, or paid-API key. The Supabase **service-role** key and any LLM key must be server-only (no `NEXT_PUBLIC_`).
- **Secret sprawl on disk:** stray `.env.*.local`, `.vercel/.env.*`, `*.bak` dirs, downloaded credential JSON. Flag plaintext secrets sitting in backup folders even if uncommitted.
- Confirm the client's data path: does the browser talk to the backend directly (needs a *public/anon* key + RLS) or only through server routes (service-role, never shipped)? This decides how much RLS is load-bearing in Phase 3.

## Phase 2 — Endpoints, auth & rate limiting  → *Goal 2 (can't get spent by bots)*

For **every** route, fill one row: method(s) · auth check (quote the line) · input validation · rate limit · paid/expensive work it triggers · uses service-role? · "if a bot hammered this, what happens / what does it cost?"

Focus fire on the money vectors:

- **Cron / scheduled routes.** These almost always trigger the most expensive work (LLM calls, crawls, long compute). Read the auth guard *literally*. On Vercel the only trustworthy gate is `Authorization: Bearer ${CRON_SECRET}` — **a check on the presence of `x-vercel-cron` (or any non-secret header) is a bypass** (see Landmines). Also confirm `CRON_SECRET` is actually *set* in the deploy env — an unset secret silently disables the only real gate.
- **Public POST endpoints** (contact/quote/lead, analytics ingest, anything unauthenticated). For each: rate limit? captcha/honeypot? Does one call fan out to **email sends**, **LLM calls**, or **heavy DB writes**? An unauthenticated endpoint that sends email to an attacker-supplied address is an abuse relay (mailbombing, sender-reputation burn, spam). An unauthenticated endpoint that calls a paid API is a direct invoice.
- **Long-lived connections** (SSE/websockets/streaming). Anyone can open many; each pins a serverless function for its lifetime = compute burn. Note max duration and whether it's auth-gated.
- **Admin/login routes.** Rate-limited against brute force? Is the session token a *random* value, or is it the password/secret itself (anti-pattern)? Constant-time compare? What PII sits behind it?
- **The global rate-limit question.** Search the whole repo for any limiter. If there is **none**, that is itself a high-severity finding for any public or paid endpoint — state it plainly and recommend a concrete mechanism (e.g. `@upstash/ratelimit` + Vercel KV, or Vercel WAF / firewall rules, keyed by IP).

## Phase 3 — RLS & data exposure  → *Goal 3 (user data protected)*

The backstop that protects customer PII even if a key leaks or a route has a hole.

- **As-coded posture:** in migrations, list every `create table`, every `enable row level security`, and every `create policy`. The safe pattern for a PII table is **RLS enabled + no permissive anon/authenticated policy** (deny-all; only service-role reaches it). RLS *enabled with a broad `using (true)` SELECT policy* on a PII table is a leak. RLS *disabled* on a PII table + a discoverable anon key = public data.
- **As-deployed reality (the part people skip):** migrations applied by hand drift from the files. If you can reach the live project, run Supabase's security advisor (`get_advisors type:security`) — it catches missing RLS, `SECURITY DEFINER` functions callable by anon, and exposed views. If you **cannot** reach it via MCP, say so loudly and give the owner a one-paste SQL check (see `reference/checks.md`) or have them confirm the anon REST endpoint returns `[]`/401 for a PII table. **Never report "RLS is fine" off the migration files alone.**
- Identify which tables hold PII (names, emails, phones, addresses, payment data) and trace exactly who can read them.

## Phase 4 — Platform spend caps  → *Goal 1 (never overspend)*

The master safety net. Code fixes reduce the chance of abuse; spend caps bound the damage when something slips through. Most can only be verified in a dashboard — if you can't see them, list them as **owner action items**, don't skip them.

- **Supabase:** Cost Control / Spend Cap toggle ON (project pauses instead of billing overages). Note egress & compute add-ons.
- **Vercel:** Spend Management configured with an amount + action (notify or **pause project**). Without it, function-invocation/bandwidth abuse is unbounded.
- **Each paid API** (LLM, Perplexity, etc.): a hard monthly spend limit set in that vendor's dashboard.
- **Email/SMS:** sending quota and what happens at the cap (fail vs. bill). Note sender-reputation exposure.
- **Billing alerts** at, say, 50/80/100% on every account.

## Phase 5 — Report

Write the findings using `reference/report-template.md`. Order strictly by **money + data risk**, not by code locality. Every finding: severity · what & where (`file:line`) · concrete impact in dollars/data terms · exact fix (code or dashboard step). End with: a one-line verdict against each of the three goals, and a short "owner action items" list for the things only the account owner can do (spend caps, env vars, dashboard toggles).

Offer to apply the safe, high-value code fixes (e.g. the cron-auth hardening, a rate-limiter) — but treat anything touching production/billing as outward-facing: confirm before doing it, and don't probe live paid endpoints without explicit OK.

---

## Severity rubric

- **P0 / Critical** — direct path to unbounded spend or live PII exposure: unauthed endpoint that calls a paid API or sends email; spoofable cron auth on an expensive job; leaked service-role key; PII table readable by anon; **no platform spend cap**.
- **P1 / High** — strong abuse vector or weak data protection: no rate limit on a public/paid endpoint; brute-forceable admin login; session token == secret; RLS unverified on live PII.
- **P2 / Medium** — cost/integrity erosion: unauthed analytics/write ingest (DB bloat, egress), long-lived public SSE, non-constant-time compares, secret sprawl in uncommitted backups.
- **P3 / Low** — hardening: search_path on functions, missing leaked-password protection, defence-in-depth niceties.

## Stack-specific landmines (learned the hard way)

- **`x-vercel-cron` is not a secret.** Vercel does **not** document stripping inbound `x-vercel-cron` from external requests; its *only* documented cron-auth mechanism is `CRON_SECRET` via the `Authorization: Bearer` header. Any guard shaped `if (request.headers.get("x-vercel-cron")) return ok;` is a header-spoof bypass — `curl -H "x-vercel-cron: 1"` walks straight in. Fix: require the Bearer token; drop the header short-circuit.
- **`CRON_SECRET` unset = no gate.** If the env var isn't set in the deploy environment, the Bearer branch can never match and any presence-based fallback becomes the whole defence. Always verify it's set (`vercel env ls`).
- **The MCP points at the wrong project.** A connected Supabase MCP token frequently only sees *some* of an org's projects — and the live one may not be among them. Auditing advisors/tables on the wrong ref produces confident, wrong conclusions. Always reconcile the `.env` ref against the MCP project list first; if the real project isn't reachable, say so and fall back to migration-file review + an owner-run SQL/REST check.
- **Cookie value == password.** A session cookie set to the literal password (so the middleware check is `cookie === PASSWORD`) is a static, non-rotating credential equal to the secret. Use a random/HMAC session token instead.
- **One lead form, many side effects.** Trace fan-out: a single public submit that writes DB rows *and* sends two emails *and* triggers an optimisation/LLM run multiplies every bot hit. Rate-limit and validate at the front door.
- **RLS-enabled ≠ RLS-applied.** Migration files are intent; the live DB is truth. Verify on the deployed project.

See `reference/checks.md` (command arsenal) and `reference/report-template.md` (output format).
