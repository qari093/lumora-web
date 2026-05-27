import type { AtmosphereMode } from "../core/types";

export type ConductorPersona =
  | "calm"
  | "electric"
  | "poetic"
  | "chaotic";

export type ConductorState = {
  userId: string;
  persona: ConductorPersona;
  enabled: boolean;
  adaptationLevel: number;
  trustScore: number;
};

export type ConductorWhisper = {
  whisperId: string;
  mode: AtmosphereMode;
  tone: string;
  message: string;
  generatedAt: number;
};

export type WeeklyReflection = {
  reflectionId: string;
  userId: string;
  dominantMode: AtmosphereMode;
  atmosphereHours: number;
  emotionalSignature: string;
  shareable: boolean;
};
