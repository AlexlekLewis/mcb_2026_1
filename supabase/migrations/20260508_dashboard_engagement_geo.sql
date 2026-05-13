-- Adds geo, device, scroll depth and engagement tracking to analytics_events
-- and creates new dashboard views to expose them.

alter table public.analytics_events
  add column if not exists country text,
  add column if not exists region text,
  add column if not exists city text,
  add column if not exists latitude numeric(10, 6),
  add column if not exists longitude numeric(10, 6),
  add column if not exists device_type text,
  add column if not exists browser text,
  add column if not exists os text,
  add column if not exists scroll_percent smallint,
  add column if not exists engagement_seconds integer,
  add column if not exists viewport_width smallint,
  add column if not exists viewport_height smallint;

create index if not exists analytics_events_country_idx on public.analytics_events (country);
create index if not exists analytics_events_city_idx on public.analytics_events (city);
create index if not exists analytics_events_device_idx on public.analytics_events (device_type);
create index if not exists analytics_events_session_created_idx on public.analytics_events (session_id, created_at);

-- Top locations (city + region + country) for the last 30 days.
create or replace view public.dashboard_locations_30d
with (security_invoker = true)
as
select
  coalesce(nullif(city, ''), 'Unknown') as city,
  coalesce(nullif(region, ''), '') as region,
  coalesce(nullif(country, ''), 'Unknown') as country,
  count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
  count(distinct session_id) filter (where session_id is not null) as sessions,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(*) filter (where event_name = 'quote_cta_click') as quote_clicks,
  count(*) filter (where event_name = 'phone_tap') as phone_taps
from public.analytics_events
where created_at >= now() - interval '30 days'
  and country is not null
group by 1, 2, 3
order by visitors desc nulls last, sessions desc;

-- Country-level rollup so the geo panel can render a clean top-N.
create or replace view public.dashboard_countries_30d
with (security_invoker = true)
as
select
  coalesce(nullif(country, ''), 'Unknown') as country,
  count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
  count(distinct session_id) filter (where session_id is not null) as sessions,
  count(*) filter (where event_name = 'page_view') as page_views
from public.analytics_events
where created_at >= now() - interval '30 days'
group by 1
order by visitors desc nulls last;

-- Device / browser / os splits.
create or replace view public.dashboard_devices_30d
with (security_invoker = true)
as
select
  coalesce(nullif(device_type, ''), 'unknown') as device_type,
  count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
  count(distinct session_id) filter (where session_id is not null) as sessions,
  count(*) filter (where event_name = 'page_view') as page_views
from public.analytics_events
where created_at >= now() - interval '30 days'
group by 1
order by visitors desc;

create or replace view public.dashboard_browsers_30d
with (security_invoker = true)
as
select
  coalesce(nullif(browser, ''), 'Unknown') as browser,
  count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
  count(distinct session_id) filter (where session_id is not null) as sessions
from public.analytics_events
where created_at >= now() - interval '30 days'
group by 1
order by visitors desc;

