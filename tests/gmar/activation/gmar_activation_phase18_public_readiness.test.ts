import {
  createGmarPublicReadinessStatus,
  assertGmarPublicReadinessStatus
} from "@/src/core/gmar/public-active/publicReadiness";

describe("GMAR Activation Phase 18 — Public Readiness", () => {
  it("creates public readiness status", () => {
    const status = createGmarPublicReadinessStatus();

    expect(status.releaseCandidate).toBe(true);
    expect(status.homepageReady).toBe(true);
    expect(status.onboardingReady).toBe(true);
    expect(status.gameplayLoopReady).toBe(true);
    expect(status.zencoinRewardsReady).toBe(true);
    expect(status.liveEventsReady).toBe(true);
    expect(status.socialFoundationReady).toBe(true);
    expect(status.fypIntegrationReady).toBe(true);
    expect(status.creatorEcosystemReady).toBe(true);
    expect(status.aiAssistSafeModeReady).toBe(true);
    expect(status.infrastructureReady).toBe(true);
    expect(status.rollbackReady).toBe(true);
    expect(status.supportReady).toBe(true);
    expect(status.publicLaunchReady).toBe(true);
    expect(assertGmarPublicReadinessStatus(status)).toBe(true);
  });
});
