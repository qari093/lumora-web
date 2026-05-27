import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP94 real ingestion fix", () => {
  it("has real ingested videos and page points to real path", () => {
    expect(fs.existsSync("public/native-fyp/real/1.mp4")).toBe(true);
    expect(fs.statSync("public/native-fyp/real/1.mp4").size).toBeGreaterThan(50_000);

    const page = fs.readFileSync("app/fyp94/page.tsx", "utf8");
    expect(page).toContain("/native-fyp/real/${n}.mp4");
  });
});
