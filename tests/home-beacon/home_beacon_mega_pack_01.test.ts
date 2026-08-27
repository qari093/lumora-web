import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  DEFAULT_HOME_BEACON_CONFIG,
  computeHomeBeaconBreath,
  createHomeBeaconTelemetry,
  isHomeBeaconEnabled,
  nextHomeBeaconState,
} from "@/src/core/home-beacon";

describe("Home Beacon Mega Pack 1/5", () => {
  it("keeps Home Beacon enabled by default", () => {
    expect(isHomeBeaconEnabled({})).toBe(true);
    expect(DEFAULT_HOME_BEACON_CONFIG.position).toBe("bottom-center");
    expect(DEFAULT_HOME_BEACON_CONFIG.bladeCore).toBe(true);
  });

  it("computes breathing state", () => {
    const breath = computeHomeBeaconBreath(1000);
    expect(typeof breath.pulseScale).toBe("number");
  });

  it("advances interaction state", () => {
    expect(nextHomeBeaconState("idle", "tap")).toBe("expanded");
    expect(nextHomeBeaconState("expanded", "tap")).toBe("active");
    expect(nextHomeBeaconState("active", "close")).toBe("idle");
  });

  it("creates telemetry", () => {
    const event = createHomeBeaconTelemetry("expand", 123);
    expect(event.source).toBe("home_beacon");
    expect(event.type).toBe("expand");
    expect(event.ts).toBe(123);
  });

  it("mounts Home Beacon through the canonical chrome gate", () => {
    const layout = fs.readFileSync("app/layout.tsx", "utf8");
    const gate = fs.readFileSync(
      "components/layout/LumoraChromeGate.tsx",
      "utf8"
    );
    const component = fs.readFileSync(
      "components/home-beacon/HomeBeacon.tsx",
      "utf8"
    );

    expect(layout).toContain("LumoraChromeGate");
    expect(gate).toContain("HomeBeacon");
    expect(component).toContain(
      'data-testid="lumora-home-beacon"'
    );
    expect(component).toContain("Lumora Home Beacon");
  });
});
