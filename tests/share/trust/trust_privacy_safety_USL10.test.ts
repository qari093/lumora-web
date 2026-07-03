import { describe, expect, it } from "vitest";
import {
  calculateRelationshipTrustScore,
  canActorView,
  createModerationHook,
  createPrivacyPolicy,
  createPrivacyPreservingAnalytics,
  createSafetySignal,
  createTrustAuditEntry,
  createTrustPolicy,
  detectUnsafeShareText,
  evaluateTrustSafety,
  hasBlockingSignal,
  isShareExpired,
  revokePrivacyPolicy,
  summarizeTrustAudit,
} from "@/src/core/share";

describe("USL Mega Pack 10 — Trust Privacy Safety Ω", () => {
  it("enforces privacy visibility, expiration, and revocation", () => {
    const policy = createPrivacyPolicy({
      ownerId: "waqar",
      audience: "friends",
      allowedActorIds: ["ayesha"],
      expiresAt: "2999-01-01T00:00:00.000Z",
    });

    const revoked = revokePrivacyPolicy(policy);

    expect(canActorView(policy, "waqar")).toBe(true);
    expect(canActorView(policy, "ayesha")).toBe(true);
    expect(canActorView(policy, "stranger")).toBe(false);
    expect(isShareExpired(policy)).toBe(false);
    expect(canActorView(revoked, "ayesha")).toBe(false);
  });

  it("detects unsafe share signals and blocking conditions", () => {
    const signals = detectUnsafeShareText("urgent transfer free money password malware");
    const manual = createSafetySignal("blocked_actor", 1, "Blocked actor.");

    expect(signals.some((signal) => signal.kind === "scam")).toBe(true);
    expect(signals.some((signal) => signal.kind === "malware_risk")).toBe(true);
    expect(hasBlockingSignal([...signals, manual])).toBe(true);
  });

  it("evaluates trust, consent, blocked actors, and external restrictions", () => {
    const policy = createTrustPolicy({
      actorId: "waqar",
      minTrustScore: 0.5,
      allowExternal: false,
      requireConsent: true,
      blockedActorIds: ["bad_actor"],
    });

    const allowed = evaluateTrustSafety({
      policy,
      actorId: "waqar",
      recipientId: "ayesha",
      baseTrust: 0.8,
      priorShares: 5,
      successfulDeliveries: 5,
      consentGranted: true,
      external: false,
    });

    const blocked = evaluateTrustSafety({
      policy,
      actorId: "bad_actor",
      baseTrust: 0.9,
      priorShares: 10,
      successfulDeliveries: 10,
      consentGranted: true,
      external: false,
    });

    const review = evaluateTrustSafety({
      policy,
      actorId: "waqar",
      baseTrust: 0.3,
      priorShares: 0,
      successfulDeliveries: 0,
      consentGranted: false,
      external: true,
    });

    expect(allowed.decision).toBe("allow");
    expect(blocked.decision).toBe("block");
    expect(review.decision).toBe("review");
    expect(calculateRelationshipTrustScore({ baseTrust: 0.8, priorShares: 2, successfulDeliveries: 2, safetySignals: [] })).toBeGreaterThan(0.8);
  });

  it("creates moderation hooks, audit logs, and privacy-preserving analytics", () => {
    const signal = createSafetySignal("scam", 0.8, "Scam phrase.");
    const hook = createModerationHook({
      objectId: "share_1",
      signals: [signal],
      decision: "review",
    });
    const audit = createTrustAuditEntry({
      actorId: "waqar",
      objectId: "share_1",
      decision: "review",
      reason: "Needs safety review.",
    });
    const summary = summarizeTrustAudit([audit]);
    const analytics = createPrivacyPreservingAnalytics([audit]);

    expect(hook.queue).toBe("trust_safety_review");
    expect(summary.review).toBe(1);
    expect(analytics.actorIdsIncluded).toBe(false);
    expect(analytics.objectIdsIncluded).toBe(false);
  });
});
