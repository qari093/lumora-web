import { describe, expect, it } from "vitest";
import { dedupeFeed } from "../../src/lib/native-fyp/feed/dedupe";
import { enforceDiversity } from "../../src/lib/native-fyp/feed/diversity";
import { finalizeFeed } from "../../src/lib/native-fyp/feed/finalize";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/native-fyp/demo.mp4",
  posterUrl: "/native-fyp/demo.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 007", () => {
  it("dedupes items", () => {
    const items = [
      { ...base, id: "1", title: "a" },
      { ...base, id: "1", title: "a" }
    ];
    const out = dedupeFeed(items);
    expect(out.length).toBe(1);
  });

  it("enforces diversity", () => {
    const items = Array.from({ length: 10 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
      sourceType: i < 8 ? "lumora_generated" : "creator_upload"
    }));
    const out = enforceDiversity(items);
    expect(out.length).toBeLessThanOrEqual(10);
  });

  it("finalizes feed", () => {
    const items = Array.from({ length: 30 }).map((_, i) => ({
      ...base,
      id: String(i),
      title: "v" + i,
    }));
    const out = finalizeFeed(items);
    expect(out.length).toBe(20);
  });
});
