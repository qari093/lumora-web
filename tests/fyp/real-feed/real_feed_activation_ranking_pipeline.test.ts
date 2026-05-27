import { describe, expect, it } from "vitest";

import {
  isRealFeedSource,
  REAL_FEED_SOURCES
} from "@/src/core/fyp/real-feed/sourceRegistry";

import {
  buildRealFeedCandidates
} from "@/src/core/fyp/real-feed/candidatePipeline";

import {
  calculateRankScore
} from "@/src/core/fyp/ranking/rankScore";

import {
  rankRealFeedCandidates
} from "@/src/core/fyp/ranking/rankingPipeline";

import {
  balanceFeedDiversity
} from "@/src/core/fyp/ranking/diversityBalancer";

import {
  activateRealFeed
} from "@/src/core/fyp/feed-activation/activatedFeed";

import type {
  RealFeedCandidate
} from "@/src/core/fyp/real-feed/types";

describe("Lumora FYP Real Feed Activation + Ranking Pipeline", () => {
  const candidates: RealFeedCandidate[] = [
    {
      id: "clip_1",
      source: "ugc_video",
      creatorId: "creator_1",
      mode: "drift",
      intensity: 70,
      trustScore: 90,
      safetyScore: 95,
      noveltyScore: 60,
      resonanceScore: 92,
      voltageScore: 50,
      createdAt: 100
    },
    {
      id: "clip_2",
      source: "gmar_event",
      creatorId: "creator_2",
      mode: "chaos",
      intensity: 95,
      trustScore: 80,
      safetyScore: 90,
      noveltyScore: 88,
      resonanceScore: 70,
      voltageScore: 98,
      createdAt: 101
    },
    {
      id: "clip_unsafe",
      source: "ugc_video",
      creatorId: "creator_bad",
      mode: "chaos",
      intensity: 100,
      trustScore: 10,
      safetyScore: 20,
      noveltyScore: 100,
      resonanceScore: 100,
      voltageScore: 100,
      createdAt: 102
    }
  ];

  it("locks real feed source registry", () => {
    expect(REAL_FEED_SOURCES).toContain("ugc_video");
    expect(REAL_FEED_SOURCES).toContain("gmar_event");
    expect(isRealFeedSource("creator_drop")).toBe(true);
    expect(isRealFeedSource("unknown")).toBe(false);
  });

  it("builds safe real feed candidates", () => {
    const safe = buildRealFeedCandidates(candidates);

    expect(safe).toHaveLength(2);
    expect(safe.some(item => item.id === "clip_unsafe")).toBe(false);
  });

  it("calculates rank score", () => {
    const score = calculateRankScore(candidates[0]);

    expect(score).toBeGreaterThan(70);
  });

  it("ranks real feed candidates", () => {
    const ranked = rankRealFeedCandidates(
      buildRealFeedCandidates(candidates)
    );

    expect(ranked[0]?.rank).toBe(1);
    expect(ranked[1]?.rank).toBe(2);
    expect(ranked[0]?.rankScore).toBeGreaterThan(0);
  });

  it("balances feed diversity", () => {
    const ranked = rankRealFeedCandidates([
      candidates[0],
      {
        ...candidates[0],
        id: "clip_1b"
      },
      {
        ...candidates[0],
        id: "clip_1c"
      }
    ]);

    const balanced = balanceFeedDiversity(ranked, 2);

    expect(balanced).toHaveLength(2);
  });

  it("activates real feed", () => {
    const feed = activateRealFeed({
      userId: "waqar",
      mode: "drift",
      candidates,
      limit: 10
    });

    expect(feed.activated).toBe(true);
    expect(feed.safe).toBe(true);
    expect(feed.items.length).toBe(2);
  });
});
