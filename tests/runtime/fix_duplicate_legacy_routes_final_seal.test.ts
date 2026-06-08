import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("fix duplicate legacy routes final seal", () => {
  it("writes final duplicate-route seal artifacts", () => {
    expect(fs.existsSync(".lumora-audits/fix-duplicate-legacy-routes-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_fix_duplicate_legacy_routes_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/fix-duplicate-legacy-routes-final-seal.md")).toBe(true);
  });

  it("records main user journey as next phase", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/fix-duplicate-legacy-routes-final-seal.json", "utf8"));
    expect(seal.status).toBe("FIX_DUPLICATE_LEGACY_ROUTES_PHASE_SEALED");
    expect(seal.nextCanonicalPhase).toBe("Validate main user journey");
    expect(seal.currentRiskCount).toBeLessThanOrEqual(2);
  });
});
