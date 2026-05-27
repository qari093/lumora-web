import type {
  CityPulse,
  GlobalPulseWave
} from "./types";

import type { AtmosphereMode } from "../core/types";

export function createCityPulse(input: {
  cityId: string;
  cityName: string;
  country: string;
  dominantMode: AtmosphereMode;
  activeUsers: number;
  pulseStrength: number;
  now?: number;
}): CityPulse {
  if (!input.cityId.trim() || !input.cityName.trim()) {
    throw new Error("City pulse requires cityId and cityName.");
  }

  if (input.activeUsers < 0 || input.pulseStrength < 0) {
    throw new Error("City pulse values must be positive.");
  }

  return {
    cityId: input.cityId,
    cityName: input.cityName,
    country: input.country,
    dominantMode: input.dominantMode,
    activeUsers: input.activeUsers,
    pulseStrength: input.pulseStrength,
    updatedAt: input.now ?? Date.now()
  };
}

export function createGlobalPulseWave(input: {
  mode: AtmosphereMode;
  cities: CityPulse[];
}): GlobalPulseWave {
  const totalEnergy = input.cities.reduce(
    (sum, city) => sum + city.pulseStrength,
    0
  );

  return {
    waveId: `wave_${input.mode}_${input.cities.length}`,
    mode: input.mode,
    cities: input.cities.map(city => city.cityName),
    totalEnergy,
    trend:
      totalEnergy >= 500
        ? "rising"
        : totalEnergy >= 200
          ? "stable"
          : "falling"
  };
}
