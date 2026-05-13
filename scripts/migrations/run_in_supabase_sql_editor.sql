create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null check (char_length(event_name) between 1 and 120),
  visitor_id text,
  session_id text,
  page_path text,
  page_url text,
  page_title text,
  referrer_url text,
  landing_path text,
  source_path text,
  target_path text,
  product_interest text,
  properties jsonb not null default '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_name_idx on public.analytics_events (event_name);
create index if not exists analytics_events_page_path_idx on public.analytics_events (page_path);
create index if not exists analytics_events_session_idx on public.analytics_events (session_id);
create index if not exists analytics_events_visitor_idx on public.analytics_events (visitor_id);
create index if not exists analytics_events_utm_idx on public.analytics_events (utm_source, utm_medium, utm_campaign);

create table if not exists public.lead_submissions (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'quote_form' check (source in ('quote_form', 'chat_widget', 'manual', 'import', 'other')),
  status text not null default 'new' check (status in ('new', 'contacted', 'appointment_booked', 'quoted', 'won', 'lost', 'spam')),
  first_name text,
  last_name text,
  email text,
  phone text,
  suburb text,
  product_interests text[] not null default '{}'::text[],
  window_count text,
  referral text,
  referrer_name text,
  best_contact_time text,
  appointment_preference text,
  project_stage text,
  needs_advice boolean not null default false,
  message text,
  tracking_context jsonb not null default '{}'::jsonb,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lead_submissions_created_at_idx on public.lead_submissions (created_at desc);
create index if not exists lead_submissions_status_idx on public.lead_submissions (status);
create index if not exists lead_submissions_source_idx on public.lead_submissions (source);
create index if not exists lead_submissions_suburb_idx on public.lead_submissions (suburb);
create index if not exists lead_submissions_products_idx on public.lead_submissions using gin (product_interests);
create index if not exists lead_submissions_tracking_context_idx on public.lead_submissions using gin (tracking_context);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_submissions_updated_at on public.lead_submissions;
create trigger set_lead_submissions_updated_at
before update on public.lead_submissions
for each row
execute function public.set_updated_at();

create table if not exists public.seo_search_console_metrics (
  id bigint generated always as identity primary key,
  metric_date date not null,
  page_path text not null,
  search_query text not null default '',
  country text not null default '',
  device text not null default '',
  clicks integer not null default 0 check (clicks >= 0),
  impressions integer not null default 0 check (impressions >= 0),
  ctr numeric(8, 6),
  position numeric(8, 3),
  created_at timestamptz not null default now(),
  unique (metric_date, page_path, search_query, country, device)
);

create index if not exists seo_search_console_metrics_date_idx on public.seo_search_console_metrics (metric_date desc);
create index if not exists seo_search_console_metrics_page_idx on public.seo_search_console_metrics (page_path);
create index if not exists seo_search_console_metrics_query_idx on public.seo_search_console_metrics (search_query);

create table if not exists public.seo_page_snapshots (
  id uuid primary key default gen_random_uuid(),
  page_path text not null,
  page_url text,
  captured_at timestamptz not null default now(),
  status_code integer,
  title text,
  meta_description text,
  canonical_url text,
  h1 text,
  noindex boolean not null default false,
  word_count integer,
  internal_link_count integer,
  image_count integer,
  missing_alt_count integer,
  schema_types text[] not null default '{}'::text[],
  performance_score numeric(5, 2),
  seo_score numeric(5, 2),
  issues jsonb not null default '[]'::jsonb
);

create index if not exists seo_page_snapshots_page_idx on public.seo_page_snapshots (page_path);
create index if not exists seo_page_snapshots_captured_idx on public.seo_page_snapshots (captured_at desc);

create table if not exists public.social_tracking_links (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  platform text not null check (platform in ('instagram', 'facebook', 'tiktok', 'linkedin', 'pinterest', 'youtube', 'other')),
  placement text not null check (char_length(placement) between 1 and 160),
  destination_path text not null default '/',
  destination_url text not null,
  utm_source text not null,
  utm_medium text not null default 'social',
  utm_campaign text not null,
  utm_content text,
  utm_term text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists social_tracking_links_platform_idx on public.social_tracking_links (platform);
create index if not exists social_tracking_links_utm_idx on public.social_tracking_links (utm_source, utm_medium, utm_campaign, utm_content);
create index if not exists social_tracking_links_created_at_idx on public.social_tracking_links (created_at desc);

drop trigger if exists set_social_tracking_links_updated_at on public.social_tracking_links;
create trigger set_social_tracking_links_updated_at
before update on public.social_tracking_links
for each row
execute function public.set_updated_at();

create or replace view public.dashboard_daily_metrics
with (security_invoker = true)
as
with event_daily as (
  select
    created_at::date as metric_date,
    count(*) filter (where event_name = 'page_view') as page_views,
    count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
    count(distinct session_id) filter (where session_id is not null) as sessions,
    count(*) filter (where event_name = 'quote_form_start') as quote_form_starts,
    count(*) filter (where event_name = 'quote_step_3_submit') as quote_submits,
    count(*) filter (where event_name = 'quote_success') as quote_successes,
    count(*) filter (where event_name = 'phone_tap') as phone_taps,
    count(*) filter (where event_name = 'chat_widget_open') as chat_opens,
    count(*) filter (where event_name = 'chat_lead_success') as chat_leads
  from public.analytics_events
  group by created_at::date
),
lead_daily as (
  select created_at::date as metric_date, count(*) as leads
  from public.lead_submissions
  group by created_at::date
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
  count(distinct visitor_id) filter (where visitor_id is not null) as visitors,
  count(*) filter (where event_name = 'quote_cta_click') as quote_clicks,
  count(*) filter (where event_name = 'phone_tap') as phone_taps,
  count(*) filter (where event_name = 'chat_widget_open') as chat_opens
from public.analytics_events
where created_at >= now() - interval '30 days'
  and page_path is not null
group by page_path
order by page_views desc, quote_clicks desc;

create or replace view public.dashboard_conversion_funnel_30d
with (security_invoker = true)
as
select *
from (
  select 1 as sort_order, 'Page views'::text as stage, count(*)::bigint as total from public.analytics_events where created_at >= now() - interval '30 days' and event_name = 'page_view'
  union all
  select 2, 'Quote CTA clicks', count(*)::bigint from public.analytics_events where created_at >= now() - interval '30 days' and event_name = 'quote_cta_click'
  union all
  select 3, 'Quote form starts', count(*)::bigint from public.analytics_events where created_at >= now() - interval '30 days' and event_name = 'quote_form_start'
  union all
  select 4, 'Quote submits', count(*)::bigint from public.analytics_events where created_at >= now() - interval '30 days' and event_name = 'quote_step_3_submit'
  union all
  select 5, 'Quote successes', count(*)::bigint from public.analytics_events where created_at >= now() - interval '30 days' and event_name = 'quote_success'
  union all
  select 6, 'Stored leads', count(*)::bigint from public.lead_submissions where created_at >= now() - interval '30 days'
) funnel
order by sort_order;

create or replace view public.dashboard_lead_sources_30d
with (security_invoker = true)
as
select
  coalesce(
    nullif(tracking_context ->> 'utmSource', ''),
    nullif(tracking_context ->> 'utm_source', ''),
    nullif(referral, ''),
    source,
    'unknown'
  ) as lead_source,
  count(*) as leads,
  count(*) filter (where status = 'won') as won,
  count(*) filter (where status = 'lost') as lost,
  count(*) filter (where status = 'new') as new
from public.lead_submissions
where created_at >= now() - interval '30 days'
group by coalesce(
  nullif(tracking_context ->> 'utmSource', ''),
  nullif(tracking_context ->> 'utm_source', ''),
  nullif(referral, ''),
  source,
  'unknown'
)
order by leads desc;

create or replace view public.dashboard_social_link_performance_30d
with (security_invoker = true)
as
with event_counts as (
  select
    link.id,
    count(events.id) filter (where events.event_name = 'page_view') as page_views,
    count(distinct events.visitor_id) filter (where events.visitor_id is not null) as visitors,
    count(distinct events.session_id) filter (where events.session_id is not null) as sessions,
    count(events.id) filter (where events.event_name = 'quote_cta_click') as quote_clicks,
    count(events.id) filter (where events.event_name = 'phone_tap') as phone_taps,
    count(events.id) filter (where events.event_name = 'chat_widget_open') as chat_opens,
    count(events.id) filter (where events.event_name = 'quote_success') as quote_successes
  from public.social_tracking_links link
  left join public.analytics_events events
    on events.created_at >= now() - interval '30 days'
   and events.utm_source = link.utm_source
   and events.utm_medium = link.utm_medium
   and events.utm_campaign = link.utm_campaign
   and coalesce(events.utm_content, '') = coalesce(link.utm_content, '')
  group by link.id
),
lead_counts as (
  select
    link.id,
    count(leads.id) as leads
  from public.social_tracking_links link
  left join public.lead_submissions leads
    on leads.created_at >= now() - interval '30 days'
   and coalesce(leads.tracking_context ->> 'utmSource', leads.tracking_context ->> 'utm_source', '') = link.utm_source
   and coalesce(leads.tracking_context ->> 'utmMedium', leads.tracking_context ->> 'utm_medium', '') = link.utm_medium
   and coalesce(leads.tracking_context ->> 'utmCampaign', leads.tracking_context ->> 'utm_campaign', '') = link.utm_campaign
   and coalesce(leads.tracking_context ->> 'utmContent', leads.tracking_context ->> 'utm_content', '') = coalesce(link.utm_content, '')
  group by link.id
)
select
  link.id,
  link.name,
  link.platform,
  link.placement,
  link.destination_path,
  link.destination_url,
  link.utm_source,
  link.utm_medium,
  link.utm_campaign,
  link.utm_content,
  link.active,
  link.created_at,
  coalesce(event_counts.page_views, 0) as page_views,
  coalesce(event_counts.visitors, 0) as visitors,
  coalesce(event_counts.sessions, 0) as sessions,
  coalesce(event_counts.quote_clicks, 0) as quote_clicks,
  coalesce(event_counts.phone_taps, 0) as phone_taps,
  coalesce(event_counts.chat_opens, 0) as chat_opens,
  coalesce(event_counts.quote_successes, 0) as quote_successes,
  coalesce(lead_counts.leads, 0) as leads
from public.social_tracking_links link
left join event_counts using (id)
left join lead_counts using (id)
order by link.created_at desc;

alter table public.analytics_events enable row level security;
alter table public.lead_submissions enable row level security;
alter table public.seo_search_console_metrics enable row level security;
alter table public.seo_page_snapshots enable row level security;
alter table public.social_tracking_links enable row level security;

revoke all on table public.analytics_events from anon, authenticated;
revoke all on table public.lead_submissions from anon, authenticated;
revoke all on table public.seo_search_console_metrics from anon, authenticated;
revoke all on table public.seo_page_snapshots from anon, authenticated;
revoke all on table public.social_tracking_links from anon, authenticated;
