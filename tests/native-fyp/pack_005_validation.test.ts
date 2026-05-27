import { describe, expect, it } from "vitest";
import { buildSeedFeed } from "../../src/lib/native-fyp/feed/seed";
import { buildEventsFallback } from "../../src/lib/native-fyp/feed/fallback";

describe("native fyp pack 005", () => {
  it("returns 20 feed items", () => {
    const items = buildSeedFeed();
    expect(items.length).toBe(20);
  });

  it("fallback works", () => {
    const items = buildEventsFallback();
    expect(items.length).toBeGreaterThan(0);
  });
});
