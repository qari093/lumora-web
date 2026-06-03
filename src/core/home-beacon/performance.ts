export type HomeBeaconPerformanceState = {
  animationBudgetMs: number;
  particleThrottle: boolean;
  memoryProtection: boolean;
  renderOptimization: boolean;
  lazyLoading: boolean;
  batteryOptimization: boolean;
  mobileOptimization: boolean;
};

export function getHomeBeaconPerformanceState(): HomeBeaconPerformanceState {
  return {
    animationBudgetMs: 16,
    particleThrottle: true,
    memoryProtection: true,
    renderOptimization: true,
    lazyLoading: true,
    batteryOptimization: true,
    mobileOptimization: true,
  };
}

export function homeBeaconPerformanceReady(frameMs = 12): boolean {
  const state = getHomeBeaconPerformanceState();
  return (
    frameMs <= state.animationBudgetMs &&
    state.particleThrottle &&
    state.memoryProtection &&
    state.renderOptimization &&
    state.lazyLoading &&
    state.batteryOptimization &&
    state.mobileOptimization
  );
}
