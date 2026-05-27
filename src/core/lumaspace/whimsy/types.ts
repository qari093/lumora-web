export type WhimsyMode =
  | "comic"
  | "glitch"
  | "roulette"
  | "raw_fun"
  | "soft_absurd";

export interface WhimsyEffect {
  id: string;
  mode: WhimsyMode;
  intensity: number;
  safe: boolean;
}

export interface GlitchSparkPlan {
  sparkId: string;
  variant: string;
  repeatable: false;
}

export interface EmotionRouletteResult {
  inputAtmosphere: string;
  remixStyle: string;
  surprise: boolean;
}
