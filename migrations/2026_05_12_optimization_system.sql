-- =============================================================================
-- MCB Optimization System — Schema Migration
-- Run against the MCB Supabase project (lrhgrmklpvwyjzaipioh).
-- Idempotent. Safe to re-run.
-- =============================================================================

-- 1. Versioned scoring weights (lets the self-improvement loop change weights
--    over time without losing history).
create table if not exists public.optimization_weights (
    id              bigserial primary key,
    version         integer not null,
    signal_key      text not null,
    sub_score       text not null check (sub_score in ('discoverability','crawlability','engagement','conversion')),
    weight          numeric(6,3) not null,
    rationale       text,
    created_at      timestamptz not null default now(),
    is_active       boolean not null default false,
    unique (version, signal_key)
);

create index if not exists idx_opt_weights_active on public.optimization_weights (is_active, version desc);

-- 2. Run-level container (one row per scoring run).
create table if not exists public.optimization_runs (
    id              uuid primary key default gen_random_uuid(),
    started_at      timestamptz not null default now(),
    finished_at     timestamptz,
    weights_version integer not null,
    composite_score numeric(5,2),
    sub_scores      jsonb not null default '{}'::jsonb,
    signals         jsonb not null default '{}'::jsonb,
    error           text,
    trigger         text not null default 'cron' check (trigger in ('cron','manual','event','learn'))
);

create index if not exists idx_opt_runs_started on public.optimization_runs (started_at desc);

-- 3. Per-URL page scores (so we can rank pages by health).
create table if not exists public.optimization_page_scores (
    id              bigserial primary key,
    run_id          uuid not null references public.optimization_runs(id) on delete cascade,
    url_path        text not null,
    page_score      numeric(5,2) not null,
    sub_scores      jsonb not null default '{}'::jsonb,
    flags           jsonb not null default '[]'::jsonb,
    created_at      timestamptz not null default now()
);

create index if not exists idx_opt_page_scores_run on public.optimization_page_scores (run_id);
create index if not exists idx_opt_page_scores_url on public.optimization_page_scores (url_path, created_at desc);

-- 4. Issue queue — one row per actionable problem detected.
create table if not exists public.optimization_issues (
    id              uuid primary key default gen_random_uuid(),
    first_seen_run  uuid references public.optimization_runs(id) on delete set null,
    last_seen_run   uuid references public.optimization_runs(id) on delete set null,
    signal_key      text not null,
    sub_score       text not null,
    severity        text not null check (severity in ('low','medium','high','critical')),
    url_path        text,
    title           text not null,
    detail          text,
    recommended_fix text,
    expected_lift   numeric(5,2),
    status          text not null default 'open' check (status in ('open','in_progress','closed','snoozed','wont_fix')),
    closed_at       timestamptz,
    closed_run_id   uuid references public.optimization_runs(id) on delete set null,
    times_seen      integer not null default 1,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now(),
    unique (signal_key, url_path)
);

create index if not exists idx_opt_issues_status on public.optimization_issues (status, severity desc);
create index if not exists idx_opt_issues_signal on public.optimization_issues (signal_key);

-- Update updated_at on row change.
create or replace function public.touch_optimization_issue() returns trigger as $$
begin
    new.updated_at := now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists trg_touch_optimization_issue on public.optimization_issues;
create trigger trg_touch_optimization_issue
    before update on public.optimization_issues
    for each row execute function public.touch_optimization_issue();

-- 5. AI citation probes — did MCB get cited for a target query?
create table if not exists public.ai_citation_probes (
    id              uuid primary key default gen_random_uuid(),
    probed_at       timestamptz not null default now(),
    engine          text not null check (engine in ('perplexity','openai','google_ai_overviews','claude','gemini','manual')),
    query_text      text not null,
    cited           boolean not null,
    citation_url    text,
    citation_rank   integer,
    response_excerpt text,
    competitor_cited text[],
    raw_response    jsonb,
    cost_usd        numeric(8,4)
);

create index if not exists idx_ai_probes_probed_at on public.ai_citation_probes (probed_at desc);
create index if not exists idx_ai_probes_query on public.ai_citation_probes (query_text, probed_at desc);

-- 6. Learning ledger — every issue close → 14-day causal window → measured lift.
create table if not exists public.optimization_learning_log (
    id              uuid primary key default gen_random_uuid(),
    issue_id        uuid references public.optimization_issues(id) on delete set null,
    signal_key      text not null,
    closed_at       timestamptz not null,
    measure_window_days integer not null default 14,
    measured_at     timestamptz,
    baseline_conv_rate numeric(8,5),
    post_conv_rate  numeric(8,5),
    measured_lift_pct numeric(7,3),
    weight_before   numeric(6,3),
    weight_after    numeric(6,3),
    notes           text
);

create index if not exists idx_opt_learning_signal on public.optimization_learning_log (signal_key, closed_at desc);

-- 7. Bot hits live in analytics_events. Add a typed column (idempotent).
do $$ begin
    if not exists (select 1 from information_schema.columns
                   where table_schema='public' and table_name='analytics_events'
                   and column_name='bot_id') then
        alter table public.analytics_events add column bot_id text;
        create index idx_analytics_events_bot on public.analytics_events (bot_id, created_at desc) where bot_id is not null;
    end if;
end $$;

-- 8. Materialised view — last-known optimization snapshot for the dashboard.
drop view if exists public.optimization_current cascade;
create or replace view public.optimization_current as
select
    runs.id                  as run_id,
    runs.started_at,
    runs.finished_at,
    runs.weights_version,
    runs.composite_score,
    runs.sub_scores,
    runs.signals,
    (select count(*) from public.optimization_issues where status = 'open')              as open_issues,
    (select count(*) from public.optimization_issues where status = 'open' and severity = 'critical') as critical_issues,
    (select count(*) from public.ai_citation_probes
     where probed_at > now() - interval '7 days' and cited = true)                       as citations_7d,
    (select count(*) from public.ai_citation_probes
     where probed_at > now() - interval '7 days')                                        as probes_7d
