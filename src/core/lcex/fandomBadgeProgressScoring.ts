export type FandomBadgeProgressScoringInput = {
  watchCount: number;
  saveCount: number;
  shareCount: number;
  liveParticipationCount: number;
  predictionParticipationCount: number;
  affinityScore: number;
};

export type FandomBadgeProgressScoringResult = {
  progressScore: number;
  tier: "low" | "building" | "strong" | "unlock";
  readyToUnlock: boolean;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreFandomBadgeProgress(
  input: FandomBadgeProgressScoringInput
): FandomBadgeProgressScoringResult {
  const progressScore = clampScore(
    Math.min(input.watchCount, 50) * 0.8 +
      Math.min(input.saveCount, 20) * 1.5 +
      Math.min(input.shareCount, 20) * 1.5 +
      Math.min(input.liveParticipationCount, 20) * 2 +
      Math.min(input.predictionParticipationCount, 20) * 1.5 +
      input.affinityScore * 0.25
  );

  return {
    progressScore,
    tier:
      progressScore >= 85
        ? "unlock"
        : progressScore >= 65
        ? "strong"
        : progressScore >= 40
        ? "building"
        : "low",
    readyToUnlock: progressScore >= 85,
  };
}

export function isReadyToUnlockFandomBadge(
  input: FandomBadgeProgressScoringInput
): boolean {
  return scoreFandomBadgeProgress(input).readyToUnlock;
}
