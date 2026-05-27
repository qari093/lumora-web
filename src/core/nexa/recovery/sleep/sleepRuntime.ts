export const sleepRuntime = {
  sleepScoring: true,
  sleepConstellation: true,
  sleepConsistencyTracking: true,
  echoWindDown: true,
  offlineSleepCache: true
} as const;

export function sleepRuntimeHealthy(): boolean {
  return Object.values(sleepRuntime).every(Boolean);
}
