import { fetch } from "undici";

/** Extract best-effort client IP from Next Request headers */
export function getClientIP(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const parts = fwd.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[0];
  }
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  // In dev, Next may set 127.0.0.1; return null to let provider use "me"
  return null;
}

type Geo = {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  source: string; // which provider
};

/** Look up geo for an IP via chosen provider (env-configurable) */
export async function lookupGeo(ip: string | null): Promise<Geo> {
  const provider = (process.env.IP_GEO_PROVIDER || "ip-api").toLowerCase();
  const token = process.env.IP_GEO_TOKEN || "";
  try {
    if (provider === "ipinfo") {
      const url = "https://ipinfo.io/" + (ip ? ip : "") + "?token=" + token;
      const r = await fetch(url, { headers: { accept: "application/json" } });
      const j: any = await r.json();
      const loc = (j.loc || "").split(",");
      const lat = Number(loc[0]);
      const lon = Number(loc[1]);
      return {
        ip: j.ip,
        city: j.city,
        region: j.region,
        country: j.country,
        countryCode: j.country,
        lat: Number.isFinite(lat) ? lat : undefined,
        lon: Number.isFinite(lon) ? lon : undefined,
        timezone: j.timezone,
        source: "ipinfo",
      };
    }
    if (provider === "ipapi") {
      const url = "https://ipapi.co/" + (ip ? ip + "/" : "") + "json/";
      const j: any = await (await fetch(url)).json();
      return {
        ip: j.ip,
        city: j.city,
        region: j.region,
        country: j.country_name,
        countryCode: j.country,
        lat: j.latitude,
        lon: j.longitude,
        timezone: j.timezone,
        source: "ipapi",
      };
    }
    // default: ip-api.com (no token; works with IP or auto)
    const url = "http://ip-api.com/json/" + (ip || "") + "?fields=status,message,query,city,regionName,country,countryCode,lat,lon,timezone";
    const j: any = await (await fetch(url)).json();
    if (j.status !== "success") throw new Error(j.message || "ip-api failed");
    return {
      ip: j.query,
      city: j.city,
      region: j.regionName,
      country: j.country,
      countryCode: j.countryCode,
      lat: j.lat,
      lon: j.lon,
      timezone: j.timezone,
      source: "ip-api",
    };
  } catch {
    return { source: "geo-error" };
  }
}

/** Format a human-readable location label */
export function labelFromGeo(g: Geo): string {
  const parts = [g.city, g.region, g.country].filter(Boolean);
  return parts.join(", ");
}
