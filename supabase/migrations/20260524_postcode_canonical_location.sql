-- =====================================================================
-- Postcode-as-canonical-location
-- ---------------------------------------------------------------------
-- Adds a normalised `postcode` text column to lead_submissions and
-- analytics_events so location surfaces (Geography map, suburb roll-ups,
-- region groupings) can bucket by postcode instead of relying on the
-- inconsistent free-text `suburb` field or city-from-IP-geo guesses.
--
-- For lead_submissions we backfill from the existing `suburb` column by
-- pulling the first 4-digit run (mirrors src/lib/postcodes.extractPostcode).
-- Rows where `suburb` is purely a name (e.g. "doncaster") stay null and
-- are resolved at read-time via the LOCATIONS lookup table.
-- =====================================================================

alter table public.lead_submissions
  add column if not exists postcode text;

alter table public.analytics_events
  add column if not exists postcode text;

create index if not exists idx_lead_submissions_postcode
  on public.lead_submissions (postcode);

create index if not exists idx_analytics_events_postcode
  on public.analytics_events (postcode);

-- Backfill lead_submissions.postcode where the suburb field already contains
-- a 4-digit AU postcode (e.g. "3088", "Greensborough 3088"). Idempotent.
update public.lead_submissions
   set postcode = substring(suburb from '\d{4}')
 where postcode is null
   and suburb ~ '\d{4}';

-- We deliberately do NOT backfill analytics_events.postcode — there's no
-- reliable suburb-to-postcode mapping in the existing geo data (city/region
-- are IP-derived). New rows will populate from x-vercel-ip-postal-code via
-- src/lib/server/request-meta.ts.

comment on column public.lead_submissions.postcode is
  'AU 4-digit postcode. Populated on insert via src/lib/postcodes.extractPostcode + suburb-name fallback. Backfilled 2026-05-24 for rows whose suburb field contains a 4-digit run.';

comment on column public.analytics_events.postcode is
  'AU 4-digit postcode from Vercel''s x-vercel-ip-postal-code header (when present). Use for canonical location bucketing on dashboard geography surfaces.';
