import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 real demo clips fix", () => {
  it("has 20 playable demo mp4 files", () => {
    for (let i = 1; i <= 20; i++) {
      const file = `public/native-fyp/fallback/${i}.mp4`;
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeGreaterThan(10_000);
    }
  });
});
