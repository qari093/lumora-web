export type SatireAmbiguityInput = {
  ironyMarkers: number;
  contradictionDensity: number;
  politicalOverlap: number;
  regionalSensitivity: number;
};

export type SatireAmbiguityResult = {
  score: number;
  bucket: "low" | "medium" | "high";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreSatireAmbiguity(
  input: SatireAmbiguityInput
): SatireAmbiguityResult {
  const score = clampScore(
    input.ironyMarkers * 0.3 +
      input.contradictionDensity * 0.25 +
      input.politicalOverlap * 0.2 +
      input.regionalSensitivity * 0.25
  );

  return {
    score,
    bucket: score >= 75 ? "high" : score >= 45 ? "medium" : "low",
  };
}

export function requiresSatireReview(
  input: SatireAmbiguityInput
): boolean {
  return scoreSatireAmbiguity(input).bucket === "high";
}
