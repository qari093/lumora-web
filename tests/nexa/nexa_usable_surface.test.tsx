import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("NEXA usable surface (locked)", () => {
  it("has /nexa/checkin route page", () => {
    expect(fs.existsSync("app/nexa/checkin/page.tsx")).toBe(true);
  });

  it("NEXA portal page links to /nexa/checkin", () => {
    const s = fs.readFileSync("app/nexa/page.tsx", "utf8");
    expect(s.includes('href="/nexa/checkin"')).toBe(true);
  });

  it("QuickCheckIn exists and contains alive marker", () => {
    const s = fs.readFileSync("components/nexa/QuickCheckIn.tsx", "utf8");
    expect(s.includes("LUMORA_NEXA_USABLE_SURFACE")).toBe(true);
  });
});
