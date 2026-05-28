export type LiveSafetyState = {
  calmMode: boolean;
  fatigueRisk: "low" | "medium" | "high";
  allowEscalation: boolean;
};

export function evaluateLiveSafety(intensity: number): LiveSafetyState {
  const safeIntensity = Math.max(0, Math.min(1, intensity));

  return {
    calmMode: safeIntensity > 0.72,
    fatigueRisk: safeIntensity > 0.82 ? "high" : safeIntensity > 0.55 ? "medium" : "low",
    allowEscalation: safeIntensity < 0.8
  };
}
