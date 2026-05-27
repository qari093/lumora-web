import type {
  PreloadCandidate,
  PreloadDecision
} from "../types";

import {
  validatePreloadCandidate
} from "../contracts/preloadContract";

const MAX_PRELOAD_BYTES = 25_000_000;

export function evaluatePreloadCandidate(
  candidate: PreloadCandidate
): PreloadDecision {
  if (!validatePreloadCandidate(candidate)) {
    throw new Error("invalid_preload_candidate");
  }

  if (candidate.estimatedBytes > MAX_PRELOAD_BYTES) {
    return {
      id: candidate.id,
      preload: false,
      reason: "asset_too_large"
    };
  }

  if (candidate.priority < 50) {
    return {
      id: candidate.id,
      preload: false,
      reason: "priority_too_low"
    };
  }

  return {
    id: candidate.id,
    preload: true,
    reason: "preload_approved"
  };
}
