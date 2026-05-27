import type {
  RuntimeMatrixEntry,
  RuntimeMatrixResult
} from "../types";

import {
  evaluateRuntimeMatrix
} from "./runtimeMatrixEvaluator";

export function runRuntimeMatrixValidation(
  entries: RuntimeMatrixEntry[]
): RuntimeMatrixResult {
  return evaluateRuntimeMatrix(entries);
}
