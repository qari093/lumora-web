import { describe, expect, it } from "vitest";

import {
  isPersonalizationSignalType,
  validatePersonalizationSignal
} from "@/src/core/fyp/personalization/contracts/personalizationContract";

import {
  buildPersonalizationProfile
} from "@/src/core/fyp/personalization/runtime/profileBuilder";

import {
  personalizeScore
} from "@/src/core/fyp/personalization/runtime/scorePersonalizer";

import {
  createFypPersonalizationRuntime
} from "@/src/core/fyp/personalization/runtime/personalizationRuntime";

const signal = {
  userId: "user_1",
  itemId: "item_1",
  type: "watch" as const,
  weight: 7,
  ts: Date.now()
};

describe("Lumora FYP Personalization Runtime Activation", () => {
  it("validates signal type", () => {
    expect(isPersonalizationSignalType("watch")).toBe(true);
    expect(isPersonalizationSignalType("bad")).toBe(false);
  });

  it("validates personalization signal", () => {
    expect(validatePersonalizationSignal(signal)).toBe(true);
  });

  it("builds personalization profile", () => {
    const profile = buildPersonalizationProfile(
      "user_1",
      [signal]
    );

    expect(profile.affinity.item_1).toBe(7);
  });

  it("personalizes score", () => {
    const profile = buildPersonalizationProfile(
      "user_1",
      [signal]
    );

    const decision = personalizeScore(
      profile,
      "item_1",
      50
    );

    expect(decision.personalizedScore).toBe(57);
    expect(decision.reason).toBe("positive_affinity");
  });

  it("runs personalization runtime", () => {
    const runtime = createFypPersonalizationRuntime();

    runtime.ingest(signal);

    const decision = runtime.decide(
      "user_1",
      "item_1",
      50
    );

    expect(runtime.count()).toBe(1);
    expect(decision.personalizedScore).toBe(57);
  });
});
