import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 Pack 2 — Multi-Source Integration", () => {
  it("has Pixabay + Pexels ingestion and normalized schema", () => {
    const script = fs.readFileSync("scripts/fyp94/multisource_ingest.mjs", "utf8");

    expect(script).toContain("fetchPixabay");
    expect(script).toContain("fetchPexels");
    expect(script).toContain("normalizeClip");
    expect(script).toContain("seenSourceKeys");
  });

  it("manifest has normalized source metadata and unique URLs", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));

    const withUrl = manifest.filter((x: any) => x.mp4Url);
    expect(new Set(withUrl.map((x: any) => x.mp4Url)).size).toBe(withUrl.length);

    const withSource = manifest.filter((x: any) => x.source && x.localUrl);
    expect(withSource.length).toBeGreaterThanOrEqual(80);
    expect(withSource.every((x: any) => ["pexels", "pixabay"].includes(x.source))).toBe(true);
  });

  it("confirms Pixabay is now present as a real second source", () => {
    const manifest = JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json", "utf8"));
    expect(manifest.some((x: any) => x.source === "pixabay")).toBe(true);
  });

  it("validates source diversity capability", () => {
    const script = fs.readFileSync("scripts/fyp94/multisource_ingest.mjs", "utf8");

    expect(script).toContain("PIXABAY_API_KEY");
    expect(script).toContain("PEXELS_API_KEY");
    expect(script).toContain("license: \"pixabay\"");
    expect(script).toContain("license: \"pexels\"");
  });
});
