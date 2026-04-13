export type EmotionalProfile = {
  dominant: string;
  calmIndex: number;
  intensityIndex: number;
};

export function buildEmotionalProfile(): EmotionalProfile {
  return {
    dominant: "curiosity",
    calmIndex: 0.68,
    intensityIndex: 0.74,
  };
}
