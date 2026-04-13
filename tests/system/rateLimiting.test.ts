import { describe, expect, it } from "vitest";
import { evaluateRateLimit } from "@/lib/system/rateLimiting";

describe("API rate limiting enforcement", () => {
  it("allows requests under limit", () => {
    const out = evaluateRateLimit({
      key: "ip:127.0.0.1",
      limit: 10,
      windowMs: 60000,
      requestCount: 3,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.allowed).toBe(true);
      expect(out.state.remaining).toBe(7);
    }
  });

  it("blocks requests at limit", () => {
    const out = evaluateRateLimit({
      key: "ip:127.0.0.1",
      limit: 10,
      windowMs: 60000,
      requestCount: 10,
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.allowed).toBe(false);
      expect(out.state.remaining).toBe(0);
    }
  });

  it("rejects missing key", () => {
    const out = evaluateRateLimit({
      key: "",
      limit: 10,
      windowMs: 60000,
      requestCount: 1,
    });

    expect(out).toEqual({ ok: false, reason: "missing_key" });
  });

  it("rejects invalid limit", () => {
    const out = evaluateRateLimit({
      key: "ip:127.0.0.1",
      limit: 0,
      windowMs: 60000,
      requestCount: 1,
    });

    expect(out).toEqual({ ok: false, reason: "invalid_limit" });
  });
});
