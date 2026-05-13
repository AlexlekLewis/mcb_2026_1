/**
 * Region-keyed differentiator content for Melbourne suburb pages.
 *
 * Goal: replace identical boilerplate across 693 suburb pages with copy that
 * actually varies by Melbourne region. Each region gets a hand-written angle
 * referencing local architecture, light/weather, and product mix that punches
 * above its weight there.
 *
 * Origin is Melbourne CBD (-37.8136, 144.9631). Suburbs are bucketed by
 * compass bearing from the CBD plus a small inner-city radius override.
 */

export type MelbourneRegion =
  | "north"
  | "north-east"
  | "east"
  | "south-east"
  | "south"
  | "bayside"
  | "west"
  | "north-west"
  | "inner";

const MELBOURNE_CBD = { latitude: -37.8136, longitude: 144.9631 } as const;

/** Radius (km) from the CBD inside which a suburb is treated as inner Melbourne. */
const INNER_RADIUS_KM = 6;

/** Suburb shape this module relies on. Kept loose so it accepts the full Suburb type from locations.ts. */
export interface SuburbLike {
  name: string;
  slug?: string;
  latitude: number;
  longitude: number;
}

/**
 * Map a suburb's lat/lon to a Melbourne region via bearing from the CBD,
 * with a small inner-city override based on straight-line distance.
 *
 * Bearings are measured clockwise from true north (0deg = north, 90deg = east, etc.).
 * "Bayside" is a thin wedge along the eastern shore of Port Phillip Bay where
 * the bayside identity dominates the south-east/south split.
 */
export function getMelbourneRegion(suburb: { latitude: number; longitude: number }): MelbourneRegion {
  const distance = haversineKm(MELBOURNE_CBD.latitude, MELBOURNE_CBD.longitude, suburb.latitude, suburb.longitude);

  if (distance <= INNER_RADIUS_KM) {
    return "inner";
  }

  const bearing = bearingDegrees(MELBOURNE_CBD.latitude, MELBOURNE_CBD.longitude, suburb.latitude, suburb.longitude);

  // Bayside wedge: south-south-west through south-south-east, far enough out
  // to actually be along the bay rather than in the inner south.
  const longitudeDeltaFromCbd = suburb.longitude - MELBOURNE_CBD.longitude;
  const isBaysideWedge =
    (bearing >= 170 && bearing <= 215) &&
    distance > 8 &&
    longitudeDeltaFromCbd > -0.08 && longitudeDeltaFromCbd < 0.15;

  if (isBaysideWedge) {
    return "bayside";
  }

  if (bearing >= 337.5 || bearing < 22.5) return "north";
  if (bearing >= 22.5 && bearing < 67.5) return "north-east";
  if (bearing >= 67.5 && bearing < 112.5) return "east";
  if (bearing >= 112.5 && bearing < 157.5) return "south-east";
  if (bearing >= 157.5 && bearing < 202.5) return "south";
  if (bearing >= 202.5 && bearing < 247.5) return "south"; // SSW pulled into "south" so "west" stays distinct
  if (bearing >= 247.5 && bearing < 292.5) return "west";
  return "north-west"; // 292.5 - 337.5
}

export interface RegionContent {
  /** 60-80 words of hand-written context for the region: architecture, light, common window types. */
  regionalAngle: string;
  /** 30-40 words about how MCB serves the region: drive time from Preston, appointment expectations. */
  installationContext: string;
  /** 30-50 words highlighting 1-2 product categories that punch above their weight in the region. */
  productEmphasis: string;
  /** ~20 words, phrased as "we" with no hard claims — safe local trust signal. */
  localTrustSignal: string;
}

