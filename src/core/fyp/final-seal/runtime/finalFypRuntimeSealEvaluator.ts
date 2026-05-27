import type {
  FinalFypRuntimeSealInput,
  FinalFypRuntimeSealResult
} from "../types";

import {
  validateFinalFypRuntimeSealInput
} from "../contracts/finalFypRuntimeSealContract";

export function evaluateFinalFypRuntimeSeal(
  input: FinalFypRuntimeSealInput
): FinalFypRuntimeSealResult {
  if (!validateFinalFypRuntimeSealInput(input)) {
    throw new Error("invalid_final_fyp_runtime_seal_input");
  }

  const completionRate =
    input.completedPacks / input.totalPacks;

  const sealed =
    completionRate === 1 &&
    input.runtimeMatrixReady &&
    input.productionSealReady;

  return {
    ok: sealed,
    sealed,
    completionRate,
    status: sealed
      ? "final_fyp_runtime_sealed"
      : "final_fyp_runtime_incomplete"
  };
}
