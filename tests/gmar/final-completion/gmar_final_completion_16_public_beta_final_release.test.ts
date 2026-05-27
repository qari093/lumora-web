import {
  createGmarReleaseStatus,
  assertGmarReleaseStatus
} from "@/src/core/gmar/final-completion/release/publicFinalRelease";

describe("GMAR Final Completion Phase 16 — Public Beta + Final Release", () => {
  it("creates final public release status", () => {
    const status = createGmarReleaseStatus("public_release");

    expect(status.stage).toBe("public_release");
    expect(status.playable).toBe(true);
    expect(status.multiplayerReady).toBe(true);
    expect(status.economyReady).toBe(true);
    expect(status.creatorPipelineReady).toBe(true);
    expect(status.observabilityReady).toBe(true);
    expect(status.complianceReady).toBe(true);
    expect(status.infrastructureReady).toBe(true);
    expect(status.browserE2EReady).toBe(true);
    expect(status.launchApproved).toBe(true);
    expect(status.releaseSeal).toBe("GMAR_FINAL_RELEASE_LOCKED");

    expect(assertGmarReleaseStatus(status)).toBe(true);
  });

  it("creates public beta release status", () => {
    const status = createGmarReleaseStatus("public_beta");

    expect(status.stage).toBe("public_beta");
    expect(assertGmarReleaseStatus(status)).toBe(true);
  });
});
