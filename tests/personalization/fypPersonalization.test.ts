import { describe, expect, it } from "vitest";
import { personalizeFeed } from "../../lib/personalization/fypPersonalization";

describe("fyp personalization", () => {
  it("boosts liked tags", () => {
    const ranked = personalizeFeed(
      [
        { id: "1", tags: ["sports"], creatorId: "a", baseScore: 1 },
        { id: "2", tags: ["calm"], creatorId: "b", baseScore: 1 }
      ],
      { likedTags: ["calm"] }
    );

    expect(ranked[0].id).toBe("2");
  });

  it("penalizes blocked tags", () => {
    const ranked = personalizeFeed(
      [
        { id: "1", tags: ["blocked"], creatorId: "a", baseScore: 2 },
        { id: "2", tags: ["safe"], creatorId: "b", baseScore: 1 }
      ],
      { blockedTags: ["blocked"] }
    );

    expect(ranked[0].id).toBe("2");
  });

  it("boosts preferred creators", () => {
    const ranked = personalizeFeed(
      [
        { id: "1", tags: ["x"], creatorId: "fav", baseScore: 1 },
        { id: "2", tags: ["x"], creatorId: "other", baseScore: 1 }
      ],
      { preferredCreators: ["fav"] }
    );

    expect(ranked[0].id).toBe("1");
  });

  it("handles empty safely", () => {
    expect(personalizeFeed([], {})).toEqual([]);
  });
});
