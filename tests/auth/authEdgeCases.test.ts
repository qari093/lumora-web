import { describe, expect, it } from "vitest";
import { validateAuthEdgeCases } from "@/lib/auth/edgeCases";

describe("auth edge-case handling", () => {
  const now = 1_700_000_000_000;

  it("accepts a valid normalized session", () => {
    const out = validateAuthEdgeCases(
      {
        userId: "  user_1 ",
        token: " token_1 ",
        fingerprint: " fp_1 ",
        issuedAt: now - 1000,
        expiresAt: now + 60_000,
      },
      { now }
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.normalized.userId).toBe("user_1");
      expect(out.normalized.token).toBe("token_1");
      expect(out.normalized.fingerprint).toBe("fp_1");
    }
  });

  it("rejects missing session", () => {
    const out = validateAuthEdgeCases(null, { now });
    expect(out).toEqual({ ok: false, reason: "missing_session" });
  });

  it("rejects missing token", () => {
    const out = validateAuthEdgeCases(
      {
        userId: "user_1",
        token: " ",
        fingerprint: "fp",
        issuedAt: now - 1000,
        expiresAt: now + 1000,
      },
      { now }
    );
    expect(out).toEqual({ ok: false, reason: "missing_token" });
  });

  it("rejects future-issued sessions", () => {
    const out = validateAuthEdgeCases(
      {
        userId: "user_1",
        token: "token_1",
        fingerprint: "fp",
        issuedAt: now + 120_000,
        expiresAt: now + 180_000,
      },
      { now }
    );
    expect(out).toEqual({ ok: false, reason: "issued_in_future" });
  });

  it("rejects oversized session windows", () => {
    const out = validateAuthEdgeCases(
      {
        userId: "user_1",
        token: "token_1",
        fingerprint: "fp",
        issuedAt: now - 1000,
        expiresAt: now + 1000 * 60 * 60 * 24 * 60,
      },
      { now }
    );
    expect(out).toEqual({ ok: false, reason: "session_window_too_large" });
  });

  it("allows fingerprint omission only when explicitly disabled", () => {
    const bad = validateAuthEdgeCases(
      {
        userId: "user_1",
        token: "token_1",
        fingerprint: "",
        issuedAt: now - 1000,
        expiresAt: now + 1000,
      },
      { now }
    );
    expect(bad).toEqual({ ok: false, reason: "missing_fingerprint" });

    const ok = validateAuthEdgeCases(
      {
        userId: "user_1",
        token: "token_1",
        fingerprint: "",
        issuedAt: now - 1000,
        expiresAt: now + 1000,
      },
      { now, requireFingerprint: false }
    );
    expect(ok.ok).toBe(true);
  });
});
