/**
 * Approved facts registry — the ONLY source of factual claims the AI Content
 * Engine skill is allowed to introduce into generated content.
 *
 * Read this before editing:
 *
 * 1. Every fact in this file has been vetted by Alex (or a domain expert) and
 *    is safe to publish verbatim. The skill cannot add new facts at draft
 *    time — it can only restate facts from this file OR repeat language that
 *    already exists verbatim on the live site (region-content.ts, data.ts,
 *    legacy-blind-content.ts, etc.).
 *
 * 2. The skill annotates each factual claim in its draft with [fact:<id>]
 *    markers. The validate-content gate strips the markers before publish,
 *    but verifies every ID exists in this file and is not expired.
 *
 * 3. Pricing and regulatory facts are special. They are flagged
 *    is_price=true / is_regulatory=true and the skill is HARD-BLOCKED from
 *    publishing them without explicit human approval flagged on the fact
 *    itself. See FORBIDDEN_CLAIMS in forbidden-claims.ts for the matching
 *    block patterns.
 *
 * 4. Facts can expire. A price approved in May 2026 should expire by August.
 *    The skill ignores expired facts as if they don't exist.
 *
 * 5. New facts get added by Alex or via a manual PR. The skill never adds
 *    its own facts to this file — it can only consume from it.
 *
 * If a tracked question can't be answered from any combination of facts in
 * this file + existing on-site content, the skill MUST skip that question
 * and flag it for Alex to provide the missing fact. The skill is forbidden
 * from "filling in" with general knowledge.
 */

export type FactSource =
  | "site_content"        // already lives on the live site verbatim
  | "manufacturer_spec"   // from a supplier datasheet
  | "australian_standard" // from an AS/NZS standard
  | "owner_attested"      // owner stated under their own name
  | "industry_consensus"; // common across multiple suppliers / manufacturers

export type FactDomain =
  | "shutters"
  | "blinds"
  | "curtains"
  | "security"
  | "awnings"
  | "motorisation"
  | "pricing"
  | "install"
  | "service"
  | "general";

export interface ApprovedFact {
  /** Stable id used in draft markers like [fact:plantation-pvc-bathroom]. snake_case or kebab-case. */
  id: string;
  domain: FactDomain;
  /** The fact, written as a complete sentence the skill can quote or rephrase. */
  claim: string;
  source: FactSource;
  /** Where this fact came from — file path on the site, manufacturer URL, standard ID, "alex_lewis_2026_05" for owner attestation. */
  source_detail: string;
  /** Who approved this fact for publication. Pricing and regulatory facts require alex_lewis. */
  approved_by: "alex_lewis" | "site_existing";
  /** ISO date. */
  approved_at: string;
  /** ISO date. Expired facts are ignored by the skill. */
  expires_at?: string;
  /** tracked_questions.id values this fact is most relevant to. Optional — for the skill's targeting. */
  applies_to_questions?: number[];
  /** Hard-block flag — skill cannot publish a price without an explicit approved fact. */
  is_price: boolean;
  /** Hard-block flag — skill cannot publish regulatory/legal claims without an explicit approved fact. */
  is_regulatory: boolean;
  /** Optional context for the skill (when to use, when not to). */
  notes?: string;
}

// =====================================================================
// Seed facts — derived from existing live-site content.
//
// Everything here is already published on moderncurtainsandblinds.com.au
// in some form. The skill is allowed to restate them.
// =====================================================================

