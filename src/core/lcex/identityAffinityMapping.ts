export type IdentityAffinityCategory =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media";

export type IdentityAffinitySignal = {
  category: IdentityAffinityCategory;
  weight: number;
};

export type IdentityAffinityMappingInput = {
  watchedCategories: IdentityAffinityCategory[];
  engagedCategories: IdentityAffinityCategory[];
  savedCategories: IdentityAffinityCategory[];
};

export type IdentityAffinityMappingResult = {
  topAffinities: IdentityAffinitySignal[];
};

function scoreCategory(
  category: IdentityAffinityCategory,
  input: IdentityAffinityMappingInput
): number {
  const watched = input.watchedCategories.filter((c) => c === category).length;
  const engaged = input.engagedCategories.filter((c) => c === category).length;
  const saved = input.savedCategories.filter((c) => c === category).length;

  return watched * 1 + engaged * 2 + saved * 3;
}

export function mapIdentityAffinities(
  input: IdentityAffinityMappingInput
): IdentityAffinityMappingResult {
  const categories: IdentityAffinityCategory[] = [
    "movie",
    "series",
    "music",
    "gaming",
    "cross-media",
  ];

  const topAffinities = categories
    .map((category) => ({
      category,
      weight: scoreCategory(category, input),
    }))
    .filter((entry) => entry.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  return { topAffinities };
}

export function hasIdentityAffinityMap(
  result: IdentityAffinityMappingResult
): boolean {
  return result.topAffinities.length > 0;
}
