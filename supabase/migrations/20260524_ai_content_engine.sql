-- =====================================================================
-- AI Content Engine — registry, runs, gate log, performance view
-- ---------------------------------------------------------------------
-- Backs the weekly content-generation skill (.claude/skills/ai-content-engine).
-- Closes the loop: tracked_questions → answer_registry → content_pieces
-- → real-world performance → next week's targeting.
--
-- Apply via the Supabase SQL editor (NOT via the connected MCP — wrong
-- project). All writes go through the service-role key from CLI scripts
-- in .claude/skills/ai-content-engine/scripts/.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. answer_registry — one row per published answer
-- ---------------------------------------------------------------------
-- Maps a tracked_question to a specific URL + anchor on the live site,
-- so the dashboard can show "answered: Y/N, where" alongside the
-- citation status, and so subsequent skill runs know what's already
-- handled and where it lives.
-- ---------------------------------------------------------------------
create table if not exists public.answer_registry (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  question_id bigint not null
    references public.tracked_questions(id) on delete cascade,
  url text not null,                  -- e.g. '/shutters/plantation-shutters'
  anchor text not null,               -- e.g. 'q-cost-2026' (no '#')
  full_url text generated always as (url || '#' || anchor) stored,
  mode text not null default 'inline', -- 'inline' | 'region' | 'journal'
  product_slug text,                  -- optional — which product page hosts it
  question_text text not null,        -- denormalised from tracked_questions for fast joins
  answer_text text not null,          -- the 40-60 word capsule body
  byline_author text not null default 'Modern Curtains and Blinds',
  published_at timestamptz not null default now(),
  last_revised_at timestamptz not null default now(),
  content_hash text not null,         -- sha256 of answer_text — change-detection
  is_active boolean not null default true,
  meta jsonb default '{}'::jsonb,     -- e.g. {related_anchors: ['/blinds#q-x']}
  unique (question_id, url, anchor)
);

create index if not exists idx_answer_registry_question
  on public.answer_registry (question_id, is_active);

create index if not exists idx_answer_registry_url
  on public.answer_registry (url);

create index if not exists idx_answer_registry_full_url
  on public.answer_registry (full_url);

comment on table public.answer_registry is
  'Published answers to tracked_questions. One row per Q×URL×anchor. Written by the weekly skill, read by /dashboard/ai-presence to show answered-status alongside citation-status.';


-- ---------------------------------------------------------------------
-- 2. content_pieces — every draft the skill produced (passed gates or not)
-- ---------------------------------------------------------------------
-- Distinct from answer_registry — that table is what's currently live.
-- This table is the audit log of every attempt, including rejections.
-- Critical for liability-bearing content: we want to be able to show
-- which drafts were blocked by which gate.
-- ---------------------------------------------------------------------
create table if not exists public.content_pieces (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  skill_run_id bigint,                -- back-ref to skill_runs.id (FK added below)
  question_id bigint
    references public.tracked_questions(id) on delete set null,
  draft_question_text text not null,  -- the visible H3 the skill drafted
  draft_answer_text text not null,    -- the 40-60 word capsule the skill drafted
  word_count int generated always as (
    array_length(regexp_split_to_array(trim(draft_answer_text), '\s+'), 1)
  ) stored,
  status text not null,               -- 'gate_passed' | 'gate_failed' | 'published' | 'rejected_human'
  gate_summary jsonb default '{}'::jsonb,  -- {fact_gate: 'pass', ai_tell_gate: 'fail', ...}
  target_url text,
  target_anchor text,
  registry_id bigint                  -- back-ref to answer_registry.id if published
    references public.answer_registry(id) on delete set null,
  rejection_reason text,
  meta jsonb default '{}'::jsonb
);

create index if not exists idx_content_pieces_run
  on public.content_pieces (skill_run_id, created_at desc);

create index if not exists idx_content_pieces_status
  on public.content_pieces (status, created_at desc);

create index if not exists idx_content_pieces_question
  on public.content_pieces (question_id, created_at desc);

comment on table public.content_pieces is
  'Every draft the skill produced, including those blocked by gates. Audit trail for liability-bearing auto-published content. Joined with skill_runs and content_gate_log.';


-- ---------------------------------------------------------------------
-- 3. skill_runs — one row per weekly run
-- ---------------------------------------------------------------------
-- Captures what was targeted, what hypothesis was tested, and what
-- patterns were applied. The skill reads its own history from this
-- table on the next run to choose targeting + tactics.
-- ---------------------------------------------------------------------
create table if not exists public.skill_runs (
  id bigserial primary key,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'started',  -- 'started' | 'completed' | 'failed' | 'partial'
  skill_version text not null default 'v1', -- bump when best-practices.md is meaningfully revised
  best_practices_hash text,            -- sha256 of best-practices.md at run-time
  trigger_source text not null default 'schedule', -- 'schedule' | 'manual' | 'backfill'
  targets_considered int default 0,
  targets_attempted int default 0,
  pieces_drafted int default 0,
  pieces_passed_gates int default 0,
  pieces_published int default 0,
  pieces_rejected int default 0,
  hypothesis text,                     -- e.g. "Testing whether anecdote-bearing answers outperform neutral"
  pattern_summary jsonb default '{}'::jsonb,  -- e.g. {anecdote_count: 3, statistic_count: 5, named_expert_quote: true}
  release_id text,                     -- matches releases.ts id if a release entry was logged
  commit_sha text,
  error_message text,
  meta jsonb default '{}'::jsonb
);

