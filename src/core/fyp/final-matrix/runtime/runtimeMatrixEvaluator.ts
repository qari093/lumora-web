import type {
  RuntimeMatrixEntry,
  RuntimeMatrixResult
} from "../types";

import {
  validateRuntimeMatrixEntry
} from "../contracts/runtimeMatrixContract";

export function evaluateRuntimeMatrix(
  entries: RuntimeMatrixEntry[]
): RuntimeMatrixResult {
  if (!entries.every(validateRuntimeMatrixEntry)) {
    throw new Error("invalid_runtime_matrix_entry");
  }

  const passed = entries.filter((entry) => entry.passed).length;
  const failed = entries.length - passed;

  return {
    ok: failed === 0,
    total: entries.length,
    passed,
    failed,
    ready: failed === 0
  };
}
