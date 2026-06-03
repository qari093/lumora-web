import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  DEFAULT_HOME_BEACON_CONFIG,
  computeHomeBeaconBreath,
  createHomeBeaconTelemetry,
  isHomeBeaconEnabled,
  nextHomeBeaconState,
} from "@/src/core/home-beacon";

describe("Home Beacon Mega Pack 1/5", () => {
  it("enables Home Beacon by default", () => {
    expect(isHomeBeaconEnabled({})).toBe(true);
    expect(DEFAULT_HOME_BEACON_CONFIG.position).toBe("bottom-center");
    expect(DEFAULT_HOME_BEACON_CONFIG.bladeCore).toBe(true);
  });

  it("computes breathing visual state", () => {
    const state = computeHomeBeaconBreath(2400);
    expect(state.state).toBe("breathing");
    expect(state.pulseScale).toBeGreaterThan(1);
    expect(state.glowOpacity).toBeGreaterThan(0);
  });

  it("handles tap state expansion", () => {
    expect(nextHomeBeaconState("idle", "tap")).toBe("expanded");
    expect(nextHomeBeaconState("expanded", "tap")).toBe("active");
    expect(nextHomeBeaconState("active", "close")).toBe("idle");
  });

  it("creates telemetry events", () => {
    const event = createHomeBeaconTelemetry("expand", 123);
    expect(event.source).toBe("home_beacon");
    expect(event.type).toBe("expand");
    expect(event.ts).toBe(123);
  });

  it("mounts Home Beacon globally", () => {
    const layout = fs.readFileSync("app/layout.tsx", "utf8");
    const component = fs.readFileSync("components/home-beacon/HomeBeacon.tsx", "utf8");

    expect(layout).toContain("HomeBeacon");
    expect(component).toContain("data-testid=\"lumora-home-beacon\"");
    expect(component).toContain("Lumora Home Beacon");
  });
});
