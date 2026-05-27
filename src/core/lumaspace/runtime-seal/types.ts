export interface RuntimeMatrix {
  id: string;
  passed: number;
  total: number;
}

export interface PackSeal {
  id: string;
  sealed: boolean;
}

export interface RuntimeSeal {
  active: boolean;
  matrixId: string;
}
