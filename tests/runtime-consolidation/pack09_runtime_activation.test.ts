import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  assertActivationAllowed,
  buildRuntimeActivationReport,
  canActivateMonetization,
  canActivatePublic,
  evaluateRuntimeActivation,
  getRuntimeActivationRule,
  RUNTIME_ACTIVATION_RULES
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 09 — Runtime Activation Hierarchy", () => {
  it("defines activation levels for all runtime domains", () => {
    expect(RUNTIME_ACTIVATION_RULES.length).toBeGreaterThanOrEqual(16);
    expect(getRuntimeActivationRule("creator_alchemy").level).toBe(3);
    expect(getRuntimeActivationRule("commerce").level).toBe(1);
    expect(getRuntimeActivationRule("unknown").level).toBe(0);
  });

  it("allows requests at or below current activation level", () => {
    const decision = evaluateRuntimeActivation({
      domain: "creator_alchemy",
      requestedLevel: 3
    });

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("activation_level_allowed");
  });

  it("blocks requests above current activation level", () => {
    const decision = evaluateRuntimeActivation({
      domain: "wallet",
      requestedLevel: 5
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain("activation_blocked_until_");
  });

  it("blocks public and monetized activation by default", () => {
    expect(canActivatePublic("creator_alchemy")).toBe(false);
    expect(canActivateMonetization("wallet")).toBe(false);
  });

  it("asserts blocked activation", () => {
    expect(() =>
      assertActivationAllowed({
        domain: "commerce",
        requestedLevel: 4
      })
    ).toThrow("activation_blocked_until_mock_demo");
  });

  it("builds and writes runtime activation report", () => {
    const report = buildRuntimeActivationReport();

    expect(report.status).toBe("PASS");
    expect(report.privateBeta).toBeGreaterThan(0);
    expect(report.monetized).toBe(0);

    writeFileSync("docs/runtime-consolidation/runtime_activation_hierarchy_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/runtime-consolidation/runtime_activation_hierarchy_report.json")).toBe(true);
  });

  it("creates runtime activation API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/activation/route.ts")).toBe(true);
  });
});
