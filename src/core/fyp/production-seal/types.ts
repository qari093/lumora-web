export interface ProductionSealInput {
  pack: number;
  total: number;
  typecheckPassed: boolean;
  testsPassed: boolean;
  runtimeClean: boolean;
}

export interface ProductionSealResult {
  ok: boolean;
  sealed: boolean;
  score: number;
  reason: string;
}
