export type FypFallbackTier =
  | "primary"
  | "cdn_fallback"
  | "embedded_emergency";

export interface FypFallbackInput {
  primaryUrl?: string;
  cdnFallbackUrl?: string;
  primaryHealthy: boolean;
  cdnFallbackHealthy: boolean;
}

export interface FypFallbackDecision {
  tier: FypFallbackTier;
  playbackUrl: string;
  message: string;
}
