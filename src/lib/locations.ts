import { PRESTON_ORIGIN, PRESTON_RADIUS_LOCATIONS, PRESTON_SERVICE_RADIUS_KM } from "./location-data";

export interface Suburb {
  name: string;
  slug: string;
  postcode: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  description?: string;
}

export const SERVICE_RADIUS_KM = PRESTON_SERVICE_RADIUS_KM;

export const LOCATIONS: Suburb[] = PRESTON_RADIUS_LOCATIONS.map((location) => ({ ...location }));

/**
 * Suburb-page indexation policy (2026-06-14 growth audit).
 *
 * The site has 693 suburbs. Indexing all of them — plus a product page for each
 * (~33k thin URLs) — is the doorway-page / scaled-content pattern that was
 * suppressing the whole domain. We keep a curated shortlist indexable and
 * noindex the long tail (still reachable, still passes link equity via
 * follow, just out of the index and out of the sitemap).
 *
 * INDEXABLE suburb hubs = woven (own unique static page) + priority core suburbs.
 * Everything else (incl. ALL /locations/[suburb]/[product] pages) is noindexed.
 */

// Growth-corridor suburbs with genuinely-unique woven content and their own
// /locations/{slug}/page.tsx (see WovenSuburbPage). Always indexable.
export const WOVEN_SUBURB_SLUGS = new Set<string>([
  "clyde-north", "clyde", "officer", "officer-south", "wollert", "donnybrook",
  "beveridge", "mickleham", "greenvale", "tarneit", "deanside", "fraser-rise",
]);

// Core Preston-radius suburbs kept indexable on the legacy template — MCB's
// stated top serviced suburbs (public/llms.txt). The thin long-tail beyond
// these is noindexed; promote suburbs into the woven template to re-index them.
export const PRIORITY_SUBURB_SLUGS = new Set<string>([
  "preston", "northcote", "brunswick", "coburg", "reservoir", "thornbury",
  "carlton", "fitzroy", "heidelberg", "bundoora", "ivanhoe", "kew", "hawthorn",
  "richmond", "doncaster", "templestowe", "eltham", "greensborough",
  "diamond-creek", "mernda",
]);

/** A suburb HUB page (/locations/[suburb]) is indexable if it's woven or priority. */
export function isSuburbHubIndexable(slug: string): boolean {
  return WOVEN_SUBURB_SLUGS.has(slug) || PRIORITY_SUBURB_SLUGS.has(slug);
}

export function getLocationBySlug(slug: string): Suburb | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug);
}

export function getNearbyLocations(currentSlug: string, count: number = 6): Suburb[] {
  const current = getLocationBySlug(currentSlug);

  if (!current) {
    return LOCATIONS.slice(0, count);
  }

  return LOCATIONS
    .filter((loc) => loc.slug !== currentSlug)
    .map((loc) => ({
      location: loc,
      distance: getDistanceKm(current.latitude, current.longitude, loc.latitude, loc.longitude),
    }))
    .sort((a, b) => a.distance - b.distance || a.location.name.localeCompare(b.location.name))
    .slice(0, count)
    .map((item) => item.location);
}

export function getDistanceFromPrestonKm(location: Suburb) {
  return getDistanceKm(PRESTON_ORIGIN.latitude, PRESTON_ORIGIN.longitude, location.latitude, location.longitude);
}

function getDistanceKm(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return value * Math.PI / 180;
}
