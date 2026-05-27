export const fitnessRuntime = {
  strengthTraining: true,
  hypertrophyTraining: true,
  fatLossCircuits: true,
  mobilityTraining: true,
  enduranceTraining: true,
  sportProtocols: true,
  recoveryDeloads: true,
  audioCuedTraining: true
} as const;

export function fitnessHealthy(): boolean {
  return Object.values(fitnessRuntime).every(Boolean);
}
