import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("live fyp final seal", () => {
  it("writes final Live + FYP seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/live-fyp-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_live_fyp_validated_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/live-fyp-final-seal.md")).toBe(true);
  });

  it("seals Live + FYP and points to private beta", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/live-fyp-final-seal.json", "utf8"));
    expect(seal.status).toBe("LIVE_FYP_VALIDATED");
    expect(seal.checks.productionMatrix).toBe("PASS");
    expect(seal.checks.legacyAliasSafety).toBe("PASS");
    expect(seal.checks.productionGuards).toBe("PASS");
    expect(seal.nextCanonicalPhase).toBe("Start private beta");
  });
});
