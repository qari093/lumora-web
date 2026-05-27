import { describe, expect, it } from "vitest";
import {
  createRollbackSnapshot,
  getZendoroObservabilitySignals,
  validateZendoroObservabilityRollbackRuntime
} from "@/core/zendoro/ops/observabilityRollbackRuntime";

describe("Zendoro Pack 9/10 — Observability + Rollback Systems", () => {
  it("validates observability and rollback runtime", () => {
    const r = validateZendoroObservabilityRollbackRuntime();

    expect(r.ok).toBe(true);
    expect(r.checkoutLogs).toBe(true);
    expect(r.webhookLogs).toBe(true);
    expect(r.paymentFailureAlerts).toBe(true);
    expect(r.orderReconciliation).toBe(true);
    expect(r.sellerIssueAlerts).toBe(true);
    expect(r.runtimeHealthDashboard).toBe(true);
    expect(r.rollbackSnapshots).toBe(true);
    expect(r.auditEventStream).toBe(true);
    expect(r.rollbackCoverage).toBe(true);
    expect(r.seal).toBe("ZENDORO_OBSERVABILITY_ROLLBACK_READY");
  });

  it("tracks required operational signal coverage", () => {
    const signals = getZendoroObservabilitySignals();

    expect(signals.length).toBe(8);
    expect(signals).toContain("checkout_logs");
    expect(signals).toContain("webhook_logs");
    expect(signals).toContain("order_reconciliation");
    expect(signals).toContain("rollback_snapshots");
  });

  it("creates reversible rollback snapshots", () => {
    const snapshot = createRollbackSnapshot("payment");

    expect(snapshot.id).toBe("zendoro-rollback-payment");
    expect(snapshot.scope).toBe("payment");
    expect(snapshot.reversible).toBe(true);
    expect(snapshot.checksum).toContain("sha256:");
  });
});
