/**
 * Forbidden claims and phrases — the deterministic regex layer of the
 * AI Content Engine's gate stack.
 *
 * Three categories:
 *
 * 1. AI_TELL_PHRASES — phrases the 2026 zeitgeist reads as AI-generated.
 *    Any match fails the ai_tell gate.
 *
 * 2. BANNED_SUPERLATIVES — superlatives that read as cheap marketing
 *    when used without specific evidence. The gate allows them if they
 *    appear within ~20 chars of a named source (e.g. "voted Best by
 *    Houzz 2023") but rejects bare uses.
 *
 * 3. REGULATORY_TOPICS — topics that imply legal/code knowledge the
 *    skill can NEVER bluff about. Any mention triggers a hard block
 *    unless the relevant approved fact is flagged is_regulatory=true
 *    in approved-facts.ts.
 *
 * 4. US_SPELLING — US-English spellings that should be Australian.
 *    Auto-flagged for correction, not blocked.
 *
 * 5. PRICE_PATTERN — regex that detects price-shaped numbers. Hard-blocks
 *    publish unless the relevant approved fact is flagged is_price=true.
 */

// =====================================================================
// 1. AI-TELL PHRASES (2026 zeitgeist)
// =====================================================================
// These are case-insensitive. Word boundaries enforced.

export const AI_TELL_PHRASES: string[] = [
  // The classics
  "delve",
  "delve into",
  "navigate the landscape",
  "in today's fast-paced world",
  "in today's digital age",
  "in today's competitive market",
  "let's dive in",
  "let's explore",
  "it's important to note",
  "it's worth noting",
  "it's worth mentioning",
  "in conclusion",
  "moreover",
  "furthermore",
  "at the end of the day",

  // Unlock-family
  "unlock your potential",
  "unlock the value",
  "unlock the power",

  // Buzzwords
  "revolutionise",
  "revolutionize",
  "cutting-edge",
  "seamless",
  "robust",
  "leverage",
  "comprehensive guide",
  "holistic approach",
  "tailored solutions",
  "bespoke solutions",
  "elevate your",
  "empower your",
  "game-changer",
  "game changer",
  "ever-evolving",

  // Filler transitions
  "in the realm of",
  "when it comes to",
  "that being said",
  "look no further",

  // Metaphor abuse
  "your journey",
  "journey towards",
  "your path to",

  // "As an expert" tells
  "as someone who",
  "as an expert in",
  "as a seasoned",

  // Rhetorical question openers (matched at start of paragraph)
  // (handled separately by the structural check, not by this list)
];

// =====================================================================
// 2. BANNED SUPERLATIVES (without evidence within ~20 chars)
// =====================================================================

export const BANNED_SUPERLATIVES_WITHOUT_EVIDENCE: string[] = [
  "best in the business",
  "leading provider",
  "premier",
  "premier provider",
  "#1",
  "number one",
  "top-rated",
  "award-winning", // unless followed by a named award within 20 chars
  "voted best",
  "trusted by", // unless followed by a number or named party
  "melbourne's leading",
  "australia's leading",
  "the highest quality",
  "unbeatable",
  "unparalleled",
  "world-class",
];

// =====================================================================
// 3. REGULATORY TOPICS — hard-blocked unless approved-fact is_regulatory=true
// =====================================================================
// If the draft mentions any of these topics, the regulatory_check gate
// looks up applies_to_questions in approved-facts.ts. If no fact is
// flagged is_regulatory=true for the current question, the gate blocks.

export const REGULATORY_TOPICS: Array<{ pattern: RegExp; topic: string }> = [
  { pattern: /\bvictorian rental law(s)?\b/i, topic: "victorian-rta" },
  { pattern: /\brental tenanc(y|ies)\b/i, topic: "victorian-rta" },
  { pattern: /\blandlord('s|s')? (obligation|requirement|duty)/i, topic: "victorian-rta" },
  { pattern: /\bconsumer affairs victoria\b/i, topic: "victorian-rta" },
  { pattern: /\bresidential tenancies act\b/i, topic: "victorian-rta" },
  { pattern: /\bminimum (housing|rental) standard/i, topic: "victorian-rta" },
  { pattern: /\bbuilding code\b/i, topic: "building-code" },
  { pattern: /\bbca\b/i, topic: "building-code" },
  { pattern: /\bnccp?\b/i, topic: "building-code" },
  { pattern: /\bfire (rating|safety|resistant)/i, topic: "fire-rating" },
  { pattern: /\bAS\s?\d{4}/i, topic: "australian-standard" },
  { pattern: /\bAS\/NZS\s?\d{4}/i, topic: "australian-standard" },
  { pattern: /\belectrical (regulation|standard|requirement)/i, topic: "electrical" },
  { pattern: /\blicensed electrician (must|required|needed)/i, topic: "electrical" }, // edge case
  { pattern: /\bworkcover\b/i, topic: "workcover" },
  { pattern: /\binsurance (claim|cover|policy) (require|need|must)/i, topic: "insurance" },
  { pattern: /\bwarrant(y|ies) (require|guarantee|cover)/i, topic: "warranty-claim" },
];

