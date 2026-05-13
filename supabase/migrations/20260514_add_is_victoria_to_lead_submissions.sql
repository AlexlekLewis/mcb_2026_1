-- Track whether a quote-form lead is from Victoria (in-area) or not.
-- Computed server-side in /api/quote by classifying the suburb input's postcode
-- against the VIC postcode ranges (3000–3999, 8000–8999). null = we couldn't
-- find a postcode in what the user typed (e.g. they entered just "Preston").
--
-- We don't BLOCK out-of-area submissions — the dashboard simply flags them so
-- Alex can triage. See /api/quote/route.ts and src/lib/postcodes.ts.
--
-- Apply via the Supabase SQL editor on project lrhgrmklpvwyjzaipioh:
--   https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new
-- (Do NOT run via the connected Supabase MCP — that one points at the cricket
-- academy project per CLAUDE.md.)

ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS is_victoria boolean;

-- Partial index so dashboard queries that filter to out-of-area leads stay cheap
-- even as the table grows. We only index the false rows because in-area is the
-- default expected state and we don't query it independently.
CREATE INDEX IF NOT EXISTS idx_lead_submissions_out_of_area
  ON lead_submissions (created_at DESC)
  WHERE is_victoria = false;
