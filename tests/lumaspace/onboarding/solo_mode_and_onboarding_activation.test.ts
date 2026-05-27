import { describe, expect, it } from "vitest";

import {
  validateSoloSpace,
  validateOnboardingFlow,
  validateOnboardingRuntime
} from "@/src/core/lumaspace/onboarding/contracts/onboardingContract";

import {
  createSoloSpace
} from "@/src/core/lumaspace/onboarding/solo/soloSpace";

import {
  createOnboardingFlow
} from "@/src/core/lumaspace/onboarding/runtime/onboardingFlow";

import {
  runOnboardingRuntime
} from "@/src/core/lumaspace/onboarding/runtime/onboardingRuntime";

describe("LumaSpace Solo Mode and Onboarding Activation", () => {
  it("creates solo space", () => {
    const solo = createSoloSpace();

    expect(
      validateSoloSpace(solo)
    ).toBe(true);
  });

  it("creates onboarding flow", () => {
    const flow = createOnboardingFlow();

    expect(
      validateOnboardingFlow(flow)
    ).toBe(true);
  });

  it("runs onboarding runtime", () => {
    const runtime = runOnboardingRuntime();

    expect(
      validateOnboardingRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.solo.id
    ).toBe("solo_001");
  });
});
