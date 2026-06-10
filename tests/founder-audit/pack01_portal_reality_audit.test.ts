import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Founder Audit Pack 01/05", () => {
  it("audit artifact exists", () => {
    expect(
      fs.existsSync(
        "data/founder-audit/pack01-portal-reality-audit.json"
      )
    ).toBe(true);
  });

  it("all required portal files exist", () => {
    const data = JSON.parse(
      fs.readFileSync(
        "data/founder-audit/pack01-portal-reality-audit.json",
        "utf8"
      )
    );

    expect(data.status).toBe("PASS");
    expect(data.summary.total).toBe(10);
    expect(data.summary.existing).toBe(10);
  });
});
