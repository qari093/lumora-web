export const civilizationTiers = [
  "witness",
  "initiate",
  "contributor",
  "elder",
];

export function createCivilization(name: string) {
  return {
    name,
    alive: true,
    scheduledEvents: true,
  };
}

export function canPost(tier: string) {
  return tier !== "witness";
}
