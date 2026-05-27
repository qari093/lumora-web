export function createAtmosphereWidget() {
  return {
    active: true,
    mode: "smart-snapshot",
    staleState: "graceful-aging",
    liveAnimationRequired: false
  } as const;
}
