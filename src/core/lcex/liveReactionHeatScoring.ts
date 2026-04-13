export type LiveReactionHeatInput = {
  liveCount: number;
  messageVelocity: number;
  joinVelocity: number;
  reactionVelocity: number;
  retentionRate: number;
};

export type LiveReactionHeatResult = {
  score: number;
  bucket: "low" | "warm" | "hot" | "surging";
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function scoreLiveReactionHeat(
  input: LiveReactionHeatInput
): LiveReactionHeatResult {
  const score = clampScore(
    Math.min(input.liveCount, 1000) * 0.02 +
      input.messageVelocity * 0.25 +
      input.joinVelocity * 0.2 +
      input.reactionVelocity * 0.18 +
      input.retentionRate * 0.35
  );

  return {
    score,
    bucket:
      score >= 85
        ? "surging"
        : score >= 65
        ? "hot"
        : score >= 40
        ? "warm"
        : "low",
  };
}

export function isLiveReactionRoomHot(
  input: LiveReactionHeatInput
): boolean {
  const result = scoreLiveReactionHeat(input);
  return result.bucket === "hot" || result.bucket === "surging";
}
