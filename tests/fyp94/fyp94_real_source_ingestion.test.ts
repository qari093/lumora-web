import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 real source ingestion", () => {
  it("has multiple real source videos and manifest", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    expect(manifest.length).toBeGreaterThanOrEqual(8);
    expect(new Set(manifest.map((x: any) => x.mp4Url)).size).toBeGreaterThanOrEqual(8);
    expect(manifest.every((x: any) => ["pexels", "pixabay"].includes(x.source))).toBe(true);
  });
});
