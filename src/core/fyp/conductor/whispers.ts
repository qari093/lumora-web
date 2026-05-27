import type {
  ConductorWhisper
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createConductorWhisper(input: {
  mode: AtmosphereMode;
  tone: string;
  message: string;
}): ConductorWhisper {
  if (!input.message.trim()) {
    throw new Error("Conductor whisper requires message.");
  }

  return {
    whisperId: `whisper_${input.mode}_${Date.now()}`,
    mode: input.mode,
    tone: input.tone,
    message: input.message,
    generatedAt: Date.now()
  };
}

export function generateWhisperTone(
  intensity: number
): string {
  if (intensity >= 85) {
    return "volatile";
  }

  if (intensity >= 60) {
    return "electric";
  }

  if (intensity >= 35) {
    return "reflective";
  }

  return "calm";
}
