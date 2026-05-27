import {
  createGmarPrivateTesterProfile,
  activateGmarPrivateTester,
  completeGmarTesterFirstSession,
  assertGmarPrivateTesterProfile
} from "@/src/core/gmar/tester-active/privateTesterFlow";

describe("GMAR Post-Activation Pack 04 — Private Tester Flow", () => {
  it("creates private tester profile", () => {
    const profile = createGmarPrivateTesterProfile({
      testerId: "tester_001",
      displayName: "Waqar",
      now: new Date("2026-05-09T00:00:00.000Z")
    });

    expect(profile.testerId).toBe("tester_001");
    expect(profile.displayName).toBe("Waqar");
    expect(profile.status).toBe("invited");
    expect(profile.bugReportEnabled).toBe(true);
    expect(assertGmarPrivateTesterProfile(profile)).toBe(true);
  });

  it("activates tester and completes first session metrics", () => {
    const profile = createGmarPrivateTesterProfile({
      testerId: "tester_001",
      displayName: "Waqar"
    });

    const active = activateGmarPrivateTester(profile);
    const completed = completeGmarTesterFirstSession(active);

    expect(completed.status).toBe("active");
    expect(completed.firstSessionComplete).toBe(true);
    expect(completed.missionComplete).toBe(true);
    expect(completed.rewardClaimed).toBe(true);
    expect(completed.returnIntentCaptured).toBe(true);
    expect(assertGmarPrivateTesterProfile(completed)).toBe(true);
  });

  it("rejects empty tester profile", () => {
    expect(() =>
      createGmarPrivateTesterProfile({
        testerId: " ",
        displayName: " "
      })
    ).toThrow("GMAR private tester requires testerId and displayName.");
  });

  it("rejects session completion before activation", () => {
    const profile = createGmarPrivateTesterProfile({
      testerId: "tester_001",
      displayName: "Waqar"
    });

    expect(() =>
      completeGmarTesterFirstSession(profile)
    ).toThrow("GMAR tester must be active before first session completion.");
  });
});
