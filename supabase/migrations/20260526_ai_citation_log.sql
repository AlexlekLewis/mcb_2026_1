-- 20260526_ai_citation_log.sql
--
-- Manual quarterly tracker for AI-search citations.
-- ---------------------------------------------------
-- The growth-corridor strategy depends on whether ChatGPT, Perplexity, Gemini,
-- and Google AI Overview cite MCB when asked the verified buyer questions we've
-- targeted with content. There is no automated API for citation detection at
-- the volume we'd need to track this — so it's a manual quarterly sweep, logged
-- here, and rendered in /dashboard/growth-corridors as panel 5.
--
-- Apply via the Supabase SQL editor at
--   https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new
-- The connected Supabase MCP points at the cricket-academy project, NOT this
-- one — so do NOT run this through the MCP. (Per CLAUDE.md.)

create table if not exists public.ai_citation_log (
    id              uuid primary key default gen_random_uuid(),

    -- Stable identifier for the tracked question. Matches the question_id
    -- used in the woven Q&A sections on the corridor pages, so we can join
    -- this table to question-level engagement events.
    question_id     text not null,

    -- One of: chatgpt | perplexity | gemini | google_ai_overview
    -- Stored as text rather than enum so adding sources later doesn't need a migration.
    source          text not null,

    -- When this sweep was conducted. Tracker is quarterly but the column
    -- is a timestamp so daily/weekly tracking is possible later if desired.
    checked_at      timestamptz not null default now(),

    -- Was MCB cited in the AI response? null = source skipped / not checked this sweep.
    cited           boolean,

    -- Free-form notes — context for the result, e.g. "cited but as one of three sources"
    -- or "ranked 3rd in cited sources" or specific phrasing the AI used.
    notes           text,

    -- Optional: the actual query text used in the AI tool, in case we want to
    -- compare query phrasing variants.
    query_text      text,

    -- Optional: the URL the AI cited (lets us see which MCB page is winning citations).
    cited_url       text,

    created_at      timestamptz not null default now()
);

create index if not exists ai_citation_log_question_id_idx on public.ai_citation_log(question_id);
create index if not exists ai_citation_log_checked_at_idx on public.ai_citation_log(checked_at desc);
create index if not exists ai_citation_log_source_idx on public.ai_citation_log(source);

-- RLS: service role only. The dashboard page is server-rendered with the
-- service-role key already; no end-user reads this table directly.
alter table public.ai_citation_log enable row level security;

-- No policies are added — RLS-enabled with no policies = service role only.
-- If we later want to expose this in a public read view, add a policy then.

comment on table public.ai_citation_log is
    'Manual quarterly tracker for AI-search citations of MCB pages. Read by /dashboard/growth-corridors panel 5.';
comment on column public.ai_citation_log.question_id is
    'Stable identifier matching the question_id of the woven Q&A section being tracked.';
comment on column public.ai_citation_log.source is
    'AI tool checked: chatgpt | perplexity | gemini | google_ai_overview.';
comment on column public.ai_citation_log.cited is
    'true = MCB cited; false = not cited; null = source skipped this sweep.';
