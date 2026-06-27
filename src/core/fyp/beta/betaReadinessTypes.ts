export interface FypBetaReadinessInput {
  verifiedVideos: number;
  lanesWithAtLeast100: number;
  playbackFailureRate: number;
  legalAllowlistReady: boolean;
  moderationReady: boolean;
  rollbackReady: boolean;
  fallbackReady: boolean;
  deviceRealityReady: boolean;
}

export interface FypBetaReadinessResult {
  ok: boolean;
  failures: string[];
}
