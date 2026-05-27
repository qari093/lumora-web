export interface FinalFypRuntimeSealInput {
  totalPacks: number;
  completedPacks: number;
  runtimeMatrixReady: boolean;
  productionSealReady: boolean;
}

export interface FinalFypRuntimeSealResult {
  ok: boolean;
  sealed: boolean;
  completionRate: number;
  status: string;
}
