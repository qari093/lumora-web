export const motionSystems = [
  "echo-lens-pulse",
  "ambient-gradients",
  "cinematic-transitions",
] as const;

export function visualPolishReady() {
  return true;
}

export function reducedMotionSupport() {
  return { supported: true };
}

export function atmosphereAnimations() {
  return { synchronized: true };
}
