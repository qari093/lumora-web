import type { AtmosphereMode } from "../core/types";
import type { UserAtmosphereProfile } from "../profile/atmosphereProfile";

export type ModeSuggestionContext = {
  hour: number;
  weather?: "rain" | "clear" | "snow" | "storm";
  squadMode?: AtmosphereMode;
  lastMode?: AtmosphereMode;
};

export type ModeSuggestion = {
  mode: AtmosphereMode;
  label: string;
  reason: string;
  confidence: number;
};

export function suggestMode(
  profile: UserAtmosphereProfile,
  context: ModeSuggestionContext
): ModeSuggestion {
  if (context.squadMode) {
    return {
      mode: context.squadMode,
      label: `Your squad entered ${context.squadMode}`,
      reason: "squad_sync",
      confidence: 92
    };
  }

  if (context.weather === "rain") {
    return {
      mode: "drift",
      label: "Rain Drift is rising nearby",
      reason: "weather",
      confidence: 84
    };
  }

  if (context.hour >= 22 || context.hour < 5) {
    return {
      mode: "deep",
      label: "Late-night Deep mode?",
      reason: "nighttime",
      confidence: 78
    };
  }

  if (context.lastMode) {
    return {
      mode: context.lastMode,
      label: `Continue ${context.lastMode}?`,
      reason: "continuation",
      confidence: 72
    };
  }

  return {
    mode: profile.currentMode,
    label: `Continue ${profile.currentMode}?`,
    reason: "profile_current",
    confidence: 65
  };
}
