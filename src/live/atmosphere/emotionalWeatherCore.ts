export type EmotionalWeather = "calm" | "warm" | "electric" | "heavy" | "balanced";

export type EmotionalWeatherInput = {
  calm: number;
  joy: number;
  intensity: number;
  heaviness: number;
};

export function calculateEmotionalWeather(input: EmotionalWeatherInput): EmotionalWeather {
  const max = Math.max(input.calm, input.joy, input.intensity, input.heaviness);

  if (max < 25) return "balanced";
  if (input.calm === max) return "calm";
  if (input.joy === max) return "warm";
  if (input.intensity === max) return "electric";
  return "heavy";
}
