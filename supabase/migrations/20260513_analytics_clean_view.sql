-- Bot-filtering helper function + clean analytics view.
-- The existing raw `analytics_events` table is untouched. Any future
-- bot-aware query reads from `analytics_events_clean` instead.
--
-- Pattern list mirrors the JS-side parseUserAgent in src/lib/server/request-meta.ts
-- so a row is "bot" if EITHER:
--   (a) device_type column was set to 'bot' at ingest (post-2026-05-13 rows), OR
--   (b) user_agent matches the heuristic regex (covers pre-migration rows too)

create or replace function public.is_bot_user_agent(ua text)
returns boolean
language sql
immutable
as $$
  select case
    when ua is null or ua = '' then false
    else ua ~* '(bot|crawler|spider|crawling|facebookexternalhit|slurp|preview|googlebot|bingbot|yandex|duckduckbot|baiduspider|pingdom|uptime|monitor|headlesschrome|phantomjs|puppeteer|playwright|http[s]?client|curl|wget|python-requests|axios)'
  end;
$$;

comment on function public.is_bot_user_agent(text) is
  'Heuristic bot UA detector used by analytics_events_clean. Conservative — false positives are acceptable since the clean view is for headline KPIs only; raw table retains everything.';

create or replace view public.analytics_events_clean
with (security_invoker = true)
as
select *
from public.analytics_events
where coalesce(device_type, '') <> 'bot'
  and not public.is_bot_user_agent(user_agent);

comment on view public.analytics_events_clean is
  'Bot-filtered view over analytics_events. Use this for headline KPIs. Raw table remains the source of truth.';

-- Helper view: per-session bot vs human split for the dashboard summary.
create or replace view public.dashboard_traffic_quality_30d
with (security_invoker = true)
as
with classified as (
  select
    session_id,
    bool_or(
      coalesce(device_type, '') = 'bot' or public.is_bot_user_agent(user_agent)
    ) as is_bot_session
  from public.analytics_events
  where created_at >= now() - interval '30 days'
    and session_id is not null
  group by session_id
)
select
  count(*) filter (where not is_bot_session) as human_sessions,
  count(*) filter (where is_bot_session) as bot_sessions,
  count(*) as total_sessions,
  round(
    100.0 * count(*) filter (where is_bot_session) / nullif(count(*), 0),
    1
  ) as bot_share_pct
from classified;

-- Clean equivalents of the engagement totals + recent sessions views,
-- so headline KPIs can switch over without touching the existing dashboard code.
create or replace view public.dashboard_engagement_totals_30d_clean
with (security_invoker = true)
as
with sessions as (
  select
    session_id,
    sum(coalesce(engagement_seconds, 0)) filter (where event_name = 'engagement_tick') as engaged_seconds,
    count(*) filter (where event_name = 'page_view') as page_views,
    max(scroll_percent) as max_scroll_percent
  from public.analytics_events_clean
  where created_at >= now() - interval '30 days'
    and session_id is not null
  group by session_id
)
select
  count(*) as total_sessions,
  round(avg(engaged_seconds))::int as avg_engaged_seconds,
  round(avg(page_views)::numeric, 2) as avg_pages_per_session,
  round(avg(max_scroll_percent))::int as avg_max_scroll_percent,
  count(*) filter (where page_views = 1) as bounced_sessions
from sessions;

-- CTA performance by location/variant — powers the validation dashboard once
-- agents start firing `cta_impression` events.
create or replace view public.dashboard_cta_performance_30d
with (security_invoker = true)
as
with impressions as (
  select
    coalesce(properties ->> 'location', 'unknown') as location,
    coalesce(properties ->> 'variant', 'default') as variant,
    count(*) as impressions,
    count(distinct session_id) as sessions_with_impression
  from public.analytics_events_clean
  where event_name = 'cta_impression'
    and created_at >= now() - interval '30 days'
  group by 1, 2
),
clicks as (
  select
    coalesce(properties ->> 'location', 'unknown') as location,
    coalesce(properties ->> 'variant', 'default') as variant,
    count(*) as clicks
  from public.analytics_events_clean
  where event_name = 'quote_cta_click'
    and created_at >= now() - interval '30 days'
  group by 1, 2
)
select
  i.location,
  i.variant,
  coalesce(c.clicks, 0) as clicks,
  i.impressions,
  i.sessions_with_impression,
  case when i.impressions > 0
    then round(100.0 * coalesce(c.clicks, 0) / i.impressions, 2)
    else null
  end as ctr_on_impressions_pct
from impressions i
left join clicks c on c.location = i.location and c.variant = i.variant
order by i.impressions desc;

-- Replacement for dashboard_traffic_sources_30d that splits Google Ads
-- (sessions with a gclid) from Google Organic, and uses the clean view.
create or replace view public.dashboard_traffic_sources_30d
with (security_invoker = true)
as
with base as (
  select
    case
      when nullif(gclid, '') is not null then 'Google Ads'
      when nullif(utm_source, '') is not null then utm_source
      when nullif(referrer_url, '') is null then 'direct'
      else regexp_replace(
        coalesce((regexp_match(referrer_url, '^https?://([^/]+)'))[1], 'unknown'),
        '^www\.', ''
      )
    end as source,
    visitor_id,
    session_id,
    event_name
  from public.analytics_events_clean
  where created_at >= now() - interval '30 days'
)
select
  source,
  count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
  count(distinct session_id) filter (where session_id is not null) as sessions,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(*) filter (where event_name = 'quote_cta_click') as quote_clicks
from base
group by source
order by visitors desc;

-- Experiment exposure → conversion view for the validation dashboard.
create or replace view public.dashboard_experiment_results_30d
with (security_invoker = true)
as
with exposures as (
  select
    coalesce(properties ->> 'experiment', 'unknown') as experiment,
    coalesce(properties ->> 'variant', 'default') as variant,
    visitor_id,
    min(created_at) as first_exposure
  from public.analytics_events_clean
  where event_name = 'experiment_exposure'
    and created_at >= now() - interval '30 days'
    and visitor_id is not null
  group by 1, 2, 3
),
conversions as (
  select
    e.experiment,
    e.variant,
    count(distinct e.visitor_id) as exposed_visitors,
    count(distinct case when ev.event_name = 'quote_cta_click' then e.visitor_id end) as cta_clickers,
    count(distinct case when ev.event_name = 'quote_success' then e.visitor_id end) as completed_quotes
  from exposures e
  left join public.analytics_events_clean ev
    on ev.visitor_id = e.visitor_id
   and ev.created_at >= e.first_exposure
   and ev.created_at < now()
  group by e.experiment, e.variant
)
select
  experiment,
  variant,
  exposed_visitors,
  cta_clickers,
  completed_quotes,
  case when exposed_visitors > 0
    then round(100.0 * cta_clickers / exposed_visitors, 2)
    else null
  end as cta_click_rate_pct,
  case when exposed_visitors > 0
    then round(100.0 * completed_quotes / exposed_visitors, 2)
    else null
  end as conversion_rate_pct
from conversions
order by experiment, variant;
