import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export type FreshnessRotatedSeed = SafeSeedRegistryEntry & {
  freshnessScore: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getSeedTimestamp(entry: SafeSeedRegistryEntry): number {
  const card = entry.card as Record<string, unknown>;
  const raw =
    (typeof card.releasedAt === "string" && card.releasedAt) ||
    (typeof card.releaseDate === "string" && card.releaseDate) ||
    (typeof card.detectedAt === "string" && card.detectedAt) ||
    null;

  if (!raw) return 0;
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function scoreSeedFreshness(entry: SafeSeedRegistryEntry): number {
  const timestamp = getSeedTimestamp(entry);
  if (timestamp === 0) return 45;

  const ageDays = Math.max(0, (Date.now() - timestamp) / (1000 * 60 * 60 * 24));
  if (ageDays <= 3) return 100;
  if (ageDays <= 7) return 90;
  if (ageDays <= 30) return 75;
  if (ageDays <= 90) return 55;
  return 30;
}

export function rotateSeedsByFreshness(
  entries: SafeSeedRegistryEntry[]
): FreshnessRotatedSeed[] {
  return entries
    .map((entry) => ({
      ...entry,
      freshnessScore: clampScore(scoreSeedFreshness(entry)),
    }))
    .sort((a, b) => {
      const freshnessDelta = b.freshnessScore - a.freshnessScore;
      if (freshnessDelta !== 0) return freshnessDelta;
      return a.priority - b.priority;
    });
}
