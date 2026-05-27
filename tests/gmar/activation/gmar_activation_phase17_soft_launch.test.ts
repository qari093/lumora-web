import {
  createGmarSoftLaunchStatus,
  assertGmarSoftLaunchStatus
} from "@/src/core/gmar/launch-active/softLaunch";

describe("GMAR Activation Phase 17 — Soft Launch", () => {
  it("creates enabled soft launch status", () => {
    const status = createGmarSoftLaunchStatus({
      launchId: "gmar_soft_launch_v1",
      enabled: true
    });

    expect(status.enabled).toBe(true);
    expect(status.limitedUsersEnabled).toBe(true);
    expect(status.firstLiveEventEnabled).toBe(true);
    expect(status.zencoinRewardsEnabled).toBe(true);
    expect(status.leaderboardEnabled).toBe(true);
    expect(status.fypSurfacingEnabled).toBe(true);
    expect(status.monitoringEnabled).toBe(true);
    expect(status.dailyPatchWindowReady).toBe(true);
    expect(assertGmarSoftLaunchStatus(status)).toBe(true);
  });

  it("rejects disabled soft launch as active status", () => {
    const status = createGmarSoftLaunchStatus({
      enabled: false
    });

    expect(() =>
      assertGmarSoftLaunchStatus(status)
    ).toThrow("Invalid GMAR soft launch status.");
  });
});
