import type { EmotionalWeather, MiniMirrorSymbol, WhisperEvent } from "./types";

export function selectWeatherSymbol(events: readonly WhisperEvent[]): MiniMirrorSymbol {
  const strongest = [...events].sort((a, b) => b.strength - a.strength)[0];

  if (!strongest) return "silence";

  switch (strongest.signal) {
    case "silent_linger":
      return "silence";
    case "rewatch_peak":
      return "echo";
    case "completion_rhythm":
      return "patience";
    case "save_overlap":
      return "bloom";
    case "tone_softening":
      return "softness";
    case "quiet_return":
      return "return";
    default:
      return "threshold";
  }
}

export function buildEmotionalWeather(events: readonly WhisperEvent[], recentlyShownCount: number): EmotionalWeather {
  const averageStrength =
    events.length === 0 ? 0 : events.reduce((sum, event) => sum + event.strength, 0) / events.length;

  if (events.length === 0 || averageStrength < 0.42 || recentlyShownCount >= 4) {
    return {
      visible: false,
      text: "",
      symbol: null,
      strength: averageStrength
    };
  }

  const symbol = selectWeatherSymbol(events);

  return {
    visible: true,
    text: weatherText(symbol),
    symbol,
    strength: averageStrength
  };
}

function weatherText(symbol: MiniMirrorSymbol): string {
  switch (symbol) {
    case "silence":
      return "Tonight feels quiet — people lingered longer in softer moments.";
    case "echo":
      return "Tonight feels echoing — certain moments quietly called people back.";
    case "patience":
      return "Tonight feels patient — your pacing held attention gently.";
    case "bloom":
      return "Tonight feels blooming — more people saved your work quietly.";
    case "softness":
      return "Tonight feels soft — your gentler tone carried farther.";
    case "return":
      return "Tonight feels returning — some viewers came back without noise.";
    default:
      return "Tonight feels open — your work left a small trace.";
  }
}
