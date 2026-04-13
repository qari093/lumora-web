import { describe, expect, it } from "vitest";
import { resolvePortalRouting } from "@/lib/portals/routing";

describe("portal routing stability", () => {
  it("builds stable routes for enabled portals", () => {
    const out = resolvePortalRouting({
      enabledPortals: ["FYP", "GMAR", "LIVE"],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.routes.find((r) => r.key === "FYP")?.path).toBe("/fyp");
      expect(out.routes.find((r) => r.key === "GMAR")?.enabled).toBe(true);
      expect(out.routes.find((r) => r.key === "MUSIC")?.enabled).toBe(false);
    }
  });

  it("accepts custom unique route map", () => {
    const out = resolvePortalRouting({
      enabledPortals: ["MOVIES"],
      routeMap: {
        MOVIES: "/cineverse",
      },
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.routes.find((r) => r.key === "MOVIES")?.path).toBe("/cineverse");
    }
  });

  it("rejects invalid route path", () => {
    const out = resolvePortalRouting({
      enabledPortals: ["FYP"],
      routeMap: {
        FYP: "fyp",
      },
    });

    expect(out).toEqual({ ok: false, reason: "invalid_route_path" });
  });

  it("rejects duplicate route path", () => {
    const out = resolvePortalRouting({
      enabledPortals: ["FYP", "LIVE"],
      routeMap: {
        FYP: "/same",
        LIVE: "/same",
      },
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_route_path" });
  });
});
