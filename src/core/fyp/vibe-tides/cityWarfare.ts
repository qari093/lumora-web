import type { VibeTide } from "./vibeTide";

export type CityWarStatus = {
  mode: string;
  activeCities: number;
  winningCity: string;
  battlefieldIntensity: number;
};

export function createCityWarStatus(
  tide: VibeTide
): CityWarStatus {
  const total = tide.cityScores.reduce(
    (sum, city) => sum + city.score,
    0
  );

  return {
    mode: tide.mode,
    activeCities: tide.cityScores.length,
    winningCity: tide.winningCity,
    battlefieldIntensity: total
  };
}
