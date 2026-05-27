import type {
  ResonanceRow,
  ResonanceRowItem
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createResonanceRow(input: {
  contentId: string;
  mode: AtmosphereMode;
  items: ResonanceRowItem[];
  expanded?: boolean;
}): ResonanceRow {
  if (!input.contentId.trim()) {
    throw new Error("Resonance Row requires contentId.");
  }

  return {
    contentId: input.contentId,
    mode: input.mode,
    items: [...input.items].sort((a, b) => b.priority - a.priority),
    expanded: input.expanded ?? false
  };
}

export function getTopResonanceRowItems(
  row: ResonanceRow,
  limit = 5
): ResonanceRowItem[] {
  return row.items.slice(0, limit);
}
