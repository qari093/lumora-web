import type { CreatorActivityState, RecoveryDecision } from "./types";

export function decideRecoveryMode(input: CreatorActivityState): RecoveryDecision {
  if (input.sanctuaryRequested) {
    return {
      state: "sanctuary",
      softDecayMultiplier: 0,
      notificationMode: "silent",
      preserveSeed: true,
      substituteSimilarCreators: true
    };
  }

  if (input.daysSincePost >= 21 || input.emotionalLoad >= 0.82) {
    return {
      state: "recovering",
      softDecayMultiplier: 0.25,
      notificationMode: "quiet",
      preserveSeed: true,
      substituteSimilarCreators: true
    };
  }

  if (input.daysSincePost >= 7 || input.emotionalLoad >= 0.62) {
    return {
      state: "resting",
      softDecayMultiplier: 0.55,
      notificationMode: "quiet",
      preserveSeed: true,
      substituteSimilarCreators: false
    };
  }

  return {
    state: "active",
    softDecayMultiplier: 1,
    notificationMode: "normal",
    preserveSeed: true,
    substituteSimilarCreators: false
  };
}

export function calculateSoftDecay(baseReach: number, multiplier: number): number {
  const safeBase = Number.isFinite(baseReach) ? Math.max(0, baseReach) : 0;
  const safeMultiplier = Number.isFinite(multiplier) ? Math.max(0, Math.min(1, multiplier)) : 0;
  return Math.round(safeBase * safeMultiplier);
}
