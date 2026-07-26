# Report template

Fill this in. Lead with the verdict, order findings by money + data risk, make every fix copy-pasteable.

---

## Cost & Security Audit — <app> — <date>

**Scope:** <repo path> · live project ref `<ref>` · deploy <vercel/...>
**Verified against live infra?** <yes via MCP / no — migration files + owner SQL check>

### Verdict against the three goals
- **① Never overspend:** <PASS / AT RISK> — <one line: are platform spend caps on?>
- **② Can't get spent by bots:** <PASS / AT RISK> — <one line: cron auth + rate limits>
- **③ Nothing exposed / data protected:** <PASS / AT RISK> — <one line: secrets + RLS>

### Findings (highest risk first)

| # | Sev | Finding | Where | If exploited | Fix |
|---|-----|---------|-------|--------------|-----|
| 1 | P0 | <e.g. cron auth bypassable via header> | `file:line` | <$ / data impact> | <exact change> |
| 2 | P1 | <no rate limit on public POST> | `file:line` | <…> | <…> |

For each P0/P1, expand below with the quoted code and the precise fix:

#### 1. <title> — P0
```ts
// file:line — the problem
```
**Why it costs you:** <concrete>
**Fix:**
```ts
// the corrected code, or the dashboard steps
```

### Owner action items (only you can do these — dashboard/account)
- [ ] Supabase Spend Cap ON — <link>
- [ ] Vercel Spend Management set to <$X> + pause — <link>
- [ ] `<PAID_API>` monthly limit set — <link>
- [ ] Confirm `CRON_SECRET` set in Vercel Production — `vercel env ls`
- [ ] Verify RLS on `<pii_table>` on the live DB — run the SQL check / anon REST probe

### What's already good (so it doesn't regress)
- <e.g. .env gitignored, no secrets in history, RLS deny-by-default as coded>
