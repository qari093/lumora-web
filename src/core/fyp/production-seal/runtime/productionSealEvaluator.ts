import type {
  ProductionSealInput,
  ProductionSealResult
} from "../types";

import {
  validateProductionSealInput
} from "../contracts/productionSealContract";

export function evaluateProductionSeal(
  input: ProductionSealInput
): ProductionSealResult {
  if (!validateProductionSealInput(input)) {
    throw new Error("invalid_production_seal_input");
  }

  const checks = [
    input.typecheckPassed,
    input.testsPassed,
    input.runtimeClean
  ];

  const score =
    checks.filter(Boolean).length * 33 +
    (checks.every(Boolean) ? 1 : 0);

  return {
    ok: checks.every(Boolean),
    sealed: checks.every(Boolean),
    score,
    reason: checks.every(Boolean)
      ? "production_seal_ready"
      : "production_seal_blocked"
  };
}
