export const recoveryRuntime = {
  sleepScoring: true,
  hrvReadiness: true,
  recoveryBands: true,
  breathwork: true,
  echoWindDown: true,
  sleepConstellation: true,
  adaptiveDeload: true,
  quietCheckIn: true
} as const;

export function recoveryHealthy(): boolean {
  return Object.values(recoveryRuntime).every(Boolean);
}
