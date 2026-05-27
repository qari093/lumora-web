import type { SafetyInput } from "../types";

export function validateSafetyInput(
  input: SafetyInput
): boolean {
  return Boolean(
    input.itemId &&
    input.title &&
    input.source &&
    Array.isArray(input.tags) &&
    typeof input.hasLicenseProof === "boolean"
  );
}
