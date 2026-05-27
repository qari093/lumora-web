export interface PulseSunState {
  glow: number;
  tide: number;
}

export function createPulseSun(): PulseSunState {
  return {
    glow: 0.7,
    tide: 0.5
  };
}
