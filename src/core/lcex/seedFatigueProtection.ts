import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export type SeedExposureRecord = {
  seedId: string;
  impressions: number;
  hides: number;
  lastShownAt?: string;
};

export function computeSeedFatigueScore(
  exposure: SeedExposureRecord
): number {
  const impressionPenalty = Math.min(70, exposure.impressions * 5);
  const hidePenalty = Math.min(30, exposure.hides * 10);
  return Math.max(0, 100 - impressionPenalty - hidePenalty);
}

export function applySeedFatigueProtection(
  entries: SafeSeedRegistryEntry[],
  exposures: SeedExposureRecord[]
): SafeSeedRegistryEntry[] {
  const exposureMap = new Map(exposures.map((item) => [item.seedId, item]));

  return [...entries]
    .map((entry) => ({
      entry,
      fatigueScore: computeSeedFatigueScore(
        exposureMap.get(entry.id) ?? {
          seedId: entry.id,
          impressions: 0,
          hides: 0,
        }
      ),
    }))
    .filter((item) => item.fatigueScore > 20)
    .sort((a, b) => {
      const fatigueDelta = b.fatigueScore - a.fatigueScore;
      if (fatigueDelta !== 0) return fatigueDelta;
      return a.entry.priority - b.entry.priority;
    })
    .map((item) => item.entry);
}
