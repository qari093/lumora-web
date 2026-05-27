import { describe, expect, it } from "vitest";
import { liveSafety } from "@/src/core/live-presence/safety/liveSafety";
import { liveTrustBoundary } from "@/src/core/live-presence/safety/liveTrustBoundary";

describe("live presence safety", () => {
  it("enables moderation", () => {
    expect(liveSafety.moderationReady).toBe(true);
  });

  it("enforces trust boundary", () => {
    expect(liveTrustBoundary.rateLimited).toBe(true);
  });
});
