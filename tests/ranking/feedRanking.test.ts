import { describe, it, expect } from "vitest";
import { rankFeed } from "../../lib/ranking/feedRanking";

describe("feed ranking", () => {
  it("should rank higher engagement higher", () => {
    const now = Date.now();
    const items = [
      { id: "1", createdAt: now, likes: 1, watchTime: 10 },
      { id: "2", createdAt: now, likes: 10, watchTime: 100 }
    ];

    const ranked = rankFeed(items);
    expect(ranked[0].id).toBe("2");
  });

  it("should handle empty safely", () => {
    const ranked = rankFeed([]);
    expect(ranked.length).toBe(0);
  });

  it("should penalize skips", () => {
    const now = Date.now();
    const items = [
      { id: "1", createdAt: now, likes: 10, watchTime: 100, skips: 5 },
      { id: "2", createdAt: now, likes: 5, watchTime: 50 }
    ];

    const ranked = rankFeed(items);
    expect(ranked[0].id).toBe("2");
  });
});
