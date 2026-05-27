import { describe, expect, it } from "vitest";
import { buildFyp94FinalFeed } from "../../src/lib/fyp94/feed/build";

describe("FYP94 visibility pack 001", () => {
  it("builds 20-item visible feed", () => {
    const item = (id: string) => ({
      id,
      title: id,
      category: "adrenaline",
      tags: ["adrenaline"],
      playbackUrl: `/v/${id}.mp4`,
      posterUrl: `/p/${id}.jpg`,
      thrillScore: 80,
      source: "lumora_owned",
    });

    const response = buildFyp94FinalFeed({
      layers: [Array.from({ length: 20 }).map((_, index) => item(String(index)))],
      targetSize: 20,
    });

    expect(response.items).toHaveLength(20);
    expect(response.source).toBe("fyp94");
  });
});
