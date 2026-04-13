import type { LumoraTrustLevel } from "./trustScore";

export type CreatorThresholdResult = {
  canPostToSurge: boolean;
  canUseRiskMode: boolean;
  canCreateDuels: boolean;
  canEnterFlashChallenges: boolean;
  minimumLevel: LumoraTrustLevel;
};

export function getCreatorThresholds(level: LumoraTrustLevel): CreatorThresholdResult {
  if (level === "high") {
    return {
      canPostToSurge: true,
      canUseRiskMode: true,
      canCreateDuels: true,
      canEnterFlashChallenges: true,
      minimumLevel: "high",
    };
  }

  if (level === "medium") {
    return {
      canPostToSurge: true,
      canUseRiskMode: false,
      canCreateDuels: true,
      canEnterFlashChallenges: true,
      minimumLevel: "medium",
    };
  }

  return {
    canPostToSurge: false,
    canUseRiskMode: false,
    canCreateDuels: false,
    canEnterFlashChallenges: false,
    minimumLevel: "low",
  };
}
