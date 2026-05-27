export const sanctuaryRuntime = {
  sanctuaryRuntime: true,
  eternalFlame: true,
  totems: true,
  selfSeed: true,
  emotionalStones: true,
  ambientWorldRenderer: true,
  antiToxicity: true,
  noComparisonEnforcement: true
} as const;

export function sanctuaryHealthy(): boolean {
  return Object.values(sanctuaryRuntime).every(Boolean);
}
