import { describe, expect, it } from "vitest";
import {
  applyLumoraSecurityHeaders,
  LUMORA_CONTENT_SECURITY_POLICY,
} from "../../middleware";

describe("security headers contract", () => {
  it("applies the canonical security headers", () => {
    const headers = new Headers();

    applyLumoraSecurityHeaders(headers);

    expect(headers.get("x-content-type-options")).toBe("nosniff");
    expect(headers.get("x-frame-options")).toBe("DENY");
    expect(headers.get("referrer-policy")).toBe("no-referrer");
    expect(headers.get("permissions-policy")).toContain("camera=()");
    expect(headers.get("content-security-policy")).toBe(
      LUMORA_CONTENT_SECURITY_POLICY
    );
  });

  it("keeps HSTS disabled unless explicitly requested", () => {
    const headers = new Headers();

    applyLumoraSecurityHeaders(headers);

    expect(headers.get("strict-transport-security")).toBeNull();
  });
});
