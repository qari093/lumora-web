export type GravityOnboardingState = {
  showGhostHand: boolean;
  sessionGated: boolean;
  exposureCount: number;
};

export function computeGravityOnboarding(exposureCount: number): GravityOnboardingState {
  return {
    showGhostHand: exposureCount < 3,
    sessionGated: true,
    exposureCount,
  };
}
