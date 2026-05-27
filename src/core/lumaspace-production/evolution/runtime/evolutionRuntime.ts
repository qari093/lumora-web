import type { EvolutionRuntime } from "../types";
import { createCivilizationEpoch } from "../epochs/civilizationEpoch";

export function runEvolutionRuntime(): EvolutionRuntime {
  return {
    active: true,
    epoch: createCivilizationEpoch()
  };
}
