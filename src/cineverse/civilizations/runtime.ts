export const civilizationTiers = [
  "witness",
  "initiate",
  "contributor",
  "elder",
] as const;

export type CivilizationTier = (typeof civilizationTiers)[number];

export function createCivilization(name: string) {
  return {
    name,
    alive: true,
    scheduledEvents: true,
  };
}

export function canPost(tier: CivilizationTier | string) {
  return tier !== "witness";
}
