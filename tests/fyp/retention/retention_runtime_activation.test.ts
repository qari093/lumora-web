import { describe, expect, it } from "vitest";

import {
  isRetentionSignalType,
  validateRetentionSignal
} from "@/src/core/fyp/retention/contracts/retentionContract";

import {
  createRetentionStore
} from "@/src/core/fyp/retention/runtime/retentionStore";

import {
  buildRetentionProfile
} from "@/src/core/fyp/retention/runtime/retentionProfile";

import {
  createRetentionRuntime
} from "@/src/core/fyp/retention/runtime/retentionRuntime";

const signal = {
  userId: "user_1",
  type: "watch" as const,
  weight: 5,
  ts: Date.now()
};

describe("Lumora FYP Retention Runtime Activation", () => {
  it("validates retention signal types", () => {
    expect(
      isRetentionSignalType("watch")
    ).toBe(true);

    expect(
      isRetentionSignalType("invalid")
    ).toBe(false);
  });

  it("validates retention signal", () => {
    expect(
      validateRetentionSignal(signal)
    ).toBe(true);
  });

  it("stores retention signals", () => {
    const store =
      createRetentionStore();

    store.track(signal);

    expect(store.count()).toBe(1);
  });

  it("builds retention profile", () => {
    const profile =
      buildRetentionProfile(
        "user_1",
        [signal]
      );

    expect(profile.level).toBe("cold");
    expect(profile.score).toBe(5);
  });

  it("runs retention runtime", () => {
    const runtime =
      createRetentionRuntime();

    runtime.track(signal);

    const profile =
      runtime.profile("user_1");

    expect(profile.userId).toBe("user_1");
    expect(profile.streak).toBe(1);
  });
});
