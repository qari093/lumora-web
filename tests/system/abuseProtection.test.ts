import { describe, expect, it } from "vitest";
import { assessAbuseRisk } from "@/lib/system/abuseProtection";

describe("abuse & bot protection layer", () => {
  it("allows normal traffic", () => {
    const out = assessAbuseRisk({
      ipHash: "abc123xyz",
      userAgent: "Mozilla/5.0",
      requestCount: 10,
      failedAuthCount: 0,
      velocityScore: 0.2,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.assessment.blocked).toBe(false);
      expect(out.assessment.riskScore).toBe(0);
    }
  });

  it("flags suspicious user agent", () => {
    const out = assessAbuseRisk({
      ipHash: "abc123xyz",
      userAgent: "curl/8.0",
      requestCount: 10,
      failedAuthCount: 0,
      velocityScore: 0.2,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.assessment.flags).toContain("suspicious_user_agent");
      expect(out.assessment.riskScore).toBeGreaterThan(0);
    }
  });

  it("blocks high-risk traffic", () => {
    const out = assessAbuseRisk({
      ipHash: "abc123xyz",
      userAgent: "bot-agent",
      requestCount: 500,
      failedAuthCount: 50,
      velocityScore: 0.95,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.assessment.blocked).toBe(true);
      expect(out.assessment.riskScore).toBeGreaterThanOrEqual(60);
    }
  });

  it("rejects missing ip hash", () => {
    const out = assessAbuseRisk({
      ipHash: "",
      userAgent: "Mozilla/5.0",
      requestCount: 10,
      failedAuthCount: 0,
      velocityScore: 0.2,
    });

    expect(out).toEqual({ ok: false, reason: "missing_ip_hash" });
  });
});
