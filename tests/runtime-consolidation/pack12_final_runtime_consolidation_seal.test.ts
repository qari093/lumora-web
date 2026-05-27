import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  buildRuntimeConsolidationSealReport,
  collectRuntimeSealInput,
  RUNTIME_CONSOLIDATION_REQUIRED_LOCKS,
  RUNTIME_CONSOLIDATION_REQUIRED_REPORTS,
  writeRuntimeConsolidationSealReport
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 12 — Final Runtime Consolidation Seal", () => {
  it("defines required locks and reports", () => {
    expect(RUNTIME_CONSOLIDATION_REQUIRED_LOCKS).toHaveLength(11);
    expect(RUNTIME_CONSOLIDATION_REQUIRED_REPORTS).toHaveLength(11);
  });

  it("collects current seal input", () => {
    const input = collectRuntimeSealInput();

    expect(input.requiredLocks.length).toBe(11);
    expect(input.existingLocks.length).toBeGreaterThanOrEqual(11);
    expect(input.reports.length).toBeGreaterThanOrEqual(11);
  });

  it("passes final seal when all packs are present", () => {
    const report = buildRuntimeConsolidationSealReport();

    expect(report.status).toBe("PASS");
    expect(report.presentLocks).toBe(11);
    expect(report.missingLocks).toHaveLength(0);
    expect(Object.values(report.features).every(Boolean)).toBe(true);
  });

  it("fails final seal when a lock is missing", () => {
    const report = buildRuntimeConsolidationSealReport({
      requiredLocks: ["missing.lock"],
      existingLocks: [],
      reports: RUNTIME_CONSOLIDATION_REQUIRED_REPORTS
    });

    expect(report.status).toBe("FAILED");
    expect(report.missingLocks).toEqual(["missing.lock"]);
  });

  it("writes final runtime consolidation seal report", () => {
    const report = writeRuntimeConsolidationSealReport("docs/runtime-consolidation/final_runtime_consolidation_seal.json");

    expect(report.status).toBe("PASS");
    expect(existsSync("docs/runtime-consolidation/final_runtime_consolidation_seal.json")).toBe(true);
  });

  it("creates final seal API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/final-seal/route.ts")).toBe(true);
  });

  it("writes pack 12 local report mirror", () => {
    const report = buildRuntimeConsolidationSealReport();
    writeFileSync("docs/runtime-consolidation/runtime_consolidation_pack12_summary.json", JSON.stringify(report, null, 2) + "\n");

    expect(existsSync("docs/runtime-consolidation/runtime_consolidation_pack12_summary.json")).toBe(true);
  });
});
