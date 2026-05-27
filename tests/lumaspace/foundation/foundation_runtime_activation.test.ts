import { describe, expect, it } from "vitest";

import { validateImmutableLaws } from "@/src/core/lumaspace/foundation/contracts/immutableLaws";
import { createFoundationRuntime } from "@/src/core/lumaspace/foundation/runtime/foundationRuntime";
import { createMotionProfile } from "@/src/core/lumaspace/foundation/runtime/motionEngine";
import { createQuietBeginning } from "@/src/core/lumaspace/foundation/onboarding/quietBeginning";
import { createIdentity } from "@/src/core/lumaspace/foundation/identity/lumaIdentity";

describe("LumaSpace Foundation Runtime Activation", () => {
  it("validates immutable laws", () => {
    expect(validateImmutableLaws()).toBe(true);
  });

  it("creates runtime", () => {
    const runtime = createFoundationRuntime();

    expect(runtime.initialized).toBe(true);
    expect(runtime.atmosphere).toBe("calm");
  });

  it("creates reduced motion profile", () => {
    const profile = createMotionProfile(true);

    expect(profile.enabled).toBe(false);
    expect(profile.multiplier).toBe(0.25);
  });

  it("creates quiet onboarding state", () => {
    const state = createQuietBeginning();

    expect(state.minimalMode).toBe(true);
  });

  it("creates identity", () => {
    const identity = createIdentity("user_001");

    expect(identity.id).toBe("user_001");
    expect(identity.mode).toBe("solo");
  });
});
