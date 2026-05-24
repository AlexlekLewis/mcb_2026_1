/**
 * Client-safe suburb option labels for the quote form datalist.
 *
 * One string per location in the form "Suburb 3072" — that's the format
 * users see in the dropdown AND what gets typed into the input. The server
 * (api/quote) already extracts the postcode from arbitrary text via
 * extractPostcode + derivePostcode, so this format round-trips cleanly:
 * user picks "Preston 3072" → field value = "Preston 3072" → server stores
 * suburb = "Preston 3072", postcode = "3072".
 *
 * Bundle cost: ~700 lines × ~20 chars ≈ 14 KB pre-gzip, ~4 KB gzipped.
 * Acceptable for a customer-facing conversion form.
 */

import { LOCATIONS } from "@/lib/locations";

export const SUBURB_OPTIONS: string[] = LOCATIONS
  .filter((l) => l.postcode)
  .map((l) => `${l.name} ${l.postcode}`)
  .sort((a, b) => a.localeCompare(b));
