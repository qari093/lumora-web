import type { AtmosphereMode } from "../core/types";

export type EmotionalHotDrop = {
  dropId: string;
  mode: AtmosphereMode;
  countdownSeconds: number;
  synchronized: boolean;
  participants: number;
  liveTrackGenerated: boolean;
};

export function createEmotionalHotDrop(input: {
  mode: AtmosphereMode;
  countdownSeconds: number;
  participants: number;
}): EmotionalHotDrop {
  if (input.countdownSeconds < 10) {
    throw new Error("Hot Drop countdown too short.");
  }

  if (input.participants < 1) {
    throw new Error("Hot Drop requires participants.");
  }

  return {
    dropId: `hotdrop_${input.mode}_${Date.now()}`,
    mode: input.mode,
    countdownSeconds: input.countdownSeconds,
    synchronized: true,
    participants: input.participants,
    liveTrackGenerated: true
  };
}
