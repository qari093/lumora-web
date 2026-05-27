import type {
  EmotionResult,
  EmotionSignal,
  EmotionSignalType
} from "../types";

import {
  validateEmotionSignal
} from "../contracts/emotionContract";

export function scoreEmotionSignals(
  itemId: string,
  signals: EmotionSignal[]
): EmotionResult {
  const scoped = signals.filter(
    (signal) =>
      signal.itemId === itemId &&
      validateEmotionSignal(signal)
  );

  const totals = new Map<EmotionSignalType, number>();

  for (const signal of scoped) {
    totals.set(
      signal.emotion,
      (totals.get(signal.emotion) ?? 0) + signal.intensity
    );
  }

  let dominantEmotion: EmotionSignalType = "calm";
  let resonanceScore = 0;

  for (const [emotion, score] of totals.entries()) {
    if (score > resonanceScore) {
      dominantEmotion = emotion;
      resonanceScore = score;
    }
  }

  return {
    itemId,
    dominantEmotion,
    resonanceScore
  };
}
