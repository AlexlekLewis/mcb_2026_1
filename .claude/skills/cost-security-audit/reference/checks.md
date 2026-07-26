# Command arsenal

Concrete checks per phase. Run from the app root. Adjust `src/` and `.next/` to the project's source and build dirs. These are starting points — read what they surface, don't just run them.

## Phase 0 — Map the surface

```bash
# Stack & deploy
cat package.json next.config.* vercel.json 2>/dev/null
# API routes (App Router, Pages Router, and serverless)
find src -path '*api*' \( -name 'route.ts' -o -name 'route.js' \) 2>/dev/null
find . -path '*pages/api*' -name '*.ts' 2>/dev/null
# Cron jobs (the expensive ones)
grep -A2 '"crons"' vercel.json 2>/dev/null
# Paid / external services actually imported (your money blast radius)
grep -rlE "anthropic|openai|@ai-sdk|perplexity|cohere|generativelanguage|replicate|stripe|twilio|resend|sendgrid|nodemailer|cloudinary|@aws-sdk|s3" src package.json 2>/dev/null
# Which backend project is REAL — reconcile this ref against your MCP/dashboard
grep -iE "supabase|SUPABASE_URL|project|ref|db\.|\.supabase\.co" .env* CLAUDE.md README* 2>/dev/null
```

## Phase 1 — Secrets & key exposure

```bash
# Is .env ignored? Is anything sensitive tracked?
cat .gitignore | grep -i env
git ls-files | grep -iE '\.env|secret|credential|\.pem'        # expect: nothing
# Was a secret EVER committed (history is forever once pushed)?
git log --all --oneline -- '*.env*' '.env*'
git log --all -p -S 'service_role' -- . 2>/dev/null | head      # or -S the key signature
# Does a server secret leak into the SHIPPED bundle? (use a unique slice of the real key)
grep -rl '<unique-signature-of-service-role-or-api-key>' .next dist build 2>/dev/null   # expect: nothing
# What gets shipped to the browser? None of these may be a service-role / DB / paid-API key
grep -rhoE 'NEXT_PUBLIC_[A-Z0-9_]+' src | sort -u
# Secret sprawl on disk (uncommitted but plaintext)
find . -name '.env*' -not -path '*/node_modules/*' 2>/dev/null
ls -la .vercel*/ 2>/dev/null    # .vercel/.env.*.local and *.bak backups often hold SMTP/API creds
# Does the client hit the backend directly (needs anon key + RLS) or only via server routes?
grep -rnE 'createBrowserClient|createClientComponentClient|NEXT_PUBLIC_SUPABASE_ANON' src 2>/dev/null
```

## Phase 2 — Endpoints, auth & rate limiting

```bash
# Cron / scheduled auth — read the guard literally
grep -rnE 'CRON_SECRET|x-vercel-cron|authorization|Bearer|authoriseCron|isAuthorized' src/app/api 2>/dev/null
# Is CRON_SECRET actually set in the deploy env? (run where vercel CLI is linked)
vercel env ls 2>/dev/null | grep -i cron
# Rate limiting ANYWHERE — search many names before concluding "none"
grep -rniE 'ratelimit|rate-limit|rate_limit|@upstash|@vercel/kv|throttle|leaky|token.?bucket|429|too many requests' src 2>/dev/null
# Per-request fan-out to paid work (email / LLM / heavy writes)
grep -rnE 'sendMail|transporter|resend|messages\.create|chat/completions|fetch\(.+(api\.|/v1/)' src/app/api 2>/dev/null
# Validation libs in use
grep -rnE 'zod|valibot|yup|joi|safeParse' src/app/api 2>/dev/null
```

For each route, read the file and record: methods · auth line · validation · rate limit · paid work · service-role? · bot-hammer impact.

### Optional live probe (destructive — get OK first)
Only against the owner's own infra, with explicit permission, on the *cheapest* endpoint:
```bash
# Proves a cron gate exists (expect 401):
curl -s -o /dev/null -w '%{http_code}\n' https://SITE/api/cron/<cheapest>
# Proves header-spoof bypass (expect 401 if fixed; 200 = vulnerable & it RAN the job):
curl -s -o /dev/null -w '%{http_code}\n' -H 'x-vercel-cron: 1' https://SITE/api/cron/<cheapest>
```

## Phase 3 — RLS & data exposure

```bash
# As-coded posture from migrations
grep -rhoiE 'create table (if not exists )?[a-z_.]+' supabase/migrations | sort -u
grep -rniE 'enable row level security' supabase/migrations          # which tables are protected
grep -rniE 'create policy' supabase/migrations                      # how many, on what, USING what
grep -rniE 'using \(true\)|to anon|to public|grant .* to (anon|authenticated)' supabase/migrations  # over-permissive?
```

As-deployed (preferred — needs the RIGHT project reachable):
- Supabase MCP: `get_advisors {project_id, type:"security"}` — catches missing RLS, anon-executable `SECURITY DEFINER`, exposed views.

If the live project is NOT reachable via MCP, give the owner this to paste into the SQL editor:
```sql
select c.relname as table, c.relrowsecurity as rls_on,
       count(p.policyname) as policies
from pg_class c
join pg_namespace n on n.oid=c.relnamespace and n.nspname='public'
left join pg_policies p on p.tablename=c.relname and p.schemaname='public'
where c.relkind='r'
group by 1,2 order by rls_on, table;
```
Any PII table with `rls_on=false` is public-readable if the anon key is known. Or test directly:
```bash
curl -s 'https://<ref>.supabase.co/rest/v1/<pii_table>?select=*&limit=1' \
  -H "apikey: <ANON_KEY>"   # expect [] or 401, NOT customer rows
```

## Phase 4 — Platform spend caps (dashboard — list as owner actions if you can't see them)
- Supabase → Settings → Cost Control / Spend Cap = ON.
- Vercel → Settings → Spend Management = amount + action (pause project).
- Each paid API vendor → monthly hard spend limit.
- Billing alerts at 50/80/100% on every account.
