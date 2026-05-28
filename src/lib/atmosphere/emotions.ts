export const HUMAN_EMOTIONS = [
  "wonder",
  "calm",
  "nostalgic",
  "adrenaline",
  "cinematic",
  "surreal",
  "emotional",
  "hopeful",
  "ambient",
  "reflective"
] as const;

export type HumanEmotion = typeof HUMAN_EMOTIONS[number];