from public.optimization_runs runs
where runs.finished_at is not null
order by runs.started_at desc
limit 1;

-- 9. View — bot traffic last 7 days, by bot.
drop view if exists public.bot_traffic_7d cascade;
create or replace view public.bot_traffic_7d as
select
    bot_id,
    count(*)                  as hits,
    count(distinct page_path) as unique_paths,
    max(created_at)           as last_seen
from public.analytics_events
where bot_id is not null
  and created_at > now() - interval '7 days'
group by bot_id
order by hits desc;

-- 10. View — citation rate by engine (last 30 days).
drop view if exists public.citation_rate_30d cascade;
create or replace view public.citation_rate_30d as
select
    engine,
    count(*)                                                              as probes,
    count(*) filter (where cited)                                         as cites,
    round(count(*) filter (where cited)::numeric / nullif(count(*),0) * 100, 1) as cite_rate_pct,
    max(probed_at)                                                        as last_probe
from public.ai_citation_probes
where probed_at > now() - interval '30 days'
group by engine
order by cite_rate_pct desc nulls last;

-- 11. Seed initial weights v1 (active).
insert into public.optimization_weights (version, signal_key, sub_score, weight, rationale, is_active)
values
    -- Discoverability (target sum: 25)
    (1, 'llms_txt_present',         'discoverability', 4.0, 'llms.txt is the new robots.txt for AI engines', true),
    (1, 'sitemap_fresh',            'discoverability', 3.0, 'Stale sitemap → AI engines miss new pages', true),
    (1, 'jsonld_org_complete',      'discoverability', 4.0, 'Organization schema with full NAP + sameAs', true),
    (1, 'jsonld_localbusiness_per_location', 'discoverability', 4.0, 'Per-suburb LocalBusiness for "near me"', true),
    (1, 'jsonld_aggregaterating',   'discoverability', 3.0, 'AggregateRating drives review snippets', true),
    (1, 'jsonld_faqpage_coverage',  'discoverability', 3.0, 'FAQ blocks are extractive gold for AI engines', true),
    (1, 'ai_citation_rate',         'discoverability', 4.0, 'Live measure of AI search visibility', true),
    -- Crawlability (15)
    (1, 'render_parity',            'crawlability',    5.0, 'JS-rendered content invisible to many AI bots', true),
    (1, 'lcp_under_2_5s',           'crawlability',    3.0, 'Core Web Vitals — Largest Contentful Paint', true),
    (1, 'cls_under_0_1',            'crawlability',    2.0, 'Layout shift — degrades AI extraction', true),
    (1, 'no_broken_internal_links', 'crawlability',    3.0, '404s tank crawl budget', true),
    (1, 'mobile_viewport_ok',       'crawlability',    2.0, 'Mobile-first crawler still primary', true),
    -- Engagement (25)
    (1, 'avg_engaged_seconds',      'engagement',      6.0, 'Higher engagement = AI engines reward intent match', true),
    (1, 'pages_per_session',        'engagement',      5.0, 'Multi-page = navigable architecture', true),
    (1, 'bounce_rate',              'engagement',      5.0, 'High bounce = wrong message', true),
    (1, 'avg_max_scroll_pct',       'engagement',      4.0, 'Scroll depth proxy for content fit', true),
    (1, 'rage_click_rate',          'engagement',      5.0, 'Clarity rage clicks = UX friction', true),
    -- Conversion (35) — most weight, where the money is
    (1, 'quote_step1_start_rate',   'conversion',      6.0, 'Of all sessions, % starting quote', true),
    (1, 'step1_to_step2_rate',      'conversion',      6.0, 'Mid-funnel completion', true),
    (1, 'step2_to_submit_rate',     'conversion',      6.0, 'Submit-completion (form drop-off detector)', true),
    (1, 'submit_to_lead_stored',    'conversion',      4.0, 'Server-side reliability', true),
    (1, 'phone_tap_rate',           'conversion',      4.0, 'Alt conversion path (high-intent mobile)', true),
    (1, 'cost_per_lead_paid',       'conversion',      5.0, 'CPL trend (lower = better)', true),
    (1, 'lead_quality_score',       'conversion',      4.0, 'Avg windows/products per lead', true)
on conflict (version, signal_key) do nothing;

-- 12. Realtime publication so dashboard subscriptions fire on inserts.
do $$ begin
    if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        create publication supabase_realtime;
    end if;
end $$;

do $$ begin
    begin
        alter publication supabase_realtime add table public.optimization_runs;
    exception when duplicate_object then null;
    end;
    begin
        alter publication supabase_realtime add table public.optimization_issues;
    exception when duplicate_object then null;
    end;
    begin
        alter publication supabase_realtime add table public.ai_citation_probes;
    exception when duplicate_object then null;
    end;
    begin
        alter publication supabase_realtime add table public.lead_submissions;
    exception when duplicate_object then null;
    end;
end $$;

-- 13. RLS — service role only (admin dashboard reads via service_role).
alter table public.optimization_runs        enable row level security;
alter table public.optimization_page_scores enable row level security;
alter table public.optimization_issues      enable row level security;
alter table public.optimization_weights     enable row level security;
alter table public.ai_citation_probes       enable row level security;
alter table public.optimization_learning_log enable row level security;

-- No public policies — service_role bypasses RLS so the dashboard works,
-- and anon/authenticated cannot read or write.

-- =============================================================================
-- Done. After running, the dashboard will populate on the first cron run.
-- =============================================================================
