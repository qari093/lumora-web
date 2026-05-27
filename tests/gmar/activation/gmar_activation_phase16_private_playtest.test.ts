import {
  createGmarPrivatePlaytestSession,
  assertGmarPrivatePlaytestSession
} from "@/src/core/gmar/playtest-active/privatePlaytest";

describe("GMAR Activation Phase 16 — Private Playtest", () => {
  it("creates private playtest session", () => {
    const session = createGmarPrivatePlaytestSession({
      testerId: "tester_001",
      accepted: true
    });

    expect(session.sessionId).toBe("gmar_private_playtest_tester_001");
    expect(session.accessGranted).toBe(true);
    expect(session.targetTesterCount).toBe(10);
    expect(session.metrics.firstSessionTracked).toBe(true);
    expect(session.metrics.missionCompletionTracked).toBe(true);
    expect(session.metrics.rewardClaimTracked).toBe(true);
    expect(session.metrics.returnIntentTracked).toBe(true);
    expect(session.metrics.bugCaptureEnabled).toBe(true);
    expect(assertGmarPrivatePlaytestSession(session)).toBe(true);
  });

  it("rejects missing tester id", () => {
    expect(() =>
      createGmarPrivatePlaytestSession({
        testerId: " ",
        accepted: true
      })
    ).toThrow("GMAR private playtest testerId is required.");
  });

  it("rejects unaccepted invite", () => {
    expect(() =>
      createGmarPrivatePlaytestSession({
        testerId: "tester_001",
        accepted: false
      })
    ).toThrow("GMAR private playtest access requires accepted invite.");
  });
});
