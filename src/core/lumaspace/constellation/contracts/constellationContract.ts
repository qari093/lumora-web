import type {
  Constellation,
  AuraBloom,
  ConstellationRuntime
} from "../types";

export function validateConstellation(
  constellation: Constellation
): boolean {
  return Boolean(
    constellation.id &&
    constellation.members > 0
  );
}

export function validateAuraBloom(
  bloom: AuraBloom
): boolean {
  return Boolean(
    bloom.id &&
    bloom.atmosphere
  );
}

export function validateConstellationRuntime(
  runtime: ConstellationRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.constellationId
  );
}
