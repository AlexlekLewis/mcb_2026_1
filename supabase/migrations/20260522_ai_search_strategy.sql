-- =====================================================================
-- AI Search Strategy infrastructure
-- ---------------------------------------------------------------------
-- Eight new tables that back the redesigned admin dashboard's AI
-- Presence, Content, and Reputation surfaces, plus the eight planned
-- automations.
--
-- Apply via the Supabase SQL editor (NOT via the connected MCP — it
-- points at the wrong project). All writes go through the
-- service-role key from server-side code; no anon reads are exposed.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. bot_crawls — every AI bot crawler hit on the site
-- ---------------------------------------------------------------------
create table if not exists public.bot_crawls (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  bot_id text not null,            -- 'GPTBot', 'ClaudeBot', etc. — id from middleware AI_BOTS list
  user_agent text not null,
  path text not null,              -- pathname only
  host text,
  status_code int,                 -- response status if known at log time
  ip_hash text,                    -- sha256(ip) — never raw IP
  meta jsonb default '{}'::jsonb
);

create index if not exists idx_bot_crawls_created_at
  on public.bot_crawls (created_at desc);

create index if not exists idx_bot_crawls_bot_id
  on public.bot_crawls (bot_id, created_at desc);

create index if not exists idx_bot_crawls_path
  on public.bot_crawls (path);

comment on table public.bot_crawls is
  'AI bot crawler hits, fire-and-forgot from src/middleware.ts via /api/internal/bot-log. Read by /dashboard/ai-presence Bots tab.';


-- ---------------------------------------------------------------------
-- 2. tracked_questions — top N questions MCB targets for AI citations
-- ---------------------------------------------------------------------
create table if not exists public.tracked_questions (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  question text not null unique,
  category text not null,          -- 'pricing', 'comparison', 'style', 'functional', 'install', 'maintenance', 'vendor', 'au_specific'
  intent text not null,            -- 'commercial' | 'informational' | 'navigational'
  priority int not null default 5, -- 1 = highest, 10 = lowest
  expected_volume int,             -- monthly search volume estimate (Australia)
  notes text,
  is_active boolean not null default true
);

create index if not exists idx_tracked_questions_priority
  on public.tracked_questions (priority, is_active);

comment on table public.tracked_questions is
  'Top questions MCB is targeting for AI citations. Seeded from research memo; editable via /dashboard/ai-presence.';


-- ---------------------------------------------------------------------
-- 3. ai_citations — per-question per-engine citation probe results
-- ---------------------------------------------------------------------
create table if not exists public.ai_citations (
  id bigserial primary key,
  probed_at timestamptz not null default now(),
  question_id bigint not null
    references public.tracked_questions(id) on delete cascade,
  engine text not null,            -- 'chatgpt' | 'perplexity' | 'google_ai_mode' | 'copilot' | 'gemini'
  mcb_cited boolean not null,
  mcb_cited_url text,
  competitor_brands text[] default '{}',
  competitor_urls text[] default '{}',
  raw_answer text,                 -- truncated to 2KB; primarily for debug
  source text not null default 'manual',  -- 'manual' | 'otterly' | 'api_probe'
  meta jsonb default '{}'::jsonb
);

create index if not exists idx_ai_citations_probed_at
  on public.ai_citations (probed_at desc);

create index if not exists idx_ai_citations_question
  on public.ai_citations (question_id, probed_at desc);

create index if not exists idx_ai_citations_engine
  on public.ai_citations (engine, probed_at desc);

comment on table public.ai_citations is
  'Per-question per-engine citation probe results. source=manual today (entered via dashboard); Otterly Lite or API probes can write source=otterly/api_probe later — same schema.';


-- ---------------------------------------------------------------------
-- 4. content_backlog — discovered content opportunities awaiting decision
-- ---------------------------------------------------------------------
create table if not exists public.content_backlog (
  id bigserial primary key,
  discovered_at timestamptz not null default now(),
  question text not null,
  source text not null,            -- 'paa' | 'reddit' | 'whirlpool' | 'houzz' | 'manual'
  source_url text,
  category text,
  est_volume int,                  -- guess at monthly search volume
  commercial_intent_score int,     -- 1-10
  content_gap_score int,           -- 1-10 (how thin existing answers are)
  total_score int generated always as (
    coalesce(est_volume, 0) / 10
    + coalesce(commercial_intent_score, 0) * 5
    + coalesce(content_gap_score, 0) * 3
  ) stored,
  status text not null default 'new',  -- 'new' | 'approved' | 'rejected' | 'in_brief' | 'published'
  notes text
);

create unique index if not exists uniq_content_backlog_question
  on public.content_backlog (lower(question));

create index if not exists idx_content_backlog_status
  on public.content_backlog (status, total_score desc);

create index if not exists idx_content_backlog_score
  on public.content_backlog (total_score desc);

comment on table public.content_backlog is
  'Discovered questions awaiting decision in /dashboard/content Backlog tab. total_score is generated; sort by it to rank.';


