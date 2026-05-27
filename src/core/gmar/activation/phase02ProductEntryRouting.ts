export const GMAR_ACTIVATION_PHASE02_ROUTING = {
  route: "/gmar",
  portalEntryReady: true,
  launcherReady: true,
  navigationReady: true,
  mobileReady: true,
  desktopReady: true,
  smokeTestReady: true
} as const;

export function assertGmarActivationPhase02(): true {
  if (
    GMAR_ACTIVATION_PHASE02_ROUTING.route !== "/gmar" ||
    GMAR_ACTIVATION_PHASE02_ROUTING.portalEntryReady !== true ||
    GMAR_ACTIVATION_PHASE02_ROUTING.launcherReady !== true ||
    GMAR_ACTIVATION_PHASE02_ROUTING.navigationReady !== true
  ) {
    throw new Error("GMAR activation phase 02 failed.");
  }

  return true;
}
