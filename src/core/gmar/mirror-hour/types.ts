export type MirrorHourMood =
  | "reflective"
  | "golden"
  | "silent"
  | "harmonic";

export type MirrorHourState = {
  active: boolean;
  mood: MirrorHourMood;
  competitiveSystemsPaused: boolean;
  skyTransitionActive: boolean;
  ambientAudioActive: boolean;
};
