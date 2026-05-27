import type {
  CivilizationSeal,
  RuntimeMatrix,
  FinalSealRuntime
} from "../types";

export function validateCivilizationSeal(
  seal: CivilizationSeal
): boolean {
  return Boolean(
    seal.id &&
    seal.status &&
    seal.completionRate >= 0
  );
}

export function validateRuntimeMatrix(
  matrix: RuntimeMatrix
): boolean {
  return Boolean(
    matrix.id &&
    matrix.total >= matrix.passed
  );
}

export function validateFinalSealRuntime(
  runtime: FinalSealRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    validateCivilizationSeal(runtime.seal)
  );
}
