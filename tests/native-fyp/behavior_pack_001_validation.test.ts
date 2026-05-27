import { describe, expect, it } from "vitest";
import { rerankBySessionSignals, scoreSessionSignal } from "../../src/lib/native-fyp/behavior/sessionRank";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp behavior pack 001", () => {
  it("scores dwell positively", () => {
    expect(scoreSessionSignal({ id: "1", dwellMs: 3000 })).toBeGreaterThan(0);
  });

  it("scores skip negatively", () => {
    expect(scoreSessionSignal({ id: "1", skipped: true })).toBeLessThan(0);
  });

  it("reranks by session signals", () => {
    const items = [
      { ...base, id: "1", title: "a" },
      { ...base, id: "2", title: "b" },
    ];
    const out = rerankBySessionSignals(items, [{ id: "2", stashed: true }]);
    expect(out[0].id).toBe("2");
  });
});
