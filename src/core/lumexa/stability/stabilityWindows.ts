export interface StabilityWindow {
  stable: boolean;
  durationMs: number;
}

export function resolveStabilityWindow(
  transitions: number
): StabilityWindow {
  if (transitions > 5) {
    return {
      stable: false,
      durationMs: 120000
    };
  }

  return {
    stable: true,
    durationMs: 300000
  };
}
