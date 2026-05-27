import {
  createSoloSpace
} from "../solo/soloSpace";

import {
  createOnboardingFlow
} from "./onboardingFlow";

export function runOnboardingRuntime() {
  return {
    active: true,
    solo: createSoloSpace(),
    flow: createOnboardingFlow()
  };
}
