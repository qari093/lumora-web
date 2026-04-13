import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export type FirstSessionSeedMixInput = {
  seeds: SafeSeedRegistryEntry[];
  limit?: number;
};

export function buildFirstSessionPremiumSeedMix(
  input: FirstSessionSeedMixInput
): SafeSeedRegistryEntry[] {
  const limit = input.limit ?? 10;

  const officialTeasers = input.seeds.filter((entry) => entry.card.type === "teaser");
  const metadataFallbacks = input.seeds.filter((entry) => entry.card.type === "metadata");
  const trendSignals = input.seeds.filter((entry) => entry.card.type === "trend");

  const mixed = [
    ...officialTeasers.slice(0, 5),
    ...metadataFallbacks.slice(0, 2),
    ...trendSignals.slice(0, 3),
  ];

  return mixed
    .slice(0, limit)
    .sort((a, b) => a.priority - b.priority);
}

export function hasPremiumFirstSessionMix(
  seeds: SafeSeedRegistryEntry[]
): boolean {
  const mixed = buildFirstSessionPremiumSeedMix({ seeds });
  return mixed.length >= 6;
}
