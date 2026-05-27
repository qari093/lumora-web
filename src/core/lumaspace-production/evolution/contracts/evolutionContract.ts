import type { CivilizationEpoch, ResonanceMutation, EvolutionRuntime } from "../types";

export function validateCivilizationEpoch(epoch: CivilizationEpoch): boolean {
  return Boolean(epoch.id && epoch.era);
}

export function validateResonanceMutation(mutation: ResonanceMutation): boolean {
  return Boolean(mutation.id && typeof mutation.adaptive === "boolean");
}

export function validateEvolutionRuntime(runtime: EvolutionRuntime): boolean {
  return Boolean(runtime.active === true && validateCivilizationEpoch(runtime.epoch));
}
