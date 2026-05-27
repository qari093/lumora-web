import type { MiniMirror, MiniMirrorSymbol, WhisperEvent } from "./types";
import { selectWeatherSymbol } from "./emotionalWeather";

export function createMiniMirror(monthKey: string, events: readonly WhisperEvent[]): MiniMirror {
  const symbol = selectWeatherSymbol(events);

  return {
    monthKey,
    symbol,
    phrase: miniMirrorPhrase(symbol),
    accepted: null,
    stored: false
  };
}

export function applyMiniMirrorFeedback(mirror: MiniMirror, accepted: boolean): MiniMirror {
  return {
    ...mirror,
    accepted,
    stored: accepted
  };
}

export function miniMirrorPhrase(symbol: MiniMirrorSymbol): string {
  switch (symbol) {
    case "silence":
      return "This month, your silence spoke softly.";
    case "patience":
      return "This month, patience shaped your rhythm.";
    case "bloom":
      return "This month, something gentle began to bloom.";
    case "echo":
      return "This month, your work quietly echoed back.";
    case "return":
      return "This month carried the feeling of return.";
    case "restlessness":
      return "This month held restless movement.";
    case "softness":
      return "This month, softness carried weight.";
    case "threshold":
      return "This month felt like a threshold.";
    default:
      return "This month left a quiet trace.";
  }
}

export function buildAnnualSymbolConstellation(mirrors: readonly MiniMirror[]): MiniMirrorSymbol[] {
  return mirrors.filter((mirror) => mirror.stored).map((mirror) => mirror.symbol).slice(0, 12);
}
