import { isMultiSourceFypEnabled } from "./multiSourceFlags";
import { normalizeMultiSourceForFyp, type MultiSourceFypItem } from "./multiSourceFeedNormalizer";
import type { RawSourceClip } from "@/src/lib/content/pipeline/types";

export function injectMultiSourceIntoFyp(existing: any[], sourceItems: RawSourceClip[]): any[] {
  if (!isMultiSourceFypEnabled()) return existing;

  const multi = normalizeMultiSourceForFyp(sourceItems);

  if (multi.length === 0) return existing;

  return [...multi, ...existing];
}

export function buildMultiSourceDebug(items: any[]) {
  const multi = items.filter((item) => item.sourceType === "multi-source");

  return {
    multiSourceCount: multi.length,
    firstMultiSource: multi[0] || null,
    sources: Array.from(new Set(multi.map((item: MultiSourceFypItem) => item.source))).sort(),
  };
}
