import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Trace Current Shell Readiness", () => {
  it("audit exists", () => {
    expect(
      fs.existsSync("audits/fyp-trace-current/mega_pack_01.json")
    ).toBe(true);
  });

  it("fyp shell exists", () => {
    expect(
      fs.existsSync("app/fyp/FypAutoplayFeed.tsx")
    ).toBe(true);
  });
});
