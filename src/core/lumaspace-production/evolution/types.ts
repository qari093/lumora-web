export interface CivilizationEpoch {
  id: string;
  era: string;
}

export interface ResonanceMutation {
  id: string;
  adaptive: boolean;
}

export interface EvolutionRuntime {
  active: boolean;
  epoch: CivilizationEpoch;
}
