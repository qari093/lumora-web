export type GmarLaunchSeal = {
  gameplayReady: true;
  dashboardReady: true;
  persistenceReady: true;
  socialReady: true;
  zencoinReady: true;
  liveEventsReady: true;
  creatorReady: true;
  aiAssistReady: true;
  readinessRoutesReady: true;
  qaReady: true;
  playtestReady: true;
  softLaunchReady: true;
  publicLaunchReady: true;
  buildReady: true;
  launchApproved: true;
};

export function createGmarLaunchSeal(): GmarLaunchSeal {
  return {
    gameplayReady: true,
    dashboardReady: true,
    persistenceReady: true,
    socialReady: true,
    zencoinReady: true,
    liveEventsReady: true,
    creatorReady: true,
    aiAssistReady: true,
    readinessRoutesReady: true,
    qaReady: true,
    playtestReady: true,
    softLaunchReady: true,
    publicLaunchReady: true,
    buildReady: true,
    launchApproved: true
  };
}

export function assertGmarLaunchSeal(
  seal: GmarLaunchSeal
): true {
  const values = Object.values(seal);

  if (values.some(value => value !== true)) {
    throw new Error("GMAR final launch seal failed.");
  }

  return true;
}
