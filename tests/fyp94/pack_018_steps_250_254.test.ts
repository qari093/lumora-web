import { describe, expect, it } from "vitest";
import { mergeFyp94ContentLayers } from "../../src/lib/fyp94/feed/merge";
import { enforceFyp94Cooldown, enforceFyp94Diversity } from "../../src/lib/fyp94/feed/diversity";
import { ensureFyp94NoEmptyFeed } from "../../src/lib/fyp94/feed/fallback";
import { buildFyp94FeedResponse, validateFyp94FeedContract } from "../../src/lib/fyp94/feed/contract";
import { buildFyp94FinalFeed } from "../../src/lib/fyp94/feed/build";

const item = (id: string, category = "surf", thrillScore = 80) => ({
  id,
  title: `clip ${id}`,
  category,
  tags: [category],
  playbackUrl: `/v/${id}.mp4`,
  posterUrl: `/p/${id}.jpg`,
  thrillScore,
  source: "pexels",
});

describe("FYP 9.4 Pack 018 — Feed Engine Integration", () => {
  it("merges and dedupes content layers", () => {
    const merged = mergeFyp94ContentLayers([[item("1")], [item("1"), item("2")]]);
    expect(merged.map((x) => x.id)).toEqual(["1", "2"]);
  });

  it("enforces diversity and cooldown", () => {
    const items = Array.from({ length: 8 }).map((_, i) => item(String(i), "surf", 90 - i));
    const diverse = enforceFyp94Diversity(items, 3);
    const cooled = enforceFyp94Cooldown({ items: diverse, recentlySeenIds: ["0", "1"] });

    expect(diverse).toHaveLength(8);
    expect(cooled.some((x) => x.id === "0")).toBe(false);
  });

  it("guarantees no empty feed", () => {
    const filled = ensureFyp94NoEmptyFeed([], 20);
    expect(filled).toHaveLength(20);
    expect(filled[0].source).toBe("lumora_owned");
  });

  it("returns final production feed contract", () => {
    const response = buildFyp94FeedResponse([item("1")]);
    expect(validateFyp94FeedContract(response)).toBe(true);
  });

  it("builds final 20-item feed", () => {
    const layers = [
      Array.from({ length: 10 }).map((_, i) => item(`a${i}`, "surf", 90 - i)),
      Array.from({ length: 10 }).map((_, i) => item(`b${i}`, "bike", 80 - i)),
    ];

    const response = buildFyp94FinalFeed({ layers, recentlySeenIds: ["a0"], targetSize: 20 });

    expect(validateFyp94FeedContract(response)).toBe(true);
    expect(response.items).toHaveLength(20);
    expect(response.items.some((x) => x.id === "a0")).toBe(false);
  });
});
