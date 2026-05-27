import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  assertKnownDomainOwner,
  buildDomainOwnershipReport,
  getDeprecatedCanonicalTarget,
  getDomainOwner,
  isCanonicalRoute,
  RUNTIME_DOMAIN_OWNERS
} from "@/src/core/runtime-consolidation";

describe("Runtime Consolidation Pack 02 — Domain Ownership + Canonical Route Map", () => {
  it("defines canonical owners for all runtime domains", () => {
    expect(RUNTIME_DOMAIN_OWNERS.length).toBeGreaterThanOrEqual(16);
    expect(assertKnownDomainOwner("creator_alchemy")).toBe(true);
    expect(assertKnownDomainOwner("fyp")).toBe(true);
    expect(assertKnownDomainOwner("live")).toBe(true);
    expect(assertKnownDomainOwner("wallet")).toBe(true);
  });

  it("resolves domain owners", () => {
    expect(getDomainOwner("creator_alchemy").owner).toBe("Creator Alchemy Orchestrator");
    expect(getDomainOwner("fyp").canonicalPrefix).toBe("/api/fyp");
    expect(getDomainOwner("trust_safety").owner).toBe("Trust Safety Orchestrator");
  });

  it("detects canonical routes", () => {
    expect(isCanonicalRoute("/api/creator-alchemy/dashboard")).toBe(true);
    expect(isCanonicalRoute("/api/fyp/feed")).toBe(true);
    expect(isCanonicalRoute("/api/live/rooms")).toBe(true);
  });

  it("maps deprecated aliases to canonical prefixes", () => {
    expect(getDeprecatedCanonicalTarget("/api/coin/balance")).toBe("/api/wallet");
    expect(getDeprecatedCanonicalTarget("/api/live/roomlist")).toBe("/api/live");
    expect(getDeprecatedCanonicalTarget("/api/unknown/thing")).toBeNull();
  });

  it("builds and writes domain ownership report", () => {
    const report = buildDomainOwnershipReport();
    expect(report.domainCount).toBeGreaterThanOrEqual(16);
    expect(report.canonicalRouteCount).toBeGreaterThan(10);
    expect(report.coverage.creator_alchemy.owner).toBe("Creator Alchemy Orchestrator");

    writeFileSync("docs/runtime-consolidation/domain_ownership_report.json", JSON.stringify(report, null, 2) + "\n");
    expect(existsSync("docs/runtime-consolidation/domain_ownership_report.json")).toBe(true);
  });

  it("creates domain ownership API endpoint", () => {
    expect(existsSync("app/api/runtime-consolidation/domain-ownership/route.ts")).toBe(true);
  });
});
