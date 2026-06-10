import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Founder Audit Pack 04/05", () => {
  it("artifact exists", () => {
    expect(
      fs.existsSync(
        "data/founder-audit/pack04-rendered-experience-audit.json"
      )
    ).toBe(true);
  });
});
