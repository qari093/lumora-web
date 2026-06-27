import type {
  FypFallbackDecision,
  FypFallbackInput
} from "./fallbackTypes";

import {
  FYP_EMBEDDED_EMERGENCY_FALLBACK,
  FYP_FALLBACK_MESSAGES
} from "./fallbackConstants";

export function resolveFypFallback(
  input: FypFallbackInput
): FypFallbackDecision {
  if (input.primaryHealthy && input.primaryUrl) {
    return {
      tier: "primary",
      playbackUrl: input.primaryUrl,
      message: FYP_FALLBACK_MESSAGES.primary
    };
  }

  if (input.cdnFallbackHealthy && input.cdnFallbackUrl) {
    return {
      tier: "cdn_fallback",
      playbackUrl: input.cdnFallbackUrl,
      message: FYP_FALLBACK_MESSAGES.cdn_fallback
    };
  }

  return {
    tier: "embedded_emergency",
    playbackUrl: FYP_EMBEDDED_EMERGENCY_FALLBACK,
    message: FYP_FALLBACK_MESSAGES.embedded_emergency
  };
}
