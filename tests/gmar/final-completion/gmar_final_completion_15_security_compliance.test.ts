import {
  createGmarComplianceStatus,
  assertGmarComplianceStatus
} from "@/src/core/gmar/final-completion/compliance/securityCompliance";

describe("GMAR Final Completion Phase 15 — Security + Compliance", () => {
  it("creates complete security compliance status", () => {
    const status = createGmarComplianceStatus();

    expect(status.apiSecurityAuditReady).toBe(true);
    expect(status.authSecurityAuditReady).toBe(true);
    expect(status.walletSecurityAuditReady).toBe(true);
    expect(status.creatorSafetyAuditReady).toBe(true);
    expect(status.dataPrivacyReviewReady).toBe(true);
    expect(status.loggingPrivacyReviewReady).toBe(true);
    expect(status.rateLimitReviewReady).toBe(true);
    expect(status.dependencyAuditReady).toBe(true);
    expect(status.secretLeakScanReady).toBe(true);
    expect(status.permissionAuditReady).toBe(true);
    expect(status.abusePolicyReady).toBe(true);
    expect(status.termsPrivacyLinksReady).toBe(true);
    expect(status.complianceSmokeReady).toBe(true);
    expect(status.securitySealReady).toBe(true);
    expect(assertGmarComplianceStatus(status)).toBe(true);
  });
});
