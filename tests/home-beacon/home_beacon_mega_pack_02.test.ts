import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createHomeBeaconNavigationDecision,
  createHomeBeaconPortalArc,
  createHomeBeaconReturnDecision,
  getHomeBeaconGravityBridge,
  getHomeBeaconPortal,
  getHomeBeaconPortals,
} from "@/src/core/home-beacon";

describe("Home Beacon Mega Pack 2/5", () => {
  it("registers all required portals", () => {
    const portals = getHomeBeaconPortals();
    const ids = portals.map((portal) => portal.id);

    expect(ids).toContain("fyp");
    expect(ids).toContain("lumaspace");
    expect(ids).toContain("live");
    expect(ids).toContain("gmar");
    expect(ids).toContain("nexa");
    expect(ids).toContain("zendoro");
    expect(ids).toContain("movies");
    expect(ids).toContain("music");
  });

  it("creates portal arc positions", () => {
    const arc = createHomeBeaconPortalArc();

    expect(arc.length).toBeGreaterThanOrEqual(8);
    expect(arc.every((item) => Number.isFinite(item.x))).toBe(true);
    expect(arc.every((item) => Number.isFinite(item.y))).toBe(true);
  });

  it("creates navigation decisions", () => {
    expect(getHomeBeaconPortal("fyp")?.href).toBe("/fyp");

    const decision = createHomeBeaconNavigationDecision("lumaspace");
    expect(decision.ok).toBe(true);
    expect(decision.href).toBe("/lumaspace");

    const home = createHomeBeaconReturnDecision();
    expect(home.href).toBe("/");
  });

  it("keeps Gravity Core bridge safe", () => {
    const bridge = getHomeBeaconGravityBridge();

    expect(bridge.integrated).toBe(true);
    expect(bridge.longPressActivatesGravity).toBe(true);
    expect(bridge.emergencyReturnEnabled).toBe(true);
    expect(bridge.navigationHijackAllowed).toBe(false);
  });

  it("mounts portal arc into Home Beacon", () => {
    const beacon = fs.readFileSync("components/home-beacon/HomeBeacon.tsx", "utf8");
    const arc = fs.readFileSync("components/home-beacon/HomeBeaconPortalArc.tsx", "utf8");

    expect(beacon).toContain("HomeBeaconPortalArc");
    expect(arc).toContain("data-testid=\"home-beacon-portal-arc\"");
    expect(arc).toContain("data-home-beacon-portal");
  });
});
