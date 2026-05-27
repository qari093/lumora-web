import type { DiversityFeedItem } from "../types";
import { calculateFeedDiversity } from "./feedDiversityScore";

export function runFeedDiversityRuntime(
  items: DiversityFeedItem[]
) {
  return {
    active: true,
    results: calculateFeedDiversity(items)
  };
}
