import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { readGuaranteedPool } from "@/src/lib/content/guaranteed/guaranteedPool";
import { buildGuaranteedFypFeed } from "@/src/lib/content/guaranteed/finalFypSupply";

describe("Guaranteed FYP Supply", () => {
  it("has guaranteed manifest", () => {
    expect(fs.existsSync("public/native-fyp/guaranteed-meta/manifest.json")).toBe(true);
  });

  it("reads local playable pool", () => {
    const pool = readGuaranteedPool();
    expect(Array.isArray(pool)).toBe(true);
  });

  it("builds final guaranteed feed", async () => {
    const feed = await buildGuaranteedFypFeed(20);
    expect(feed.ok).toBe(true);
    expect(Array.isArray(feed.items)).toBe(true);
    expect(feed.debug).toHaveProperty("guaranteedTotalCount");
  });

  it("fyp94 is wired to guaranteed supply", () => {
    const route = fs.readFileSync("app/api/fyp94/library/route.ts", "utf8");
    expect(route).toContain("buildGuaranteedFypFeed");
    expect(route).toContain("guaranteed-local-first");
  });
});
