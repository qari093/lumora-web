export interface PerformanceTier {
  tier: "low" | "medium" | "high";
  animations: boolean;
  particles: boolean;
}

export function resolvePerformanceTier(
  battery: number,
  thermal: number
): PerformanceTier {
  if (battery < 0.2 || thermal > 0.8) {
    return {
      tier: "low",
      animations: false,
      particles: false
    };
  }

  if (battery < 0.5) {
    return {
      tier: "medium",
      animations: true,
      particles: false
    };
  }

  return {
    tier: "high",
    animations: true,
    particles: true
  };
}
