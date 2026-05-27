export const gmarDoctrine = {
  noPayToWin: true,
  noCasinoLoops: true,
  noManipulativeUrgency: true,
  memoryFirst: true,
  civilizationFirst: true,
  emotionalSafety: true,
  calmAdrenalineBalance: true,
} as const;

export function doctrineHealthy(): boolean {
  return Object.values(gmarDoctrine).every(Boolean);
}
