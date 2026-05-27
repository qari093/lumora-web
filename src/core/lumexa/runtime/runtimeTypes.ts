export type LumexaMode =
  | "neutral"
  | "calm"
  | "focus"
  | "social"
  | "creative";

export interface LumexaAtmosphereState {
  mode: LumexaMode;
  confidence: number;
  energy: number;
  inward: number;
  updatedAt: number;
}
