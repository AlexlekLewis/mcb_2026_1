/**
 * Maps an arbitrary (lat, lon) to the nearest Victorian suburb in our service-area
 * list using great-circle (Haversine) distance.
 *
 * Used by the dashboard's "Top Suburbs" card to turn IP-geolocation coordinates
 * (which Cloudflare / Vercel report at city centroid resolution, roughly 5–10 km
 * accuracy) into a suburb-cluster signal.
 *
 * Notes / honest limitations:
 * - IP geo accuracy is much coarser than suburb size. Treat this as a cluster
 *   signal ("traffic from northern inner Melbourne"), not pinpoint addressing.
 * - PRESTON_RADIUS_LOCATIONS only covers ~60 km from Preston, so visitors well
 *   outside Melbourne (e.g. Sydney IPs) would otherwise snap onto whichever
 *   edge-of-range suburb is closest. We guard against that with a distance cap.
 */
import { PRESTON_RADIUS_LOCATIONS } from "@/lib/location-data";

export type SuburbMatch = {
  name: string;
  slug: string;
  postcode: string;
  distanceKm: number;
};

/** Max distance from nearest known suburb before we consider the visitor "out of area". */
const MAX_MATCH_DISTANCE_KM = 25;

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/**
 * Returns the nearest VIC suburb to the given coordinates, or null if no suburb
 * in our service-area list is within MAX_MATCH_DISTANCE_KM.
 */
export function nearestSuburb(
  lat: number | null | undefined,
  lon: number | null | undefined
): SuburbMatch | null {
  if (
    typeof lat !== "number" ||
    typeof lon !== "number" ||
    Number.isNaN(lat) ||
    Number.isNaN(lon)
  ) {
    return null;
  }

  let best: SuburbMatch | null = null;
  for (const entry of PRESTON_RADIUS_LOCATIONS) {
    const distance = haversineKm(lat, lon, entry.latitude, entry.longitude);
    if (!best || distance < best.distanceKm) {
      best = {
        name: entry.name,
        slug: entry.slug,
        postcode: entry.postcode,
        distanceKm: distance,
      };
    }
  }

  if (!best || best.distanceKm > MAX_MATCH_DISTANCE_KM) {
    return null;
  }
  return best;
}

export type SuburbTally = {
  name: string;
  slug: string;
  count: number;
};

/**
 * Tally a list of (lat, lon) pairs into top suburbs.
 *
 * Pairs that don't match any suburb within MAX_MATCH_DISTANCE_KM are skipped
 * (they're treated as out-of-area and surfaced separately via the % Outside VIC
 * card).
 *
 * Returns suburbs sorted by descending count.
 */
export function tallyTopSuburbs(
  coords: Array<{ lat: number | null | undefined; lon: number | null | undefined }>
): SuburbTally[] {
  const tally = new Map<string, SuburbTally>();
  for (const point of coords) {
    const match = nearestSuburb(point.lat, point.lon);
    if (!match) continue;
    const existing = tally.get(match.slug);
    if (existing) {
      existing.count += 1;
    } else {
      tally.set(match.slug, { name: match.name, slug: match.slug, count: 1 });
    }
  }
  return Array.from(tally.values()).sort((a, b) => b.count - a.count);
}
