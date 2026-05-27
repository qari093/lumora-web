import type {
  SafetyBoundary,
  ConsentLayer,
  GovernanceRuntime
} from "../types";

export function validateSafetyBoundary(
  boundary: SafetyBoundary
): boolean {
  return Boolean(
    boundary.id &&
    boundary.category
  );
}

export function validateConsentLayer(
  consent: ConsentLayer
): boolean {
  return Boolean(
    consent.id &&
    typeof consent.required === "boolean"
  );
}

export function validateGovernanceRuntime(
  runtime: GovernanceRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.boundaryId
  );
}
