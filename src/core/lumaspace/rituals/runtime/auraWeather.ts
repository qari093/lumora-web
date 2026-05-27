import type {
  AuraWeather
} from "../types";

export function createAuraWeather(
  constellationId: string,
  atmosphere = "wonder"
): AuraWeather {
  if (!constellationId || !atmosphere) {
    throw new Error("invalid_aura_weather");
  }

  return {
    constellationId,
    phrase: "Your constellation is breathing in soft light.",
    atmosphere
  };
}
