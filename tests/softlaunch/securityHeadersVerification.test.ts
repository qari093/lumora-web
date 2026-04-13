import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { evaluateSecurityHeadersVerification } from "@/lib/softlaunch/securityHeadersVerification";

describe("soft-launch security headers verification", () => {
  it("passes valid security header snapshots", () => {
    const snapshots = JSON.parse(fs.readFileSync("data/softlaunch/security-headers.json", "utf8"));
    const out = evaluateSecurityHeadersVerification({ snapshots });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.verification.total).toBe(3);
      expect(out.verification.valid).toBe(3);
      expect(out.verification.ready).toBe(true);
    }
  });

  it("rejects invalid path", () => {
    const out = evaluateSecurityHeadersVerification({
      snapshots: [
        {
          path: "fyp",
          csp: "default-src 'self'",
          frameOptions: "DENY",
          contentTypeOptions: "nosniff",
          referrerPolicy: "no-referrer",
          valid: true
        }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_path" });
  });

  it("rejects invalid frame options", () => {
    const out = evaluateSecurityHeadersVerification({
      snapshots: [
        {
          path: "/fyp",
          csp: "default-src 'self'",
          frameOptions: "ALLOWALL" as any,
          contentTypeOptions: "nosniff",
          referrerPolicy: "no-referrer",
          valid: true
        }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_frame_options" });
  });

  it("rejects invalid content type options", () => {
    const out = evaluateSecurityHeadersVerification({
      snapshots: [
        {
          path: "/fyp",
          csp: "default-src 'self'",
          frameOptions: "DENY",
          contentTypeOptions: "sniff" as any,
          referrerPolicy: "no-referrer",
          valid: true
        }
      ]
    });

    expect(out).toEqual({ ok: false, reason: "invalid_content_type_options" });
  });
});
