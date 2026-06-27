export const FYP_DEPTHCANVAS_LANES = [
  "Wonder",
  "Learn",
  "Laugh",
  "Build",
  "Reflect",
  "Connect"
] as const;

export const FYP_DEPTHCANVAS_ACTIONS = [
  "Deep",
  "Board",
  "Share",
  "Pulse",
  "Space"
] as const;

export const FYP_DEPTHCANVAS_BOTTOM_NAV = [
  "Origin",
  "Flow",
  "Live",
  "Trace",
  "Space"
] as const;

export function validateDepthCanvasModel() {
  return {
    ok:
      FYP_DEPTHCANVAS_LANES.length === 6 &&
      FYP_DEPTHCANVAS_ACTIONS.length === 5 &&
      FYP_DEPTHCANVAS_BOTTOM_NAV.length === 5,
    laneCount: FYP_DEPTHCANVAS_LANES.length,
    actionCount: FYP_DEPTHCANVAS_ACTIONS.length,
    bottomNavCount: FYP_DEPTHCANVAS_BOTTOM_NAV.length
  };
}
