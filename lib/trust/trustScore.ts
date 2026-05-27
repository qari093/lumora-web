export type TrustScoreInput = {
  reports?: number;
  verified?: boolean;
  ageDays?: number;
};

export function calculateTrustScore(input: TrustScoreInput = {}): number {
  const reportsPenalty = Math.min(Number(input.reports ?? 0) * 10, 60);
  const verifiedBoost = input.verified ? 15 : 0;
  const ageBoost = Math.min(Number(input.ageDays ?? 0) / 10, 15);
  return Math.max(0, Math.min(100, 70 + verifiedBoost + ageBoost - reportsPenalty));
}

export function canAccessSurgeFeatures(input: TrustScoreInput = {}): boolean {
  return calculateTrustScore(input) >= 65;
}

export function computeTrustBatch(items: TrustScoreInput[] = []) {
  return items.map((item, index) => ({
    index,
    score: calculateTrustScore(item),
    allowed: canAccessSurgeFeatures(item),
  }));
}
