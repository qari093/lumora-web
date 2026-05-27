import type { LocalCulturalSignal } from "./types";

export function createLocalCulturalSignal(input: {
  cityId: string;
  category: LocalCulturalSignal["category"];
  energyBoost: number;
  expiresAt: number;
}): LocalCulturalSignal {
  if (!input.cityId.trim()) {
    throw new Error("Local cultural signal requires cityId.");
  }

  if (input.energyBoost < 1) {
    throw new Error("Local cultural signal energyBoost invalid.");
  }

  return {
    signalId: `signal_${input.cityId}_${Date.now()}`,
    cityId: input.cityId,
    category: input.category,
    energyBoost: input.energyBoost,
    expiresAt: input.expiresAt
  };
}

export function calculatePulseAmplification(
  signals: LocalCulturalSignal[]
): number {
  return signals.reduce(
    (sum, signal) => sum + signal.energyBoost,
    0
  );
}
