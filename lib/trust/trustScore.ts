export type LumoraTrustLevel = 'high' | 'medium' | 'low';

export type TrustScoreInput = {
  reports?: number;
  strikes?: number;
  verified?: boolean;
  ageDays?: number;
  positiveEvents?: number;
};

export type TrustScoreResult = {
  score: number;
  level: LumoraTrustLevel;
};

function clampCount(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

export function trustLevelFromScore(score: number): LumoraTrustLevel {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function calculateTrustScore(input: TrustScoreInput = {}): TrustScoreResult {
  const reports = clampCount(input.reports);
  const strikes = clampCount(input.strikes);
  const ageDays = clampCount(input.ageDays);
  const positiveEvents = clampCount(input.positiveEvents);

  const reportsPenalty = Math.min(reports * 10, 60);
  const strikesPenalty = Math.min(strikes * 15, 60);
  const verifiedBoost = input.verified ? 15 : 0;
  const ageBoost = Math.min(ageDays / 10, 15);
  const positiveBoost = Math.min(positiveEvents * 2, 20);

  const score = Math.max(
    0,
    Math.min(100, 70 + verifiedBoost + ageBoost + positiveBoost - reportsPenalty - strikesPenalty),
  );

  return {
    score,
    level: trustLevelFromScore(score),
  };
}

export function canAccessSurgeFeatures(
  input: TrustScoreInput | TrustScoreResult | LumoraTrustLevel = {},
): boolean {
  if (typeof input === 'string') {
    return input === 'high' || input === 'medium';
  }

  if ('score' in input && 'level' in input) {
    return input.score >= 65;
  }

  return calculateTrustScore(input).score >= 65;
}

export function computeTrustBatch(items: TrustScoreInput[] = []) {
  return items.map((item, index) => {
    const trust = calculateTrustScore(item);
    return {
      index,
      score: trust.score,
      level: trust.level,
      allowed: canAccessSurgeFeatures(trust),
    };
  });
}
