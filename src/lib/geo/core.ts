export type LatLon = { lat: number; lon: number };

export function parseLatLon(latStr?: any, lonStr?: any): LatLon | null {
  const lat = Number(latStr); const lon = Number(lonStr);
  if (!isFinite(lat) || !isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

export function haversineKm(a: LatLon, b: LatLon): number {
  const R = 6371; // km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return +(R * c).toFixed(3);
}

export function eligibleForRadius(
  user: LatLon,
  center: LatLon,
  radiusKm = 50
): { eligible: boolean; distanceKm: number } {
  const d = haversineKm(user, center);
  return { eligible: d <= radiusKm, distanceKm: d };
}

/** Dev consent + whereami store (per IP) */
declare global {
  // eslint-disable-next-line no-var
  var __GEO_CONSENT: Map<string, { consent: "granted" | "denied"; at: number }> | undefined;
}
export const CONSENTS: Map<string, { consent: "granted" | "denied"; at: number }> =
  (globalThis.__GEO_CONSENT ||= new Map());

export function setConsent(ip: string, consent: "granted" | "denied") {
  CONSENTS.set(ip, { consent, at: Date.now() });
}
export function getConsent(ip: string): { consent: "granted" | "denied"; at: number } | undefined {
  return CONSENTS.get(ip);
}
