import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP real-life ingestion upgrade", () => {
  it("has real-life query strategy and duration filters", () => {
    const script = fs.readFileSync("scripts/fyp94/real_life_ingest_upgrade.mjs", "utf8");

    expect(script).toContain("people arguing street");
    expect(script).toContain("funny public fail");
    expect(script).toContain("crowd reaction surprise");
    expect(script).toContain("page <= 10");
    expect(script).toContain("d >= 8");
    expect(script).toContain("d <= 45");
  });

  it("manifest contains real-life biased clips", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));

    const realLife = manifest.filter((x: any) => x.contentMode === "real-life");
    const queries = new Set(realLife.map((x: any) => x.query));
    const humanBiased = realLife.filter((x: any) => x.humanBiased);
    const preferred = realLife.filter((x: any) => x.preferredDuration);

    expect(realLife.length).toBeGreaterThanOrEqual(40);
    expect(queries.size).toBeGreaterThanOrEqual(6);
    expect(humanBiased.length).toBeGreaterThan(0);
    expect(preferred.length).toBeGreaterThan(0);
  });

  it("keeps unique source/url records", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    const withUrls = manifest.filter((x: any) => x.mp4Url);
    const urls = new Set(withUrls.map((x: any) => x.mp4Url));

    expect(urls.size).toBe(withUrls.length);
  });
});
