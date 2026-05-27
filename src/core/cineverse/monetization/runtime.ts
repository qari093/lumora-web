export const patronageTiers = [
  "observer",
  "patron",
  "founder",
  "elder-patron"
] as const;

export function createCinemaStone(amount: number) {
  return {
    amount,
    ceremonial: true,
    transferable: false
  };
}

export function createCivilizationTribute(name: string) {
  return {
    civilization: name,
    ceremonial: true,
    unlocks: [
      "theme",
      "constellation",
      "ritual-access"
    ]
  };
}
