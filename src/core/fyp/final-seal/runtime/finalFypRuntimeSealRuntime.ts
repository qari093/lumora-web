import type {
  FinalFypRuntimeSealInput,
  FinalFypRuntimeSealResult
} from "../types";

import {
  evaluateFinalFypRuntimeSeal
} from "./finalFypRuntimeSealEvaluator";

export function runFinalFypRuntimeSeal(
  input: FinalFypRuntimeSealInput
): FinalFypRuntimeSealResult {
  return evaluateFinalFypRuntimeSeal(input);
}
