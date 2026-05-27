export interface CivilizationEpoch {
  id: string;
  era: string;
}

export interface ResonanceMutation {
  id: string;
  evolving: boolean;
}

export interface EvolutionRuntime {
  active: boolean;
  epochId: string;
}
