export function getDeviceIdFromHeaders(h: Headers): string {
  const d = h.get("x-device-id");
  if (d && d.length > 3) return d.slice(0, 64);
  // fallback: XFF or random
  const ip = (h.get("x-forwarded-for") || "local").split(",")[0].trim();
  return "dev-" + (ip || "local");
}
