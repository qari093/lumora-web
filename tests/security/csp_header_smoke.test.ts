import { describe, expect, it } from "vitest";
import {
  applyLumoraSecurityHeaders,
  LUMORA_CONTENT_SECURITY_POLICY,
} from "../../middleware";

describe("security headers CSP contract", () => {
  it("defines the Lumora CSP", () => {
    expect(LUMORA_CONTENT_SECURITY_POLICY.length).toBeGreaterThan(0);
    expect(LUMORA_CONTENT_SECURITY_POLICY).toContain("default-src");
    expect(LUMORA_CONTENT_SECURITY_POLICY).toContain("frame-ancestors");
  });

  it("applies CSP through the canonical helper", () => {
    const headers = new Headers();

    applyLumoraSecurityHeaders(headers);

    expect(headers.get("content-security-policy")).toBe(
      LUMORA_CONTENT_SECURITY_POLICY
    );
  });
});
