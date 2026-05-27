import { describe, expect, it } from "vitest";

import {
  validateFeedComposerItem
} from "@/src/core/fyp/composer/contracts/feedComposerContract";

import {
  composeFeedRank
} from "@/src/core/fyp/composer/runtime/feedComposerRanker";

import {
  runFeedComposerRuntime
} from "@/src/core/fyp/composer/runtime/feedComposerRuntime";

const item = {
  id: "feed_001",
  lane: "viral",
  rankScore: 90,
  qualityScore: 80
};

describe("Lumora FYP Feed Composer Runtime Activation", () => {
  it("validates feed composer item", () => {
    expect(validateFeedComposerItem(item)).toBe(true);
  });

  it("creates composed rank", () => {
    const result = composeFeedRank(item);

    expect(result.composedRank).toBeGreaterThan(0);
  });

  it("supports balanced ranking", () => {
    const result = composeFeedRank({
      ...item,
      rankScore: 70,
      qualityScore: 95
    });

    expect(result.composedRank).toBeGreaterThan(75);
  });

  it("sorts feed by composed rank", () => {
    const runtime = runFeedComposerRuntime([
      item,
      {
        id: "feed_002",
        lane: "social",
        rankScore: 50,
        qualityScore: 50
      }
    ]);

    expect(runtime.items[0].id).toBe("feed_001");
  });

  it("runs feed composer runtime", () => {
    const runtime = runFeedComposerRuntime([item]);

    expect(runtime.ok).toBe(true);
    expect(runtime.total).toBe(1);
  });
});
