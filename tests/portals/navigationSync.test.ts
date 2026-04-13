import { describe, expect, it } from "vitest";
import { resolveCrossPortalNavigation } from "@/lib/portals/navigationSync";

describe("cross-portal navigation sync", () => {
  it("navigates to enabled target portal", () => {
    const out = resolveCrossPortalNavigation({
      currentPortal: "FYP",
      targetPortal: "GMAR",
      enabledPortals: ["FYP", "GMAR", "LIVE"],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.targetPath).toBe("/gmar");
      expect(out.state.canNavigate).toBe(true);
    }
  });

  it("uses remembered path when available", () => {
    const out = resolveCrossPortalNavigation({
      currentPortal: "FYP",
      targetPortal: "LIVE",
      enabledPortals: ["FYP", "LIVE"],
      lastVisited: { LIVE: "/live/room-7" },
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.state.targetPath).toBe("/live/room-7");
    }
  });

  it("rejects disabled target portal", () => {
    const out = resolveCrossPortalNavigation({
      currentPortal: "FYP",
      targetPortal: "MOVIES",
      enabledPortals: ["FYP", "LIVE"],
    });

    expect(out).toEqual({ ok: false, reason: "target_portal_disabled" });
  });

  it("rejects missing current portal", () => {
    const out = resolveCrossPortalNavigation({
      targetPortal: "LIVE",
      enabledPortals: ["FYP", "LIVE"],
    });

    expect(out).toEqual({ ok: false, reason: "missing_current_portal" });
  });
});
