export interface EmotionSignal {
  id: string;
  atmosphere: string;
  confidence: number;
}

export interface AiSafetyDecision {
  allowed: boolean;
  reason: string;
}

export interface AiEmotionRuntime {
  active: boolean;
  signal: EmotionSignal;
  decision: AiSafetyDecision;
}
