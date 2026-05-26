/**
 * Victorian growth-corridor cohort
 * --------------------------------
 *
 * The 17 URLs that target Melbourne's three growth corridors (south-east,
 * north, west). The dashboard's Growth Corridor section filters its metrics
 * to this cohort, so it can show corridor performance separately from the
 * 600+ other URLs on the site.
 *
 * Three categories:
 *   - 11 suburb pages (rewrites of /locations/[suburb] in the woven content style)
 *   - 3 corridor pillar guides (net-new authority content per corridor)
 *   - 3 answer-gap landing pages (first-mover AI-citation pages on queries
 *     no Australian competitor currently owns)
 *
 * Add a URL here when it's first deployed in the woven growth-corridor style,
 * not before — the dashboard treats a URL as "in cohort" the moment it's listed.
 */

export type GrowthCorridor = "south-east" | "north" | "west" | "cross-corridor";

export interface GrowthCorridorPage {
  /** Path the page is served at. Leading slash, no trailing slash. */
  url: string;
  /** Which corridor the page primarily serves. */
  corridor: GrowthCorridor;
  /** Page category — feeds the dashboard grouping. */
  category: "suburb" | "pillar" | "answer-gap";
  /** Human label shown in dashboard tables. */
  label: string;
}

/**
 * The 11 growth-corridor suburb pages. These already exist as dynamic-route
 * /locations/[suburb] renders today; they enter the cohort once each is
 * rewritten in the woven style as a static override at /locations/{slug}.
 */
const SUBURB_PAGES: GrowthCorridorPage[] = [
  { url: "/locations/clyde",         corridor: "south-east", category: "suburb", label: "Clyde" },
  { url: "/locations/clyde-north",   corridor: "south-east", category: "suburb", label: "Clyde North" },
  { url: "/locations/officer",       corridor: "south-east", category: "suburb", label: "Officer" },
  { url: "/locations/officer-south", corridor: "south-east", category: "suburb", label: "Officer South" },
  { url: "/locations/wollert",       corridor: "north",      category: "suburb", label: "Wollert" },
  { url: "/locations/donnybrook",    corridor: "north",      category: "suburb", label: "Donnybrook" },
  { url: "/locations/beveridge",     corridor: "north",      category: "suburb", label: "Beveridge" },
  { url: "/locations/mickleham",     corridor: "north",      category: "suburb", label: "Mickleham" },
  { url: "/locations/greenvale",     corridor: "north",      category: "suburb", label: "Greenvale" },
  { url: "/locations/tarneit",       corridor: "west",       category: "suburb", label: "Tarneit" },
  { url: "/locations/deanside",      corridor: "west",       category: "suburb", label: "Deanside" },
  { url: "/locations/fraser-rise",   corridor: "west",       category: "suburb", label: "Fraser Rise" },
];

/**
 * 3 corridor pillar guides (3,500-word authority content per corridor).
 * Listed here once they're actually deployed.
 */
const PILLAR_PAGES: GrowthCorridorPage[] = [
  { url: "/guides/window-furnishings-south-east-growth-corridor", corridor: "south-east", category: "pillar", label: "South-East pillar" },
  { url: "/guides/window-furnishings-northern-growth-corridor",   corridor: "north",      category: "pillar", label: "Northern pillar" },
  { url: "/guides/window-furnishings-western-growth-corridor",    corridor: "west",       category: "pillar", label: "Western pillar" },
];

/**
 * 3 answer-gap pages — first-mover AI-citation pages on queries no
 * Australian competitor currently owns. These are the highest-leverage
 * pages in the whole growth-corridor strategy.
 */
const ANSWER_GAP_PAGES: GrowthCorridorPage[] = [
  { url: "/guides/new-build-window-furnishings-not-included",            corridor: "cross-corridor", category: "answer-gap", label: "New-build inclusions gap" },
  { url: "/guides/pooja-prayer-room-blackout-curtains-australia",        corridor: "cross-corridor", category: "answer-gap", label: "Pooja / prayer room blackout" },
  { url: "/guides/estate-covenant-roller-shutters-zipscreens-melbourne", corridor: "cross-corridor", category: "answer-gap", label: "Estate covenant rules" },
];

/**
 * Live cohort. Update this list as pages go live. The dashboard reads
 * `live` to scope all corridor-cohort metrics. Listing a URL that isn't
 * yet deployed will produce empty metrics; that's the signal to ship it.
 */
export const GROWTH_CORRIDOR_PAGES: GrowthCorridorPage[] = [
  ...ANSWER_GAP_PAGES,
  ...PILLAR_PAGES,
  ...SUBURB_PAGES,
];

/** Plain URL set — useful for membership checks. */
export const GROWTH_CORRIDOR_URLS: ReadonlySet<string> = new Set(
  GROWTH_CORRIDOR_PAGES.map((p) => p.url),
);

/** URL → page metadata, for joining analytics rows to corridor metadata. */
export const PAGE_BY_URL: Readonly<Record<string, GrowthCorridorPage>> = Object.freeze(
  Object.fromEntries(GROWTH_CORRIDOR_PAGES.map((p) => [p.url, p])),
);

/** Group pages by corridor for dashboard rendering. */
export function groupByCorridor(): Record<GrowthCorridor, GrowthCorridorPage[]> {
  const groups: Record<GrowthCorridor, GrowthCorridorPage[]> = {
    "south-east": [],
    north: [],
    west: [],
    "cross-corridor": [],
  };
  for (const page of GROWTH_CORRIDOR_PAGES) {
    groups[page.corridor].push(page);
  }
  return groups;
}

/** Pretty-print a corridor key for UI. */
export function formatCorridor(c: GrowthCorridor): string {
  if (c === "south-east") return "South-East";
  if (c === "north") return "Northern";
  if (c === "west") return "Western";
  return "Cross-corridor";
}

/** Suburb URL → suburb-page metadata. Used by suburb-page rewrites. */
export function isGrowthCorridorSuburb(suburbSlug: string): GrowthCorridorPage | undefined {
  return SUBURB_PAGES.find((p) => p.url === `/locations/${suburbSlug}`);
}
