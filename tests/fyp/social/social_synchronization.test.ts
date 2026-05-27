import { describe, expect, it } from "vitest";

import {
  createSyncPrivacyState,
  canExposeSyncPresence
} from "@/src/core/fyp/privacy/syncPrivacy";

import {
  createSocialPresenceSignal
} from "@/src/core/fyp/social/socialPresence";

import {
  detectSynchronicityFlare
} from "@/src/core/fyp/social/synchronicityFlare";

import {
  createSharedAtmosphereMemory
} from "@/src/core/fyp/social/sharedMemory";

import {
  createParallelFeedAccess,
  assertParallelFeedAccess
} from "@/src/core/fyp/social/parallelFeed";

describe("Lumora FYP Social Synchronization", () => {
  it("creates privacy-safe sync state", () => {
    const privacy = createSyncPrivacyState("waqar");

    expect(canExposeSyncPresence(privacy)).toBe(true);
  });

  it("creates anonymous social presence signal", () => {
    const privacy = createSyncPrivacyState("waqar");

    const signal = createSocialPresenceSignal({
      userId: "waqar",
      mode: "chaos",
      privacy,
      now: 100
    });

    expect(signal.userId).toBe("anonymous");
    expect(signal.visible).toBe(true);
    expect(signal.anonymous).toBe(true);
  });

  it("detects synchronicity flare", () => {
    const privacy = createSyncPrivacyState("waqar");

    const signals = ["a", "b", "c"].map((userId, index) =>
      createSocialPresenceSignal({
        userId,
        mode: "chaos",
        privacy,
        now: 100 + index
      })
    );

    const flare = detectSynchronicityFlare({
      mode: "chaos",
      signals,
      now: 100,
      threshold: 3
    });

    expect(flare?.active).toBe(true);
    expect(flare?.participantCount).toBe(3);
  });

  it("creates shared atmosphere memory", () => {
    const memory = createSharedAtmosphereMemory({
      mode: "drift",
      participantCount: 4,
      now: 100
    });

    expect(memory.echoUnlocked).toBe(true);
  });

  it("validates parallel feed access", () => {
    const access = createParallelFeedAccess({
      ownerUserId: "a",
      viewerUserId: "b",
      mode: "deep",
      permitted: true,
      now: 100
    });

    expect(assertParallelFeedAccess(access)).toBe(true);
  });
});
