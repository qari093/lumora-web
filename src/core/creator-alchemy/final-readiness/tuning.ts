export interface FinalTuningPlan {
  reduceWhispers: boolean;
  softenAtmosphere: boolean;
  slowDreamCadence: boolean;
  throttleEconomy: boolean;
}

export function decideFinalTuning(input: {
  overloadRate: number;
  whisperOpenRate: number;
  dreamParticipationRate: number;
  economyPressure: number;
}): FinalTuningPlan {
  return {
    reduceWhispers: input.overloadRate > 0.15 || input.whisperOpenRate < 0.35,
    softenAtmosphere: input.overloadRate > 0.1,
    slowDreamCadence: input.dreamParticipationRate < 0.2,
    throttleEconomy: input.economyPressure > 0.75
  };
}
