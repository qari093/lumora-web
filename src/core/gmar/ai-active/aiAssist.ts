import type { GmarGameState } from "@/src/core/gmar/state/gameState";

export type GmarAiSafetyMode = "disabled" | "shadow" | "assistive";

export type GmarAiMissionSuggestion = {
  suggestionId: string;
  mode: GmarAiSafetyMode;
  playerId: string;
  title: string;
  objective: string;
  rewardHint: string;
  humanReviewRequired: boolean;
  createdAt: string;
};

export const GMAR_AI_CONFIG = {
  defaultMode: "shadow" as GmarAiSafetyMode,
  humanOverrideRequired: true,
  autonomousExecutionAllowed: false,
  auditLoggingRequired: true
} as const;

export function createGmarAiMissionSuggestion(input: {
  state: GmarGameState;
  mode?: GmarAiSafetyMode;
  now?: Date;
}): GmarAiMissionSuggestion {
  const mode = input.mode ?? GMAR_AI_CONFIG.defaultMode;

  if (mode === "disabled") {
    throw new Error("GMAR AI mission suggestions are disabled.");
  }

  const now = input.now ?? new Date();

  return {
    suggestionId: `gmar_ai_mission_${input.state.player.playerId}_${now.getTime()}`,
    mode,
    playerId: input.state.player.playerId,
    title: "Stabilize the Origin Signal",
    objective: "Complete one safe objective based on current GMAR state.",
    rewardHint: "XP + capped Zencoin reward after human-approved completion.",
    humanReviewRequired: GMAR_AI_CONFIG.humanOverrideRequired,
    createdAt: now.toISOString()
  };
}

export function assertGmarAiMissionSuggestion(
  suggestion: GmarAiMissionSuggestion
): true {
  if (
    !suggestion.suggestionId ||
    !suggestion.playerId ||
    suggestion.humanReviewRequired !== true ||
    suggestion.mode === "disabled"
  ) {
    throw new Error("Invalid GMAR AI mission suggestion.");
  }

  return true;
}
