export type TeaserRegionTag =
  | "global"
  | "eu"
  | "mena"
  | "south-asia"
  | "north-america"
  | "latam"
  | "apac"
  | "regional";

export type RegionTaggedTeaser = {
  id: string;
  sourceRegion?: string;
  distributionRegions?: string[];
};

function normalizeRegion(input?: string): string {
  return (input || "").trim().toLowerCase();
}

export function inferTeaserRegionTag(
  input: RegionTaggedTeaser
): TeaserRegionTag {
  const source = normalizeRegion(input.sourceRegion);
  const regions = (input.distributionRegions || []).map(normalizeRegion);

  const all = [source, ...regions].filter(Boolean);

  if (all.includes("global")) return "global";
  if (all.includes("eu") || all.includes("europe")) return "eu";
  if (all.includes("mena") || all.includes("middle-east") || all.includes("middle east")) return "mena";
  if (all.includes("south-asia") || all.includes("south asia") || all.includes("india") || all.includes("pakistan")) return "south-asia";
  if (all.includes("north-america") || all.includes("north america") || all.includes("usa")) return "north-america";
  if (all.includes("latam") || all.includes("latin-america") || all.includes("latin america")) return "latam";
  if (all.includes("apac")) return "apac";

  return all.length <= 1 ? "regional" : "global";
}

export function attachTeaserRegionTag<T extends RegionTaggedTeaser>(
  input: T
): T & { regionTag: TeaserRegionTag } {
  return {
    ...input,
    regionTag: inferTeaserRegionTag(input),
  };
}
