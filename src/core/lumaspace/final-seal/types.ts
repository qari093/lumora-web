export interface CivilizationSeal {
  id: string;
  status: string;
  completionRate: number;
}

export interface RuntimeMatrix {
  id: string;
  passed: number;
  total: number;
}

export interface FinalSealRuntime {
  active: boolean;
  seal: CivilizationSeal;
}
