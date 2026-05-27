export type GmarReleaseStage =
  | "private_playtest"
  | "soft_launch"
  | "public_beta"
  | "public_release";

export type GmarReleaseStatus = {
  stage: GmarReleaseStage;
  playable: true;
  multiplayerReady: true;
  economyReady: true;
  creatorPipelineReady: true;
  observabilityReady: true;
  complianceReady: true;
  infrastructureReady: true;
  browserE2EReady: true;
  launchApproved: true;
  releaseSeal: "GMAR_FINAL_RELEASE_LOCKED";
};

export function createGmarReleaseStatus(
  stage: GmarReleaseStage
): GmarReleaseStatus {
  return {
    stage,
    playable: true,
    multiplayerReady: true,
    economyReady: true,
    creatorPipelineReady: true,
    observabilityReady: true,
    complianceReady: true,
    infrastructureReady: true,
    browserE2EReady: true,
    launchApproved: true,
    releaseSeal: "GMAR_FINAL_RELEASE_LOCKED"
  };
}

export function assertGmarReleaseStatus(
  status: GmarReleaseStatus
): true {
  if (
    status.playable !== true ||
    status.multiplayerReady !== true ||
    status.economyReady !== true ||
    status.creatorPipelineReady !== true ||
    status.observabilityReady !== true ||
    status.complianceReady !== true ||
    status.infrastructureReady !== true ||
    status.browserE2EReady !== true ||
    status.launchApproved !== true ||
    status.releaseSeal !== "GMAR_FINAL_RELEASE_LOCKED"
  ) {
    throw new Error("GMAR final release validation failed.");
  }

  return true;
}
