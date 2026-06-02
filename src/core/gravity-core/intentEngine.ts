import { DEFAULT_GRAVITY_THRESHOLDS } from "./config";
import {
  getBottomProximity,
  getScrollDirection,
  getScrollVelocity,
  getTopProximity,
  normalizeProximity,
} from "./scrollIntelligence";
import type { GravityIntentResult, GravityRuntimeInput, GravityThresholds } from "./types";

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function computeGravityIntent(
  input: GravityRuntimeInput,
  thresholds: GravityThresholds = DEFAULT_GRAVITY_THRESHOLDS,
): GravityIntentResult {
  const direction = getScrollDirection(input.previous, input.current);
  const velocity = getScrollVelocity(input.previous, input.current);

  const bottomProximity = getBottomProximity(input.current);
  const topProximity = getTopProximity(input.current);
  const edgeProximity = Math.min(bottomProximity, topProximity);
  const proximity = normalizeProximity(edgeProximity, thresholds.proximityPx);

  const velocityScore = clamp01(velocity / thresholds.velocityIntent);
  const directionScore = direction === "down" || direction === "up" ? 0.18 : 0;
  const repetitionScore = clamp01((input.repeatedAttempts ?? 0) * thresholds.repetitionBoost);
  const hesitationScore = clamp01((input.hesitationMs ?? 0) > 700 ? thresholds.hesitationBoost : 0);
  const conflictPenalty = input.conflictActive ? thresholds.conflictPenalty : 0;
  const motionPenalty = input.reduceMotion ? 0.15 : 0;

  const intentScore = clamp01(
    proximity * 0.42 +
      velocityScore * 0.28 +
      directionScore +
      repetitionScore +
      hesitationScore -
      conflictPenalty -
      motionPenalty,
  );

  const confidence = clamp01(intentScore * 0.82 + proximity * 0.18);

  const state =
    confidence >= thresholds.confidenceThreshold
      ? "intent"
      : proximity >= 0.55
        ? "proximity"
        : direction === "none"
          ? "idle"
          : "watching";

  return {
    state,
    direction,
    velocity,
    proximity,
    intentScore,
    confidence,
    shadowOnly: true,
    shouldShowRing: intentScore >= thresholds.intentThreshold,
    shouldNavigate: false,
  };
}
