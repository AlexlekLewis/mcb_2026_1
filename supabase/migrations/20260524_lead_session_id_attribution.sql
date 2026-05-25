-- =====================================================================
-- Lead-session attribution column + view rewire
-- ---------------------------------------------------------------------
-- Adds session_id as a top-level column on lead_submissions so the
-- answer_performance view can join to analytics_events_clean.session_id
-- and attribute quote-form submissions back to the InlineAnswer URL the
-- visitor viewed within the previous 14 days.
--
-- The session_id has been captured client-side in the form's
-- trackingContext JSONB blob since the analytics layer shipped — this
-- migration just promotes it to a queryable column and backfills
-- historic rows from the JSONB. Zero client-side change needed; the
-- API route gets one extra field on the INSERT (committed alongside
-- this migration).
--
-- Apply via the Supabase SQL editor (NOT via the connected MCP).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Add column + index
-- ---------------------------------------------------------------------
alter table public.lead_submissions
  add column if not exists session_id text;

create index if not exists idx_lead_submissions_session_id
  on public.lead_submissions (session_id)
  where session_id is not null;

comment on column public.lead_submissions.session_id is
  'Client-side session id (mcb_session_id from sessionStorage), promoted from tracking_context JSONB to enable joins against analytics_events_clean for content-attribution surfaces. Set by /api/quote on insert; backfilled from tracking_context->>sessionId by migration 20260524_lead_session_id_attribution.';


-- ---------------------------------------------------------------------
-- 2. Backfill from existing tracking_context JSONB
-- ---------------------------------------------------------------------
-- For every historic lead that has a sessionId in its tracking_context
-- but no top-level session_id yet, copy the JSONB value across. Safe
-- to re-run — the WHERE clause skips rows that already have a value.
update public.lead_submissions
set session_id = tracking_context ->> 'sessionId'
where session_id is null
  and tracking_context is not null
  and (tracking_context ->> 'sessionId') is not null
  and (tracking_context ->> 'sessionId') <> '';


-- ---------------------------------------------------------------------
-- 3. Rebuild answer_performance with the REAL attributed_leads CTE
-- ---------------------------------------------------------------------
-- Replaces the stub (added 2026-05-24 because session_id wasn't on
-- lead_submissions yet) with the proper session-level attribution join.
-- ---------------------------------------------------------------------
create or replace view public.answer_performance as
with bot_hits_7d as (
  select
    bc.path,
    count(*) as hits_7d,
    count(distinct bc.bot_id) as distinct_bots_7d,
    max(bc.created_at) as last_bot_hit
  from public.bot_crawls bc
  where bc.created_at >= now() - interval '7 days'
  group by bc.path
),
bot_hits_30d as (
  select
    bc.path,
    count(*) as hits_30d
  from public.bot_crawls bc
  where bc.created_at >= now() - interval '30 days'
  group by bc.path
),
views_7d as (
  select
    page_path,
    count(*) as page_views_7d,
    count(distinct session_id) as sessions_7d
  from public.analytics_events_clean
  where event_name = 'page_view'
    and created_at >= now() - interval '7 days'
  group by page_path
),
views_30d as (
  select
    page_path,
    count(*) as page_views_30d
  from public.analytics_events_clean
  where event_name = 'page_view'
    and created_at >= now() - interval '30 days'
  group by page_path
),
-- Sessions that hit a given URL within 14 days before submitting a lead.
-- Real attribution — works now that lead_submissions has session_id.
attributed_leads as (
  select distinct
    e.page_path,
    l.id as lead_id,
    l.created_at as lead_created_at
  from public.analytics_events_clean e
  join public.lead_submissions l
    on e.session_id = l.session_id
   and e.created_at <= l.created_at
   and e.created_at >= l.created_at - interval '14 days'
  where e.event_name = 'page_view'
    and l.created_at >= now() - interval '30 days'
    and l.session_id is not null
),
leads_30d as (
  select page_path, count(distinct lead_id) as leads_30d
  from attributed_leads
  group by page_path
),
latest_citation as (
  select distinct on (question_id)
    question_id,
    probed_at,
    mcb_cited,
    mcb_cited_url
  from public.ai_citations
  order by question_id, probed_at desc
)
select
  ar.id as registry_id,
  ar.question_id,
  ar.question_text,
  ar.url,
  ar.anchor,
  ar.full_url,
  ar.mode,
  ar.product_slug,
  ar.byline_author,
  ar.published_at,
  ar.last_revised_at,
  extract(day from now() - ar.published_at)::int as days_since_publish,
  coalesce(bh7.hits_7d, 0) as ai_bot_hits_7d,
  coalesce(bh7.distinct_bots_7d, 0) as distinct_ai_bots_7d,
  bh7.last_bot_hit,
  coalesce(bh30.hits_30d, 0) as ai_bot_hits_30d,
  coalesce(v7.page_views_7d, 0) as page_views_7d,
  coalesce(v7.sessions_7d, 0) as sessions_7d,
  coalesce(v30.page_views_30d, 0) as page_views_30d,
  coalesce(l30.leads_30d, 0) as leads_attributed_30d,
  lc.mcb_cited as latest_cited,
  lc.probed_at as latest_probe_at,
  lc.mcb_cited_url as latest_cited_url
from public.answer_registry ar
left join bot_hits_7d  bh7 on bh7.path = ar.url
left join bot_hits_30d bh30 on bh30.path = ar.url
left join views_7d     v7  on v7.page_path = ar.url
left join views_30d    v30 on v30.page_path = ar.url
left join leads_30d    l30 on l30.page_path = ar.url
left join latest_citation lc on lc.question_id = ar.question_id
where ar.is_active = true;

comment on view public.answer_performance is
  'Per-published-answer performance feed. Joins answer_registry with bot crawls, page views, attributed leads (via session_id ↔ lead_submissions.session_id, 14d look-back), and latest citation status. Read by /dashboard/ai-presence content-performance panel and by .claude/skills/ai-content-engine for next-run targeting.';
