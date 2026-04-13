import { describe, expect, it } from "vitest";
import { buildConsentStub } from "@/lib/privacy/consent";

describe("GDPR / consent stubs", () => {
  it("creates consent record", () => {
    const out = buildConsentStub({
      userId: "user_1",
      analytics: true,
      ads: false,
      personalization: true,
      updatedAt: 1700000000000,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.consent.userId).toBe("user_1");
      expect(out.consent.analytics).toBe(true);
      expect(out.consent.ads).toBe(false);
      expect(out.consent.personalization).toBe(true);
      expect(out.consent.updatedAt).toBe(1700000000000);
    }
  });

  it("defaults booleans to false", () => {
    const out = buildConsentStub({
      userId: "user_2",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.consent.analytics).toBe(false);
      expect(out.consent.ads).toBe(false);
      expect(out.consent.personalization).toBe(false);
    }
  });

  it("rejects missing user id", () => {
    const out = buildConsentStub({
      userId: " ",
      analytics: true,
    });

    expect(out).toEqual({ ok: false, reason: "missing_user_id" });
  });

  it("uses current time when updatedAt invalid", () => {
    const out = buildConsentStub({
      userId: "user_3",
      updatedAt: 0,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(typeof out.consent.updatedAt).toBe("number");
      expect(out.consent.updatedAt).toBeGreaterThan(0);
    }
  });
});
