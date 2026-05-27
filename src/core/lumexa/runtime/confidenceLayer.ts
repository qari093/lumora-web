export function resolveAtmosphericConfidence(score: number): "neutralize" | "adapt" {
  return score >= 0.65 ? "adapt" : "neutralize";
}
