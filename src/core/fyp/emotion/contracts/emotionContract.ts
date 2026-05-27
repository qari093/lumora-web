import type {
  EmotionSignal,
  EmotionSignalType
} from "../types";

const VALID_EMOTIONS: EmotionSignalType[] = [
  "calm",
  "joy",
  "focus",
  "awe",
  "tension"
];

export function isEmotionSignalType(
  value: string
): value is EmotionSignalType {
  return VALID_EMOTIONS.includes(
    value as EmotionSignalType
  );
}

export function validateEmotionSignal(
  signal: EmotionSignal
): boolean {
  return Boolean(
    signal.id &&
      signal.itemId &&
      isEmotionSignalType(signal.emotion) &&
      Number.isFinite(signal.intensity) &&
      signal.intensity >= 0 &&
      signal.intensity <= 100
  );
}
