import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("runtime consolidation phase 1 seal", () => {
  it("writes final seal and lock markers", () => {
    expect(fs.existsSync(".lumora-audits/runtime-consolidation-final-seal.json")).toBe(true);
    expect(fs.existsSync(".lumora_runtime_consolidation_phase1_lock")).toBe(true);
    expect(fs.existsSync("docs/runtime/runtime-consolidation-phase1-seal.md")).toBe(true);
  });

  it("records the next canonical phase", () => {
    const seal = JSON.parse(fs.readFileSync(".lumora-audits/runtime-consolidation-final-seal.json", "utf8"));
    expect(seal.status).toBe("RUNTIME_CONSOLIDATION_PHASE_1_SEALED");
    expect(seal.nextCanonicalPhase).toBe("Fix duplicate/legacy routes");
  });
});
