-- Surface Google Ads gclid as a first-class column on lead_submissions so we
-- can later upload offline conversions ("this lead closed for $X") back to
-- Google Ads via the Offline Conversions API. The value is already inside
-- tracking_context JSON, but querying JSON for every Google Ads sync is slow
-- and the new column is filterable / indexable.
--
-- Apply via the Supabase SQL editor on project lrhgrmklpvwyjzaipioh:
--   https://supabase.com/dashboard/project/lrhgrmklpvwyjzaipioh/sql/new
-- (Do NOT run via the connected Supabase MCP — that one points at the cricket
-- academy project per CLAUDE.md.)

ALTER TABLE lead_submissions
  ADD COLUMN IF NOT EXISTS gclid text;

CREATE INDEX IF NOT EXISTS idx_lead_submissions_gclid_not_null
  ON lead_submissions (gclid)
  WHERE gclid IS NOT NULL;
