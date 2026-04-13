import { describe, expect, it } from "vitest";
import {
  applyFeedbackScore,
  buildFeedbackProfile
} from "../../lib/recommendation/feedbackLoop";

describe("recommendation feedback loop", () => {
  it("builds positive affinity for liked tags and creators", () => {
    const profile = buildFeedbackProfile([
      {
        itemId: "1",
        userId: "u1",
        tags: ["sports"],
        creatorId: "creatorA",
        type: "like"
      }
    ]);

    expect(profile.tagAffinity.sports).toBeGreaterThan(0);
    expect(profile.creatorAffinity.creatorA).toBeGreaterThan(0);
  });

  it("builds negative affinity for skipped tags and creators", () => {
    const profile = buildFeedbackProfile([
      {
        itemId: "1",
        userId: "u1",
        tags: ["spam"],
        creatorId: "creatorB",
        type: "skip"
      }
    ]);

    expect(profile.tagAffinity.spam).toBeLessThan(0);
    expect(profile.creatorAffinity.creatorB).toBeLessThan(0);
  });

  it("applies feedback score boost", () => {
    const profile = buildFeedbackProfile([
      {
        itemId: "1",
        userId: "u1",
        tags: ["calm"],
        creatorId: "creatorC",
        type: "like"
      }
    ]);

    const boosted = applyFeedbackScore(
      1,
      { tags: ["calm"], creatorId: "creatorC" },
      profile
    );

    expect(boosted).toBeGreaterThan(1);
  });

  it("applies feedback score penalty", () => {
    const profile = buildFeedbackProfile([
      {
        itemId: "1",
        userId: "u1",
        tags: ["blocked"],
        creatorId: "creatorD",
        type: "skip"
      }
    ]);

    const penalized = applyFeedbackScore(
      1,
      { tags: ["blocked"], creatorId: "creatorD" },
      profile
    );

    expect(penalized).toBeLessThan(1);
  });
});
