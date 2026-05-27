export const readinessRuntime = {
  hrvReadiness: true,
  recoveryBands: true,
  nervousSystemLoad: true,
  adaptiveDeload: true,
  restorationDay: true
} as const;

export const recoveryBands = ["restore", "stable", "rebuild", "momentum"] as const;

export function readinessRuntimeHealthy(): boolean {
  return Object.values(readinessRuntime).every(Boolean) && recoveryBands.length === 4;
}
