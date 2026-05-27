export interface BrowserValidationResult {
  mobileSafe: boolean;
  tabletSafe: boolean;
  desktopSafe: boolean;
  bottomTextVisible: boolean;
  atmosphereReadable: boolean;
  reducedMotionSafe: boolean;
  accessibilitySafe: boolean;
  gesturesSafe: boolean;
  ok: boolean;
}

export function validateCreatorHubBrowser(input: Omit<BrowserValidationResult, "ok">): BrowserValidationResult {
  const ok =
    input.mobileSafe &&
    input.tabletSafe &&
    input.desktopSafe &&
    input.bottomTextVisible &&
    input.atmosphereReadable &&
    input.reducedMotionSafe &&
    input.accessibilitySafe &&
    input.gesturesSafe;

  return {
    ...input,
    ok
  };
}
