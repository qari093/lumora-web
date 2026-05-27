export const patronageTiers = [
  "observer",
  "patron",
  "founder",
  "elder-patron",
] as const;

export function createCinemaStone(amount: number) {
  if (amount <= 0) {
    throw new Error("INVALID_CINEMA_STONE_AMOUNT");
  }

  return {
    amount,
    currency: "EUR",
    ceremonial: true,
    transferable: false,
    speculative: false,
  };
}

export function createCivilizationTribute(name: string) {
  return {
    civilization: name,
    ceremonial: true,
    unlocks: ["theme", "constellation", "ritual-access"],
  };
}

export function validateInfrastructureRevenueRatio(input: {
  monthlyInfraCost: number;
  monthlyRevenue: number;
}) {
  if (input.monthlyRevenue <= 0) return false;
  return input.monthlyInfraCost <= input.monthlyRevenue * 0.3;
}
