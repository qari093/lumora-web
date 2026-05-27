import { describe, expect, it } from "vitest";
import { observabilityRuntime, observabilityHealthy } from "@/core/zencoin/observability/observabilityRuntime";

describe("Zencoin Pack 22 — Observability", () => {
  it("supports ledger monitoring", () => {
    expect(observabilityRuntime.ledgerMonitoring).toBe(true);
  });

  it("supports fraud and reconciliation alerts", () => {
    expect(observabilityRuntime.fraudAlerts).toBe(true);
    expect(observabilityRuntime.reconciliationAlerts).toBe(true);
  });

  it("supports observability health", () => {
    expect(observabilityHealthy()).toBe(true);
  });
});
