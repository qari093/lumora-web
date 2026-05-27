export const LIGHT_ONLY_DRIFT_LIMIT_MS = 14 * 24 * 60 * 60 * 1000;

export function isLightOnlyDriftExceeded(input: {
  lastActiveAtMs: number;
  nowMs: number;
}): boolean {
  return (input.nowMs - input.lastActiveAtMs) >= LIGHT_ONLY_DRIFT_LIMIT_MS;
}
