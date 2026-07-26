-- Fix headline dashboard views: bot-filter + Melbourne-time bucketing.
--
-- WHAT THIS FIXES
--   dashboard_daily_metrics, dashboard_top_pages_30d and
--   dashboard_conversion_funnel_30d were created 2026-05-06, BEFORE the
--   analytics_events_clean bot-filter view existed (2026-05-13). They kept
--   reading the raw public.analytics_events table, so:
--     1. Bot sessions inflated visitors/sessions. Real example: the
--        dashboard showed 421 "visitors" on 2026-05-26 and 425 on 05-27
--        vs ~36-40 real humans, and visitors > page_views on several days
--        (impossible) because bots fire non-page_view events with unique
--        visitor_ids. When bot crawling tailed off, the same column read
--        ~22, which *looked* like a traffic crash but was just the bot
--        padding disappearing.
--     2. `group by created_at::date` bucketed by UTC, so the dashboard's
--        "today" only began at 10:00 Australia/Melbourne (00:00 UTC),
--        dropping the local midnight-10am window and understating the
--        current day until late evening.
--   CLAUDE.md rule: "Headline KPIs should read from analytics_events_clean."
--
-- THE CHANGES
--   * FROM public.analytics_events  ->  public.analytics_events_clean
--   * daily bucket: (created_at at time zone 'Australia/Melbourne')::date
--     (DST-correct: AEST/AEDT handled by the named zone, not a fixed +10)
--   * visitors/sessions distinct counts are now scoped to page_view events,
--     so visitors <= page_views and sessions <= page_views can never be
--     violated again.
--
-- HOW TO APPLY
--   Paste into the Supabase SQL editor for the MCB website project:
--     https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new
--   (The connected Supabase MCP points at a different project, per CLAUDE.md,
--   so this cannot be applied through it.)
--   Idempotent: create-or-replace only, no data is modified. The dashboard
--   reflects the corrected numbers on next load (no redeploy needed).

create or replace view public.dashboard_daily_metrics
with (security_invoker = true)
as
with event_daily as (
  select
    (created_at at time zone 'Australia/Melbourne')::date as metric_date,
    count(*) filter (where event_name = 'page_view') as page_views,
    count(distinct visitor_id) filter (where event_name = 'page_view' and visitor_id is not null) as visitors,
    count(distinct session_id) filter (where event_name = 'page_view' and session_id is not null) as sessions,
    count(*) filter (where event_name = 'quote_form_start') as quote_form_starts,
    count(*) filter (where event_name = 'quote_step_3_submit') as quote_submits,
    count(*) filter (where event_name = 'quote_success') as quote_successes,
    count(*) filter (where event_name = 'phone_tap') as phone_taps,
    count(*) filter (where event_name = 'chat_widget_open') as chat_opens,
    count(*) filter (where event_name = 'chat_lead_success') as chat_leads
  from public.analytics_events_clean
  group by (created_at at time zone 'Australia/Melbourne')::date
),
lead_daily as (
  select
    (created_at at time zone 'Australia/Melbourne')::date as metric_date,
    count(*) as leads
  from public.lead_submissions
  group by (created_at at time zone 'Australia/Melbourne')::date
)
select
  coalesce(event_daily.metric_date, lead_daily.metric_date) as metric_date,
  coalesce(event_daily.page_views, 0) as page_views,
  coalesce(event_daily.visitors, 0) as visitors,
  coalesce(event_daily.sessions, 0) as sessions,
  coalesce(event_daily.quote_form_starts, 0) as quote_form_starts,
  coalesce(event_daily.quote_submits, 0) as quote_submits,
  coalesce(event_daily.quote_successes, 0) as quote_successes,
  coalesce(event_daily.phone_taps, 0) as phone_taps,
  coalesce(event_daily.chat_opens, 0) as chat_opens,
  coalesce(event_daily.chat_leads, 0) as chat_leads,
  coalesce(lead_daily.leads, 0) as leads
from event_daily
full join lead_daily using (metric_date)
order by metric_date desc;

create or replace view public.dashboard_top_pages_30d
with (security_invoker = true)
as
select
  page_path,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(distinct visitor_id) filter (where event_name = 'page_view' and visitor_id is not null) as visitors,
  count(*) filter (where event_name = 'quote_cta_click') as quote_clicks,
  count(*) filter (where event_name = 'phone_tap') as phone_taps,
  count(*) filter (where event_name = 'chat_widget_open') as chat_opens
from public.analytics_events_clean
where created_at >= now() - interval '30 days'
  and page_path is not null
group by page_path
order by page_views desc, quote_clicks desc;

create or replace view public.dashboard_conversion_funnel_30d
with (security_invoker = true)
as
select *
from (
  select 1 as sort_order, 'Page views'::text as stage, count(*)::bigint as total from public.analytics_events_clean where created_at >= now() - interval '30 days' and event_name = 'page_view'
  union all
  select 2, 'Quote CTA clicks', count(*)::bigint from public.analytics_events_clean where created_at >= now() - interval '30 days' and event_name = 'quote_cta_click'
  union all
  select 3, 'Quote form starts', count(*)::bigint from public.analytics_events_clean where created_at >= now() - interval '30 days' and event_name = 'quote_form_start'
  union all
  select 4, 'Quote submits', count(*)::bigint from public.analytics_events_clean where created_at >= now() - interval '30 days' and event_name = 'quote_step_3_submit'
  union all
  select 5, 'Quote successes', count(*)::bigint from public.analytics_events_clean where created_at >= now() - interval '30 days' and event_name = 'quote_success'
  union all
  select 6, 'Stored leads', count(*)::bigint from public.lead_submissions where created_at >= now() - interval '30 days'
) funnel
order by sort_order;
