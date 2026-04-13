export type IdentityReasonExplainerInput = {
  affinityMatches: string[];
  vibeMatches: string[];
  regionMatch?: string;
  languageMatch?: string;
  optedInFeature?: string;
  noveltyMode?: "low" | "balanced" | "high";
};

export type IdentityReasonExplanation = {
  headline: string;
  reasons: string[];
};

export function buildIdentityReasonExplanation(
  input: IdentityReasonExplainerInput
): IdentityReasonExplanation {
  const reasons: string[] = [];

  if (input.affinityMatches.length > 0) {
    reasons.push(`Matches your affinity for ${input.affinityMatches.slice(0, 3).join(", ")}`);
  }

  if (input.vibeMatches.length > 0) {
    reasons.push(`Fits your vibe tags: ${input.vibeMatches.slice(0, 3).join(", ")}`);
  }

  if (input.regionMatch) {
    reasons.push(`Relevant in ${input.regionMatch.trim()}`);
  }

  if (input.languageMatch) {
    reasons.push(`Available in ${input.languageMatch.trim()}`);
  }

  if (input.optedInFeature) {
    reasons.push(`Included because you opted into ${input.optedInFeature.trim()}`);
  }

  if (input.noveltyMode) {
    reasons.push(`Discovery intensity: ${input.noveltyMode}`);
  }

  return {
    headline: "Why this fits your identity layer",
    reasons: reasons.slice(0, 5),
  };
}

export function hasIdentityReasonExplanation(
  explanation: IdentityReasonExplanation
): boolean {
  return explanation.reasons.length > 0;
}
