import type {
  EmotionRouletteResult
} from "../types";

const STYLES = [
  "retro_synth",
  "soft_noir",
  "dream_pop",
  "comic_burst",
  "liquid_light"
] as const;

export function createEmotionRoulette(
  inputAtmosphere: string,
  index = 0
): EmotionRouletteResult {
  if (!inputAtmosphere) {
    throw new Error("invalid_emotion_roulette_input");
  }

  return {
    inputAtmosphere,
    remixStyle: STYLES[index % STYLES.length],
    surprise: true
  };
}
