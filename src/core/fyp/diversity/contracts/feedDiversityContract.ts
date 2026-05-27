import type { DiversityFeedItem } from "../types";

export function validateFeedDiversityInput(
  items: DiversityFeedItem[]
): boolean {
  return items.every(
    (item) =>
      typeof item.id === "string" &&
      typeof item.lane === "string" &&
      typeof item.score === "number"
  );
}
