import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  assertRouteUsesOrchestrator,
  buildCanonicalOrchestratorReport,
  CANONICAL_ORCHESTRATORS,
  getCanonicalOrchestrator,
  routeThroughCanonicalOrchestrator
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 04 — Canonical Orchestrator Layer", () => {
  it("defines canonical orchestrators for all main domains", () => {
    expect(CANONICAL_ORCHESTRATORS.length).toBeGreaterThanOrEqual(16);
    expect(getCanonicalOrchestrator("creator_alchemy").name).toBe("CreatorAlchemyOrchestrator");
    expect(getCanonicalOrchestrator("fyp").name).toBe("FypOrchestrator");
    expect(getCanonicalOrchestrator("live").name).toBe("LiveOrchestrator");
    expect(getCanonicalOrchestrator("wallet").name).toBe("WalletOrchestrator");
  });

  it("routes canonical paths through orchestrators", () => {
    const decision = routeThroughCanonicalOrchestrator("/api/creator-alchemy/dashboard");

    expect(decision.ok).toBe(true);
    expect(decision.allowed).toBe(true);
    expect(decision.orchestrator).toBe("CreatorAlchemyOrchestrator");
  });

  it("marks deprecated aliases but still allows adapter routing", () => {
    const decision = routeThroughCanonicalOrchestrator("/api/coin/balance");

    expect(decision.allowed).toBe(true);
    expect(decision.reason).toContain("deprecated_alias_use_canonical:/api/wallet");
  });

  it("blocks unknown-domain routes until classification", () => {
    const decision = routeThroughCanonicalOrchestrator("/api/random-unowned-route");

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("unknown_domain_requires_classification");
  });

  it("asserts known routes use orchestrators", () => {
    expect(assertRouteUsesOrchestrator("/api/fyp/feed")).toBe(true);
    expect(assertRouteUsesOrchestrator("/api/live/rooms")).toBe(true);
    expect(assertRouteUsesOrchestrator("/api/random-unowned-route")).toBe(false);
  });

  it("builds and writes canonical orchestrator report", () => {
    const report = buildCanonicalOrchestratorReport();

    expect(report.orchestratorCount).toBeGreaterThanOrEqual(16);
    expect(report.activeCount).toBeGreaterThan(10);
    expect(report.writeOwners).toBeGreaterThan(5);

    writeFileSync("docs/runtime-consolidation/canonical_orchestrator_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/runtime-consolidation/canonical_orchestrator_report.json")).toBe(true);
  });

  it("creates orchestrator API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/orchestrators/route.ts")).toBe(true);
  });
});
