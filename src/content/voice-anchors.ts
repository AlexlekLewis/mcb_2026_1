/**
 * Voice anchors — the canonical voice spec the AI Content Engine skill uses
 * as a tuning fork on every run.
 *
 * The actual voice of Modern Curtains and Blinds is best demonstrated by the
 * region copy in src/lib/region-content.ts. That file is the gold standard:
 * first-person plural, named suburbs, era-specific housing references,
 * opinion-bearing, slightly imperfect cadence.
 *
 * This file extracts representative paragraphs from that source as anchors
 * the skill can measure its own drafts against. The skill is NOT allowed
 * to paste these verbatim into new content — they're voice samples, not
 * boilerplate. Plagiarism gate fails if a generated draft overlaps these
 * by more than ~12 contiguous words.
 *
 * Update process: when Alex writes new copy in his own voice elsewhere on
 * the site, lift a couple of strong paragraphs into this file. The
 * skill's voice improves automatically.
 */

export interface VoiceAnchor {
  id: string;
  source_file: string;
  /** What aspect of the voice this anchor demonstrates. */
  demonstrates: string[];
  paragraph: string;
}

export const VOICE_ANCHORS: VoiceAnchor[] = [
  {
    id: "northern-suburbs-context",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "named-suburbs-density",
      "era-specific-housing",
      "specific-climate-problem",
      "first-person-plural",
      "opinion-bearing",
    ],
    paragraph:
      "The northern suburbs are our backyard. From the Californian bungalows and weatherboard workers' cottages around Preston, Thornbury and Reservoir through to the brick-veneer family homes of Bundoora and Mill Park, you get a real mix of original tall sash windows, mid-century aluminium frames and newer double-glazed units. Northern light leans hot in summer and the western sun on rear extensions is the single most common thing customers want sorted.",
  },
  {
    id: "preston-base-scheduling",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "logistical-honesty",
      "first-person-plural",
      "everyday-cadence",
      "concrete-time-windows",
    ],
    paragraph:
      "We're based in Preston, so most northern measure-and-quote appointments happen within a short drive — usually within a day or two of your enquiry. Morning and after-school windows tend to suit families here best.",
  },
  {
    id: "northern-product-recommendation",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "specific-product-recommendation",
      "tied-to-house-type",
      "tied-to-microclimate",
      "opinion-bearing",
    ],
    paragraph:
      "Roller blinds with a blockout layer behind sheer curtains do a lot of work in northern Federation and brick-veneer homes — handling glare on west-facing rear rooms while keeping the front of the house looking soft and traditional from the street.",
  },
  {
    id: "bayside-honest-context",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "honest-about-distance",
      "specific-suburbs",
      "house-type-mix",
      "microclimate-named",
      "customer-mindset",
    ],
    paragraph:
      "Bayside — Brighton, Hampton, Sandringham, Black Rock, Mentone and down toward Mordialloc — is a different planet for window coverings. Strong reflected light off the bay, salt-laden air, and a mix of grand Victorian and Edwardian homes alongside contemporary architect-designed builds with enormous west-facing glazing. Customers here are almost always balancing privacy from the street with the desire to keep that bay-facing light pouring in.",
  },
  {
    id: "bayside-product-with-stakes",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "product-named",
      "trade-off-shown",
      "earned-certainty",
      "concrete-mechanism",
    ],
    paragraph:
      "Motorised sheer curtains and external awnings genuinely earn their keep in bayside homes. Motorisation lets you manage tall west-facing windows without climbing furniture, and external awnings stop the heat at the glass rather than after it's already inside.",
  },
  {
    id: "southern-period-homes",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "specific-fabric-noun",
      "respect-for-existing-architecture",
      "opinion-bearing",
      "soft-confidence",
    ],
    paragraph:
      "Roman blinds in linen or textured weaves work beautifully in southern period homes — they respect the original window proportions while giving you a softer look than rollers, and they pair well with the heritage detailing you find through this part of Melbourne.",
  },
  {
    id: "western-suburbs-mix",
    source_file: "src/lib/region-content.ts",
    demonstrates: [
      "varied-housing-stock",
      "specific-suburbs",
      "named-window-types",
      "stacker-door-detail",
    ],
    paragraph:
      "The west — Footscray, Yarraville, Williamstown, Altona, Werribee, Point Cook and out through Tarneit and Truganina — is one of Melbourne's most varied regions. Worker's cottages and Victorian terraces near the inner west sit alongside vast newer estates further out, where you'll find tightly spaced two-storey homes with large stacker doors onto small backyards and full-height windows facing the street.",
  },
];

// ---------------------------------------------------------------------
// Voice rules derived from the anchors above. These power the
// validate-content gate.
// ---------------------------------------------------------------------

export const VOICE_RULES = {
  /** Minimum named local references per 200 words. */
  minLocalRefsPer200Words: 1,

  /** Minimum first-person-plural sentences per answer. */
  minFirstPersonPluralPerAnswer: 1,

  /** Minimum opinion-bearing sentences per 300 words. */
  minOpinionsPer300Words: 1,

  /** Minimum specific number/measurement per answer (mm, %, $/m², °C, year, week). */
  minDefensibleNumbersPerAnswer: 1,

  /**
   * Max ratio of similar-length sentences. If >0.6 of consecutive sentences
   * have word counts within ±2 of each other, the "uniform cadence" tell
   * fires and the gate fails.
   */
  maxUniformCadenceRatio: 0.6,

  /** Max em-dashes per 200 words. */
  maxEmDashesPer200Words: 1,

  /** Max consecutive sentences starting with the same word. */
  maxConsecutiveSameOpener: 2,
} as const;