export const APPROVED_FACTS: ApprovedFact[] = [
  // ---------- Shutters ----------
  {
    id: "shutters-pvc-bathrooms",
    domain: "shutters",
    claim:
      "PVC plantation shutters suit bathrooms, kitchens and laundries because they handle moisture better than timber shutters.",
    source: "site_content",
    source_detail: "src/app/shutters/page.tsx FAQ + decision guide",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [28],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "shutters-timber-basswood",
    domain: "shutters",
    claim:
      "MCB's premium timber plantation shutters are crafted from A-Grade American Basswood (Tilia Americana) — lightweight, stable, and paintable or stainable.",
    source: "site_content",
    source_detail: "src/lib/data.ts:458-466 Sovereign Wood Shutters",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [6],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "shutters-aluminium-outdoor",
    domain: "shutters",
    claim:
      "Aluminium plantation shutters are designed for outdoor use — patios, alfresco areas and balconies where weather exposure rules out timber and PVC.",
    source: "site_content",
    source_detail: "src/app/shutters/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "shutters-louvres-airflow",
    domain: "shutters",
    claim:
      "Adjustable louvres on plantation shutters let you control light, privacy and ventilation independently — closed for darkness, tilted for light without losing privacy, open for full airflow.",
    source: "site_content",
    source_detail: "src/app/shutters/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },

  // ---------- Blinds ----------
  {
    id: "blinds-blockout-bedroom",
    domain: "blinds",
    claim:
      "Blockout roller blinds, double rollers and honeycomb blinds are the most common bedroom choices because they improve privacy and light control.",
    source: "site_content",
    source_detail: "src/app/blinds/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [3, 12],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "blinds-sunscreen-vs-blockout",
    domain: "blinds",
    claim:
      "Sunscreen blinds reduce glare and heat while preserving the daytime view; blockout blinds provide full privacy and darkness.",
    source: "site_content",
    source_detail: "src/app/blinds/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "blinds-double-roller-day-night",
    domain: "blinds",
    claim:
      "Double roller blinds combine a sunscreen and a blockout fabric on one bracket so you can switch between daytime glare control and night privacy without changing the blind.",
    source: "site_content",
    source_detail: "src/lib/legacy-blind-content.ts double-roller block",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "blinds-honeycomb-insulation",
    domain: "blinds",
    claim:
      "Honeycomb (cellular) blinds trap air in their cells, which adds an insulating layer at the window — useful for energy-conscious homes and windows that lose or gain heat fast.",
    source: "site_content",
    source_detail: "src/lib/legacy-blind-content.ts honeycomb block",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [4, 18, 20],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "blinds-sheers-night-privacy",
    domain: "blinds",
    claim:
      "Sheer curtains and sunscreen blinds give daytime privacy but not full night privacy with interior lights on — pair them with a blockout layer for evening cover.",
    source: "site_content",
    source_detail: "src/app/curtains/page.tsx FAQ + src/lib/legacy-blind-content.ts",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [14],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "blinds-verticals-modern-alternatives",
    domain: "blinds",
    claim:
      "Panel glide and soft vertical drape systems have become MCB's go-to alternatives to traditional vertical blinds for sliding doors and wide openings.",
    source: "site_content",
    source_detail: "src/lib/legacy-blind-content.ts panel-glide + verticals",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [27],
    is_price: false,
    is_regulatory: false,
  },

  // ---------- Curtains ----------
  {
    id: "curtains-blockout-100pct",
    domain: "curtains",
    claim:
      "MCB's blockout curtains use 3-pass coated fabrics that block 100% of light through the fabric — ideal for bedrooms, nurseries and media rooms. (Edge gaps at the reveal can still let some light through; see install notes.)",
    source: "site_content",
    source_detail: "src/app/curtains/blockout/page.tsx + src/lib/data.ts",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [12],
    is_price: false,
    is_regulatory: false,
    notes:
      "Always pair the '100% through fabric' claim with the edge-gap caveat — overpromising on 'total darkness' is a real-world disappointment that drives callbacks.",
  },
  {
    id: "curtains-layering-sheer-blockout",
    domain: "curtains",
    claim:
      "Double curtains combine a sheer and a blockout on one track — sheers for daytime softness and light diffusion, blockout for night privacy and insulation.",
    source: "site_content",
    source_detail: "src/app/curtains/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [25],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "curtains-wavefold-modern-heading",
    domain: "curtains",
    claim:
      "Wavefold (also called S-fold or ripplefold) is currently MCB's most-requested modern curtain heading — consistent waves, works beautifully on large windows.",
    source: "site_content",
    source_detail: "src/app/curtains/page.tsx FAQ + src/lib/data.ts",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [7],
    is_price: false,
    is_regulatory: false,
  },

  // ---------- Motorisation ----------
  {
    id: "motorisation-battery-retrofit",
    domain: "motorisation",
    claim:
      "Battery motors can often be added to suitable existing roller, double-roller and honeycomb blinds without running new wiring or damaging the property — suitability depends on hardware, size, condition and motor compatibility.",
    source: "site_content",
    source_detail: "src/app/blinds/motorised-blinds/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [9],
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "motorisation-wired-needs-electrician",
    domain: "motorisation",
    claim:
      "Wired (hardwired) motor systems usually need electrical planning and installation by a licensed electrician — battery systems generally do not.",
    source: "site_content",
    source_detail: "src/app/blinds/motorised-blinds/page.tsx FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },

  // ---------- Service / company ----------
  {
    id: "service-free-measure-quote",
    domain: "service",
    claim:
      "MCB offers a free in-home measure and quote across Melbourne — we bring fabric and finish samples, measure every opening, and provide a clear written quote before anything is ordered.",
    source: "site_content",
    source_detail: "src/lib/cro-data.ts:363 + sitewide",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "service-multi-product-visit",
    domain: "service",
    claim:
      "MCB can measure and quote curtains, blinds, plantation shutters, security screens, fly screens, awnings and motorisation during the same in-home appointment.",
    source: "site_content",
    source_detail: "src/components/ProductTemplate.tsx default FAQ",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },
  {
    id: "service-melbourne-coverage",
    domain: "service",
    claim:
      "MCB is based in Preston and services Melbourne and surrounding Victorian suburbs — north, east, inner south, bayside and west are all in regular rotation.",
    source: "site_content",
    source_detail: "src/lib/region-content.ts",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    is_price: false,
    is_regulatory: false,
  },

  // ---------- Pricing stance ----------
  // MCB doesn't publish specific per-window prices in marketing copy — every
  // window varies and a number-on-the-page tends to misinform more than it
  // informs. This fact gives the skill a citation-worthy "honest broker"
  // answer pattern for any pricing-shaped question. It is_price=false because
  // it doesn't quote a price — it explains the position.
  {
    id: "service-no-published-pricing",
    domain: "pricing",
    claim:
      "MCB doesn't publish per-window or per-square-metre prices in advance because every window is genuinely different — drop, width, frame style, fabric or finish choice, fixing points, motorisation and access all change the number. What MCB does is a free in-home measure and quote where you get an itemised written price before anything is ordered. The trade-offs that move the price most are: material (PVC vs basswood vs aluminium for shutters; fabric grade and lining for curtains and blinds), motor type (battery vs hardwired), and any custom shaping (arched, raked, oversized).",
    source: "owner_attested",
    source_detail: "alex_lewis_position_2026_05",
    approved_by: "alex_lewis",
    approved_at: "2026-05-25",
    applies_to_questions: [1, 5, 8, 21, 22, 23, 29],
    is_price: false,
    is_regulatory: false,
    notes:
      "Use this as the backbone for ANY pricing-shaped question. The skill must NOT quote specific numbers; it can reference the trade-offs and the free-quote process. This is the canonical anti-fake-transparency move — answering honestly without making a claim that ages badly.",
  },

  // ---------- Regional / climate ----------
  {
    id: "region-west-facing-heat",
    domain: "general",
    claim:
      "West-facing Melbourne windows take strong late-afternoon sun and heat in summer — MCB most often pairs honeycomb blockout blinds with external folding-arm awnings to stop heat at the glass.",
    source: "site_content",
    source_detail: "src/lib/region-content.ts (bayside + west sections)",
    approved_by: "site_existing",
    approved_at: "2026-05-13",
    applies_to_questions: [4],
    is_price: false,
    is_regulatory: false,
  },

  // =====================================================================
  // PRICING FACTS — intentionally not seeded.
  //
  // MCB's deliberate position is to never publish specific per-window or
  // per-square-metre prices in marketing copy. The `service-no-published-pricing`
  // fact above is the canonical answer pattern for ANY pricing question
  // (categories: pricing + vendor). Do NOT add is_price=true facts to this
  // file unless that policy changes — the skill's price_approval gate is the
  // safety net catching any number that slips into a draft.
  //
  // REGULATORY FACTS — none seeded. Any claim about Victorian RTA,
  // electrical regulations, fire ratings, building codes etc. must be
  // approved by Alex with an explicit standard / source reference before
  // the skill is allowed to use it. Until then, regulatory-shaped questions
  // route to flagged_for_alex automatically.
  // =====================================================================
];

// ---------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------

/** Returns facts that are not expired as of `now`. */
export function getActiveFacts(now: Date = new Date()): ApprovedFact[] {
  const nowIso = now.toISOString();
  return APPROVED_FACTS.filter((f) => !f.expires_at || f.expires_at > nowIso);
}

/** Looks up a single fact by id. Returns null if missing or expired. */
export function getFactById(id: string, now: Date = new Date()): ApprovedFact | null {
  const f = APPROVED_FACTS.find((x) => x.id === id);
  if (!f) return null;
  if (f.expires_at && f.expires_at <= now.toISOString()) return null;
  return f;
}

/** Returns facts relevant to a tracked-question id. */
export function getFactsForQuestion(questionId: number): ApprovedFact[] {
  return getActiveFacts().filter((f) =>
    f.applies_to_questions?.includes(questionId),
  );
}

/** Returns true if the skill is allowed to make ANY price claim for this question. */
export function pricingApprovedForQuestion(questionId: number): boolean {
  return getFactsForQuestion(questionId).some((f) => f.is_price);
}

/** Returns true if the skill is allowed to make ANY regulatory claim for this question. */
export function regulatoryApprovedForQuestion(questionId: number): boolean {
  return getFactsForQuestion(questionId).some((f) => f.is_regulatory);
}
