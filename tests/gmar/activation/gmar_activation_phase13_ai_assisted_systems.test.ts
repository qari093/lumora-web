import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  GMAR_AI_CONFIG,
  createGmarAiMissionSuggestion,
  assertGmarAiMissionSuggestion
} from "@/src/core/gmar/ai-active/aiAssist";

describe("GMAR Activation Phase 13 — AI-Assisted Systems", () => {
  it("locks AI safety config", () => {
    expect(GMAR_AI_CONFIG.defaultMode).toBe("shadow");
    expect(GMAR_AI_CONFIG.humanOverrideRequired).toBe(true);
    expect(GMAR_AI_CONFIG.autonomousExecutionAllowed).toBe(false);
    expect(GMAR_AI_CONFIG.auditLoggingRequired).toBe(true);
  });

  it("creates safe AI mission suggestion", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const suggestion = createGmarAiMissionSuggestion({
      state,
      mode: "assistive",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(suggestion.mode).toBe("assistive");
    expect(suggestion.playerId).toBe("gmar_user_001");
    expect(suggestion.humanReviewRequired).toBe(true);
    expect(assertGmarAiMissionSuggestion(suggestion)).toBe(true);
  });

  it("rejects disabled AI mode", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      createGmarAiMissionSuggestion({
        state,
        mode: "disabled"
      })
    ).toThrow("GMAR AI mission suggestions are disabled.");
  });
});
