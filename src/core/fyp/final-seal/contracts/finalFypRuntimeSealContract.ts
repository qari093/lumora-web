import type {
  FinalFypRuntimeSealInput
} from "../types";

export function validateFinalFypRuntimeSealInput(
  input: FinalFypRuntimeSealInput
): boolean {
  return Boolean(
    Number.isInteger(input.totalPacks) &&
    Number.isInteger(input.completedPacks) &&
    input.totalPacks > 0 &&
    input.completedPacks >= 0 &&
    input.completedPacks <= input.totalPacks &&
    typeof input.runtimeMatrixReady === "boolean" &&
    typeof input.productionSealReady === "boolean"
  );
}
