export const movementRuntime = {
  dailySculpture: true,
  movementSeasonality: true,
  adaptiveMovement: true,
  gentleNoCompatible: true,
  flowRingReady: true
} as const;

export function movementHealthy(): boolean {
  return Object.values(movementRuntime).every(Boolean);
}
