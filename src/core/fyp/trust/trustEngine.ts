import type {
  TrustProfile,
  TrustSignal
} from "./types";

export function createTrustProfile(
  signal: TrustSignal
): TrustProfile {
  const trustScore =
    Math.round(
      (
        signal.authenticityScore * 0.4 +
        signal.communityConfidence * 0.35 +
        signal.longevityScore * 0.25
      ) * 100
    ) / 100;

  return {
    creatorId: signal.creatorId,
    trustScore,
    verified: trustScore >= 80,
    protected: trustScore >= 60
  };
}
