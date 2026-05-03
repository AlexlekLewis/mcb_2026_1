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
