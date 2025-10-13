export type Geo = {
  city: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  ip: string;
};

export function getClientIp(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-for") || "";
  const ip = (xf.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "").trim();
  if (!ip || ip === "127.0.0.1" || ip === "::1") return null;
  return ip;
}

export async function geoByIp(ip: string | null): Promise<Geo> {
  const fallback: Geo = {
    city: "San Francisco",
    region: "CA",
    country: "US",
    lat: 37.7749,
    lon: -122.4194,
    ip: ip || "local"
  };
  try {
    if (!ip) return fallback;
    const r = await fetch(`https://ipapi.co/${ip}/json/`, { cache: "no-store" });
    if (!r.ok) return fallback;
    const j = await r.json();
    const lat = Number(j.latitude);
    const lon = Number(j.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return fallback;
    return {
      city: String(j.city || ""),
      region: String(j.region_code || j.region || ""),
      country: String((j.country || j.country_code || "US")).toUpperCase(),
      lat,
      lon,
      ip
    };
  } catch {
    return fallback;
  }
}

const CCY: Record<string, string> = {
  US: "USD", CA: "CAD", GB: "GBP", EU: "EUR",
  PK: "PKR", IN: "INR", AE: "AED", SA: "SAR",
  AU: "AUD", NZ: "NZD", JP: "JPY", CN: "CNY",
  HK: "HKD", SG: "SGD"
};

export function currencyFor(country?: string): string {
  return (country && CCY[country]) || "USD";
}
