import { describe, expect, it } from "vitest";
import { validateSession } from "../../lib/auth/sessionHardening";

describe("identity & session hardening", () => {
  const now = Date.now();

  it("accepts a valid session", () => {
    const result = validateSession({
      userId: "u1",
      sessionId: "session_12345",
      issuedAt: now - 1000,
      expiresAt: now + 60_000,
      ipHash: "ip1",
      userAgentHash: "ua1"
    });

    expect(result).toEqual({ ok: true, reason: "valid" });
  });

  it("rejects expired sessions", () => {
    const result = validateSession({
      userId: "u1",
      sessionId: "session_12345",
      issuedAt: now - 60_000,
      expiresAt: now - 1000
    });

    expect(result).toEqual({ ok: false, reason: "expired" });
  });

  it("rejects invalid timestamps", () => {
    const result = validateSession({
      userId: "u1",
      sessionId: "session_12345",
      issuedAt: now,
      expiresAt: now
    });

    expect(result).toEqual({ ok: false, reason: "invalid_timestamps" });
  });

  it("rejects fingerprint mismatches when enforced", () => {
    const result = validateSession(
      {
        userId: "u1",
        sessionId: "session_12345",
        issuedAt: now - 1000,
        expiresAt: now + 60_000,
        ipHash: "ip1",
        userAgentHash: "ua1"
      },
      {
        ipHash: "ip2",
        userAgentHash: "ua1",
        enforceFingerprint: true
      }
    );

    expect(result).toEqual({ ok: false, reason: "fingerprint_mismatch" });
  });
});
