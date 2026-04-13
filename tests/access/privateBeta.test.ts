import { describe, expect, it } from "vitest";
import { resolvePrivateBetaAccess } from "@/lib/access/privateBeta";

describe("private beta access gate", () => {
  it("allows email in allowlist", () => {
    const out = resolvePrivateBetaAccess({
      enabled: true,
      mode: "allowlist",
      email: "Tester@Lumora.app",
      allowlist: ["tester@lumora.app", "alpha@lumora.app"],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.access.allowed).toBe(true);
      expect(out.access.normalizedEmail).toBe("tester@lumora.app");
    }
  });

  it("blocks email not in allowlist", () => {
    const out = resolvePrivateBetaAccess({
      enabled: true,
      mode: "allowlist",
      email: "other@lumora.app",
      allowlist: ["tester@lumora.app"],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.access.allowed).toBe(false);
    }
  });

  it("allows all in open mode", () => {
    const out = resolvePrivateBetaAccess({
      enabled: true,
      mode: "open",
      email: "anyone@lumora.app",
      allowlist: [],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.access.allowed).toBe(true);
    }
  });

  it("rejects missing email in allowlist mode", () => {
    const out = resolvePrivateBetaAccess({
      enabled: true,
      mode: "allowlist",
      email: "",
      allowlist: ["tester@lumora.app"],
    });

    expect(out).toEqual({ ok: false, reason: "missing_email" });
  });

  it("allows all when gate disabled", () => {
    const out = resolvePrivateBetaAccess({
      enabled: false,
      mode: "allowlist",
      email: "",
      allowlist: [],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.access.allowed).toBe(true);
      expect(out.access.enabled).toBe(false);
    }
  });
});
