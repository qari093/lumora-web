export function resolveScaleMode(activeUsers: number): "seed" | "beta" | "surge_guarded" {
  if (activeUsers >= 10000) return "surge_guarded";
  if (activeUsers >= 500) return "beta";
  return "seed";
}