-- Traffic source rollup: prefers UTM source, then referrer host, then 'direct'.
create or replace view public.dashboard_traffic_sources_30d
with (security_invoker = true)
as
with base as (
  select
    case
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
  from public.analytics_events
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

-- Hour-of-day pattern (UTC-stored, displayed in Melbourne in the UI).
create or replace view public.dashboard_hourly_30d
with (security_invoker = true)
as
select
  extract(hour from created_at at time zone 'Australia/Melbourne')::int as hour,
  count(*) filter (where event_name = 'page_view') as page_views,
  count(distinct session_id) filter (where session_id is not null) as sessions
from public.analytics_events
where created_at >= now() - interval '30 days'
group by 1
order by 1;

-- Per-page engagement: page views, unique visitors, avg scroll, avg engaged time.
create or replace view public.dashboard_page_engagement_30d
with (security_invoker = true)
as
with views as (
  select page_path,
    count(*) as page_views,
    count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
    count(distinct session_id) filter (where session_id is not null) as sessions
  from public.analytics_events
  where created_at >= now() - interval '30 days'
    and event_name = 'page_view'
    and page_path is not null
  group by page_path
),
scrolls as (
  select page_path, max(scroll_percent) as max_scroll
  from public.analytics_events
  where created_at >= now() - interval '30 days'
    and event_name = 'scroll_depth'
    and page_path is not null
    and scroll_percent is not null
  group by page_path, session_id, visitor_id
),
scroll_avg as (
  select page_path, round(avg(max_scroll))::int as avg_scroll_percent
  from scrolls
  group by page_path
),
engagement as (
  select
    page_path,
    session_id,
    sum(coalesce(engagement_seconds, 0)) as session_engaged
  from public.analytics_events
  where created_at >= now() - interval '30 days'
    and event_name = 'engagement_tick'
    and page_path is not null
  group by page_path, session_id
),
engagement_avg as (
  select page_path, round(avg(session_engaged))::int as avg_engaged_seconds
  from engagement
  group by page_path
)
select
  v.page_path,
  v.page_views,
  v.visitors,
  v.sessions,
  coalesce(s.avg_scroll_percent, 0) as avg_scroll_percent,
  coalesce(e.avg_engaged_seconds, 0) as avg_engaged_seconds
from views v
left join scroll_avg s using (page_path)
left join engagement_avg e using (page_path)
order by v.page_views desc;

-- Per-session summary: when, where, what device, how many pages, total engaged seconds.
create or replace view public.dashboard_recent_sessions_30d
with (security_invoker = true)
as
with session_events as (
  select
    session_id,
    visitor_id,
    min(created_at) as started_at,
    max(created_at) as last_event_at,
    count(*) filter (where event_name = 'page_view') as page_views,
    count(distinct page_path) filter (where event_name = 'page_view') as unique_pages,
    sum(coalesce(engagement_seconds, 0)) filter (where event_name = 'engagement_tick') as engaged_seconds,
    max(scroll_percent) as max_scroll_percent,
    bool_or(event_name = 'quote_cta_click') as clicked_quote_cta,
    bool_or(event_name = 'phone_tap') as tapped_phone,
    bool_or(event_name = 'quote_success') as completed_quote
  from public.analytics_events
  where created_at >= now() - interval '30 days'
    and session_id is not null
  group by session_id, visitor_id
),
session_meta as (
  select distinct on (session_id)
    session_id,
    landing_path,
    referrer_url,
    utm_source,
    utm_medium,
    utm_campaign,
    country,
    region,
    city,
    device_type,
    browser,
    os
  from public.analytics_events
  where session_id is not null
  order by session_id, created_at asc
)
select
  e.session_id,
  e.visitor_id,
  e.started_at,
  e.last_event_at,
  greatest(extract(epoch from (e.last_event_at - e.started_at))::int, coalesce(e.engaged_seconds, 0)) as duration_seconds,
  coalesce(e.engaged_seconds, 0) as engaged_seconds,
  e.page_views,
  e.unique_pages,
  coalesce(e.max_scroll_percent, 0) as max_scroll_percent,
  e.clicked_quote_cta,
  e.tapped_phone,
  e.completed_quote,
  m.landing_path,
  m.referrer_url,
  m.utm_source,
  m.utm_medium,
  m.utm_campaign,
  m.country,
  m.region,
  m.city,
  m.device_type,
  m.browser,
  m.os
from session_events e
left join session_meta m using (session_id)
order by e.started_at desc;

-- Aggregate engagement KPIs for headline cards.
create or replace view public.dashboard_engagement_totals_30d
with (security_invoker = true)
as
with sessions as (
  select
    session_id,
    sum(coalesce(engagement_seconds, 0)) filter (where event_name = 'engagement_tick') as engaged_seconds,
    count(*) filter (where event_name = 'page_view') as page_views,
    max(scroll_percent) as max_scroll_percent
  from public.analytics_events
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
