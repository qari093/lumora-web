import type {
  EmotionResult,
  EmotionSignal
} from "../types";

import {
  scoreEmotionSignals
} from "./emotionScorer";

export function runEmotionRuntime(
  itemIds: string[],
  signals: EmotionSignal[]
): EmotionResult[] {
  return itemIds
    .map((itemId) =>
      scoreEmotionSignals(itemId, signals)
    )
    .sort(
      (a, b) =>
        b.resonanceScore - a.resonanceScore
    );
}
