import { describe, expect, it } from "vitest";
import {
  buildCoreFeed,
  createSessionSeed,
  enforceNoSameItemRepetition,
  filterRecentlySeen,
  stableShuffle,
} from "../../scripts/fyp94/feed_core_logic.mjs";

describe("Phase 4 Pack 7 — Feed Core Logic", () => {
  const items = Array.from({ length: 20 }).map((_, i) => ({ id: String(i + 1) }));

  it("creates numeric session seed", () => {
    expect(typeof createSessionSeed(1000)).toBe("number");
  });

  it("shuffles deterministically per seed", () => {
    const a = stableShuffle(items, 123).map(x => x.id).join(",");
    const b = stableShuffle(items, 123).map(x => x.id).join(",");
    expect(a).toBe(b);
  });

  it("filters recently seen with fallback", () => {
    const filtered = filterRecentlySeen(items, ["1", "2"], 10);
    expect(filtered.some(x => x.id === "1")).toBe(false);

    const fallback = filterRecentlySeen(items, items.map(x => x.id), 10);
    expect(fallback).toHaveLength(items.length);
  });

  it("removes same-item repetition", () => {
    const out = enforceNoSameItemRepetition([{ id: "1" }, { id: "1" }, { id: "2" }]);
    expect(out.map(x => x.id)).toEqual(["1", "2"]);
  });

  it("builds core feed", () => {
    const feed = buildCoreFeed(items, ["1"], 123);
    expect(feed.length).toBeGreaterThan(0);
    expect(feed[0].id).toBeTruthy();
  });
});
