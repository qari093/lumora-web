import type {
  FypBetaReadinessInput,
  FypBetaReadinessResult
} from "./betaReadinessTypes";

export function evaluateFypBetaReadiness(
  input: FypBetaReadinessInput
): FypBetaReadinessResult {
  const failures: string[] = [];

  if (input.verifiedVideos < 1500) failures.push("verified_video_pool_below_1500");
  if (input.lanesWithAtLeast100 < 6) failures.push("all_lanes_need_100_verified_videos");
  if (input.playbackFailureRate > 0.01) failures.push("playback_failure_rate_above_1_percent");
  if (!input.legalAllowlistReady) failures.push("legal_allowlist_not_ready");
  if (!input.moderationReady) failures.push("moderation_not_ready");
  if (!input.rollbackReady) failures.push("rollback_not_ready");
  if (!input.fallbackReady) failures.push("fallback_not_ready");
  if (!input.deviceRealityReady) failures.push("device_reality_not_ready");

  return {
    ok: failures.length === 0,
    failures
  };
}
