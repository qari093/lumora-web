import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 real clip rotation fix", () => {
  it("uses 20 real local mp4 paths and category rotation", () => {
    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");

    expect(page.includes("Array.from({ length: 20 })") || page.includes("Array.from({ length: Number(20) })")).toBe(true);
    expect(page).toContain("/native-fyp/real/${n}.mp4");
    expect(page).toContain("CATEGORIES[index % CATEGORIES.length]");

    for (let i = 1; i <= 20; i++) {
      expect(fs.existsSync(`public/native-fyp/real/${i}.mp4`)).toBe(true);
      expect(fs.statSync(`public/native-fyp/real/${i}.mp4`).size).toBeGreaterThan(50_000);
    }
  });
});
