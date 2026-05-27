import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  assertPersistenceAllowed,
  buildPersistenceBoundaryReport,
  evaluatePersistenceOperation,
  getPersistenceBoundaryRule,
  PERSISTENCE_BOUNDARY_RULES
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 08 — Persistence Boundary Guard", () => {
  it("defines persistence rules for all runtime domains", () => {
    expect(PERSISTENCE_BOUNDARY_RULES.length).toBeGreaterThanOrEqual(16);
    expect(getPersistenceBoundaryRule("wallet").writeOwner).toBe("WalletOrchestrator");
    expect(getPersistenceBoundaryRule("feed").mode).toBe("aggregate_only");
    expect(getPersistenceBoundaryRule("unknown").mode).toBe("blocked");
  });

  it("allows canonical wallet owner to write", () => {
    const decision = evaluatePersistenceOperation({
      domain: "wallet",
      operation: "write",
      requester: "WalletOrchestrator"
    });

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toBe("persistence_operation_allowed");
  });

  it("blocks non-owner wallet writes", () => {
    const decision = evaluatePersistenceOperation({
      domain: "wallet",
      operation: "write",
      requester: "FeedOrchestrator"
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("write_requires_canonical_owner");
  });

  it("allows aggregate-only domains to aggregate but not write", () => {
    expect(evaluatePersistenceOperation({
      domain: "feed",
      operation: "aggregate",
      requester: "FeedOrchestrator"
    }).allowed).toBe(true);

    expect(evaluatePersistenceOperation({
      domain: "feed",
      operation: "write",
      requester: "FeedOrchestrator"
    }).allowed).toBe(false);
  });

  it("blocks unknown domain persistence", () => {
    const decision = evaluatePersistenceOperation({
      domain: "unknown",
      operation: "read",
      requester: "RuntimeConsolidationOrchestrator"
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("operation_not_allowed_for_domain");
  });

  it("asserts persistence guard failures", () => {
    expect(() => assertPersistenceAllowed({
      domain: "wallet",
      operation: "write",
      requester: "FeedOrchestrator"
    })).toThrow("write_requires_canonical_owner");
  });

  it("builds and writes persistence boundary report", () => {
    const report = buildPersistenceBoundaryReport();

    expect(report.status).toBe("PASS");
    expect(report.writeAuthorizedDomains).toBeGreaterThan(5);
    expect(report.blockedDomains).toBe(1);

    writeFileSync("docs/runtime-consolidation/persistence_boundary_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/runtime-consolidation/persistence_boundary_report.json")).toBe(true);
  });

  it("creates persistence boundary API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/persistence-boundary/route.ts")).toBe(true);
  });
});
