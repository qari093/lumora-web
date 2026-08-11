export type GeoResult = {
  ip: string;
  country: string;
  region: string;
  city: string;
  currency: string;
  lat: number;
  lon: number;
};

export function getClientIp(req?: Request | { headers?: Headers | Record<string, string | string[] | undefined> }): string {
  const headers: any = req?.headers;
  const get = typeof headers?.get === "function"
    ? (k: string) => headers.get(k)
    : (k: string) => headers?.[k] ?? headers?.[k.toLowerCase()];

  const forwarded = get?.("x-forwarded-for");
  const ip = Array.isArray(forwarded) ? forwarded[0] : String(forwarded ?? "");
  return ip.split(",")[0]?.trim() || "127.0.0.1";
}

export function geoByIp(ip = "127.0.0.1"): GeoResult {
  return {
    ip,
    country: "DE",
    region: "TH",
    city: "Schmalkalden",
    currency: "EUR",
    lat: 50.72,
    lon: 10.45,
  };
}

export function getClientGeo(req?: Request): GeoResult {
  return geoByIp(getClientIp(req));
}

export function currencyFor(country = "DE"): string {
  const map: Record<string, string> = {
    DE: "EUR",
    FR: "EUR",
    IT: "EUR",
    ES: "EUR",
    NL: "EUR",
    US: "USD",
    GB: "GBP",
    PK: "PKR",
    IN: "INR",
  };

  return map[country.toUpperCase()] ?? "EUR";
}
