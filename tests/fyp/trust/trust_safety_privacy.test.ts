import { describe, expect, it } from "vitest";

import {
  createTrustProfile
} from "@/src/core/fyp/trust/trustEngine";

import {
  evaluateContentSafety
} from "@/src/core/fyp/safety/contentGuard";

import {
  evaluateBurnoutProtection
} from "@/src/core/fyp/safety/burnoutProtection";

import {
  createPrivacyState
} from "@/src/core/fyp/privacy/privacyMode";

import {
  createDataBoundary
} from "@/src/core/fyp/privacy/dataBoundary";

import {
  createReputationState
} from "@/src/core/fyp/trust/reputation";

describe("Lumora FYP Trust + Safety + Privacy", () => {
  it("creates trust profile", () => {
    const profile = createTrustProfile({
      creatorId: "creator_1",
      authenticityScore: 92,
      communityConfidence: 88,
      longevityScore: 80
    });

    expect(profile.verified).toBe(true);
    expect(profile.trustScore).toBeGreaterThan(80);
  });

  it("evaluates safety decision", () => {
    const decision = evaluateContentSafety({
      violence: 10,
      exploitation: 20,
      harassment: 15
    });

    expect(decision).toBe("allow");
  });

  it("detects burnout risk", () => {
    const burnout = evaluateBurnoutProtection({
      creatorId: "creator_1",
      uploads24h: 30,
      hoursActive: 15
    });

    expect(burnout.overloadDetected).toBe(true);
  });

  it("creates privacy state", () => {
    const privacy = createPrivacyState({
      userId: "user_1",
      mode: "phantom"
    });

    expect(privacy.anonymousSignals).toBe(true);
    expect(privacy.locationVisible).toBe(false);
  });

  it("creates encrypted data boundary", () => {
    const boundary = createDataBoundary({
      userId: "user_1",
      aiTrainingAllowed: false
    });

    expect(boundary.encrypted).toBe(true);
    expect(boundary.aiTrainingAllowed).toBe(false);
  });

  it("creates reputation state", () => {
    const reputation = createReputationState({
      creatorId: "creator_1",
      strikes: 2
    });

    expect(reputation.recoveryEligible).toBe(true);
  });
});
