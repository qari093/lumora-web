import { describe, expect, it } from "vitest";
import { buildSecurityHeaders } from "@/lib/system/securityHeaders";

describe("security hardening (headers, surfaces)", () => {
  it("builds secure default headers", () => {
    const out = buildSecurityHeaders({});

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.headers["X-Frame-Options"]).toBe("DENY");
      expect(out.headers["X-Content-Type-Options"]).toBe("nosniff");
      expect(out.headers["Content-Security-Policy"]).toContain("default-src");
    }
  });

  it("accepts SAMEORIGIN when explicitly set", () => {
    const out = buildSecurityHeaders({
      xFrameOptions: "SAMEORIGIN",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.headers["X-Frame-Options"]).toBe("SAMEORIGIN");
    }
  });

  it("rejects invalid frame option", () => {
    const out = buildSecurityHeaders({
      xFrameOptions: "ALLOWALL",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_x_frame_options" });
  });

  it("rejects invalid x-content-type-options", () => {
    const out = buildSecurityHeaders({
      xContentTypeOptions: "invalid",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_x_content_type_options" });
  });

  it("rejects invalid csp", () => {
    const out = buildSecurityHeaders({
      csp: "script-src 'self'",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_csp" });
  });
});
