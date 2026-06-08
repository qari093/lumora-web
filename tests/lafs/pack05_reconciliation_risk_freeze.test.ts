import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  classifyReconciliationRisk,
  createRiskFlag,
  reconcileSources,
  resolveRiskEscalation,
  shouldFreezePayouts,
} from "../../src/core/lafs/reconciliationRisk";

describe("LAFS Pack 05/08 reconciliation + risk freeze", () => {
  it("classifies reconciliation deltas deterministically", () => {
    expect(classifyReconciliationRisk(0, 0)).toBe("LOW");
    expect(classifyReconciliationRisk(50, 0)).toBe("MEDIUM");
    expect(classifyReconciliationRisk(1000, 0)).toBe("HIGH");
    expect(classifyReconciliationRisk(6000, 0)).toBe("CRITICAL");
  });

  it("maps risk levels to freeze states", () => {
    expect(resolveRiskEscalation("LOW").freezeState).toBe("SAFE");
    expect(resolveRiskEscalation("MEDIUM").freezeState).toBe("WATCH");
    expect(resolveRiskEscalation("HIGH").freezeState).toBe("REVIEW");
    expect(resolveRiskEscalation("CRITICAL").freezeState).toBe("FROZEN");
  });

  it("freezes affected sources on high risk reconciliation failure", () => {
    const result = reconcileSources({
      source: "stripe_vs_ledger",
      sourceAMinor: 10_000,
      sourceBMinor: 8_000,
      toleranceMinor: 0,
    });

    expect(result.ok).toBe(false);
    expect(result.riskLevel).toBe("HIGH");
    expect(result.freezeState).toBe("REVIEW");
    expect(shouldFreezePayouts(result)).toBe(true);

    const flag = createRiskFlag({
      result,
      detectedAt: "2026-06-07T00:00:00.000Z",
      owner: "operator_a",
    });

    expect(flag.requiresHumanClearance).toBe(true);
    expect(flag.autoFreeze).toBe(true);
  });

  it("writes reconciliation risk freeze audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/lafs-pack05-reconciliation-risk-freeze.json")).toBe(true);
    expect(fs.existsSync("data/lafs/reconciliation-risk-freeze.json")).toBe(true);
    expect(fs.existsSync("docs/lafs/pack05-reconciliation-risk-freeze.md")).toBe(true);
    expect(fs.existsSync(".lumora_lafs_pack05_reconciliation_risk_freeze_lock")).toBe(true);

    const audit = JSON.parse(fs.readFileSync(".lumora-audits/lafs-pack05-reconciliation-risk-freeze.json", "utf8"));
    expect(audit.status).toBe("PASS");
    expect(audit.manifest.status).toBe("RECONCILIATION_RISK_FREEZE_READY");
    expect(audit.manifest.guards.unfreezeRequiresHumanApproval).toBe(true);
  });
});
