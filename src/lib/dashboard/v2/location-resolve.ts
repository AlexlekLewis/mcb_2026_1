/**
 * Postcode-as-canonical-location resolver.
 *
 * Takes whatever location signal we have on a row (typed suburb text,
 * pre-derived postcode, both, neither) and returns a single canonical
 * representation: postcode + suburb display name + lat/lng + region.
 *
 * Resolution order:
 *   1. Explicit `postcode` field (most trustworthy)
 *   2. 4-digit run inside `suburb` text (e.g. "3088" or "Greensborough 3088")
 *   3. Suburb name match against LOCATIONS (slug or display name, case-
 *      and punctuation-insensitive)
 *
 * If none of those resolve, returns null. Map / bucket code must skip the
 * row (and ideally bump a "unresolved" counter so we can iterate the
 * matcher).
 */

import { LOCATIONS } from "@/lib/locations";
import { extractPostcode } from "@/lib/postcodes";

export interface ResolvedLocation {
  postcode: string;
  suburb: string;
  latitude: number;
  longitude: number;
  source: "explicit_postcode" | "extracted_postcode" | "suburb_name" | "fuzzy_suburb_name";
}

// Fuzzy match tolerance — max Levenshtein distance for a suburb-name match.
// 2 catches "nortcote"→"northcote", "preson"→"preston", but rejects more
// distant typos that would risk false positives.
const FUZZY_MAX_DISTANCE = 2;
const FUZZY_MIN_INPUT_LEN = 4; // skip 1-3 char inputs — too many false matches

interface ResolveInput {
  suburb?: string | null;
  postcode?: string | null;
}

// Lazy-built lookup maps. Built once per process — LOCATIONS is static.
let postcodeIndex: Map<string, (typeof LOCATIONS)[number]> | null = null;
let nameIndex: Map<string, (typeof LOCATIONS)[number]> | null = null;

function ensureIndexes(): void {
  if (postcodeIndex && nameIndex) return;
  postcodeIndex = new Map();
  nameIndex = new Map();
  for (const loc of LOCATIONS) {
    // Postcode index — multiple suburbs can share a postcode; first one wins.
    if (loc.postcode && !postcodeIndex.has(loc.postcode)) {
      postcodeIndex.set(loc.postcode, loc);
    }
    // Name index — by slug AND by display-name-normalised.
    nameIndex.set(loc.slug, loc);
    const normalised = normaliseName(loc.name);
    if (!nameIndex.has(normalised)) nameIndex.set(normalised, loc);
  }
}

function normaliseName(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function resolveLocation(input: ResolveInput): ResolvedLocation | null {
  ensureIndexes();

  // 1. Explicit postcode field (trusted)
  if (input.postcode) {
    const pc = input.postcode.trim();
    if (/^\d{4}$/.test(pc)) {
      const loc = postcodeIndex!.get(pc);
      if (loc) {
        return {
          postcode: pc,
          suburb: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          source: "explicit_postcode",
        };
      }
    }
  }

  // 2. Extract postcode from suburb text ("3088" or "Greensborough 3088")
  if (input.suburb) {
    const pc = extractPostcode(input.suburb);
    if (pc) {
      const loc = postcodeIndex!.get(pc);
      if (loc) {
        return {
          postcode: pc,
          suburb: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          source: "extracted_postcode",
        };
      }
    }

    // 3. Suburb-name exact match
    const normalised = normaliseName(input.suburb);
    const loc = nameIndex!.get(normalised);
    if (loc && loc.postcode) {
      return {
        postcode: loc.postcode,
        suburb: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        source: "suburb_name",
      };
    }

    // 4. Fuzzy suburb-name match (typo tolerance)
    const fuzzy = fuzzyMatchName(normalised);
    if (fuzzy && fuzzy.postcode) {
      return {
        postcode: fuzzy.postcode,
        suburb: fuzzy.name,
        latitude: fuzzy.latitude,
        longitude: fuzzy.longitude,
        source: "fuzzy_suburb_name",
      };
    }
  }

  return null;
}

/**
 * Levenshtein distance — small implementation (no deps). Used only at
 * resolveLocation read time, on inputs that already failed every cheaper
 * lookup, so scanning ~693 names is fine.
 */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (!al) return bl;
  if (!bl) return al;
  let prev = Array.from({ length: bl + 1 }, (_, i) => i);
  for (let i = 1; i <= al; i++) {
    const cur = [i];
    for (let j = 1; j <= bl; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = cur;
  }
  return prev[bl];
}

function fuzzyMatchName(normalised: string): (typeof LOCATIONS)[number] | null {
  if (normalised.length < FUZZY_MIN_INPUT_LEN) return null;
  let best: (typeof LOCATIONS)[number] | null = null;
  let bestDist = FUZZY_MAX_DISTANCE + 1;
  for (const loc of LOCATIONS) {
    const candidate = normaliseName(loc.name);
    // Cheap pre-filter: skip if length differs by more than the tolerance.
    if (Math.abs(candidate.length - normalised.length) > FUZZY_MAX_DISTANCE) continue;
    const dist = levenshtein(normalised, candidate);
    if (dist < bestDist) {
      bestDist = dist;
      best = loc;
      if (dist === 0) break; // perfect match (shouldn't happen, exact lookup ran first)
    }
  }
  return bestDist <= FUZZY_MAX_DISTANCE ? best : null;
}

/**
 * Derive just the postcode (no full lookup) from any ingest input. Used by
 * /api/quote to populate lead_submissions.postcode on insert.
 *
 * Returns null if we genuinely can't tell — never throws. The lead is still
 * stored; postcode is just missing.
 */
export function derivePostcode(input: ResolveInput): string | null {
  if (input.postcode) {
    const pc = input.postcode.trim();
    if (/^\d{4}$/.test(pc)) return pc;
  }
  if (input.suburb) {
    const pc = extractPostcode(input.suburb);
    if (pc) return pc;
    ensureIndexes();
    const normalised = normaliseName(input.suburb);
    const loc = nameIndex!.get(normalised);
    if (loc?.postcode) return loc.postcode;
    // Fuzzy fallback — same Levenshtein logic as resolveLocation.
    const fuzzy = fuzzyMatchName(normalised);
    if (fuzzy?.postcode) return fuzzy.postcode;
  }
  return null;
}
