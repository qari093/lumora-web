import { describe, expect, it } from "vitest";
import { evaluatePortalHealthSweep } from "@/lib/softlaunch/portalHealthSweep";

describe("soft-launch portal health sweep", () => {
  it("passes when all portals are healthy", () => {
    const out = evaluatePortalHealthSweep({
      portals: [
        { portal: "FYP", pageOk: true, apiOk: true },
        { portal: "LIVE", pageOk: true, apiOk: true },
        { portal: "GMAR", pageOk: true, apiOk: true },
        { portal: "NEXA", pageOk: true, apiOk: true },
        { portal: "MOVIES", pageOk: true, apiOk: true },
        { portal: "MUSIC", pageOk: true, apiOk: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.checked).toBe(6);
      expect(out.sweep.healthy).toBe(6);
      expect(out.sweep.ready).toBe(true);
    }
  });

  it("fails readiness when one portal is unhealthy", () => {
    const out = evaluatePortalHealthSweep({
      portals: [
        { portal: "FYP", pageOk: true, apiOk: true },
        { portal: "LIVE", pageOk: false, apiOk: true },
      ],
    });

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.sweep.healthy).toBe(1);
      expect(out.sweep.ready).toBe(false);
    }
  });

  it("rejects duplicate portal", () => {
    const out = evaluatePortalHealthSweep({
      portals: [
        { portal: "FYP", pageOk: true, apiOk: true },
        { portal: "FYP", pageOk: true, apiOk: true },
      ],
    });

    expect(out).toEqual({ ok: false, reason: "duplicate_portal" });
  });

  it("rejects missing portals", () => {
    const out = evaluatePortalHealthSweep({ portals: [] });
    expect(out).toEqual({ ok: false, reason: "missing_portals" });
  });
});
