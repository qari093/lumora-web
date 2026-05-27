export type EmotionalWeatherMode = "calm" | "neutral" | "energized";

export interface EmotionalWeatherInput {
  scrollSoftness?: number;
  pauseRhythm?: number;
  switchingVelocity?: number;
}

export interface EmotionalWeather {
  mode: EmotionalWeatherMode;
  confidence: number;
}

export function resolveEmotionalWeather(input: EmotionalWeatherInput = {}): EmotionalWeather {
  const scrollSoftness = input.scrollSoftness ?? 0.5;
  const pauseRhythm = input.pauseRhythm ?? 0.5;
  const switchingVelocity = input.switchingVelocity ?? 0.5;

  const calmScore = (scrollSoftness + pauseRhythm + (1 - switchingVelocity)) / 3;

  if (calmScore >= 0.65) {
    return {
      mode: "calm",
      confidence: Number(calmScore.toFixed(2))
    };
  }

  if (switchingVelocity >= 0.75) {
    return {
      mode: "energized",
      confidence: Number(switchingVelocity.toFixed(2))
    };
  }

  return {
    mode: "neutral",
    confidence: 0.5
  };
}

export function createEmotionalWeather(input: EmotionalWeatherInput = {}): EmotionalWeather {
  return resolveEmotionalWeather(input);
}
