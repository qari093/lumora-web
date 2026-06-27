import { evaluateFypBetaReadiness } from "./betaReadinessGate";
import { evaluateFypCostGuard } from "./costGuard";
import type { FypBetaReadinessInput } from "./betaReadinessTypes";
import type { FypCostGuardInput } from "./costGuard";

export function evaluateFypBetaLaunchContract(
  readiness: FypBetaReadinessInput,
  cost: FypCostGuardInput
): {
  ok: boolean;
  readinessFailures: string[];
  costWarnings: string[];
} {
  const readinessResult = evaluateFypBetaReadiness(readiness);
  const costResult = evaluateFypCostGuard(cost);

  return {
    ok: readinessResult.ok && costResult.ok,
    readinessFailures: readinessResult.failures,
    costWarnings: costResult.warnings
  };
}
