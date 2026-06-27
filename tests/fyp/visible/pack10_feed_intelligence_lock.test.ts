import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP Ω∞ Pack 10 — Feed Intelligence Lock", () => {
  const src = fs.readFileSync("app/fyp/FypOmegaPlayer.tsx", "utf8");

  it("keeps feed item fallback stable", () => {
    expect(src).toContain("initialFeed[0]");
    expect(src).toContain("Nebula");
    expect(src).toContain("wonder");
  });

  it("keeps canonical Genesis media fallback", () => {
    expect(src).toContain("/genesis/videos/trace01.mp4");
    expect(src).toContain("/genesis/posters/trace01.jpg");
  });

  it("keeps collection source identity stable", () => {
    expect(src).toContain("lumora_genesis_fyp_v1");
    expect(src).toContain("data-source={source}");
  });

  it("keeps feed intelligence non-toxic and collection-based", () => {
    expect(src).toContain("Genesis Collection");
    expect(src).not.toContain("trending drama");
    expect(src).not.toContain("public likes");
    expect(src).not.toContain("followers");
  });
});
