export type EmotionSignalType =
  | "calm"
  | "joy"
  | "focus"
  | "awe"
  | "tension";

export interface EmotionSignal {
  id: string;
  itemId: string;
  emotion: EmotionSignalType;
  intensity: number;
}

export interface EmotionResult {
  itemId: string;
  dominantEmotion: EmotionSignalType;
  resonanceScore: number;
}