create index if not exists idx_skill_runs_started
  on public.skill_runs (started_at desc);

create index if not exists idx_skill_runs_status
  on public.skill_runs (status, started_at desc);

-- Now wire the back-ref from content_pieces.skill_run_id
alter table public.content_pieces
  add constraint content_pieces_skill_run_fk
    foreign key (skill_run_id) references public.skill_runs(id) on delete set null;

comment on table public.skill_runs is
  'Per-week run log for the AI Content Engine. The skill reads its own history to choose next-week targeting and tactics. Hash of best-practices.md captured so revisions are traceable.';


-- ---------------------------------------------------------------------
-- 4. content_gate_log — every gate decision recorded
-- ---------------------------------------------------------------------
-- Granular log: gate name + pass/fail + diagnostic. Lets us answer
-- "which gate is rejecting the most drafts" and tune the gates over
-- time. Also lets the dashboard show why a piece was held back.
-- ---------------------------------------------------------------------
create table if not exists public.content_gate_log (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  content_piece_id bigint not null
    references public.content_pieces(id) on delete cascade,
  gate_name text not null,             -- 'ai_tell' | 'word_count' | 'forbidden_claims' | 'au_spelling' | 'bluf_first' | 'fact_provenance' | 'price_approval' | 'regulatory_check' | 'schema_match' | 'named_source'
  passed boolean not null,
  severity text not null default 'block', -- 'block' | 'warn' | 'info'
  diagnostic text,                     -- specific match / reason
  meta jsonb default '{}'::jsonb
);

create index if not exists idx_content_gate_log_piece
  on public.content_gate_log (content_piece_id);

create index if not exists idx_content_gate_log_gate
  on public.content_gate_log (gate_name, passed, created_at desc);

comment on table public.content_gate_log is
  'Per-gate pass/fail decisions for every drafted piece. Diagnostic field captures the specific offending phrase / claim / mismatch. Used to tune gates over time.';


-- ---------------------------------------------------------------------
-- 5. answer_performance — the dashboard view
-- ---------------------------------------------------------------------
-- Joins answer_registry with bot crawls, page views, leads, and
-- citation status for the corresponding question. One row per
-- registered answer. Read by /dashboard/ai-presence "Content
-- performance" panel.
--
-- Note: leads attribution is best-effort. We join analytics_events_clean
-- by session_id to lead_submissions, looking back 14 days from the
-- lead's created_at. This is the same multi-touch model the rest of
-- the dashboard uses.
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
-- Lead attribution: stubbed out for now. The proper version joins
-- analytics_events_clean.session_id to lead_submissions.session_id within
-- a 14d window — but lead_submissions doesn't carry session_id yet. To
-- enable real attribution: add session_id column to lead_submissions, then
-- replace this CTE with the commented-out version below.
attributed_leads as (
  select
    null::text as page_path,
    null::bigint as lead_id,
    null::timestamptz as lead_created_at
  where false
),
-- Real attribution (uncomment after adding session_id to lead_submissions):
-- attributed_leads as (
--   select distinct
--     e.page_path,
--     l.id as lead_id,
--     l.created_at as lead_created_at
--   from public.analytics_events_clean e
--   join public.lead_submissions l
--     on e.session_id = l.session_id
--    and e.created_at <= l.created_at
--    and e.created_at >= l.created_at - interval '14 days'
--   where e.event_name = 'page_view'
--     and l.created_at >= now() - interval '30 days'
-- ),
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
  'Per-published-answer performance feed. Joins answer_registry with bot crawls, page views, attributed leads, and latest citation status. Read by /dashboard/ai-presence content-performance panel and by .claude/skills/ai-content-engine for next-run targeting.';


-- ---------------------------------------------------------------------
-- 6. RLS — block anon access entirely
-- ---------------------------------------------------------------------
-- These tables are admin-only. Service-role key reads/writes from the
-- skill and from the dashboard server. No anon role should touch them.
-- ---------------------------------------------------------------------
alter table public.answer_registry  enable row level security;
alter table public.content_pieces   enable row level security;
alter table public.skill_runs       enable row level security;
alter table public.content_gate_log enable row level security;

-- No policies created → all anon access is denied. Service-role bypasses RLS.