// =====================================================================
// 4. US SPELLING (auto-corrected, not blocked, but flagged)
// =====================================================================
// Map of US → AU.

export const US_TO_AU_SPELLING: Record<string, string> = {
  color: "colour",
  colors: "colours",
  colored: "coloured",
  coloring: "colouring",
  favorite: "favourite",
  favorites: "favourites",
  flavor: "flavour",
  honor: "honour",
  organize: "organise",
  organized: "organised",
  organizing: "organising",
  organization: "organisation",
  customize: "customise",
  customized: "customised",
  customizing: "customising",
  customization: "customisation",
  analyze: "analyse",
  analyzed: "analysed",
  analyzing: "analysing",
  realize: "realise",
  realized: "realised",
  realizing: "realising",
  recognize: "recognise",
  recognized: "recognised",
  recognizing: "recognising",
  utilize: "utilise",
  utilized: "utilised",
  utilizing: "utilising",
  prioritize: "prioritise",
  prioritized: "prioritised",
  prioritizing: "prioritising",
  meter: "metre",
  meters: "metres",
  fiber: "fibre",
  fibers: "fibres",
  center: "centre",
  centers: "centres",
  centered: "centred",
  centering: "centring",
  theater: "theatre",
  theaters: "theatres",
  defense: "defence",
  offense: "offence",
  mold: "mould",
  molded: "moulded",
  molding: "moulding",
  gray: "grey",
  draperies: "curtains",
  drapery: "curtains",
  drapes: "curtains",
  shades: "blinds", // US "shades" → AU "blinds" except for niche cases (Roman shades fine)
  storefront: "shopfront",
  story: "storey", // when referring to a floor of a building — context-sensitive
};

// =====================================================================
// 5. US IDIOM (replaced or banned)
// =====================================================================

export const US_IDIOM_BANNED: string[] = [
  "reach out",       // → "get in touch" / "call us"
  "circle back",
  "touch base",
  "ballpark",        // → "rough estimate"
  "zip code",        // → "postcode"
  "you guys",        // → "you" / "everyone"
];

// =====================================================================
// 6. PRICE PATTERN — hard-blocked unless approved
// =====================================================================
// Matches things that look like prices: $123, $1,234, $X/m², $300 per window, etc.
// If the draft contains a price and no applicable approved fact has
// is_price=true, the price_approval gate blocks.

export const PRICE_PATTERNS: RegExp[] = [
  /\$\s?\d{1,3}(,\d{3})*(\.\d{1,2})?(\s?\/\s?(m²|m2|sqm|sq\s?m|window|metre|unit))?/i,
  /\b\d{2,4}\s?dollars?\b/i,
  /\bfrom\s?\$\s?\d/i,
  /\bbudget(\s|-)?of\s?\$\d/i,
  /\bcosts?\s?\$\d/i,
];

// =====================================================================
// 7. STRUCTURAL ANTI-PATTERNS (handled by validators in scripts)
// =====================================================================
// Documented here for the validator scripts to reference, but enforced
// programmatically in .claude/skills/ai-content-engine/scripts/validate-content.ts

export const STRUCTURAL_ANTIPATTERNS = {
  /** Three consecutive bullets where each bullet has exactly 3 items in parallel. */
  threeBulletsOfThree: "validator: detect <ul><li>×3</li></ul> with parallel structure",

  /** "Whether you're X, Y, or Z" opening. */
  whetherYoureOpener: /^\s*whether\s+you('|')re\b/i,

  /** Rhetorical question as section opener. */
  rhetoricalQuestionOpener: /^\s*(looking|need|wondering|searching|considering|thinking about)\s+/i,

  /** First sentence hedges instead of answering. */
  hedgeOpening: /^\s*(it depends|great question|that's a great question|many factors|it varies|generally speaking|broadly speaking)\b/i,

  /** Em-dashes (counted against max) — these are the typographic em-dash, not hyphen. */
  emDash: /—/g,

  /** Heading that looks like marketing parallel ("Quality. Service. Trust."). */
  marketingParallel: /^\w+\.\s+\w+\.\s+\w+\.\s*$/,
} as const;
