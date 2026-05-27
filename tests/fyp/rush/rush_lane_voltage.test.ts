import { describe, expect, it } from "vitest";

import {
  createRushLanePost,
  createRushLaneState
} from "@/src/core/fyp/rush/rushLane";

import {
  expireRushLanePost,
  isRushLanePostExpired
} from "@/src/core/fyp/rush/expiry";

import {
  rankRushVoltagePosts
} from "@/src/core/fyp/voltage/voltageRanking";

import {
  evaluatePulseEligibility
} from "@/src/core/fyp/voltage/pulseEligibility";

import {
  calculateRushBonus
} from "@/src/core/fyp/rush/rushMonetization";

describe("Lumora FYP Rush Lane + Voltage", () => {
  it("creates rush lane post", () => {
    const post = createRushLanePost({
      postId: "rush_001",
      creatorId: "creator_001",
      mode: "chaos",
      type: "reaction",
      intensity: 9,
      voltageSeed: 40,
      now: 100
    });

    expect(post.active).toBe(true);
    expect(post.expiresAt).toBeGreaterThan(post.createdAt);
  });

  it("creates rush lane state with active posts", () => {
    const post = createRushLanePost({
      postId: "rush_001",
      creatorId: "creator_001",
      mode: "energy",
      type: "raw_clip",
      intensity: 8,
      voltageSeed: 35,
      now: 100
    });

    const state = createRushLaneState({
      creatorId: "creator_001",
      posts: [post],
      now: 200
    });

    expect(state.activePostCount).toBe(1);
    expect(state.monetizationEligible).toBe(true);
  });

  it("expires old rush lane post", () => {
    const post = createRushLanePost({
      postId: "rush_001",
      creatorId: "creator_001",
      mode: "chaos",
      type: "meme_burst",
      intensity: 7,
      voltageSeed: 30,
      now: 100
    });

    const expired = expireRushLanePost(post, post.expiresAt + 1);

    expect(expired.active).toBe(false);
    expect(isRushLanePostExpired(expired, post.expiresAt + 1)).toBe(true);
  });

  it("ranks rush posts by voltage", () => {
    const posts = [
      createRushLanePost({
        postId: "rush_low",
        creatorId: "creator_001",
        mode: "drift",
        type: "rough_edit",
        intensity: 4,
        voltageSeed: 10,
        now: 100
      }),
      createRushLanePost({
        postId: "rush_high",
        creatorId: "creator_001",
        mode: "chaos",
        type: "reaction",
        intensity: 9,
        voltageSeed: 45,
        now: 100
      })
    ];

    const ranked = rankRushVoltagePosts(posts);

    expect(ranked[0].postId).toBe("rush_high");
    expect(ranked[0].rank).toBe(1);
  });

  it("evaluates pulse eligibility and rush bonus", () => {
    const post = createRushLanePost({
      postId: "rush_001",
      creatorId: "creator_001",
      mode: "chaos",
      type: "reaction",
      intensity: 9,
      voltageSeed: 45,
      now: 100
    });

    expect(evaluatePulseEligibility(post).eligible).toBe(true);
    expect(calculateRushBonus(post).eligible).toBe(true);
    expect(calculateRushBonus(post).amount).toBe(5);
  });
});
