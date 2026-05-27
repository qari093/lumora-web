export const visualDoctrine = {
  cinematic: true,
  holographic: true,
  restrained: true,
  atmospheric: true,
  notCasinoLike: true,
} as const;

export function visualDoctrineHealthy(): boolean {
  return Object.values(visualDoctrine).every(Boolean);
}
