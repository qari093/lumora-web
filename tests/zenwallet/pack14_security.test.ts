import { describe, expect, it } from "vitest";
import { createZenLockState, evaluateSpendRisk, verifyWebhookSignature } from "@/src/core/zenwallet/security/security";

describe("ZenWallet Pack 14 — Security", () => {
  it("scores risky spending", () => {
    expect(evaluateSpendRisk({ amount: 200, newDevice: true, failedAttempts: 1 }).requiresWebAuthn).toBe(true);
  });

  it("creates ZenLock state", () => {
    expect(createZenLockState(true).enabled).toBe(true);
  });

  it("verifies webhook signatures", () => {
    expect(verifyWebhookSignature("abc", "abc")).toBe(true);
    expect(verifyWebhookSignature("abc", "bad")).toBe(false);
  });
});
