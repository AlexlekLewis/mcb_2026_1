# MCB_WEBSITE_DATA Setup

Supabase project:

- Name: `MCB_WEBSITE_DATA`
- Project ref: `lrhgrmklpvwyjzaipioh`
- Region: `ap-southeast-2`
- URL: `https://lrhgrmklpvwyjzaipioh.supabase.co`

## Environment Variables

Add these to local development and Vercel.

```bash
SUPABASE_URL=https://lrhgrmklpvwyjzaipioh.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-with-service-role-key-from-supabase
DASHBOARD_USERNAME=replace-with-admin-email
DASHBOARD_PASSWORD=choose-a-strong-password
ANALYTICS_IP_SALT=choose-a-random-private-string
```

`SUPABASE_SERVICE_ROLE_KEY`, `DASHBOARD_PASSWORD`, and `ANALYTICS_IP_SALT` must stay private.

## What Is Stored

- `lead_submissions`: quote form and chat callback submissions.
- `analytics_events`: first-party events such as page views, quote clicks, phone taps, chat opens and quote funnel steps.
- `seo_search_console_metrics`: imported Google Search Console metrics.
- `seo_page_snapshots`: native SEO audit snapshots.
- `social_tracking_links`: reusable social media URLs and UTM presets.

## Dashboard

The dashboard route is `/dashboard`.

If `DASHBOARD_PASSWORD` is set, unauthenticated visitors are redirected to `/dashboard/login`.

- Email: the value of `DASHBOARD_USERNAME`
- Password: the value of `DASHBOARD_PASSWORD`

The dashboard will only show private data when the service role key is configured.

Social tracking links are managed at `/dashboard/social`.
