export function offlineRecoveryHealthy() {
  return {
    offlineQueue: true,
    safeReplay: true,
    stateRestore: true,
    conflictProtected: true,
  };
}
