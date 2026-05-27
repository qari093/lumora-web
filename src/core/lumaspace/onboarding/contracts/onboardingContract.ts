import type {
  SoloSpace,
  OnboardingFlow,
  OnboardingRuntime
} from "../types";

export function validateSoloSpace(
  solo: SoloSpace
): boolean {
  return Boolean(
    solo.id &&
    solo.atmosphere
  );
}

export function validateOnboardingFlow(
  flow: OnboardingFlow
): boolean {
  return Boolean(
    flow.id &&
    flow.stage
  );
}

export function validateOnboardingRuntime(
  runtime: OnboardingRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    validateOnboardingFlow(runtime.flow)
  );
}
