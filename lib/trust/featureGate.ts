import type { LumoraTrustLevel } from "./trustScore";

export type FeatureGateResult = {
  surge: boolean;
  duel: boolean;
  prediction: boolean;
  flashChallenge: boolean;
};

export function getFeatureGate(level: LumoraTrustLevel): FeatureGateResult {
  if (level === "high") {
    return {
      surge: true,
      duel: true,
      prediction: true,
      flashChallenge: true,
    };
  }

  if (level === "medium") {
    return {
      surge: true,
      duel: true,
      prediction: false,
      flashChallenge: true,
    };
  }

  return {
    surge: false,
    duel: false,
    prediction: false,
    flashChallenge: false,
  };
}
