import type {
  RuntimeMatrix,
  PackSeal,
  RuntimeSeal
} from "../types";

export function validateRuntimeMatrix(
  matrix: RuntimeMatrix
): boolean {
  return Boolean(
    matrix.id &&
    matrix.total >= matrix.passed &&
    matrix.passed > 0
  );
}

export function validatePackSeal(
  seal: PackSeal
): boolean {
  return Boolean(
    seal.id &&
    typeof seal.sealed === "boolean"
  );
}

export function validateRuntimeSeal(
  seal: RuntimeSeal
): boolean {
  return Boolean(
    seal.active === true &&
    seal.matrixId
  );
}