export const REGION_CONTENT: Record<MelbourneRegion, RegionContent> = {
  north: {
    regionalAngle:
      "The northern suburbs are our backyard. From the Californian bungalows and weatherboard workers' cottages around Preston, Thornbury and Reservoir through to the brick-veneer family homes of Bundoora and Mill Park, you get a real mix of original tall sash windows, mid-century aluminium frames and newer double-glazed units. Northern light leans hot in summer and the western sun on rear extensions is the single most common thing customers want sorted.",
    installationContext:
      "We're based in Preston, so most northern measure-and-quote appointments happen within a short drive — usually within a day or two of your enquiry. Morning and after-school windows tend to suit families here best.",
    productEmphasis:
      "Roller blinds with a blockout layer behind sheer curtains do a lot of work in northern Federation and brick-veneer homes — handling glare on west-facing rear rooms while keeping the front of the house looking soft and traditional from the street.",
    localTrustSignal:
      "Preston is our home address, so when we say we know the northern suburbs we mean we drive these streets every working day.",
  },

  "north-east": {
    regionalAngle:
      "The north-east runs from leafy Ivanhoe and Heidelberg up through Eltham, Diamond Creek and the green-belt suburbs that back onto the Yarra and Plenty ranges. Mud-brick and timber Eltham-style homes sit alongside split-level seventies builds and newer architect-designed places with large glazed expanses facing the bushland. Customers here often want window coverings that handle strong morning light through tall north-facing windows without flattening the natural feel of the home.",
    installationContext:
      "From Preston we usually reach the north-east in under 40 minutes outside peak. We're happy to work around school pick-up and shift rosters, and we'll always confirm a tighter arrival window the day before.",
    productEmphasis:
      "Honeycomb (cellular) blinds and timber venetians earn their keep in north-eastern homes. Honeycombs handle the temperature swings on bush-facing glass, and real-timber venetians sit beautifully against the warm material palettes that define this part of Melbourne.",
    localTrustSignal:
      "We've measured up plenty of bushland-adjacent homes through here and we know how unforgiving raked ceilings and tall reveals can be without proper planning.",
  },

  east: {
    regionalAngle:
      "Eastern Melbourne — Box Hill, Doncaster, Blackburn, Mitcham, Ringwood and out toward the foothills — is dominated by post-war brick homes, generous seventies and eighties family builds, and a strong wave of newer two-storey rebuilds on the original quarter-acre blocks. Living rooms are typically open-plan with sliding doors onto a deck, and east-facing master bedrooms catch hard early-morning light most of the year.",
    installationContext:
      "Eastern appointments are usually a 45 to 55 minute drive from Preston. We schedule the east in afternoon blocks where we can, and we'll bring full sample books for both blinds and curtains in one visit so you're not waiting on a second trip.",
    productEmphasis:
      "Plantation shutters and S-fold sheer curtains are the standout pair in eastern Melbourne's open-plan rebuilds. Shutters handle the wide front-facing windows and master ensuites; S-folds soften tall stacker doors onto the deck without losing the contemporary line.",
    localTrustSignal:
      "We've worked across enough eastern rebuilds to know which trims and stack widths actually fit the standard sliding-door reveals out this way.",
  },

  "south-east": {
    regionalAngle:
      "The south-east is one of the broadest stretches we cover — running from Caulfield, Oakleigh and Clayton out through Glen Waverley, Mulgrave, Dandenong and into the Berwick and Cranbourne growth corridor. You'll find tightly packed post-war brick homes near the inner ring, large mid-century family builds through the middle, and brand-new estates further out with floor-to-ceiling glazing onto small private courtyards.",
    installationContext:
      "Drive time from Preston varies a lot out here — inner south-east is around 40 minutes, the growth corridor can be over an hour. We'll always give you a realistic arrival window and try to combine appointments in the same pocket on the same day.",
    productEmphasis:
      "Dual roller blinds (blockout plus sunscreen on the same bracket) are extremely popular through south-eastern new builds — they handle the western glare on courtyard-facing glass while still letting the family use the room during the day.",
    localTrustSignal:
      "We've fitted plenty of homes in the south-east's newer estates and we know which builder window profiles play nicely with inside-mount installs.",
  },

  south: {
    regionalAngle:
      "Southern Melbourne — Caulfield, Bentleigh, Carnegie, Murrumbeena, Hughesdale and the inner-south pocket — is full of solid interwar brick homes, classic Cal-bungalows and a steady stream of period renovations. Original timber sashes and leadlight windows sit next to modern rear extensions with big sliding glass doors. Light here is reasonably even year-round, but afternoon sun on western reveals is the recurring problem people ask us to solve.",
    installationContext:
      "Southern appointments are typically 35 to 50 minutes from Preston depending on traffic across town. We're happy to do early-morning or after-work slots, and we can usually coordinate measure and install around busy household schedules.",
    productEmphasis:
      "Roman blinds in linen or textured weaves work beautifully in southern period homes — they respect the original window proportions while giving you a softer look than rollers, and they pair well with the heritage detailing you find through this part of Melbourne.",
    localTrustSignal:
      "We've worked through enough southern renovations to understand how original timber reveals behave once an extension is bolted on the back.",
  },

  bayside: {
    regionalAngle:
      "Bayside — Brighton, Hampton, Sandringham, Black Rock, Mentone and down toward Mordialloc — is a different planet for window coverings. Strong reflected light off the bay, salt-laden air, and a mix of grand Victorian and Edwardian homes alongside contemporary architect-designed builds with enormous west-facing glazing. Customers here are almost always balancing privacy from the street with the desire to keep that bay-facing light pouring in.",
    installationContext:
      "Bayside is one of our longer drives from Preston — usually 50 minutes to just over an hour — so we tend to block bayside appointments together. We'll often suggest a single longer measure visit covering the whole house.",
    productEmphasis:
      "Motorised sheer curtains and external awnings genuinely earn their keep in bayside homes. Motorisation lets you manage tall west-facing windows without climbing furniture, and external awnings stop the heat at the glass rather than after it's already inside.",
    localTrustSignal:
      "We know how brutal late-afternoon light off the bay can be on west-facing rooms and we always factor that in before recommending fabric.",
  },

  west: {
    regionalAngle:
      "The west — Footscray, Yarraville, Williamstown, Altona, Werribee, Point Cook and out through Tarneit and Truganina — is one of Melbourne's most varied regions. Worker's cottages and Victorian terraces near the inner west sit alongside vast newer estates further out, where you'll find tightly spaced two-storey homes with large stacker doors onto small backyards and full-height windows facing the street.",
    installationContext:
      "West Melbourne appointments are typically 40 minutes to an hour from Preston depending on the M80 and Westgate. We're flexible on timing and we'll always confirm the day before so you're not waiting around.",
    productEmphasis:
      "Roller blinds and panel glides do a lot of heavy lifting in newer western estates — panel glides especially suit the wide stacker doors onto courtyards that are standard in Tarneit, Point Cook and Truganina builds.",
    localTrustSignal:
      "We've fitted a lot of homes through the western growth suburbs and we understand the standard reveal depths the major builders out here tend to use.",
  },

  "north-west": {
    regionalAngle:
      "The north-west — Essendon, Moonee Ponds, Pascoe Vale, Glenroy, Broadmeadows, Craigieburn and Roxburgh Park — runs from grand Edwardian streets near the inner-north out into expanding family estates further up. You get genuine character homes with high ceilings and double-hung sashes near the centre, then a wave of newer brick-veneer family homes once you head north past the ring road.",
    installationContext:
      "Most north-western appointments are 25 to 45 minutes from Preston — it's one of the closer regions for us. We can usually fit measure visits in around school drop-off and pick-up if that helps the household.",
    productEmphasis:
      "Plantation shutters in the front rooms of period north-western homes and roller blinds through the rest of the house is a combination we recommend often — it gives you the street-facing presence without blowing the whole budget on shutters everywhere.",
    localTrustSignal:
      "The north-west borders our home base, so it's a region we know well and can usually get to faster than most window-furnishing crews coming from across town.",
  },

  inner: {
    regionalAngle:
      "Inner Melbourne — Carlton, Fitzroy, Collingwood, Richmond, South Yarra, Prahran, North Melbourne and the CBD itself — is dominated by Victorian terraces, Edwardian single-fronts, warehouse conversions and high-rise apartments. Original timber sashes, oversized warehouse glazing and floor-to-ceiling apartment windows all sit within a few streets of each other. Privacy from the street and the building opposite is almost always the first thing customers raise.",
    installationContext:
      "Inner-city appointments are close — usually 15 to 30 minutes from Preston — but parking and access often shapes the visit more than distance. Just let us know about lift bookings, loading docks or one-way street quirks when you book.",
    productEmphasis:
      "S-fold sheer curtains for street-facing terrace windows and roller blinds for apartment glazing are the two requests we field most often in the inner city. Both keep sightlines clean in tight rooms without blocking the natural light.",
    localTrustSignal:
      "We've measured inside enough Victorian terraces and warehouse conversions to know what original architraves and modern strata rules will and won't allow.",
  },
};

