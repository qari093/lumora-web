import type {
  ProductionSealInput
} from "../types";

export function validateProductionSealInput(
  input: ProductionSealInput
): boolean {
  return Boolean(
    Number.isInteger(input.pack) &&
      Number.isInteger(input.total) &&
      input.pack > 0 &&
      input.total >= input.pack &&
      typeof input.typecheckPassed === "boolean" &&
      typeof input.testsPassed === "boolean" &&
      typeof input.runtimeClean === "boolean"
  );
}
