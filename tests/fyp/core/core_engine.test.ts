import { describe, expect, it } from "vitest";

import {
  calculateIntensityScore
} from "@/src/core/fyp/core/intensity";

import {
  calculateContinuity
} from "@/src/core/fyp/core/continuity";

import {
  createFeedSession,
  updateEmotionalLoad
} from "@/src/core/fyp/session/sessionEngine";

import {
  orchestrateFeed
} from "@/src/core/fyp/core/orchestrator";

describe("Lumora Core FYP Engine", () => {
  const itemA = {
    id: "a",
    creatorId: "creator_a",
    mode: "drift" as const,
    intensity: 8,
    replayWeight: 10,
    novelty: 5,
    createdAt: Date.now()
  };

  const itemB = {
    id: "b",
    creatorId: "creator_b",
    mode: "chaos" as const,
    intensity: 4,
    replayWeight: 2,
    novelty: 1,
    createdAt: Date.now()
  };

  it("calculates intensity score", () => {
    expect(
      calculateIntensityScore(itemA)
    ).toBeGreaterThan(0);
  });

  it("calculates continuity", () => {
    expect(
      calculateContinuity(itemA, itemB)
    ).toBeLessThan(100);
  });

  it("creates feed session", () => {
    const session = createFeedSession("waqar");

    expect(session.currentMode).toBe("drift");
  });

  it("updates emotional load", () => {
    const session = createFeedSession("waqar");

    const updated = updateEmotionalLoad(
      session,
      15
    );

    expect(updated.emotionalLoad).toBe(15);
  });

  it("orchestrates feed", () => {
    const session = createFeedSession("waqar");

    const feed = orchestrateFeed(
      [itemA, itemB],
      session
    );

    expect(feed.length).toBe(2);
    expect(feed[0].mode).toBe("drift");
  });
});
