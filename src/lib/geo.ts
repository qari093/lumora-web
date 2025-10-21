export type Geo = {
  ip?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  lat?: number | null;
  lon?: number | null;
  source: "query" | "header" | "env" | "header-default";
};

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : (typeof v === "number" ? v : NaN);
  return Number.isFinite(n) ? n : null;
}

/** Per-request geo with override priority: query → headers → env → default (Berlin). */
export function getClientGeo(req: Request): Geo {
  const ip =
    (req.headers as any).get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req.headers as any).get?.("x-real-ip") ||
    null;

  // 1) Query override
  const url = new URL(req.url);
  const qLat = url.searchParams.get("lat");
  const qLon = url.searchParams.get("lon");
  const qCity = url.searchParams.get("city");
  const qCountry = url.searchParams.get("country");
  if (qLat || qLon || qCity || qCountry) {
    return {
      ip,
      city: qCity || null,
      region: null,
      country: qCountry || null,
      lat: num(qLat),
      lon: num(qLon),
      source: "query",
    };
  }

  // 2) Header override
  const hLat = (req.headers as any).get?.("x-geo-lat");
  const hLon = (req.headers as any).get?.("x-geo-lon");
  const hCity = (req.headers as any).get?.("x-geo-city");
  const hCountry = (req.headers as any).get?.("x-geo-country");
  if (hLat || hLon || hCity || hCountry) {
    return {
      ip,
      city: hCity || null,
      region: null,
      country: hCountry || null,
      lat: num(hLat),
      lon: num(hLon),
      source: "header",
    };
  }

  // 3) Env (dev/testing)
  const env = process.env.LUMORA_GEO_JSON;
  if (env) {
    try {
      const j = JSON.parse(env);
      return {
        ip,
        city: j.city ?? null,
        region: j.region ?? null,
        country: j.country ?? j.countryCode ?? null,
        lat: typeof j.lat === "number" ? j.lat : null,
        lon: typeof j.lon === "number" ? j.lon : null,
        source: "env",
      };
    } catch {}
  }

  // 4) Default Berlin
  return {
    ip,
    city: "Berlin",
    region: "BE",
    country: "DE",
    lat: 52.520008,
    lon: 13.404954,
    source: "header-default",
  };
}

/** Haversine distance in KM between two points (lat/lon in degrees). */
export function kmBetween(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
