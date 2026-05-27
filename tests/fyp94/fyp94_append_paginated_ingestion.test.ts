import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 append paginated ingestion", () => {
  it("has expanded unique manifest and matching local files", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));

    expect(manifest.length).toBeGreaterThanOrEqual(30);
    expect(new Set(manifest.map((x: any) => x.mp4Url)).size).toBe(manifest.length);
    expect(new Set(manifest.map((x: any) => String(x.pexelsId))).size).toBeGreaterThanOrEqual(20);

    for (const item of manifest.slice(-10)) {
      expect(fs.existsSync(`public/native-fyp/real/${item.id}.mp4`)).toBe(true);
      expect(fs.statSync(`public/native-fyp/real/${item.id}.mp4`).size).toBeGreaterThan(80_000);
    }
  });
});
