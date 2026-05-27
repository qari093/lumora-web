export function unlockTier(xp: number) {
  return {
    tier: Math.floor(xp / 100)
  };
}
