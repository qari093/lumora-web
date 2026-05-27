import {
  createGmarOnboardingSession,
  assertGmarOnboardingSession
} from "@/src/core/gmar/onboarding/onboarding";

describe("GMAR Activation Phase 05 — Playable Onboarding", () => {
  it("creates playable onboarding session", () => {
    const session = createGmarOnboardingSession({
      userId: "user_001",
      displayName: "Waqar",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(session.sessionId).toBe("gmar_onboarding_user_001");
    expect(session.state.player.playerId).toBe("gmar_user_001");
    expect(session.steps).toHaveLength(3);
    expect(session.steps[0]?.completed).toBe(true);
    expect(session.activeStepId).toBe("stabilize_signal");
    expect(session.firstRewardReady).toBe(true);
    expect(session.returnIntentPromptReady).toBe(true);
    expect(assertGmarOnboardingSession(session)).toBe(true);
  });

  it("rejects missing user id", () => {
    expect(() =>
      createGmarOnboardingSession({
        userId: " "
      })
    ).toThrow("GMAR player userId is required.");
  });
});