/**
 * Returns the region content for a suburb, with a small light-touch variant
 * driven by the suburb's slug/name so neighbouring suburbs don't read as
 * byte-identical to a crawler. Variant tweaks the opening clause of
 * regionalAngle only — keeps the bulk of the copy intact.
 */
export function getSuburbContent(suburb: SuburbLike): RegionContent & { region: MelbourneRegion } {
  const region = getMelbourneRegion(suburb);
  const base = REGION_CONTENT[region];

  const variantSeed = hashString(suburb.slug ?? suburb.name);
  const openers = REGIONAL_ANGLE_OPENERS[region];
  const opener = openers[variantSeed % openers.length];

  // Replace the first sentence of regionalAngle with the variant opener,
  // but only when the opener is non-empty. Empty string = use base copy as-is.
  const regionalAngle = opener
    ? `${opener} ${stripFirstSentence(base.regionalAngle)}`.trim()
    : base.regionalAngle;

  return {
    region,
    regionalAngle,
    installationContext: base.installationContext,
    productEmphasis: base.productEmphasis,
    localTrustSignal: base.localTrustSignal,
  };
}

/**
 * Per-region opener variants for the regionalAngle copy. An empty-string
 * entry means "leave the original opening sentence". Each region has a
 * handful so the same opener doesn't repeat across neighbouring suburbs.
 */
