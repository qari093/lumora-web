import type {
  CivilizationCompletion,
  OmegaSeal,
  FinalCivilizationRuntime
} from "../types";

export function validateCivilizationCompletion(
  completion: CivilizationCompletion
): boolean {
  return Boolean(
    completion.id &&
    completion.status &&
    typeof completion.complete === "boolean"
  );
}

export function validateOmegaSeal(
  seal: OmegaSeal
): boolean {
  return Boolean(
    seal.id &&
    seal.completionRate === 1
  );
}

export function validateFinalCivilizationRuntime(
  runtime: FinalCivilizationRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.sealId
  );
}
