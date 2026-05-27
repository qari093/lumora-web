export function selectGmarRegion(primaryHealthy: boolean, fallbackHealthy: boolean): "primary" | "fallback" | "offline-safe" {
  if (primaryHealthy) return "primary";
  if (fallbackHealthy) return "fallback";
  return "offline-safe";
}
