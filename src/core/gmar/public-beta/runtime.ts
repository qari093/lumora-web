export function publicBetaRuntimeHealthy() {
  return {
    accessGateReady: true,
    testerCohortsReady: true,
    feedbackLoopReady: true,
    rollbackSafe: true,
  };
}

export function resolveBetaCohort(userIndex: number): "founder" | "early" | "standard" {
  if (userIndex <= 100) return "founder";
  if (userIndex <= 1000) return "early";
  return "standard";
}
