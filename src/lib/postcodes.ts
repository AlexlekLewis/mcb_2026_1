/**
 * Australian postcode helpers — kept tiny and self-contained.
 *
 * We use the postcode-range definition of "Victorian" (3000–3999 for street
 * addresses, 8000–8999 for VIC PO boxes / large-volume) rather than the
 * service-radius list in `location-data.ts`, because the user's intent for
 * the quote-form warning is "people inside Victoria are in-area" — not just
 * those within 60 km of Preston. (A genuine VIC resident in, say, Bendigo is
 * outside our normal radius but still worth treating as a real lead.)
 *
 * If the user's stated suburb has no clearly-identifiable 4-digit postcode in
 * it (e.g. they typed just "Preston"), `extractPostcode` returns null and the
 * caller should treat the input as "unknown" — neither warn nor flag.
 */

const VIC_POSTCODE_RANGES: Array<[number, number]> = [
  [3000, 3999], // VIC street addresses
  [8000, 8999], // VIC PO boxes / large-volume mail
];

/**
 * Pulls the first 4-digit run from arbitrary user input. Returns null if there
 * isn't one — callers should treat that as "we couldn't determine state".
 */
export function extractPostcode(input: string | null | undefined): string | null {
  if (!input) return null;
  const match = input.match(/\b(\d{4})\b/);
  return match ? match[1] : null;
}

/**
 * True if the 4-digit string falls inside any Victorian postcode range.
 * Returns false for non-VIC, malformed input, etc — never throws.
 */
export function isVictorianPostcode(postcode: string | null | undefined): boolean {
  if (!postcode) return false;
  const trimmed = postcode.trim();
  if (!/^\d{4}$/.test(trimmed)) return false;
  const n = Number(trimmed);
  return VIC_POSTCODE_RANGES.some(([lo, hi]) => n >= lo && n <= hi);
}

/**
 * Three-state classification of an arbitrary "Preston 3072" / "Sydney 2000" /
 * "Preston" suburb string:
 *   - "vic"     : we found a postcode and it's Victorian
 *   - "out"     : we found a postcode and it's not Victorian
 *   - "unknown" : no 4-digit postcode present (or input was empty)
 */
export type SuburbVicStatus = "vic" | "out" | "unknown";

export function classifySuburbInput(input: string | null | undefined): SuburbVicStatus {
  const postcode = extractPostcode(input);
  if (!postcode) return "unknown";
  return isVictorianPostcode(postcode) ? "vic" : "out";
}
