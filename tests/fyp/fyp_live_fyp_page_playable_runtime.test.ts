import { describe, expect, it } from "vitest";
import { applyTraceAwareFeedRerank } from "@/src/core/fyp/runtime-learning/traceAwareRerank";

describe("FYP live page playable runtime", () => {
  it("serves native playable video cards for the live FYP page", () => {
    const runtime = applyTraceAwareFeedRerank();
    const playable = runtime.cards.filter((card) =>
      card.lane === "native_video" &&
      card.autoplayEligible &&
      card.playbackUrl.endsWith(".mp4")
    );

    expect(playable.length).toBeGreaterThanOrEqual(2);
    expect(playable.every((card) => card.playbackUrl.startsWith("https://"))).toBe(true);
    expect(playable.every((card) => card.rankScore >= 0 && card.rankScore <= 1)).toBe(true);
  });
});
