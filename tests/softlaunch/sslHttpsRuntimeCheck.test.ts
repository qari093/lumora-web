import { describe, expect, it } from "vitest";
import { evaluateSslHttpsRuntimeCheck } from "@/lib/softlaunch/sslHttpsRuntimeCheck";

describe("soft-launch SSL / HTTPS runtime check", () => {
  it("passes when https runtime is fully ready", () => {
    const out = evaluateSslHttpsRuntimeCheck({
      httpsEnabled: true,
      redirectHttpToHttps: true,
      hstsEnabled: true,
      canonicalUrl: "https://www.lumora.app",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.runtime.ready).toBe(true);
      expect(out.runtime.canonicalUrl).toBe("https://www.lumora.app");
    }
  });

  it("stays not-ready if redirect is missing", () => {
    const out = evaluateSslHttpsRuntimeCheck({
      httpsEnabled: true,
      redirectHttpToHttps: false,
      hstsEnabled: true,
      canonicalUrl: "https://www.lumora.app",
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.runtime.ready).toBe(false);
    }
  });

  it("rejects missing canonical url", () => {
    const out = evaluateSslHttpsRuntimeCheck({
      httpsEnabled: true,
      redirectHttpToHttps: true,
      hstsEnabled: true,
      canonicalUrl: "",
    });

    expect(out).toEqual({ ok: false, reason: "missing_canonical_url" });
  });

  it("rejects non-https canonical url", () => {
    const out = evaluateSslHttpsRuntimeCheck({
      httpsEnabled: true,
      redirectHttpToHttps: true,
      hstsEnabled: true,
      canonicalUrl: "http://www.lumora.app",
    });

    expect(out).toEqual({ ok: false, reason: "canonical_url_must_be_https" });
  });
});
