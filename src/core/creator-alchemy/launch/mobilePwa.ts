export interface MobilePwaCheck {
  ok: boolean;
  safeAreaReady: boolean;
  reducedMotionReady: boolean;
  touchTargetReady: boolean;
}

export function validateMobilePwaReadiness(input: MobilePwaCheck): MobilePwaCheck {
  return {
    ...input,
    ok: input.safeAreaReady && input.reducedMotionReady && input.touchTargetReady
  };
}
