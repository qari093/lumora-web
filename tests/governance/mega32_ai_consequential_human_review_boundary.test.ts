import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  assertConsequentialAutomationBoundary,
  CONSEQUENTIAL_AUTOMATION_BOUNDARY_VERSION,
  evaluateConsequentialAutomationBoundary,
} from "@/src/core/governance/consequentialAutomationBoundary";

const root = process.cwd();

function read(relative: string): string {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

describe("Mega Step 32 — AI consequential human-review boundary", () => {
  it("publishes the Mega32 runtime boundary version", () => {
    expect(CONSEQUENTIAL_AUTOMATION_BOUNDARY_VERSION).toBe("mega32-v1");
  });

  it("does not authorize final consequential action from advisory automation", () => {
    const result = evaluateConsequentialAutomationBoundary({
      decisionClass: "advisory",
      producedByAutomation: true,
    });

    expect(result.finalConsequentialActionAuthorized).toBe(false);
    expect(result.automatedDecisionRemainsNonFinal).toBe(true);
  });

  it("treats automated safety blocking as a temporary non-final gate", () => {
    const result = evaluateConsequentialAutomationBoundary({
      decisionClass: "temporary_safety_gate",
      producedByAutomation: true,
    });

    expect(result.finalConsequentialActionAuthorized).toBe(false);
    expect(result.humanReviewRequired).toBe(true);
    expect(result.remedyMustRemainAvailable).toBe(true);
  });

  it("rejects autonomous irreversible consequential action", () => {
    const result = evaluateConsequentialAutomationBoundary({
      decisionClass: "consequential",
      producedByAutomation: true,
      humanReviewed: false,
      irreversible: true,
    });

    expect(result.finalConsequentialActionAuthorized).toBe(false);
    expect(result.humanReviewRequired).toBe(true);
  });

  it("does not let automation mutate governance authority", () => {
    const result = evaluateConsequentialAutomationBoundary({
      decisionClass: "consequential",
      producedByAutomation: true,
      altersGovernanceAuthority: true,
    });

    expect(result.governanceAuthorityMutationAllowed).toBe(false);
  });

  it("does not allow secret automated reputation mutation", () => {
    const result = evaluateConsequentialAutomationBoundary({
      decisionClass: "consequential",
      producedByAutomation: true,
      altersReputation: true,
    });

    expect(result.secretReputationMutationAllowed).toBe(false);
  });

  it("recognizes explicit human review for consequential decisions", () => {
    const result = evaluateConsequentialAutomationBoundary({
      decisionClass: "consequential",
      producedByAutomation: true,
      humanReviewed: true,
    });

    expect(result.humanReviewSatisfied).toBe(true);
    expect(result.finalConsequentialActionAuthorized).toBe(true);
  });

  it("keeps trust scoring explicitly advisory and outside governance authority", () => {
    for (const file of [
      "app/api/trust/route.ts",
      "app/api/trust/gate/route.ts",
      "app/api/trust/creator-thresholds/route.ts",
    ]) {
      const source = read(file);
      expect(source).toContain('decisionClass: "advisory"');
      expect(source).toContain("governanceAuthorityGranted: false");
      expect(source).toContain("evaluateConsequentialAutomationBoundary");
    }
  });

  it("marks automated moderation denial as a non-final temporary safety gate", () => {
    for (const file of [
      "app/api/moderation/check/route.ts",
      "app/api/moderation/risk-mode/route.ts",
    ]) {
      const source = read(file);
      expect(source).toContain('"temporary_safety_gate"');
      expect(source).toContain("humanReviewRequired: !result.allowed");
      expect(source).toContain("automatedDecisionRemainsNonFinal: true");
      expect(source).toContain("governanceAuthorityMutationAllowed: false");
    }
  });

  it("preserves the constitutional human-review and remedy requirements", () => {
    const constitution = read("src/core/governance/constitution.ts");

    expect(constitution).toContain(
      "consequentialAutomationRequiresHumanReviewPath: true",
    );
    expect(constitution).toContain(
      "consequentialAIDecisionsRequireHumanReviewPath: true",
    );
    expect(constitution).toContain(
      "remedyMustRemainAvailableForConsequentialDecisions: true",
    );
  });

  it("preserves the existing durable moderation appeal path", () => {
    const route = read("app/api/moderation/appeal/route.ts");
    const service = read("src/core/moderation-production/appeal.ts");

    expect(route).toContain("requireUserSession");
    expect(service).toContain("prisma.moderationAppeal.create");
    expect(service).toContain("reviewModerationAppeal");
  });

  it("passes the built-in fail-closed assertion", () => {
    expect(assertConsequentialAutomationBoundary()).toBe(true);
  });
});
