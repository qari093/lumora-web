export const scalingSystems = [
  "edge-cache",
  "queue-retries",
  "burst-protection",
  "runtime-fallback",
  "circuit-breakers",
] as const;

export function runtimeHealth(load: number) {
  return load < 80 ? "healthy" : "degraded";
}

export function supportsEmergencyMode() {
  return true;
}
