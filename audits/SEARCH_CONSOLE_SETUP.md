# Search Console → Dashboard sync — setup

Once these 4 env vars are set on Vercel, the cron at `/api/cron/sync-search-console`
will pull daily search analytics into `seo_search_console_metrics`. The dashboard
"SEO Analytics" panel will then populate automatically.

Cron is already configured in `vercel.json` to run daily at 04:00 UTC.

You need to do this **once**, total time ~10 minutes.

---

## Step 1 — Confirm Search Console property

Open https://search.google.com/search-console (already done for you in Chrome).

Confirm that `moderncurtainsandblinds.com.au` shows up as a property and that
you're logged in as the owner. Note the exact property identifier:

- If it's a **Domain property** (preferred), the identifier is `sc-domain:moderncurtainsandblinds.com.au`
- If it's a **URL-prefix property**, the identifier is `https://moderncurtainsandblinds.com.au/` (with the trailing slash)

You'll paste this into the `GSC_PROPERTY_URL` env var below.

---

## Step 2 — Create an OAuth client in Google Cloud Console

1. Go to https://console.cloud.google.com/apis/credentials
2. If you don't have a project yet, create one called "MCB Website Data" or similar
3. Click **Create Credentials → OAuth client ID**
4. Application type: **Web application**
5. Name: `MCB Search Console Sync`
6. Authorized redirect URIs: add `https://developers.google.com/oauthplayground`
7. Click Create
8. Copy the **Client ID** and **Client Secret** — you'll paste these into env vars

While you're here, also enable the Search Console API:
- Go to https://console.cloud.google.com/apis/library/searchconsole.googleapis.com
- Click **Enable**

---

## Step 3 — Get a refresh token via OAuth Playground

1. Open https://developers.google.com/oauthplayground/
2. Click the gear ⚙️ in the top right
3. Tick **Use your own OAuth credentials**
4. Paste your Client ID and Client Secret from Step 2. Close the gear
5. In the left panel under **Step 1 — Select & authorize APIs**, paste this scope into the "Input your own scopes" box:
   ```
   https://www.googleapis.com/auth/webmasters.readonly
   ```
6. Click **Authorize APIs**
7. Sign in with the same Google account that owns the Search Console property
8. Grant access — you'll be returned to the Playground
9. On the next page, click **Exchange authorization code for tokens**
10. Copy the **Refresh token** value — this is the long string you'll paste into `GSC_REFRESH_TOKEN`

Important: the refresh token does not expire (unless you revoke it from your
Google account). Treat it like a password.

---

## Step 4 — Generate a cron secret

The cron route requires `Authorization: Bearer <secret>` so randoms on the
internet can't trigger your sync. Generate one:

```bash
openssl rand -base64 32
```

Copy the output.

---

## Step 5 — Paste all five into Vercel

Open https://vercel.com/alex-lewis-projects-6e9bb13b/mcb_2026_1/settings/environment-variables and add:

| Name | Value | Environment |
|---|---|---|
| `GSC_PROPERTY_URL` | `sc-domain:moderncurtainsandblinds.com.au` (or the URL-prefix form from Step 1) | Production |
| `GSC_CLIENT_ID` | from Step 2 | Production |
| `GSC_CLIENT_SECRET` | from Step 2 | Production |
| `GSC_REFRESH_TOKEN` | from Step 3 | Production |
| `CRON_SECRET` | from Step 4 | Production |

Save each one. **Redeploy** so the env vars take effect — `vercel deploy --prod`
or just push to main.

---

## Step 6 — Verify it works

Manually trigger the sync once to confirm:

```bash
curl -X POST https://moderncurtainsandblinds.com.au/api/cron/sync-search-console \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Expected response:
```json
{
  "ok": true,
  "window": { "startDate": "2026-05-04", "endDate": "2026-05-11" },
  "rows_fetched": 1234,
  "rows_upserted": 1234,
  "errors": []
}
```

If `ok: false` or `errors` is non-empty, the message will tell you which
credential is wrong. Most common issue: the OAuth user from Step 3 isn't an
owner of the Search Console property — re-do Step 3 with the right Google
account.

---

## What you get in the dashboard

Once data flows in, the existing `dashboard_top_pages_30d` view will combine
your analytics events with Search Console impressions/clicks, and the SEO
Analytics panel will show:

- Total clicks vs total impressions (organic-search performance)
- Average ranking position
- Per-query data: what people actually searched to find you
- Per-landing-page data: which of your suburb pages are getting impressions but
  no clicks (= weak title/meta description)

That last one is gold. It tells you exactly which pages are ranking but failing
to attract a click — usually a one-line title rewrite fixes them.

---

## Daily sync window

The cron runs at 04:00 UTC daily (~14:00 Melbourne winter / 15:00 summer). It
pulls the last 7 days, upserting — so missed days backfill automatically next
run. Initial first-sync will populate ~7 days of data.

Search Console publishes data with a 2-day delay, so today's data will appear
~3 days after the date in question. That's a Google thing, not us.
