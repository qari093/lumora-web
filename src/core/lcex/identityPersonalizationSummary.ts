export type IdentityPersonalizationSummaryInput = {
  userId: string;
  topAffinities: string[];
  vibeTags: string[];
  discoveryIntensity: "low" | "balanced" | "high";
  optInCount: number;
  safetyMode: "normal" | "safe-filtered" | "interactive-disabled" | "suppressed";
};

export type IdentityPersonalizationSummary = {
  userId: string;
  headline: string;
  summaryLine: string;
  healthy: boolean;
};

export function buildIdentityPersonalizationSummary(
  input: IdentityPersonalizationSummaryInput
): IdentityPersonalizationSummary {
  const affinities = input.topAffinities.map((item) => item.trim()).filter(Boolean).slice(0, 3);
  const vibes = input.vibeTags.map((item) => item.trim()).filter(Boolean).slice(0, 3);

  const headline =
    affinities.length > 0
      ? `Identity tuned for ${affinities.join(", ")}`
      : "Identity layer configured";

  const parts = [
    `Intensity ${input.discoveryIntensity}`,
    vibes.length > 0 ? `Vibes ${vibes.join(", ")}` : "No vibe tags yet",
    `${Math.max(0, Math.round(input.optInCount))} opt-ins`,
    `Mode ${input.safetyMode}`,
  ];

  return {
    userId: input.userId.trim(),
    headline,
    summaryLine: parts.join(" • "),
    healthy:
      input.userId.trim().length > 0 &&
      input.safetyMode !== "suppressed" &&
      (affinities.length > 0 || vibes.length > 0),
  };
}

export function hasHealthyIdentityPersonalizationSummary(
  summary: IdentityPersonalizationSummary
): boolean {
  return summary.healthy;
}
