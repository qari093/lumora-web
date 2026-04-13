import { describe, expect, it } from "vitest";
import { evaluateDomainSslReadiness } from "@/lib/softlaunch/domainSslReadiness";

describe("soft-launch domain config + SSL readiness", () => {
  it("passes when dns and ssl are ready", () => {
    const out = evaluateDomainSslReadiness({
      domain: "lumora.app",
      dnsConfigured: true,
      sslIssued: true,
      canonicalHost: "www.lumora.app",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.readiness.ready).toBe(true);
      expect(out.readiness.domain).toBe("lumora.app");
      expect(out.readiness.canonicalHost).toBe("www.lumora.app");
    }
  });

  it("stays not-ready if ssl is missing", () => {
    const out = evaluateDomainSslReadiness({
      domain: "lumora.app",
      dnsConfigured: true,
      sslIssued: false,
      canonicalHost: "www.lumora.app",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.readiness.ready).toBe(false);
    }
  });

  it("rejects invalid domain", () => {
    const out = evaluateDomainSslReadiness({
      domain: "lumora",
      dnsConfigured: true,
      sslIssued: true,
      canonicalHost: "www.lumora.app",
    });

    expect(out).toEqual({ ok: false, reason: "invalid_domain" });
  });

  it("rejects missing canonical host", () => {
    const out = evaluateDomainSslReadiness({
      domain: "lumora.app",
      dnsConfigured: true,
      sslIssued: true,
      canonicalHost: "",
    });

    expect(out).toEqual({ ok: false, reason: "missing_canonical_host" });
  });
});
