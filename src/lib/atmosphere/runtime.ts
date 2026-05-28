import { AtmosphereLane } from "./lanes";

export interface AtmosphereState {
  lane: AtmosphereLane;
  intensity: number;
  drift: number;
}

export function createAtmosphereState(
  lane: AtmosphereLane
): AtmosphereState {
  return {
    lane,
    intensity: 0.72,
    drift: Date.now()
  };
}
