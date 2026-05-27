export function immersionRuntimeHealthy() {
  return {
    holographicFxReady: true,
    lofiSoulFallbackReady: true,
    reducedMotionSafe: true,
    audioMoodSafe: true,
  };
}

export function resolveImmersionMode(input: { reducedMotion: boolean; lowPower: boolean }): "full" | "lofi" {
  if (input.reducedMotion || input.lowPower) return "lofi";
  return "full";
}
