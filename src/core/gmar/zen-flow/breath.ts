export type BreathPulse = {
  inhaleMs: number;
  holdMs: number;
  exhaleMs: number;
  intensity: "soft";
};

export function createBreathPulse(): BreathPulse {
  return {
    inhaleMs: 4000,
    holdMs: 1000,
    exhaleMs: 5000,
    intensity: "soft",
  };
}

export function breathPulseHealthy(pulse = createBreathPulse()): boolean {
  return pulse.inhaleMs >= 3000 && pulse.exhaleMs >= pulse.inhaleMs && pulse.intensity === "soft";
}
