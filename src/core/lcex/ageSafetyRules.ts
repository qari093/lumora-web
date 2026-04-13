export type AgeSafetyRating =
  | "all"
  | "13+"
  | "16+"
  | "18+"
  | "unknown";

export type AgeSafetyInput = {
  violenceScore: number;
  sexualContentScore: number;
  drugUseScore: number;
  horrorScore: number;
  languageScore: number;
};

export type AgeSafetyResult = {
  rating: AgeSafetyRating;
  restricted: boolean;
  reasons: string[];
};

function maxScore(input: AgeSafetyInput): number {
  return Math.max(
    input.violenceScore,
    input.sexualContentScore,
    input.drugUseScore,
    input.horrorScore,
    input.languageScore
  );
}

export function resolveAgeSafetyRules(
  input: AgeSafetyInput
): AgeSafetyResult {
  const reasons: string[] = [];

  if (input.violenceScore >= 80) reasons.push("high_violence");
  if (input.sexualContentScore >= 80) reasons.push("high_sexual_content");
  if (input.drugUseScore >= 75) reasons.push("high_drug_use");
  if (input.horrorScore >= 75) reasons.push("high_horror");
  if (input.languageScore >= 80) reasons.push("high_language");

  const peak = maxScore(input);

  if (peak >= 85) {
    return { rating: "18+", restricted: true, reasons };
  }

  if (peak >= 65) {
    return { rating: "16+", restricted: true, reasons };
  }

  if (peak >= 40) {
    return { rating: "13+", restricted: false, reasons };
  }

  return {
    rating: reasons.length === 0 ? "all" : "unknown",
    restricted: false,
    reasons,
  };
}

export function requiresAgeGate(
  input: AgeSafetyInput
): boolean {
  return resolveAgeSafetyRules(input).restricted;
}