const REGIONAL_ANGLE_OPENERS: Record<MelbourneRegion, string[]> = {
  north: [
    "",
    "The northern suburbs are the part of Melbourne we know best.",
    "Northern Melbourne is where we live and work.",
  ],
  "north-east": [
    "",
    "North-eastern Melbourne has a character all of its own.",
    "The north-east runs from leafy river suburbs out toward the bush.",
  ],
  east: [
    "",
    "Eastern Melbourne is a region of generous family homes.",
    "The east is where post-war brick meets the modern rebuild.",
  ],
  "south-east": [
    "",
    "The south-east is the broadest region we cover.",
    "South-eastern Melbourne ranges from tight inner streets to brand-new estates.",
  ],
  south: [
    "",
    "Southern Melbourne is rich in interwar and period housing.",
    "The south is a region where heritage detail still matters.",
  ],
  bayside: [
    "",
    "Bayside is its own conversation when it comes to window coverings.",
    "Bayside homes deal with light most of Melbourne never sees.",
  ],
  west: [
    "",
    "Western Melbourne is one of the most varied regions in the city.",
    "The west runs from inner cottages all the way out to growth-corridor estates.",
  ],
  "north-west": [
    "",
    "The north-west blends grand period streets with newer family estates.",
    "North-western Melbourne is one of the closer regions to our base.",
  ],
  inner: [
    "",
    "The inner city is its own beast for window coverings.",
    "Inner Melbourne packs a lot of housing styles into a few square kilometres.",
  ],
};

// ---------- helpers ----------

function stripFirstSentence(text: string): string {
  const match = text.match(/^[^.!?]*[.!?]\s*/);
  if (!match) return text;
  return text.slice(match[0].length);
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number): number {
  return (value * 180) / Math.PI;
}

function haversineKm(fromLat: number, fromLon: number, toLat: number, toLon: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Forward-azimuth bearing in degrees (0-360, measured clockwise from north)
 * from point A to point B on a sphere.
 */
function bearingDegrees(fromLat: number, fromLon: number, toLat: number, toLon: number): number {
  const phi1 = toRadians(fromLat);
  const phi2 = toRadians(toLat);
  const lambda1 = toRadians(fromLon);
  const lambda2 = toRadians(toLon);

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}
