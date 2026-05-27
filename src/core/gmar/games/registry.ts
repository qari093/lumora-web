export const gmarGameRegistry = [
  "zen-flow",
  "astro-shooter",
  "neural-heist-black-minute",
  "pulse-grid",
  "the-last-principle",
  "the-arena",
  "resonance-rebirth",
  "gauntlet-of-mirrors",
] as const;

export function gameRegistryHealthy(): boolean {
  return gmarGameRegistry.length >= 8 && gmarGameRegistry.includes("zen-flow");
}
