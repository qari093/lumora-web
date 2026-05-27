import { describe, expect, it } from "vitest";
import {
  createGmarProductionSeal,
  resolveIncidentSeverity,
  resolveReleaseChannel,
  validateGmarStoreDeploymentOperations,
  validateStoreSubmission
} from "../../../src/core/gmar/production/deployment-ops/storeDeploymentOps";

describe("GMAR Production Phase 7 — Store & Deployment Operations", () => {
  it("validates store deployment operations contract", () => {
    expect(validateGmarStoreDeploymentOperations()).toBe(true);
  });

  it("resolves release channel", () => {
    expect(resolveReleaseChannel({ regressionPassed: false, betaUsers: 5000, incidents: 0 })).toBe("internal");
    expect(resolveReleaseChannel({ regressionPassed: true, betaUsers: 50, incidents: 0 })).toBe("closed_beta");
    expect(resolveReleaseChannel({ regressionPassed: true, betaUsers: 500, incidents: 0 })).toBe("open_beta");
    expect(resolveReleaseChannel({ regressionPassed: true, betaUsers: 2000, incidents: 0 })).toBe("production");
  });

  it("resolves incident severity", () => {
    expect(resolveIncidentSeverity({ affectedUsers: 10, safetyRisk: false, paymentRisk: false })).toBe("low");
    expect(resolveIncidentSeverity({ affectedUsers: 200, safetyRisk: false, paymentRisk: false })).toBe("medium");
    expect(resolveIncidentSeverity({ affectedUsers: 2000, safetyRisk: false, paymentRisk: false })).toBe("high");
    expect(resolveIncidentSeverity({ affectedUsers: 1, safetyRisk: true, paymentRisk: false })).toBe("critical");
  });

  it("validates store submission", () => {
    expect(validateStoreSubmission({
      signedBuild: true,
      privacyReady: true,
      ageRatingReady: true,
      screenshotsReady: true,
      rollbackReady: true
    }).ok).toBe(true);

    expect(validateStoreSubmission({
      signedBuild: true,
      privacyReady: false,
      ageRatingReady: true,
      screenshotsReady: true,
      rollbackReady: true
    }).deploySafe).toBe(false);
  });

  it("creates final production seal", () => {
    const seal = createGmarProductionSeal();

    expect(seal.status).toBe("PASS");
    expect(seal.complete).toBe(true);
    expect(seal.productionReady).toBe(true);
    expect(seal.auditRequired).toBe(true);
  });
});
