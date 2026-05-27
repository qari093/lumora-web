export interface CivilizationCompletion {
  id: string;
  status: string;
  complete: boolean;
}

export interface OmegaSeal {
  id: string;
  completionRate: number;
}

export interface FinalCivilizationRuntime {
  active: boolean;
  sealId: string;
}
