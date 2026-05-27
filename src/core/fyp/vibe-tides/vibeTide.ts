import type { AtmosphereMode } from "../core/types";

export type VibeTide = {
  tideId: string;
  mode: AtmosphereMode;
  cityScores: {
    cityName: string;
    score: number;
  }[];
  winningCity: string;
  closesAt: number;
};

export function createVibeTide(input: {
  mode: AtmosphereMode;
  cityScores: {
    cityName: string;
    score: number;
  }[];
  closesAt: number;
}): VibeTide {
  if (input.cityScores.length < 2) {
    throw new Error("Vibe Tide requires at least 2 cities.");
  }

  const winner = [...input.cityScores]
    .sort((a, b) => b.score - a.score)[0];

  return {
    tideId: `tide_${input.mode}_${Date.now()}`,
    mode: input.mode,
    cityScores: input.cityScores,
    winningCity: winner.cityName,
    closesAt: input.closesAt
  };
}
