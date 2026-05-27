import type {
  OnboardingFlow
} from "../types";

export function createOnboardingFlow(): OnboardingFlow {
  return {
    id: "flow_001",
    stage: "shoreline-entry",
    completed: true
  };
}
