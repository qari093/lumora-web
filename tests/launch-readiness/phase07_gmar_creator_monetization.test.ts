import { describe, expect, it } from "vitest";
import { existsSync, writeFileSync } from "node:fs";
import {
  GCM_CAPABILITIES,
  buildGmarCreatorMonetizationReport,
  evaluateGcmCapability,
  evaluateGcmCapabilities,
  statusForCapability,
  statusForSystem
} from "@/src/core/launch-readiness";

describe("Launch Readiness Phase 07 — GMAR + Creator + Monetization Validation", () => {
  it("defines GMAR, creator, and monetization capabilities", () => {
    expect(GCM_CAPABILITIES.some((capability) => capability.system === "gmar")).toBe(true);
    expect(GCM_CAPABILITIES.some((capability) => capability.system === "creator")).toBe(true);
    expect(GCM_CAPABILITIES.some((capability) => capability.system === "monetization")).toBe(true);
  });

  it("passes ready critical GMAR state capability", () => {
    const capability = GCM_CAPABILITIES.find((item) => item.capability === "persistent_game_state")!;
    const finding = evaluateGcmCapability(capability);

    expect(statusForCapability(capability)).toBe("PASS");
    expect(finding.status).toBe("PASS");
  });

  it("warns medium incomplete GMAR realtime presence", () => {
    const capability = GCM_CAPABILITIES.find((item) => item.capability === "realtime_presence")!;
    const finding = evaluateGcmCapability(capability);

    expect(finding.status).toBe("WARNING");
    expect(finding.requiredFix).toContain("activation gates");
  });

  it("fails critical incomplete monetization capabilities", () => {
    const paymentSafety = GCM_CAPABILITIES.find((item) => item.capability === "payment_safety")!;
    const payoutSafety = GCM_CAPABILITIES.find((item) => item.capability === "payout_safety")!;

    expect(evaluateGcmCapability(paymentSafety).status).toBe("FAILED");
    expect(evaluateGcmCapability(payoutSafety).status).toBe("FAILED");
  });

  it("calculates system statuses", () => {
    const findings = evaluateGcmCapabilities();

    expect(statusForSystem(findings, "creator")).toBe("PASS");
    expect(statusForSystem(findings, "gmar")).toBe("WARNING");
    expect(statusForSystem(findings, "monetization")).toBe("FAILED");
  });

  it("builds GMAR creator monetization report", () => {
    const report = buildGmarCreatorMonetizationReport();

    expect(report.totalCapabilities).toBeGreaterThanOrEqual(12);
    expect(report.creatorStatus).toBe("PASS");
    expect(report.gmarStatus).toBe("WARNING");
    expect(report.monetizationStatus).toBe("FAILED");
    expect(report.failedFindings).toBeGreaterThanOrEqual(2);
  });

  it("writes GMAR creator monetization report", () => {
    const report = buildGmarCreatorMonetizationReport();

    writeFileSync(
      "docs/launch-readiness/phase07_gmar_creator_monetization_report.json",
      JSON.stringify(report, null, 2) + "\n"
    );

    expect(existsSync("docs/launch-readiness/phase07_gmar_creator_monetization_report.json")).toBe(true);
  });

  it("creates GMAR creator monetization API endpoint", () => {
    expect(existsSync("app/api/launch-readiness/gmar-creator-monetization/route.ts")).toBe(true);
  });
});
