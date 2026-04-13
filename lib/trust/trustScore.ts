export type LumoraTrustLevel = "low" | "medium" | "high";

export type TrustScoreInput = {
  reports?: number;
  strikes?: number;
  verified?: boolean;
  positiveEvents?: number;
};

export type TrustScoreResult = {
  score: number;
  level: LumoraTrustLevel;
};

export function calculateTrustScore(input: TrustScoreInput): TrustScoreResult {
  const reports = Math.max(0, input.reports ?? 0);
  const strikes = Math.max(0, input.strikes ?? 0);
  const positiveEvents = Math.max(0, input.positiveEvents ?? 0);
  const verifiedBoost = input.verified ? 12 : 0;

  const raw =
    60 +
    verifiedBoost +
    Math.min(20, positiveEvents * 2) -
    Math.min(30, reports * 3) -
    Math.min(40, strikes * 8);

  const score = Math.max(0, Math.min(100, raw));

  const level: LumoraTrustLevel =
    score >= 80 ? "high" : score >= 50 ? "medium" : "low";

  return { score, level };
}

export function canAccessSurgeFeatures(level: LumoraTrustLevel): boolean {
  return level !== "low";
}