-- ---------------------------------------------------------------------
-- 5. content_freshness — cornerstone pages with refresh metadata
-- ---------------------------------------------------------------------
create table if not exists public.content_freshness (
  id bigserial primary key,
  url text not null unique,
  title text,
  first_published timestamptz,
  last_refreshed timestamptz,
  next_review_due timestamptz,
  is_cornerstone boolean not null default true,
  notes text,
  -- read-side cache, refreshed by the weekly freshness sweep
  ai_citations_30d int default 0,
  visits_30d int default 0,
  leads_attributed_90d int default 0,
  days_stale int generated always as (
    case when last_refreshed is null then null
    else floor(extract(epoch from (now() - last_refreshed)) / 86400)::int
    end
  ) stored
);

create index if not exists idx_content_freshness_url
  on public.content_freshness (url);

create index if not exists idx_content_freshness_stale
  on public.content_freshness (days_stale desc nulls last);

comment on table public.content_freshness is
  'Cornerstone URLs tracked for refresh cadence. Powers /dashboard/content Refresh queue tab. The 30d/90d caches are written by the weekly cron.';


-- ---------------------------------------------------------------------
-- 6. content_briefs — generated content briefs awaiting publish
-- ---------------------------------------------------------------------
create table if not exists public.content_briefs (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  backlog_id bigint references public.content_backlog(id) on delete set null,
  freshness_id bigint references public.content_freshness(id) on delete set null,
  brief_type text not null,        -- 'new' | 'refresh'
  target_question text not null,
  suggested_slug text,
  suggested_h2s text[],
  required_statistics jsonb,
  internal_links text[],
  source_urls_to_cite text[],
  word_target int,
  status text not null default 'draft',  -- 'draft' | 'ready' | 'in_progress' | 'published' | 'archived'
  brief_markdown text not null,
  published_url text,
  published_at timestamptz
);

create index if not exists idx_content_briefs_status
  on public.content_briefs (status, created_at desc);

comment on table public.content_briefs is
  'Generated content briefs. Template-based today; LLM-assisted brief generation can be wired later when API budget is available.';


-- ---------------------------------------------------------------------
-- 7. gbp_reviews — Google Business Profile reviews + response tracking
-- ---------------------------------------------------------------------
create table if not exists public.gbp_reviews (
  id bigserial primary key,
  fetched_at timestamptz not null default now(),
  review_id text not null unique,  -- GBP review name/id (full path)
  reviewer_name text,
  rating int,
  review_text text,
  review_created_at timestamptz,
  draft_response text,             -- empty until LLM responder is enabled
  response_status text not null default 'pending',  -- 'pending' | 'approved' | 'posted' | 'dismissed'
  posted_response text,
  posted_at timestamptz
);

create index if not exists idx_gbp_reviews_status
  on public.gbp_reviews (response_status, fetched_at desc);

create index if not exists idx_gbp_reviews_unresponded
  on public.gbp_reviews (review_created_at desc)
  where response_status = 'pending';

comment on table public.gbp_reviews is
  'Google Business Profile reviews fetched by the review-watcher cron. draft_response stays empty until LLM responder env var is set.';


-- ---------------------------------------------------------------------
-- 8. suburb_audit — uniqueness scores across the 693 suburb pages
-- ---------------------------------------------------------------------
create table if not exists public.suburb_audit (
  id bigserial primary key,
  audited_at timestamptz not null default now(),
  url text not null,
  suburb_slug text not null,
  product_slug text,               -- null for suburb-only landing page
  region_cluster text,             -- proposed consolidation cluster (e.g. 'inner-south', 'bayside')
  unique_word_count int,
  unique_pct numeric(5,2),         -- % of content that differs from template baseline
  organic_clicks_30d int default 0,
  recommendation text,             -- 'keep' | 'consolidate' | 'redirect' | 'delete'
  cluster_target_url text,         -- destination URL if recommendation = 'redirect'
  notes text
);

create unique index if not exists uniq_suburb_audit_url_audited
  on public.suburb_audit (url, audited_at);

create index if not exists idx_suburb_audit_recommendation
  on public.suburb_audit (recommendation, unique_pct);

comment on table public.suburb_audit is
  'Per-page uniqueness audit results powering /dashboard/content Suburb audit tab. Rewritten on each audit run; historical rows preserved for trend.';


-- =====================================================================
-- RLS: all tables are server-only writes via the service-role key.
-- Enable RLS but add no policies — anon/authenticated clients cannot
-- read or write. The dashboard reads via service-role on the server.
-- =====================================================================

alter table public.bot_crawls         enable row level security;
alter table public.tracked_questions  enable row level security;
alter table public.ai_citations       enable row level security;
alter table public.content_backlog    enable row level security;
alter table public.content_freshness  enable row level security;
alter table public.content_briefs     enable row level security;
alter table public.gbp_reviews        enable row level security;
alter table public.suburb_audit       enable row level security;
