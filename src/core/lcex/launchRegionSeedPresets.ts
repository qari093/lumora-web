import type { SafeSeedRegistryEntry } from "./safeSeedRegistry";

export type LaunchRegionPreset = {
  region: string;
  label: string;
  preferredCategories: Array<"movie" | "series" | "music" | "gaming">;
  maxSeeds: number;
};

export const LAUNCH_REGION_SEED_PRESETS: LaunchRegionPreset[] = [
  {
    region: "global",
    label: "Global Launch",
    preferredCategories: ["movie", "series", "music", "gaming"],
    maxSeeds: 12,
  },
  {
    region: "eu",
    label: "Europe Launch",
    preferredCategories: ["movie", "series", "music"],
    maxSeeds: 10,
  },
  {
    region: "mena",
    label: "MENA Launch",
    preferredCategories: ["movie", "music", "gaming"],
    maxSeeds: 10,
  },
  {
    region: "south-asia",
    label: "South Asia Launch",
    preferredCategories: ["movie", "series", "music", "gaming"],
    maxSeeds: 12,
  },
];

export function getLaunchRegionSeedPreset(
  region: string
): LaunchRegionPreset {
  return (
    LAUNCH_REGION_SEED_PRESETS.find(
      (preset) => preset.region === region.trim().toLowerCase()
    ) ?? LAUNCH_REGION_SEED_PRESETS[0]
  );
}

export function applyLaunchRegionSeedPreset(
  region: string,
  seeds: SafeSeedRegistryEntry[]
): SafeSeedRegistryEntry[] {
  const preset = getLaunchRegionSeedPreset(region);

  return seeds
    .filter((entry) => {
      const category = (entry.card as { category?: string }).category;
      return typeof category === "string"
        ? preset.preferredCategories.includes(
            category as "movie" | "series" | "music" | "gaming"
          )
        : true;
    })
    .slice(0, preset.maxSeeds);
}
