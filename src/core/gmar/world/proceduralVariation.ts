export function proceduralSeed(seed: number) {
  return {
    biome: seed % 2 === 0 ? "ice" : "desert",
    rarity: seed % 5
  };
}
