export const sanctuaryCommunity = {
  sanctuaryRuntime: true,
  eternalFlame: true,
  totems: true,
  selfSeed: true,
  emotionalStones: true,
  ambientWorldRenderer: true,
  antiToxicity: true,
  noComparisonEnforcement: true,
  reducedMotionMode: true
} as const;

export function sanctuaryCommunityHealthy(): boolean {
  return Object.values(sanctuaryCommunity).every(Boolean);
}
