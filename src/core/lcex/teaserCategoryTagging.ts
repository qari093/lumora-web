export type TeaserCategoryTag =
  | "movie"
  | "series"
  | "music"
  | "gaming"
  | "cross-media"
  | "unknown";

export type CategoryTaggedTeaser = {
  id: string;
  category?: string;
  sourceHints?: string[];
  title?: string;
};

function normalize(value?: string): string {
  return (value || "").trim().toLowerCase();
}

export function inferTeaserCategoryTag(
  input: CategoryTaggedTeaser
): TeaserCategoryTag {
  const category = normalize(input.category);
  const hints = (input.sourceHints || []).map(normalize);
  const title = normalize(input.title);

  const haystack = [category, ...hints, title].join(" ");

  if (haystack.includes("movie") || haystack.includes("film")) return "movie";
  if (haystack.includes("series") || haystack.includes("show") || haystack.includes("episode")) return "series";
  if (haystack.includes("music") || haystack.includes("song") || haystack.includes("album") || haystack.includes("artist")) return "music";
  if (haystack.includes("gaming") || haystack.includes("game") || haystack.includes("patch") || haystack.includes("dlc")) return "gaming";
  if (haystack.includes("cross-media") || haystack.includes("cross media")) return "cross-media";

  return "unknown";
}

export function attachTeaserCategoryTag<T extends CategoryTaggedTeaser>(
  input: T
): T & { categoryTag: TeaserCategoryTag } {
  return {
    ...input,
    categoryTag: inferTeaserCategoryTag(input),
  };
}
