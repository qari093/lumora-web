import type {
  ProductionSealInput,
  ProductionSealResult
} from "../types";

import {
  evaluateProductionSeal
} from "./productionSealEvaluator";

export function runProductionSealRuntime(
  input: ProductionSealInput
): ProductionSealResult {
  return evaluateProductionSeal(input);
}
