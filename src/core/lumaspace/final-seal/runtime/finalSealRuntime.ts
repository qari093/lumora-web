import {
  createCivilizationSeal
} from "./civilizationSeal";

import {
  createRuntimeMatrix
} from "../validation/runtimeMatrix";

export function runFinalSealRuntime() {
  return {
    active: true,
    seal: createCivilizationSeal(),
    matrix: createRuntimeMatrix()
  };
}
