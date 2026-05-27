import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("routing fix", () => {
  it("separates homepage and fyp route", () => {
    expect(fs.existsSync("app/fyp/page.tsx")).toBe(true);
    expect(fs.readFileSync("app/page.tsx","utf8")).toContain("Creator Dashboard");
  });
});
