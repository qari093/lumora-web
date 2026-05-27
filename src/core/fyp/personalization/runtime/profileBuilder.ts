import type {
  PersonalizationProfile,
  PersonalizationSignal
} from "../types";

import { validatePersonalizationSignal } from "../contracts/personalizationContract";

export function buildPersonalizationProfile(
  userId: string,
  signals: PersonalizationSignal[]
): PersonalizationProfile {
  const affinity: Record<string, number> = {};

  for (const signal of signals) {
    if (!validatePersonalizationSignal(signal)) {
      throw new Error("invalid_personalization_signal");
    }

    if (signal.userId !== userId) {
      continue;
    }

    affinity[signal.itemId] =
      (affinity[signal.itemId] ?? 0) + signal.weight;
  }

  return {
    userId,
    affinity,
    updatedAt: Date.now()
  };
}
