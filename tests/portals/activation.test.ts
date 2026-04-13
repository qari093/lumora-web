import { describe, expect, it } from "vitest";
import { resolvePortalActivation } from "@/lib/portals/activation";

describe("portal activation", () => {
  it("activates selected portals", () => {
    const out = resolvePortalActivation({
      enabledPortals: ["fyp", "gmar", "live"],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      const enabled = out.portals.filter((p) => p.enabled).map((p) => p.key);
      expect(enabled).toEqual(["FYP", "LIVE", "GMAR"]);
    }
  });

  it("disables all when empty", () => {
    const out = resolvePortalActivation({
      enabledPortals: [],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.portals.every((p) => !p.enabled)).toBe(true);
    }
  });

  it("rejects invalid portal", () => {
    const out = resolvePortalActivation({
      enabledPortals: ["unknown"],
    });

    expect(out).toEqual({ ok: false, reason: "invalid_portal_key" });
  });

  it("handles full activation", () => {
    const out = resolvePortalActivation({
      enabledPortals: ["FYP","LIVE","GMAR","NEXA","MOVIES","MUSIC"],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.portals.every((p) => p.enabled)).toBe(true);
    }
  });
});
