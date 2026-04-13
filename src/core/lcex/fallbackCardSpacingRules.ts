export type FallbackCardSpacingInput = {
  recentCardKinds: string[];
  candidateKind:
    | "poster-only"
    | "title-release"
    | "watchlist-cta"
    | "discussion-cta"
    | "metadata-only";
};

export type FallbackCardSpacingDecision = {
  allowed: boolean;
  reason: "ok" | "fallback_too_dense";
  minDistanceSatisfied: boolean;
};

const MIN_FALLBACK_DISTANCE = 2;

export function resolveFallbackCardSpacing(
  input: FallbackCardSpacingInput
): FallbackCardSpacingDecision {
  const recentIndex = input.recentCardKinds.findIndex(
    (value) => value === input.candidateKind
  );

  if (recentIndex !== -1 && recentIndex < MIN_FALLBACK_DISTANCE) {
    return {
      allowed: false,
      reason: "fallback_too_dense",
      minDistanceSatisfied: false,
    };
  }

  return {
    allowed: true,
    reason: "ok",
    minDistanceSatisfied: true,
  };
}

export function canInsertFallbackCardWithSpacing(
  input: FallbackCardSpacingInput
): boolean {
  return resolveFallbackCardSpacing(input).allowed;
}
