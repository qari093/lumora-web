import type { Fyp94PulseSyncEffect } from "./types";

export function limitFyp94PulseSyncFrequency(input: {
  effects: Fyp94PulseSyncEffect[];
  maxPerBatch?: number;
}): Fyp94PulseSyncEffect[] {
  const max = input.maxPerBatch ?? 2;
  let used = 0;

  return input.effects.map((effect) => {
    if (!effect.visualPulse && !effect.haptic) return effect;
    used += 1;

    if (used <= max) return effect;

    return {
      ...effect,
      visualPulse: false,
      haptic: false,
      intensity: "none",
    };
  });
}
