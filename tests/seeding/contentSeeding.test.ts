import { describe, expect, it } from "vitest";
import { buildSeedFeed } from "../../lib/seeding/contentSeeding";

describe("content seeding", () => {
  it("returns empty when disabled", () => {
    const out = buildSeedFeed(
      [{ id: "1", portal: "fyp", title: "x", createdAt: 1 }],
      { enabled: false }
    );
    expect(out).toEqual([]);
  });

  it("applies portal caps", () => {
    const out = buildSeedFeed(
      [
        { id: "1", portal: "fyp", title: "a", score: 10, createdAt: 1 },
        { id: "2", portal: "fyp", title: "b", score: 9, createdAt: 2 },
        { id: "3", portal: "fyp", title: "c", score: 8, createdAt: 3 }
      ],
      { enabled: true, portalCaps: { fyp: 2 } }
    );

    expect(out.map((x) => x.id)).toEqual(["1", "2"]);
  });

  it("sorts by score then recency", () => {
    const out = buildSeedFeed(
      [
        { id: "1", portal: "gmar", title: "a", score: 5, createdAt: 1 },
        { id: "2", portal: "gmar", title: "b", score: 7, createdAt: 2 },
        { id: "3", portal: "gmar", title: "c", score: 7, createdAt: 3 }
      ],
      { enabled: true, portalCaps: { gmar: 3 } }
    );

    expect(out.map((x) => x.id)).toEqual(["3", "2", "1"]);
  });

  it("handles empty safely", () => {
    expect(buildSeedFeed([], { enabled: true })).toEqual([]);
  });
});
