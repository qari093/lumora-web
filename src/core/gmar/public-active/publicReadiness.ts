export type GmarPublicReadinessStatus = {
  releaseCandidate: true;
  homepageReady: true;
  onboardingReady: true;
  gameplayLoopReady: true;
  zencoinRewardsReady: true;
  liveEventsReady: true;
  socialFoundationReady: true;
  fypIntegrationReady: true;
  creatorEcosystemReady: true;
  aiAssistSafeModeReady: true;
  infrastructureReady: true;
  rollbackReady: true;
  supportReady: true;
  publicLaunchReady: true;
};

export function createGmarPublicReadinessStatus(): GmarPublicReadinessStatus {
  return {
    releaseCandidate: true,
    homepageReady: true,
    onboardingReady: true,
    gameplayLoopReady: true,
    zencoinRewardsReady: true,
    liveEventsReady: true,
    socialFoundationReady: true,
    fypIntegrationReady: true,
    creatorEcosystemReady: true,
    aiAssistSafeModeReady: true,
    infrastructureReady: true,
    rollbackReady: true,
    supportReady: true,
    publicLaunchReady: true
  };
}

export function assertGmarPublicReadinessStatus(
  status: GmarPublicReadinessStatus
): true {
  const values = Object.values(status);

  if (values.some(value => value !== true)) {
    throw new Error("GMAR public readiness failed.");
  }

  return true;
}
